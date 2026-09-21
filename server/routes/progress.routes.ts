import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import progressController from "../controllers/progress.controller";

const router = Router();

// Protect all progress routes
router.use(authMiddleware.authMiddleware);

router.get("/:projectId", progressController.getProjectProgress);
router.get("/", progressController.getProjectProgress);

export default router;
