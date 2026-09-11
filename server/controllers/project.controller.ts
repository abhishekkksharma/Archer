import { Response } from "express";
import mongoose from "mongoose";
import { Project } from "../models/project.model";
import { TechStack } from "../models/techStack.model";
import User from "../models/user.model";
import { techServices } from "../services/addTechStack.service";
import type { AuthRequest } from "../middlewares/auth.middleware";

class ProjectsController {
  // =========================
  // ADD PROJECT
  // POST /projects
  // =========================
  public addProject = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const {
        name,
        description,
        type,
        experienceLevel,
        status,
        progress,
        analysisId,
        techStackId,
        techStack,
        roadmapId,
        architectureId,
        projectLiveLink,
        liveUrl,
        githubLink,
        githubUrl,
      } = req.body;

      // Required fields
      if (!name || !description) {
        return res.status(400).json({
          success: false,
          message: "Name and description are required",
        });
      }

      // Create project
      const project = await Project.create({
        userId,
        name,
        description,
        type: type || "Web Application",
        experienceLevel: experienceLevel || "Beginner",
        status: status || "Planning",
        progress: progress || 0,
        analysisId,
        techStackId,
        roadmapId,
        architectureId,
        projectLiveLink: projectLiveLink || liveUrl || "",
        githubLink: githubLink || githubUrl || "",
      });

      // If techStack data is provided in request, save TechStack model
      if (techStack && typeof techStack === "object") {
        const sanitizeItems = (items: any[]) => {
          if (!Array.isArray(items)) return [];
          return items
            .filter((item) => item && (item.name || typeof item === "string"))
            .map((item) => {
              if (typeof item === "string") {
                return {
                  name: item,
                  description: item,
                  reason: "Selected for application stack",
                  alternatives: [],
                };
              }
              return {
                name: item.name,
                description: item.description || item.name || "Tech stack component",
                reason: item.reason || "Selected for application stack",
                alternatives: Array.isArray(item.alternatives)
                  ? item.alternatives
                  : typeof item.alternatives === "string"
                  ? item.alternatives
                      .split(",")
                      .map((s: string) => s.trim())
                      .filter(Boolean)
                  : [],
              };
            });
        };

        const newTechStack = await TechStack.create({
          projectId: project._id,
          frontend: sanitizeItems(techStack.frontend),
          backend: sanitizeItems(techStack.backend),
          database: sanitizeItems(techStack.database),
          authentication: sanitizeItems(techStack.authentication),
          otherServices: sanitizeItems(techStack.otherServices),
        });

        project.techStackId = newTechStack._id as any;
        await project.save();
      }

