import { Request, Response } from "express";
import mongoose from "mongoose";
import { roadmapService } from "../services/roadmap.service";
import { openRouterService } from "../services/openRouter.service";
import { Project } from "../models/project.model";

export class RoadmapController {
  // CREATE ROADMAP (Generates roadmap via OpenRouter AI based on project & automatically computes statistics)
  public createRoadmap = async (req: Request, res: Response) => {
    try {
      const { projectId } = req.body;

      if (!projectId) {
        return res.status(400).json({
          success: false,
          message: "projectId is required",
        });
      }

      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid project ID format",
        });
      }

      const project = await Project.findById(projectId).populate("techStackId");

      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }

      // Generate roadmap phases using OpenRouter AI
      const phases = await openRouterService.generateRoadMap({
        name: project.name,
        description: project.description,
        type: project.type,
        experienceLevel: project.experienceLevel,
        techStack: project.techStackId,
      });

      // Create roadmap document (roadmapService automatically computes statistics based on phases)
      const roadmap = await roadmapService.createRoadmap({
        projectId,
        phases,
      });

      return res.status(201).json({
        success: true,
        message: "Roadmap created successfully",
        data: roadmap,
      });
    } catch (error: any) {
      console.error("Create roadmap error:", error);

      return res.status(500).json({
        success: false,
        message: error.message || "Failed to create roadmap",
      });
    }
  };

  // GENERATE / REGENERATE ROADMAP WITH AI FOR A PROJECT
  public generateRoadmap = async (req: Request, res: Response) => {
    try {
      const projectId = req.params.projectId || req.body.projectId;

      if (!projectId || typeof projectId !== "string" || !mongoose.Types.ObjectId.isValid(projectId)) {
        return res.status(400).json({
          success: false,
          message: "Valid projectId is required",
        });
      }

      const project = await Project.findById(projectId).populate("techStackId");

      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }

      // Generate AI phases using OpenRouter Service
      const phases = await openRouterService.generateRoadMap({
        name: project.name,
        description: project.description,
        type: project.type,
        experienceLevel: project.experienceLevel,
        techStack: project.techStackId,
      });

      // Check if a roadmap already exists for this project
      let roadmap = await roadmapService.getRoadmapByProjectId(projectId);

      if (roadmap) {
        roadmap = await roadmapService.updateRoadmap(roadmap._id.toString(), { phases });
      } else {
        roadmap = await roadmapService.createRoadmap({
          projectId,
          phases,
        });
      }

      return res.status(201).json({
        success: true,
        message: "AI Roadmap generated successfully",
        data: roadmap,
      });
    } catch (error: any) {
      console.error("Generate AI roadmap error:", error);

      return res.status(500).json({
        success: false,
        message: error.message || "Failed to generate AI roadmap",
      });
    }
  };

  // GET ROADMAP BY ID
  public getRoadmapById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!id || typeof id !== "string") {
        return res.status(400).json({
          success: false,
          message: "Invalid or missing roadmap ID",
        });
      }

      const roadmap = await roadmapService.getRoadmapById(id);

      if (!roadmap) {
        return res.status(404).json({
          success: false,
          message: "Roadmap not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: roadmap,
      });
    } catch (error: any) {
      console.error("Get roadmap error:", error);

      return res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch roadmap",
      });
    }
  };

  // GET ROADMAP BY PROJECT ID
  public getRoadmapByProjectId = async (req: Request, res: Response) => {
    try {
      const { projectId } = req.params;

      if (!projectId || typeof projectId !== "string") {
        return res.status(400).json({
          success: false,
          message: "Invalid or missing project ID",
        });
      }

      const roadmap = await roadmapService.getRoadmapByProjectId(projectId);

      if (!roadmap) {
        return res.status(404).json({
          success: false,
          message: "Roadmap not found for this project",
        });
      }

      return res.status(200).json({
        success: true,
        data: roadmap,
      });
    } catch (error: any) {
      console.error("Get roadmap by project error:", error);

      return res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch roadmap",
      });
    }
  };

  // GET ALL ROADMAPS
  public getAllRoadmaps = async (req: Request, res: Response) => {
    try {
      const roadmaps = await roadmapService.getAllRoadmaps();

      return res.status(200).json({
        success: true,
        count: roadmaps.length,
        data: roadmaps,
      });
    } catch (error: any) {
      console.error("Get all roadmaps error:", error);

      return res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch roadmaps",
      });
    }
  };

  // UPDATE ROADMAP
  public updateRoadmap = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!id || typeof id !== "string") {
        return res.status(400).json({
          success: false,
          message: "Invalid or missing roadmap ID",
        });
      }

      const roadmap = await roadmapService.updateRoadmap(id, req.body);

      if (!roadmap) {
        return res.status(404).json({
          success: false,
          message: "Roadmap not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Roadmap updated successfully",
        data: roadmap,
      });
    } catch (error: any) {
      console.error("Update roadmap error:", error);

      return res.status(500).json({
        success: false,
        message: error.message || "Failed to update roadmap",
      });
    }
  };

  // DELETE ROADMAP
  public deleteRoadmap = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!id || typeof id !== "string") {
        return res.status(400).json({
          success: false,
          message: "Invalid or missing roadmap ID",
        });
      }

      const roadmap = await roadmapService.deleteRoadmap(id);

      if (!roadmap) {
        return res.status(404).json({
          success: false,
          message: "Roadmap not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Roadmap deleted successfully",
        data: roadmap,
      });
    } catch (error: any) {
      console.error("Delete roadmap error:", error);

      return res.status(500).json({
        success: false,
        message: error.message || "Failed to delete roadmap",
      });
    }
  };

  // GET ALL TASKS OF A ROADMAP
  public getRoadmapTasks = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!id || typeof id !== "string") {
        return res.status(400).json({
          success: false,
          message: "Invalid or missing roadmap ID",
        });
      }

      const tasks = await roadmapService.getRoadmapTasks(id);

      if (!tasks) {
        return res.status(404).json({
          success: false,
          message: "Roadmap not found",
        });
      }

      return res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks,
      });
    } catch (error: any) {
      console.error("Get roadmap tasks error:", error);

      return res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch roadmap tasks",
      });
    }
  };
}

export const roadmapController = new RoadmapController();