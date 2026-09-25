import { Router } from "express";
import { architectureController } from "../controllers/architecture.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware.authMiddleware);

// Architecture
router.post(
    "/",
    architectureController.createArchitecture
);

router.post(
    "/ai",
    architectureController.createArchitectureWithAI
);

router.get(
    "/project/:projectId",
    architectureController.getArchitectureByProject
);

router.get(
    "/:architectureId",
    architectureController.getArchitecture
);

router.delete(
    "/:architectureId",
    architectureController.deleteArchitecture
);

// Nodes
router.post(
    "/:architectureId/nodes",
    architectureController.addNewNode
);

router.patch(
    "/:architectureId/nodes/:nodeId",
    architectureController.updateExistingNode
);

router.patch(
    "/:architectureId/nodes/:nodeId/position",
    architectureController.updateNodePosition
);

router.delete(
    "/:architectureId/nodes/:nodeId",
    architectureController.deleteNode
);

// Edges
router.post(
    "/:architectureId/edges",
    architectureController.addNewEdge
);

router.patch(
    "/:architectureId/edges/:edgeId",
    architectureController.updateExistingEdge
);

router.delete(
    "/:architectureId/edges/:edgeId",
    architectureController.deleteEdge
);

// Canvas
router.patch(
    "/:architectureId/viewport",
    architectureController.updateViewport
);

router.put(
    "/:architectureId/save",
    architectureController.saveArchitecture
);

export default router;