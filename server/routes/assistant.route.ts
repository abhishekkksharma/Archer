import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import { assistantController } from "../controllers/assistant.controller";

const router = Router();

// Protect all assistant & chat routes with authentication middleware
router.use(authMiddleware.authMiddleware);

// Get conversation by projectId
router.get("/project/:projectId", assistantController.getChatByProjectId);
router.get("/:projectId", assistantController.getChatByProjectId);

// Get AI response & update conversation history
router.post("/chat", assistantController.getAnswerFromAI);
router.post("/response", assistantController.getAnswerFromAI);
router.post("/", assistantController.getAnswerFromAI);

// Clear conversation history for a project
router.delete("/project/:projectId", assistantController.clearChatHistory);
router.delete("/:projectId", assistantController.clearChatHistory);

export default router;
