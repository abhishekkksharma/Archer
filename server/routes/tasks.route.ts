import { Router } from "express";
import { tasksController } from "../controllers/tasks.controller";

const router = Router();

// Add new task to an existing phase of a roadmap
router.post("/roadmap/:roadmapId/phase/:phaseNumber", tasksController.addTask);
router.post("/", tasksController.addTask);

// Update task in a phase (only updating sent fields)
router.patch("/roadmap/:roadmapId/phase/:phaseNumber/task/:taskId", tasksController.updateTask);
router.patch("/roadmap/:roadmapId/task/:taskId", tasksController.updateTask);
router.patch("/:taskId", tasksController.updateTask);

// Delete task from a phase
router.delete("/roadmap/:roadmapId/phase/:phaseNumber/task/:taskId", tasksController.deleteTask);
router.delete("/roadmap/:roadmapId/task/:taskId", tasksController.deleteTask);
router.delete("/:taskId", tasksController.deleteTask);

export default router;
