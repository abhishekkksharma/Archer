import { Request, Response } from "express";
import { roadmapService } from "../services/roadmap.service";

export class TasksController {
  // =========================
  // ADD TASK TO A PHASE
  // POST /api/tasks/roadmap/:roadmapId/phase/:phaseNumber
  // =========================
  public addTask = async (req: Request, res: Response) => {
    try {
      const { roadmapId, phaseNumber } = req.params;
      const { title, description, order, estimatedHours, priority, status, dependencies } = req.body;

      const targetRoadmapId = roadmapId || req.body.roadmapId || req.body.projectId;
      const targetPhaseNumber = phaseNumber || req.body.phaseNumber || req.body.phaseId;

      if (!targetRoadmapId || typeof targetRoadmapId !== "string") {
        return res.status(400).json({
          success: false,
          message: "Roadmap ID or Project ID is required",
        });
      }

      if (targetPhaseNumber === undefined || targetPhaseNumber === null || targetPhaseNumber === "") {
        return res.status(400).json({
          success: false,
          message: "Phase number or ID is required",
        });
      }

      if (!title || typeof title !== "string") {
        return res.status(400).json({
          success: false,
          message: "Task title is required",
        });
      }

      const result = await roadmapService.addTaskToPhase(
        targetRoadmapId,
        targetPhaseNumber,
        {
          title,
          description,
          order,
          estimatedHours,
          priority,
          status,
          dependencies,
        }
      );

      return res.status(201).json({
        success: true,
        message: "Task added successfully to phase",
        data: result.addedTask,
        statistics: result.roadmap.statistics,
        roadmap: result.roadmap,
      });
    } catch (error: any) {
      console.error("Add task error:", error);
      const statusCode = error.message && error.message.includes("not found") ? 404 : 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message || "Failed to add task",
      });
    }
  };

  // =========================
  // UPDATE TASK IN A PHASE (Only updates fields that are sent)
  // PATCH /api/tasks/roadmap/:roadmapId/phase/:phaseNumber/task/:taskId
  // =========================
  public updateTask = async (req: Request, res: Response) => {
    try {
      const { roadmapId, taskId, phaseNumber } = req.params;

      const targetRoadmapId = roadmapId || req.body.roadmapId || req.body.projectId;
      const targetTaskId = taskId || req.body.taskId;
      const targetPhaseNumber = phaseNumber || req.body.phaseNumber || req.body.phaseId;

      if (!targetRoadmapId || typeof targetRoadmapId !== "string") {
        return res.status(400).json({
          success: false,
          message: "Roadmap ID is required",
        });
      }

      if (!targetTaskId || typeof targetTaskId !== "string") {
        return res.status(400).json({
          success: false,
          message: "Task ID or title is required",
        });
      }

      const { title, description, order, estimatedHours, priority, status, dependencies } = req.body;

      const result = await roadmapService.updateTaskInPhase(
        targetRoadmapId,
        targetTaskId,
        targetPhaseNumber,
        {
          title,
          description,
          order,
          estimatedHours,
          priority,
          status,
          dependencies,
        }
      );

      return res.status(200).json({
        success: true,
        message: "Task updated successfully",
        data: result.updatedTask,
        statistics: result.roadmap.statistics,
        roadmap: result.roadmap,
      });
    } catch (error: any) {
      console.error("Update task error:", error);
      const statusCode = error.message && error.message.includes("not found") ? 404 : 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message || "Failed to update task",
      });
    }
  };

  // =========================
  // DELETE TASK FROM A PHASE
  // DELETE /api/tasks/roadmap/:roadmapId/phase/:phaseNumber/task/:taskId
  // =========================
  public deleteTask = async (req: Request, res: Response) => {
    try {
      const { roadmapId, taskId, phaseNumber } = req.params;

      const targetRoadmapId = roadmapId || req.body.roadmapId || req.body.projectId;
      const targetTaskId = taskId || req.body.taskId;
      const targetPhaseNumber = phaseNumber || req.body.phaseNumber;

      if (!targetRoadmapId || typeof targetRoadmapId !== "string") {
        return res.status(400).json({
          success: false,
          message: "Roadmap ID is required",
        });
      }

      if (!targetTaskId || typeof targetTaskId !== "string") {
        return res.status(400).json({
          success: false,
          message: "Task ID is required",
        });
      }

      const result = await roadmapService.deleteTaskFromPhase(
        targetRoadmapId,
        targetTaskId,
        targetPhaseNumber
      );

      return res.status(200).json({
        success: true,
        message: "Task deleted successfully",
        data: result.deletedTask,
        statistics: result.roadmap.statistics,
        roadmap: result.roadmap,
      });
    } catch (error: any) {
      console.error("Delete task error:", error);
      const statusCode = error.message && error.message.includes("not found") ? 404 : 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message || "Failed to delete task",
      });
    }
  };
}

export const tasksController = new TasksController();
