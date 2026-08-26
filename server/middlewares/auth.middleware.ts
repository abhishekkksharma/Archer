import { type Request, type Response, type NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

export interface AuthJwtPayload extends JwtPayload {
  userId: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: AuthJwtPayload;
}

class AuthMiddleware {
  public authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;

      // Check if Authorization header exists
      if (!authHeader) {
        res.status(401).json({
          success: false,
          message: "Authorization token is required",
        });
        return;
      }

      const bearerMatch = authHeader.match(/^Bearer\s+(.+)$/i);

      if (!bearerMatch?.[1]) {
        res.status(401).json({
          success: false,
          message: "Invalid authorization format. Use: Bearer <token>",
        });
        return;
      }

      const token = bearerMatch[1].replace(/\s/g, "");

      // Check JWT secret
      const jwtSecret = process.env.JWT_SECRET;

      if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined");
      }

      // Verify token
      const decoded = jwt.verify(token, jwtSecret);

      if (typeof decoded === "string" || !("userId" in decoded) || !("email" in decoded)) {
        res.status(401).json({
          success: false,
          message: "Invalid token payload",
        });
        return;
      }

      // Attach decoded user data to request
      req.user = decoded as AuthJwtPayload;

      // Continue to the next middleware/controller
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        res.status(401).json({
          success: false,
          message: "Token has expired",
        });
        return;
      }

      if (error instanceof jwt.JsonWebTokenError) {
        res.status(401).json({
          success: false,
          message: "Invalid token",
        });
        return;
      }

      console.error("Authentication error:", error);

      res.status(500).json({
        success: false,
        message: "Authentication failed",
      });
    }
  };
}

export default new AuthMiddleware();
