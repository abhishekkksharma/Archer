import { Request, Response } from "express";
import User from "../models/user.model";

class UserController {
  async getUser(req: Request, res: Response) {
    try {
      const userId = req.params.id;

      const user = await User.findById(userId).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      console.error("Get user error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to get user",
      });
    }
  }

  async updateAvatar(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const { avatar } = req.body;

      const allowedAvatars = [
        "avatar1",
        "avatar2",
        "avatar3",
        "avatar4",
        "avatar5",
      ];

      if (!avatar) {
        return res.status(400).json({
          success: false,
          message: "Avatar is required",
        });
      }

      if (!allowedAvatars.includes(avatar)) {
        return res.status(400).json({
          success: false,
          message: "Invalid avatar",
        });
      }

      const user = await User.findByIdAndUpdate(
        userId,
        {
          avatar,
        },
        {
          new: true,
          runValidators: true,
        }
      ).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Avatar updated successfully",
        user,
      });
    } catch (error) {
      console.error("Update avatar error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to update avatar",
      });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const { name, email } = req.body;

      if (name === undefined && email === undefined) {
        return res.status(400).json({
          success: false,
          message: "Name or email is required",
        });
      }

      const updateData: {
        name?: string;
        email?: string;
      } = {};

      if (name !== undefined) {
        if (typeof name !== "string") {
          return res.status(400).json({
            success: false,
            message: "Name must be a string",
          });
        }

        const trimmedName = name.trim();

        if (!trimmedName) {
          return res.status(400).json({
            success: false,
            message: "Name cannot be empty",
          });
        }

        updateData.name = trimmedName;
      }

      if (email !== undefined) {
        if (typeof email !== "string") {
          return res.status(400).json({
            success: false,
            message: "Email must be a string",
          });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(normalizedEmail)) {
          return res.status(400).json({
            success: false,
            message: "Please provide a valid email address",
          });
        }

        const existingUser = await User.findOne({
          email: normalizedEmail,
          _id: { $ne: userId },
        });

        if (existingUser) {
          return res.status(409).json({
            success: false,
            message: "Email is already in use",
          });
        }

        updateData.email = normalizedEmail;
      }

      const user = await User.findByIdAndUpdate(
        userId,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      ).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user,
      });
    } catch (error) {
      console.error("Update profile error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to update profile",
      });
    }
  }
}

export const userController = new UserController();