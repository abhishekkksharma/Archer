import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { Chat } from "../models/assistant.model";
import { chatService } from "../services/assistant.service";
import mongoose from "mongoose";

export class ChatController {
  private extractParamString(value: any): string | undefined {
    if (Array.isArray(value)) {
      return value[0];
    }
    if (typeof value === "string") {
      return value;
    }
    return undefined;
  }

  /**
   * Get chat conversation by projectId for the authenticated user
   * GET /api/assistant/project/:projectId
   */
  public getChatByProjectId = async (
    req: AuthRequest,
    res: Response
  ): Promise<Response> => {
    try {
      const userId = req.user?.userId;
      const rawProjectId =
        req.params.projectId || req.params.id || req.query.projectId;
      const projectId = this.extractParamString(rawProjectId);

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized. User ID not found in token.",
        });
      }

      if (!projectId) {
        return res.status(400).json({
          success: false,
          message: "Project ID is required.",
        });
      }

      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Project ID format.",
        });
      }

      let chat = await Chat.findOne({
        projectId: new mongoose.Types.ObjectId(projectId),
        userId: new mongoose.Types.ObjectId(userId),
      });

      if (!chat) {
        // Create an initial empty chat record if not found
        chat = await Chat.create({
          projectId: new mongoose.Types.ObjectId(projectId),
          userId: new mongoose.Types.ObjectId(userId),
          messages: [],
        });
      }

      return res.status(200).json({
        success: true,
        data: chat,
      });
    } catch (error: any) {
      console.error("Get chat conversation error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve conversation.",
      });
    }
  };

  /**
   * Send user message and get AI answer/response from OpenRouter
   * POST /api/assistant/chat OR POST /api/assistant/response
   */
  public getAnswerFromAI = async (
    req: AuthRequest,
    res: Response
  ): Promise<Response> => {
    try {
      const userId = req.user?.userId;
      const rawProjectId = req.body.projectId || req.params.projectId;
      const projectId = this.extractParamString(rawProjectId);
      const userMessage = req.body.message || req.body.content || req.body.prompt;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized. User ID not found in token.",
        });
      }

      if (!projectId) {
        return res.status(400).json({
          success: false,
          message: "Project ID is required.",
        });
      }

      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Project ID format.",
        });
      }

      if (!userMessage || typeof userMessage !== "string" || userMessage.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "Message content is required.",
        });
      }

      let chat = await Chat.findOne({
        projectId: new mongoose.Types.ObjectId(projectId),
        userId: new mongoose.Types.ObjectId(userId),
      });

      if (!chat) {
        chat = new Chat({
          projectId: new mongoose.Types.ObjectId(projectId),
          userId: new mongoose.Types.ObjectId(userId),
          messages: [],
        });
      }

      // Add user message to conversation history
      chat.messages.push({
        role: "user",
        content: userMessage.trim(),
        timestamp: new Date(),
      });

      // Prepare conversation payload for AI model
      const conversationsPayload = chat.messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Call ChatService to get response from AI
      const aiResponse = await chatService.getResponse(conversationsPayload);

      // Add AI response message to conversation history
      chat.messages.push({
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      });

      // Save updated chat document
      await chat.save();

      return res.status(200).json({
        success: true,
        message: "Response generated successfully.",
        data: {
          response: aiResponse,
          chat,
        },
      });
    } catch (error: any) {
      console.error("Get answer from AI error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to generate AI response.",
      });
    }
  };

  /**
   * Clear chat conversation history for a project
   * DELETE /api/assistant/project/:projectId
   */
  public clearChatHistory = async (
    req: AuthRequest,
    res: Response
  ): Promise<Response> => {
    try {
      const userId = req.user?.userId;
      const rawProjectId = req.params.projectId || req.params.id;
      const projectId = this.extractParamString(rawProjectId);

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized. User ID not found in token.",
        });
      }

      if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
        return res.status(400).json({
          success: false,
          message: "Valid Project ID is required.",
        });
      }

      const chat = await Chat.findOneAndUpdate(
        {
          projectId: new mongoose.Types.ObjectId(projectId),
          userId: new mongoose.Types.ObjectId(userId),
        },
        { $set: { messages: [] } },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: "Chat history cleared successfully.",
        data: chat,
      });
    } catch (error: any) {
      console.error("Clear chat history error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to clear chat history.",
      });
    }
  };
}

export const assistantController = new ChatController();
export const chatController = assistantController;