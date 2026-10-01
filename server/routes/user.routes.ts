import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import { userController } from "../controllers/user.controller";

const router = Router();
router.use(authMiddleware.authMiddleware)

router.get("/:id", userController.getUser);

router.patch("/:id/avatar", userController.updateAvatar);

router.patch("/:id/profile", userController.updateProfile);

export default router;