      // Add project ID to user's projects array
      const user = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            projects: project._id,
          },
        },
        {
          new: true,
        },
      );

      if (!user) {
        // Optional rollback so we don't leave an orphan project
        await Project.findByIdAndDelete(project._id);

        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const populatedProject = await Project.findById(project._id).populate("techStackId");

      return res.status(201).json({
        success: true,
        message: "Project created successfully",
        project: populatedProject || project,
      });
    } catch (error) {
      console.error("Add project error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to create project",
      });
    }
  };

  // =========================
  // GET ALL PROJECTS
  // GET /projects
  // =========================
  public getProjects = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const projects = await Project.find({ userId })
        .sort({ createdAt: -1 })
        .populate("analysisId")
        .populate("techStackId")
        .populate("roadmapId")
        .populate("architectureId");

      return res.status(200).json({
        success: true,
        count: projects.length,
        projects,
      });
    } catch (error) {
      console.error("Get projects error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch projects",
      });
    }
  };

  // =========================
  // GET SINGLE PROJECT
  // GET /projects/:id
  // =========================
  public getProject = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (
        !id ||
        typeof id !== "string" ||
        !mongoose.Types.ObjectId.isValid(id)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid project ID",
        });
      }

      const project = await Project.findOne({
        _id: id,
        userId,
      })
        .populate("analysisId")
        .populate("techStackId")
        .populate("roadmapId")
        .populate("architectureId");

      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }

      return res.status(200).json({
        success: true,
        project,
      });
    } catch (error) {
      console.error("Get project error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch project",
      });
    }
  };

  // =========================
  // UPDATE PROJECT
  // PUT /projects/:id
  // =========================
  public updateProject = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (
        !id ||
        typeof id !== "string" ||
        !mongoose.Types.ObjectId.isValid(id)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid project ID",
        });
      }

      const {
        name,
        description,
        type,
        experienceLevel,
        status,
        progress,
        analysisId,
        techStackId,
        roadmapId,
        architectureId,
        projectLiveLink,
        liveUrl,
        githubLink,
        githubUrl,
      } = req.body;

      // Only update fields that were provided
      const updateData: Record<string, unknown> = {};

      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (type !== undefined) updateData.type = type;
      if (experienceLevel !== undefined)
        updateData.experienceLevel = experienceLevel;
      if (status !== undefined) updateData.status = status;
      if (progress !== undefined) updateData.progress = progress;
      if (analysisId !== undefined) updateData.analysisId = analysisId;
      if (techStackId !== undefined) updateData.techStackId = techStackId;
      if (roadmapId !== undefined) updateData.roadmapId = roadmapId;
      if (architectureId !== undefined)
        updateData.architectureId = architectureId;
      if (projectLiveLink !== undefined) updateData.projectLiveLink = projectLiveLink;
      else if (liveUrl !== undefined) updateData.projectLiveLink = liveUrl;
      if (githubLink !== undefined) updateData.githubLink = githubLink;
      else if (githubUrl !== undefined) updateData.githubLink = githubUrl;

      const project = await Project.findOneAndUpdate(
        {
          _id: id,
          userId,
        },
        updateData,
        {
          new: true,
          runValidators: true,
        },
      );

      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Project updated successfully",
        project,
      });
    } catch (error) {
      console.error("Update project error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to update project",
      });
    }
  };

  // =========================
  // DELETE PROJECT
  // DELETE /projects/:id
  // =========================
  public deleteProject = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (
        !id ||
        typeof id !== "string" ||
        !mongoose.Types.ObjectId.isValid(id)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid project ID",
        });
      }

      const project = await Project.findOneAndDelete({
        _id: id,
        userId,
      });

      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }

      await User.findByIdAndUpdate(userId, {
        $pull: {
          projects: id,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Project deleted successfully",
      });
    } catch (error) {
      console.error("Delete project error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to delete project",
      });
    }
  };

  // =========================
  // ADD TECH STACK ITEM
  // POST /projects/:id/tech-stack
  // =========================
  public addTechStack = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (
        !id ||
        typeof id !== "string" ||
        !mongoose.Types.ObjectId.isValid(id)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid project ID",
        });
      }

      const { category, name, description, reason, alternatives } = req.body;

      if (!name || typeof name !== "string") {
        return res.status(400).json({
          success: false,
          message: "Technology name is required",
        });
      }

      const project = await Project.findOne({ _id: id, userId });
      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found or unauthorized",
        });
      }

      const updatedTechStack = await techServices.addNewTechStack(id, category || "otherServices", {
        name,
        description,
        reason,
        alternatives,
      });

      return res.status(200).json({
        success: true,
        message: "Technology added to stack successfully",
        techStack: updatedTechStack,
      });
    } catch (error) {
      console.error("Add tech stack error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to add technology to stack",
      });
    }
  };

  // =========================
  // DELETE TECH STACK ITEM
  // DELETE /projects/:id/tech-stack
  // =========================
  public deleteTechStack = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;
      const { category, name } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (
        !id ||
        typeof id !== "string" ||
        !mongoose.Types.ObjectId.isValid(id)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid project ID",
        });
      }

      if (!name || typeof name !== "string") {
        return res.status(400).json({
          success: false,
          message: "Technology name is required",
        });
      }

      const project = await Project.findOne({ _id: id, userId });
      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found or unauthorized",
        });
      }

      const updatedTechStack = await techServices.removeTechStack(
        id,
        category || "otherServices",
        name
      );

      return res.status(200).json({
        success: true,
        message: "Technology deleted from stack successfully",
        techStack: updatedTechStack,
      });
    } catch (error) {
      console.error("Delete tech stack error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to delete technology from stack",
      });
    }
  };
}

export default new ProjectsController();
