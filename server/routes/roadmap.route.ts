import { Router } from "express";
import { roadmapController } from "../controllers/roadmap.controller";

const router = Router();

router.post("/", roadmapController.createRoadmap);
router.get("/", roadmapController.getAllRoadmaps);
router.get("/project/:projectId", roadmapController.getRoadmapByProjectId);
router.get("/:id/tasks", roadmapController.getRoadmapTasks);
router.get("/:id", roadmapController.getRoadmapById);
router.patch("/:id", roadmapController.updateRoadmap);
router.delete("/:id", roadmapController.deleteRoadmap);

export default router;
