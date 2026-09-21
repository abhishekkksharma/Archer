import { Request, Response } from "express";
import mongoose from "mongoose";
import { Project } from "../models/project.model";
import { Roadmap } from "../models/roadmap.model";

class ProgressController {
  async getProjectProgress(req: Request, res: Response) {
    try {
      const projectId =
        req.params.projectId ||
        req.params.id ||
        (req.query.projectId as string);

      if (
        !projectId ||
        typeof projectId !== "string" ||
        !mongoose.Types.ObjectId.isValid(projectId)
      ) {
        return res.status(400).json({
          success: false,
          message: "Valid Project ID is required",
        });
      }

      const project = await Project.findById(projectId);

      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }

      const roadmap = await Roadmap.findOne({
        projectId: new mongoose.Types.ObjectId(projectId),
      });

      const phases = roadmap?.phases || [];
      const allTasks = phases.flatMap((phase) => phase.tasks || []);

      const completedTasks = allTasks.filter(
        (task) => task.status === "completed"
      );

      const formatDateStr = (date: Date): string => {
        return [
          date.getUTCFullYear(),
          String(date.getUTCMonth() + 1).padStart(2, "0"),
          String(date.getUTCDate()).padStart(2, "0"),
        ].join("-");
      };

      const startOfUTCDay = (date: Date) => {
        return new Date(
          Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate()
          )
        );
      };

      const endOfUTCDay = (date: Date) => {
        return new Date(
          Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            23,
            59,
            59,
            999
          )
        );
      };

      // ---------------------------------------------------------
      // Determine project start date
      // ---------------------------------------------------------

      let startDate = new Date(project.createdAt);

      for (const task of allTasks) {
        if (task.startDateTime) {
          const taskStart = new Date(task.startDateTime);

          if (taskStart < startDate) {
            startDate = taskStart;
          }
        }
      }

      const projectStartDate = startOfUTCDay(startDate);
      const currentDate = startOfUTCDay(new Date());

      // ---------------------------------------------------------
      // Daily progress map
      // ---------------------------------------------------------

      type DailyProgress = {
        date: string;
        hoursWorked: number;
        estimatedHours: number;
        completedTasksCount: number;
      };

      const dailyMap = new Map<string, DailyProgress>();

      const iterDate = new Date(projectStartDate);

      while (iterDate <= currentDate) {
        const dateStr = formatDateStr(iterDate);

        dailyMap.set(dateStr, {
          date: dateStr,
          hoursWorked: 0,
          estimatedHours: 0,
          completedTasksCount: 0,
        });

        iterDate.setUTCDate(iterDate.getUTCDate() + 1);
      }

      // ---------------------------------------------------------
      // Summary values
      // ---------------------------------------------------------

      let totalTimeTakenHours = 0;
      let totalCompletedEstimatedHours = 0;

      const totalProjectEstimatedHours = allTasks.reduce(
        (sum, task) => sum + (task.estimatedHours || 0),
        0
      );

      // ---------------------------------------------------------
      // Process ALL tasks for estimated hours
      // ---------------------------------------------------------

      for (const task of allTasks) {
        const estimatedHours = task.estimatedHours || 0;

        if (estimatedHours <= 0) {
          continue;
        }

        let estimatedDate: Date | null = null;

        if (task.startDateTime) {
          estimatedDate = new Date(task.startDateTime);
        } else if (task.completionDateTime) {
          estimatedDate = new Date(task.completionDateTime);
        }

        if (!estimatedDate) {
          continue;
        }

        const estimatedDateStr = formatDateStr(estimatedDate);

        const targetDay = dailyMap.get(estimatedDateStr);

        if (targetDay) {
          targetDay.estimatedHours += estimatedHours;
        }
      }

      // ---------------------------------------------------------
      // Process completed tasks for actual hours
      // ---------------------------------------------------------

      for (const task of completedTasks) {
        const estimatedHours = task.estimatedHours || 0;

        totalCompletedEstimatedHours += estimatedHours;

        const taskStart = task.startDateTime
          ? new Date(task.startDateTime)
          : null;

        const taskEnd = task.completionDateTime
          ? new Date(task.completionDateTime)
          : null;

        // -------------------------------------------------------
        // Task has both start and completion timestamps
        // -------------------------------------------------------

        if (
          taskStart &&
          taskEnd &&
          taskEnd.getTime() >= taskStart.getTime()
        ) {
          const durationHours =
            (taskEnd.getTime() - taskStart.getTime()) /
            (1000 * 60 * 60);

          totalTimeTakenHours += durationHours;

          // Completion count
          const completionDateStr = formatDateStr(taskEnd);

          const completionDay = dailyMap.get(completionDateStr);

          if (completionDay) {
            completionDay.completedTasksCount += 1;
          }

          // -----------------------------------------------------
          // Distribute actual work across days
          // -----------------------------------------------------

          const taskStartDay = startOfUTCDay(taskStart);
          const taskEndDay = startOfUTCDay(taskEnd);

          const dayIterator = new Date(taskStartDay);

          while (dayIterator <= taskEndDay) {
            const dateStr = formatDateStr(dayIterator);

            const targetDay = dailyMap.get(dateStr);

            if (targetDay) {
              const dayStart = startOfUTCDay(dayIterator);
              const dayEnd = endOfUTCDay(dayIterator);

              const overlapStart = Math.max(
                taskStart.getTime(),
                dayStart.getTime()
              );

              const overlapEnd = Math.min(
                taskEnd.getTime(),
                dayEnd.getTime()
              );

              if (overlapEnd > overlapStart) {
                const hoursOnDay =
                  (overlapEnd - overlapStart) /
                  (1000 * 60 * 60);

                targetDay.hoursWorked += hoursOnDay;
              }
            }

            dayIterator.setUTCDate(
              dayIterator.getUTCDate() + 1
            );
          }
        }

        // -------------------------------------------------------
        // Only completion date exists
        // -------------------------------------------------------

        else if (taskEnd) {
          const completionDateStr = formatDateStr(taskEnd);

          const targetDay = dailyMap.get(completionDateStr);

          if (targetDay) {
            targetDay.completedTasksCount += 1;

            targetDay.hoursWorked += estimatedHours;
          }

          totalTimeTakenHours += estimatedHours;
        }
      }

      // ---------------------------------------------------------
      // Format daily progress
      // ---------------------------------------------------------

      const dailyProgress = Array.from(dailyMap.values()).map(
        (item) => ({
          date: item.date,
          hoursWorked:
            Math.round(item.hoursWorked * 100) / 100,
          estimatedHours:
            Math.round(item.estimatedHours * 100) / 100,
          completedTasksCount:
            item.completedTasksCount,
        })
      );

      // ---------------------------------------------------------
      // Response
      // ---------------------------------------------------------

      return res.status(200).json({
        success: true,
        message: "Project progress fetched successfully",

        data: {
          project: {
            _id: project._id,
            name: project.name,
            description: project.description,
            status: project.status,
            progress: project.progress,
            createdAt: project.createdAt,
          },

          summary: {
            totalTasksCount: allTasks.length,

            completedTasksCount:
              completedTasks.length,

            totalTimeTakenHours:
              Math.round(totalTimeTakenHours * 100) / 100,

            totalCompletedEstimatedHours:
              Math.round(
                totalCompletedEstimatedHours * 100
              ) / 100,

            totalProjectEstimatedHours:
              Math.round(
                totalProjectEstimatedHours * 100
              ) / 100,
          },

          dailyProgress,
        },
      });
    } catch (error: any) {
      console.error(
        "Get project progress error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to fetch project progress",
      });
    }
  }
}

export default new ProgressController();