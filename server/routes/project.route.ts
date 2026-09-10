import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import projectController from "../controllers/project.controller";

const router = Router();

// Protect all project routes
router.use(authMiddleware.authMiddleware);

router.post("/", projectController.addProject);
router.get("/", projectController.getProjects);
router.get("/:id", projectController.getProject);
router.post("/:id/tech-stack", projectController.addTechStack);
router.delete("/:id/tech-stack", projectController.deleteTechStack);
router.put("/:id", projectController.updateProject);
router.delete("/:id", projectController.deleteProject);

export default router;