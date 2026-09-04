import { Request, Response } from "express";
import { roadmapService } from "../services/roadmap.service";

export class RoadmapController {
  // CREATE ROADMAP
  public createRoadmap = async (req: Request, res: Response) => {
    try {
      const { projectId, phases, statistics } = req.body;

      if (!projectId) {
        return res.status(400).json({
          success: false,
          message: "projectId is required",
        });
      }

      const roadmap = await roadmapService.createRoadmap({
        projectId,
        phases,
        statistics,
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