import mongoose from "mongoose";
import { Roadmap, IRoadmap, IRoadmapPhase } from "../models/roadmap.model";
import { Project } from "../models/project.model";

export class RoadmapService {
  // Helper to calculate statistics from phases
  public calculateStatistics(phases: IRoadmapPhase[] = []) {
    const allTasks = phases.flatMap((p) => p.tasks || []);
    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter((t) => t.status === "completed").length;
    const inProgressTasks = allTasks.filter((t) => t.status === "in_progress").length;
    const blockedTasks = allTasks.filter((t) => t.status === "blocked").length;
    const notStartedTasks = totalTasks - completedTasks - inProgressTasks - blockedTasks;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      notStartedTasks,
      blockedTasks,
      progress,
    };
  }

  // Helper to sync Project.progress with Roadmap.statistics.progress
  private async syncProjectProgress(
    projectId: mongoose.Types.ObjectId | string,
    progress: number
  ) {
    try {
      if (projectId && mongoose.Types.ObjectId.isValid(projectId.toString())) {
        await Project.findByIdAndUpdate(projectId, { progress });
      }
    } catch (err) {
      console.error("Failed to sync project progress:", err);
    }
  }

  // Helper to safely find roadmap by ID or Project ID
  public async findRoadmap(idOrProjectId: string): Promise<IRoadmap | null> {
    if (!idOrProjectId || typeof idOrProjectId !== "string") {
      return null;
    }

    if (mongoose.Types.ObjectId.isValid(idOrProjectId)) {
      let roadmap = await Roadmap.findById(idOrProjectId);
      if (!roadmap) {
        roadmap = await Roadmap.findOne({
          projectId: new mongoose.Types.ObjectId(idOrProjectId),
        });
      }
      return roadmap;
    }

    return null;
  }

  // Create a new roadmap
  async createRoadmap(data: {
    projectId: mongoose.Types.ObjectId | string;
    phases?: IRoadmapPhase[];
    statistics?: Partial<IRoadmap["statistics"]>;
  }): Promise<IRoadmap> {
    if (!data.projectId || !mongoose.Types.ObjectId.isValid(data.projectId.toString())) {
      throw new Error("Invalid project ID");
    }

    const phases = data.phases || [];
    const computedStats = this.calculateStatistics(phases);
    const statistics = {
      ...computedStats,
      ...(data.statistics || {}),
    };

    const roadmap = await Roadmap.create({
      projectId: data.projectId,
      phases,
      statistics,
    });

    // Auto-link roadmap to Project and update progress
    await Project.findByIdAndUpdate(data.projectId, {
      roadmapId: roadmap._id,
      progress: statistics.progress,
    });

    return roadmap;
  }

  // Get roadmap by ID
  async getRoadmapById(roadmapId: string): Promise<IRoadmap | null> {
    return await this.findRoadmap(roadmapId);
  }

  // Get roadmap by project ID
  async getRoadmapByProjectId(projectId: string): Promise<IRoadmap | null> {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw new Error("Invalid project ID");
    }

    return await Roadmap.findOne({
      projectId: new mongoose.Types.ObjectId(projectId),
    });
  }

  // Get all roadmaps
  async getAllRoadmaps(): Promise<IRoadmap[]> {
    return await Roadmap.find().sort({ createdAt: -1 });
  }

  // Update roadmap
  async updateRoadmap(
    roadmapId: string,
    data: Partial<IRoadmap>
  ): Promise<IRoadmap | null> {
    const roadmap = await this.findRoadmap(roadmapId);
    if (!roadmap) {
      return null;
    }

    const updatePayload: any = { ...data };

    if (data.phases) {
      // Retain/update startDateTime and completionDateTime for tasks in data.phases
      const existingTaskMap = new Map<string, any>();
      if (roadmap.phases) {
        for (const phase of roadmap.phases) {
          for (const task of phase.tasks) {
            const taskId = task._id ? task._id.toString() : task.title;
            existingTaskMap.set(taskId, task);
          }
        }
      }

      const now = new Date();
      data.phases = data.phases.map((phase: any) => ({
        ...phase,
        tasks: (phase.tasks || []).map((task: any) => {
          const taskId = task._id ? task._id.toString() : task.title;
          const oldTask = existingTaskMap.get(taskId);
          const oldStatus = oldTask ? oldTask.status : null;
          const newStatus = task.status;

          let startDateTime =
            task.startDateTime !== undefined
              ? task.startDateTime
              : oldTask
              ? oldTask.startDateTime
              : null;
          let completionDateTime =
            task.completionDateTime !== undefined
              ? task.completionDateTime
              : oldTask
              ? oldTask.completionDateTime
              : null;

          if (oldStatus !== newStatus) {
            if (newStatus === "in_progress") {
              if (!task.startDateTime) startDateTime = now;
              completionDateTime = null;
            } else if (newStatus === "completed") {
              if (!task.completionDateTime) completionDateTime = now;
              if (!startDateTime) startDateTime = completionDateTime;
            } else if (newStatus === "not_started") {
              if (task.startDateTime === undefined) startDateTime = null;
              if (task.completionDateTime === undefined) completionDateTime = null;
            }
          }

          return {
            ...task,
            startDateTime,
            completionDateTime,
          };
        }),
      }));

      const computedStats = this.calculateStatistics(data.phases);
      updatePayload.statistics = {
        ...computedStats,
        ...(data.statistics || {}),
      };
      updatePayload.phases = data.phases;
    }

    const updatedRoadmap = await Roadmap.findByIdAndUpdate(
      roadmap._id,
      { $set: updatePayload },
      {
        new: true,
        runValidators: true,
      }
    );

    if (updatedRoadmap && updatedRoadmap.projectId && updatedRoadmap.statistics) {
      await this.syncProjectProgress(updatedRoadmap.projectId, updatedRoadmap.statistics.progress);
    }

    return updatedRoadmap;
  }

  // Delete roadmap
  async deleteRoadmap(roadmapId: string): Promise<IRoadmap | null> {
    const roadmap = await this.findRoadmap(roadmapId);
    if (!roadmap) {
      return null;
    }

    const deleted = await Roadmap.findByIdAndDelete(roadmap._id);
    if (deleted && deleted.projectId) {
      await Project.findByIdAndUpdate(deleted.projectId, {
        $unset: { roadmapId: 1 },
      });
    }
    return deleted;
  }

  // Get all tasks of a roadmap
  async getRoadmapTasks(roadmapId: string) {
    const roadmap = await this.findRoadmap(roadmapId);
    if (!roadmap) {
      return null;
    }

    const tasks = roadmap.phases.flatMap((phase) =>
      phase.tasks.map((task) => {
        const taskObj =
          typeof (task as any).toObject === "function"
            ? (task as any).toObject()
            : task;
        return {
          ...taskObj,
          phaseNumber: phase.phaseNumber,
          phaseTitle: phase.title,
        };
      })
    );

    return tasks;
  }

  // Add a new task to an existing phase in a roadmap
  async addTaskToPhase(
    roadmapId: string,
    phaseIdentifier: string | number,
    taskData: {
      title: string;
      description?: string;
      order?: number;
      estimatedHours?: number;
      priority?: "low" | "medium" | "high";
      status?: "not_started" | "in_progress" | "completed" | "blocked";
      dependencies?: string[];
      startDateTime?: Date | null;
      completionDateTime?: Date | null;
    }
  ) {
    const roadmap = await this.findRoadmap(roadmapId);
    if (!roadmap) {
      throw new Error("Roadmap not found");
    }

    const phase = roadmap.phases.find(
      (p: any) =>
        p.phaseNumber === Number(phaseIdentifier) ||
        p.order === Number(phaseIdentifier) ||
        (p._id && p._id.toString() === String(phaseIdentifier))
    );

    if (!phase) {
      throw new Error(`Phase '${phaseIdentifier}' not found in roadmap`);
    }

    const initialStatus = taskData.status || "not_started";
    const now = new Date();

    const startDateTime =
      taskData.startDateTime !== undefined
        ? taskData.startDateTime
        : initialStatus === "in_progress"
        ? now
        : initialStatus === "completed"
        ? now
        : null;

    const completionDateTime =
      taskData.completionDateTime !== undefined
        ? taskData.completionDateTime
        : initialStatus === "completed"
        ? now
        : null;

    const newTask = {
      title: taskData.title,
      description: taskData.description || "",
      order:
        taskData.order !== undefined ? taskData.order : phase.tasks.length + 1,
      estimatedHours:
        taskData.estimatedHours !== undefined ? taskData.estimatedHours : 0,
      priority: taskData.priority || "medium",
      status: initialStatus,
      dependencies: taskData.dependencies || [],
      startDateTime,
      completionDateTime,
    };

    phase.tasks.push(newTask as any);
    roadmap.markModified("phases");

    // Recalculate statistics after task addition
    roadmap.statistics = this.calculateStatistics(roadmap.phases);

    await roadmap.save();
    await this.syncProjectProgress(roadmap.projectId, roadmap.statistics.progress);

    return { roadmap, addedTask: phase.tasks[phase.tasks.length - 1] };
  }

  // Update an existing task in a phase (only updating sent fields)
  async updateTaskInPhase(
    roadmapId: string,
    taskIdentifier: string,
    phaseIdentifier?: string | number,
    updateData: {
      title?: string;
      description?: string;
      order?: number;
      estimatedHours?: number;
      priority?: "low" | "medium" | "high";
      status?: "not_started" | "in_progress" | "completed" | "blocked";
      dependencies?: string[];
      startDateTime?: Date | null;
      completionDateTime?: Date | null;
    } = {}
  ) {
    const roadmap = await this.findRoadmap(roadmapId);
    if (!roadmap) {
      throw new Error("Roadmap not found");
    }

    let targetTask: any = null;
    let targetPhase: any = null;

    if (phaseIdentifier !== undefined && phaseIdentifier !== null) {
      targetPhase = roadmap.phases.find(
        (p: any) =>
          p.phaseNumber === Number(phaseIdentifier) ||
          p.order === Number(phaseIdentifier) ||
          (p._id && p._id.toString() === String(phaseIdentifier))
      );

      if (targetPhase) {
        targetTask = targetPhase.tasks.find(
          (t: any, index: number) =>
            (t._id && t._id.toString() === String(taskIdentifier)) ||
            t.title === String(taskIdentifier) ||
            t.order === Number(taskIdentifier) ||
            index === Number(taskIdentifier)
        );
      }
    }

    // Fallback: search across all phases if phase is not specified or task not found in phase
    if (!targetTask) {
      for (const phase of roadmap.phases) {
        const found = phase.tasks.find(
          (t: any, index: number) =>
            (t._id && t._id.toString() === String(taskIdentifier)) ||
            t.title === String(taskIdentifier) ||
            t.order === Number(taskIdentifier) ||
            index === Number(taskIdentifier)
        );
        if (found) {
          targetTask = found;
          targetPhase = phase;
          break;
        }
      }
    }

    if (!targetTask) {
      throw new Error(`Task '${taskIdentifier}' not found in roadmap`);
    }

    // Only update fields that are explicitly provided
    if (updateData.title !== undefined) targetTask.title = updateData.title;
    if (updateData.description !== undefined)
      targetTask.description = updateData.description;
    if (updateData.priority !== undefined)
      targetTask.priority = updateData.priority;

    if (updateData.status !== undefined) {
      const oldStatus = targetTask.status;
      const newStatus = updateData.status;

      if (oldStatus !== newStatus) {
        if (newStatus === "in_progress") {
          targetTask.startDateTime =
            updateData.startDateTime !== undefined
              ? updateData.startDateTime
              : new Date();
          targetTask.completionDateTime = null;
        } else if (newStatus === "completed") {
          targetTask.completionDateTime =
            updateData.completionDateTime !== undefined
              ? updateData.completionDateTime
              : new Date();
          if (!targetTask.startDateTime) {
            targetTask.startDateTime =
              updateData.startDateTime || targetTask.completionDateTime;
          }
        } else if (newStatus === "not_started") {
          if (updateData.startDateTime === undefined) targetTask.startDateTime = null;
          if (updateData.completionDateTime === undefined) targetTask.completionDateTime = null;
        }
      }

      targetTask.status = newStatus;
    }

    if (updateData.startDateTime !== undefined)
      targetTask.startDateTime = updateData.startDateTime;
    if (updateData.completionDateTime !== undefined)
      targetTask.completionDateTime = updateData.completionDateTime;

    if (updateData.estimatedHours !== undefined)
      targetTask.estimatedHours = updateData.estimatedHours;
    if (updateData.order !== undefined) targetTask.order = updateData.order;
    if (updateData.dependencies !== undefined)
      targetTask.dependencies = updateData.dependencies;

    roadmap.markModified("phases");

    // Recalculate statistics after task update
    roadmap.statistics = this.calculateStatistics(roadmap.phases);

    await roadmap.save();
    await this.syncProjectProgress(roadmap.projectId, roadmap.statistics.progress);

    return { roadmap, updatedTask: targetTask };
  }

  // Delete a task from a phase
  async deleteTaskFromPhase(
    roadmapId: string,
    taskIdentifier: string,
    phaseIdentifier?: string | number
  ) {
    const roadmap = await this.findRoadmap(roadmapId);
    if (!roadmap) {
      throw new Error("Roadmap not found");
    }

    let deletedTask: any = null;
    let found = false;

    for (const phase of roadmap.phases) {
      if (
        phaseIdentifier !== undefined &&
        phaseIdentifier !== null &&
        phase.phaseNumber !== Number(phaseIdentifier) &&
        phase.order !== Number(phaseIdentifier) &&
        (!phase._id || phase._id.toString() !== String(phaseIdentifier))
      ) {
        continue;
      }

      const taskIndex = phase.tasks.findIndex(
        (t: any, index: number) =>
          (t._id && t._id.toString() === String(taskIdentifier)) ||
          t.title === String(taskIdentifier) ||
          t.order === Number(taskIdentifier) ||
          index === Number(taskIdentifier)
      );

      if (taskIndex !== -1) {
        [deletedTask] = phase.tasks.splice(taskIndex, 1);
        found = true;
        break;
      }
    }

    if (!found) {
      throw new Error(`Task '${taskIdentifier}' not found in roadmap`);
    }

    roadmap.markModified("phases");

    // Recalculate statistics after task deletion
    roadmap.statistics = this.calculateStatistics(roadmap.phases);

    await roadmap.save();
    await this.syncProjectProgress(roadmap.projectId, roadmap.statistics.progress);

    return { roadmap, deletedTask };
  }
}

export const roadmapService = new RoadmapService();