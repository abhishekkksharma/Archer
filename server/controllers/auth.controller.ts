import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import User, { type UserDocument, type UserI } from "../models/user.model";
import { Project } from "../models/project.model";
import type { AuthRequest } from "../middlewares/auth.middleware";

const scrypt = promisify(scryptCallback);

interface GoogleTokenInfo {
  aud?: string;
  email?: string;
  email_verified?: string;
  given_name?: string;
  name?: string;
  picture?: string;
  sub?: string;
}

interface VerifiedGoogleProfile {
  aud?: string;
  email: string;
  given_name?: string;
  name?: string;
  picture?: string;
  sub: string;
}

class AuthController {
  private signToken(user: UserDocument): string {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined");
    }

    return jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      jwtSecret,
      {
        expiresIn: "7d",
      }
    );
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString("hex");
    const derivedKey = (await scrypt(password, salt, 64)) as Buffer;

    return `${salt}:${derivedKey.toString("hex")}`;
  }

  private async verifyPassword(password: string, storedHash: string): Promise<boolean> {
    const [salt, hashedPassword] = storedHash.split(":");

    if (!salt || !hashedPassword) {
      return false;
    }

    const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
    const storedBuffer = Buffer.from(hashedPassword, "hex");

    if (storedBuffer.length !== derivedKey.length) {
      return false;
    }

    return timingSafeEqual(storedBuffer, derivedKey);
  }

  private sanitizeUser(user: UserDocument) {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      googleId: user.googleId ?? null,
      avatar: user.avatar,
      projects: user.projects,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private async verifyGoogleIdToken(idToken: string): Promise<VerifiedGoogleProfile> {
    const response = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`
    );

    if (!response.ok) {
      throw new Error("Invalid Google token");
    }

    const tokenInfo = (await response.json()) as GoogleTokenInfo;
    const googleClientId = process.env.GOOGLE_CLIENT_ID;

    if (googleClientId && tokenInfo.aud !== googleClientId) {
      throw new Error("Google token audience mismatch");
    }

    if (tokenInfo.email_verified !== "true" || !tokenInfo.email || !tokenInfo.sub) {
      throw new Error("Google account email is not verified");
    }

    const verifiedProfile: VerifiedGoogleProfile = {
      email: tokenInfo.email,
      sub: tokenInfo.sub,
    };

    if (tokenInfo.aud) {
      verifiedProfile.aud = tokenInfo.aud;
    }

    if (tokenInfo.given_name) {
      verifiedProfile.given_name = tokenInfo.given_name;
    }

    if (tokenInfo.name) {
      verifiedProfile.name = tokenInfo.name;
    }

    if (tokenInfo.picture) {
      verifiedProfile.picture = tokenInfo.picture;
    }

    return verifiedProfile;
  }

  public register = async (req: Request, res: Response) => {
    try {
      const { name, email, password, avatar } = req.body as {
        name?: string;
        email?: string;
        password?: string;
        avatar?: UserI["avatar"];
      };

      if (!name || !email || !password) {
        res.status(400).json({
          success: false,
          message: "Name, email, and password are required",
        });
        return;
      }

      const normalizedEmail = email.toLowerCase().trim();
      const existingUser = await User.findOne({ email: normalizedEmail });

      if (existingUser) {
        res.status(409).json({
          success: false,
          message: "User already exists",
        });
        return;
      }

      const hashedPassword = await this.hashPassword(password);
      const newUserData: {
        name: string;
        email: string;
        password: string;
        avatar?: UserI["avatar"];
      } = {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
      };

      if (avatar) {
        newUserData.avatar = avatar;
      }

      const user = await User.create(newUserData);

      const token = this.signToken(user);

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        token,
        user: this.sanitizeUser(user),
      });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to register user",
      });
    }
  };

  public login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body as {
        email?: string;
        password?: string;
      };

      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
        return;
      }

      const normalizedEmail = email.toLowerCase().trim();
      const user = await User.findOne({ email: normalizedEmail });

      if (!user) {
        res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
        return;
      }

      const isPasswordValid = await this.verifyPassword(password, user.password);

      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
        return;
      }

      const token = this.signToken(user);

      res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: this.sanitizeUser(user),
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to login",
      });
    }
  };

  public googleAuth = async (req: Request, res: Response) => {
    try {
      const { idToken } = req.body as { idToken?: string };

      if (!idToken) {
        res.status(400).json({
          success: false,
          message: "Google idToken is required",
        });
        return;
      }

      const googleProfile = await this.verifyGoogleIdToken(idToken);
      const googleId = googleProfile.sub;
      const normalizedEmail = googleProfile.email.toLowerCase();
      const resolvedName = googleProfile.name || googleProfile.given_name || "Google User";

      let user =
        ((await User.findOne({ googleId })) as UserDocument | null) ||
        ((await User.findOne({ email: normalizedEmail })) as UserDocument | null);

      if (user) {
        user.googleId = googleId;
        user.name = user.name || resolvedName;
        await user.save();
      } else {
        user = (await User.create({
          name: resolvedName,
          email: normalizedEmail,
          password: await this.hashPassword(randomBytes(32).toString("hex")),
          googleId,
        })) as UserDocument;
      }

      const token = this.signToken(user);

      res.status(200).json({
        success: true,
        message: "Google authentication successful",
        token,
        user: this.sanitizeUser(user),
      });
    } catch (error) {
      console.error("Google auth error:", error);
      res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : "Google authentication failed",
      });
    }
  };

  public getMe = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user?.userId) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
        return;
      }

      const user = await User.findById(req.user.userId);

      if (!user) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
        return;
      }

      const projects = await Project.find({ userId: user._id })
        .sort({ createdAt: -1 })
        .populate("analysisId")
        .populate("techStackId")
        .populate("roadmapId")
        .populate("architectureId");

      const sanitizedUser = this.sanitizeUser(user);
      sanitizedUser.projects = projects as any;

      res.status(200).json({
        success: true,
        user: sanitizedUser,
      });
    } catch (error) {
      console.error("Get me error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch user",
      });
    }
  };
}

export default new AuthController();
