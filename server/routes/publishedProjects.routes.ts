import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import { publishedProjectController } from "../controllers/publishedProjects.controller";

const router = Router();

router.post("/project",authMiddleware.authMiddleware,publishedProjectController.addProject);

router.get("/project",publishedProjectController.getProjects);

router.get("/project/:projectId",publishedProjectController.getProject);

router.delete("/project/:projectId",authMiddleware.authMiddleware,publishedProjectController.deleteProject);

export default router;