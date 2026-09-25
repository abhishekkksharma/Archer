import { Request, Response } from "express";
import mongoose from "mongoose";
import {
    Architecture,
    IArchitectureNode,
    IArchitectureEdge,
} from "../models/architecture.model";
import {
    ArchitectureNodeType,
    ArchitectureEdgeType,
    ArchitectureEdgeDirection,
} from "../types/Architecture";

class ArchitectureController {
    // =========================================================
    // CREATE ARCHITECTURE
    // =========================================================

    public async createArchitecture(
        req: Request,
        res: Response
    ) {
        try {
            const {
                projectId,
                nodes = [],
                edges = [],
                viewport,
                version = 1,
            } = req.body;

            if (!projectId) {
                return res.status(400).json({
                    success: false,
                    message: "projectId is required",
                });
            }

            if (
                !mongoose.Types.ObjectId.isValid(projectId)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid projectId",
                });
            }

            const existingArchitecture =
                await Architecture.findOne({
                    projectId,
                });

            if (existingArchitecture) {
                return res.status(409).json({
                    success: false,
                    message:
                        "Architecture already exists for this project",
                    architecture: existingArchitecture,
                });
            }

            const architecture =
                await Architecture.create({
                    projectId,
                    nodes,
                    edges,
                    viewport,
                    version,
                });

            return res.status(201).json({
                success: true,
                message:
                    "Architecture created successfully",
                architecture,
            });
        } catch (error) {
            console.error(
                "createArchitecture:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to create architecture",
            });
        }
    }

    // =========================================================
    // CREATE ARCHITECTURE WITH AI
    // =========================================================

    public async createArchitectureWithAI(
        req: Request,
        res: Response
    ) {
        try {
            const {
                projectId,
                prompt,
            } = req.body;

            if (!projectId || !prompt) {
                return res.status(400).json({
                    success: false,
                    message:
                        "projectId and prompt are required",
                });
            }

            if (
                !mongoose.Types.ObjectId.isValid(projectId)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid projectId",
                });
            }

            const existingArchitecture =
                await Architecture.findOne({
                    projectId,
                });

            if (existingArchitecture) {
                return res.status(409).json({
                    success: false,
                    message:
                        "Architecture already exists for this project",
                    architecture: existingArchitecture,
                });
            }

            /*
             * AI integration goes here.
             *
             * Expected result:
             *
             * {
             *   nodes: IArchitectureNode[],
             *   edges: IArchitectureEdge[]
             * }
             */

            const aiResult: {
                nodes: IArchitectureNode[];
                edges: IArchitectureEdge[];
            } = {
                nodes: [],
                edges: [],
            };

            const architecture =
                await Architecture.create({
                    projectId,
                    nodes: aiResult.nodes,
                    edges: aiResult.edges,
                });

            return res.status(201).json({
                success: true,
                message:
                    "Architecture generated successfully",
                architecture,
            });
        } catch (error) {
            console.error(
                "createArchitectureWithAI:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to generate architecture",
            });
        }
    }

    // =========================================================
    // GET ARCHITECTURE
    // =========================================================

    public async getArchitecture(
        req: Request,
        res: Response
    ) {
        try {
            const architectureId = String(
                req.params.architectureId
            );

            if (
                !mongoose.Types.ObjectId.isValid(
                    architectureId
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid architecture ID",
                });
            }

            const architecture =
                await Architecture.findById(
                    architectureId
                );

            if (!architecture) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Architecture not found",
                });
            }

            return res.status(200).json({
                success: true,
                architecture,
            });
        } catch (error) {
            console.error(
                "getArchitecture:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to fetch architecture",
            });
        }
    }

    // =========================================================
    // GET ARCHITECTURE BY PROJECT
    // =========================================================

    public async getArchitectureByProject(
        req: Request,
        res: Response
    ) {
        try {
            const projectId = String(
                req.params.projectId
            );

            if (
                !mongoose.Types.ObjectId.isValid(projectId)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid project ID",
                });
            }

            const architecture =
                await Architecture.findOne({
                    projectId:
                        new mongoose.Types.ObjectId(
                            projectId
                        ),
                });

            if (!architecture) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Architecture not found for this project",
                });
            }

            return res.status(200).json({
                success: true,
                architecture,
            });
        } catch (error) {
            console.error(
                "getArchitectureByProject:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to fetch architecture",
            });
        }
    }

    // =========================================================
    // ADD NODE
    // =========================================================

    public async addNewNode(
        req: Request,
        res: Response
    ) {
        try {
            const architectureId = String(
                req.params.architectureId
            );

            const node =
                req.body as IArchitectureNode;

            if (
                !mongoose.Types.ObjectId.isValid(
                    architectureId
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid architecture ID",
                });
            }

            if (!node.id) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Node id is required",
                });
            }

            if (!node.type) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Node type is required",
                });
            }

            if (!node.data) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Node data is required",
                });
            }

            const existingNode =
                await Architecture.findOne({
                    _id: architectureId,
                    "nodes.id": node.id,
                });

            if (existingNode) {
                return res.status(409).json({
                    success: false,
                    message:
                        "Node with this ID already exists",
                });
            }

            const architecture =
                await Architecture.findByIdAndUpdate(
                    architectureId,
                    {
                        $push: {
                            nodes: node,
                        },
                        $inc: {
                            version: 1,
                        },
                    },
                    {
                        new: true,
                        runValidators: true,
                    }
                );

            if (!architecture) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Architecture not found",
                });
            }

            return res.status(201).json({
                success: true,
                message:
                    "Node added successfully",
                node,
                version: architecture.version,
            });
        } catch (error) {
            console.error(
                "addNewNode:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to add node",
            });
        }
    }

    // =========================================================
    // UPDATE NODE
    // =========================================================

    public async updateExistingNode(
        req: Request,
        res: Response
    ) {
        try {
            const architectureId = String(
                req.params.architectureId
            );

            const nodeId = String(
                req.params.nodeId
            );

            if (
                !mongoose.Types.ObjectId.isValid(
                    architectureId
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid architecture ID",
                });
            }

            const allowedFields = [
                "type",
                "position",
                "data",
                "width",
                "height",
                "parentId",
            ];

            const updateFields: Record<
                string,
                unknown
            > = {};

            for (const field of allowedFields) {
                if (
                    req.body[field] !== undefined
                ) {
                    updateFields[
                        `nodes.$.${field}`
                    ] = req.body[field];
                }
            }

            if (
                Object.keys(updateFields).length ===
                0
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "No valid fields provided for update",
                });
            }

            const architecture =
                await Architecture.findOneAndUpdate(
                    {
                        _id: architectureId,
                        "nodes.id": nodeId,
                    },
                    {
                        $set: updateFields,
                        $inc: {
                            version: 1,
                        },
                    },
                    {
                        new: true,
                        runValidators: true,
                    }
                );

            if (!architecture) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Architecture or node not found",
                });
            }

            const updatedNode =
                architecture.nodes.find(
                    (node) =>
                        node.id === nodeId
                );

            return res.status(200).json({
                success: true,
                message:
                    "Node updated successfully",
                node: updatedNode,
                version: architecture.version,
            });
        } catch (error) {
            console.error(
                "updateExistingNode:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to update node",
            });
        }
    }

    // =========================================================
    // UPDATE NODE POSITION
    // =========================================================

    public async updateNodePosition(
        req: Request,
        res: Response
    ) {
        try {
            const architectureId = String(
                req.params.architectureId
            );

            const nodeId = String(
                req.params.nodeId
            );

            const { x, y } = req.body;

            if (
                !mongoose.Types.ObjectId.isValid(
                    architectureId
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid architecture ID",
                });
            }

            if (
                typeof x !== "number" ||
                typeof y !== "number"
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "x and y must be numbers",
                });
            }

            const architecture =
                await Architecture.findOneAndUpdate(
                    {
                        _id: architectureId,
                        "nodes.id": nodeId,
                    },
                    {
                        $set: {
                            "nodes.$.position": {
                                x,
                                y,
                            },
                        },
                        $inc: {
                            version: 1,
                        },
                    },
                    {
                        new: true,
                        runValidators: true,
                    }
                );

            if (!architecture) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Architecture or node not found",
                });
            }

            return res.status(200).json({
                success: true,
                message:
                    "Node position updated successfully",
                position: {
                    x,
                    y,
                },
                version: architecture.version,
            });
        } catch (error) {
            console.error(
                "updateNodePosition:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to update node position",
            });
        }
    }

    // =========================================================
    // DELETE NODE
    // =========================================================

    public async deleteNode(
        req: Request,
        res: Response
    ) {
        try {
            const architectureId = String(
                req.params.architectureId
            );

            const nodeId = String(
                req.params.nodeId
            );

            if (
                !mongoose.Types.ObjectId.isValid(
                    architectureId
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid architecture ID",
                });
            }

            const architecture =
                await Architecture.findByIdAndUpdate(
                    architectureId,
                    {
                        $pull: {
                            nodes: {
                                id: nodeId,
                            },
                            edges: {
                                $or: [
                                    {
                                        source: nodeId,
                                    },
                                    {
                                        target: nodeId,
                                    },
                                ],
                            },
                        },
                        $inc: {
                            version: 1,
                        },
                    },
                    {
                        new: true,
                    }
                );

            if (!architecture) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Architecture not found",
                });
            }

            return res.status(200).json({
                success: true,
                message:
                    "Node and connected edges deleted successfully",
                version: architecture.version,
            });
        } catch (error) {
            console.error(
                "deleteNode:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to delete node",
            });
        }
    }

    // =========================================================
    // ADD EDGE
    // =========================================================

    public async addNewEdge(
        req: Request,
        res: Response
    ) {
        try {
            const architectureId = String(
                req.params.architectureId
            );

            const edge =
                req.body as IArchitectureEdge;

            if (
                !mongoose.Types.ObjectId.isValid(
                    architectureId
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid architecture ID",
                });
            }

            if (!edge.id) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Edge id is required",
                });
            }

            if (!edge.source || !edge.target) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Edge source and target are required",
                });
            }

            if (!edge.type) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Edge type is required",
                });
            }

            const architecture =
                await Architecture.findOneAndUpdate(
                    {
                        _id: architectureId,
                        "nodes.id": {
                            $all: [
                                edge.source,
                                edge.target,
                            ],
                        },
                    },
                    {
                        $push: {
                            edges: edge,
                        },
                        $inc: {
                            version: 1,
                        },
                    },
                    {
                        new: true,
                        runValidators: true,
                    }
                );

            if (!architecture) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Architecture not found or source/target node does not exist",
                });
            }

            return res.status(201).json({
                success: true,
                message:
                    "Edge added successfully",
                edge,
                version: architecture.version,
            });
        } catch (error) {
            console.error(
                "addNewEdge:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to add edge",
            });
        }
    }

    // =========================================================
    // UPDATE EDGE
    // =========================================================

    public async updateExistingEdge(
        req: Request,
        res: Response
    ) {
        try {
            const architectureId = String(
                req.params.architectureId
            );

            const edgeId = String(
                req.params.edgeId
            );

            if (
                !mongoose.Types.ObjectId.isValid(
                    architectureId
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid architecture ID",
                });
            }

            const allowedFields = [
                "source",
                "target",
                "sourceHandle",
                "targetHandle",
                "label",
                "type",
                "animated",
                "data",
            ];

            const updateFields: Record<
                string,
                unknown
            > = {};

            for (const field of allowedFields) {
                if (
                    req.body[field] !== undefined
                ) {
                    updateFields[
                        `edges.$.${field}`
                    ] = req.body[field];
                }
            }

            if (
                Object.keys(updateFields).length ===
                0
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "No valid fields provided for update",
                });
            }

            const architecture =
                await Architecture.findOneAndUpdate(
                    {
                        _id: architectureId,
                        "edges.id": edgeId,
                    },
                    {
                        $set: updateFields,
                        $inc: {
                            version: 1,
                        },
                    },
                    {
                        new: true,
                        runValidators: true,
                    }
                );

            if (!architecture) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Architecture or edge not found",
                });
            }

            const updatedEdge =
                architecture.edges.find(
                    (edge) =>
                        edge.id === edgeId
                );

            return res.status(200).json({
                success: true,
                message:
                    "Edge updated successfully",
                edge: updatedEdge,
                version: architecture.version,
            });
        } catch (error) {
            console.error(
                "updateExistingEdge:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to update edge",
            });
        }
    }

    // =========================================================
    // DELETE EDGE
    // =========================================================

    public async deleteEdge(
        req: Request,
        res: Response
    ) {
        try {
            const architectureId = String(
                req.params.architectureId
            );

            const edgeId = String(
                req.params.edgeId
            );

            if (
                !mongoose.Types.ObjectId.isValid(
                    architectureId
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid architecture ID",
                });
            }

            const architecture =
                await Architecture.findByIdAndUpdate(
                    architectureId,
                    {
                        $pull: {
                            edges: {
                                id: edgeId,
                            },
                        },
                        $inc: {
                            version: 1,
                        },
                    },
                    {
                        new: true,
                    }
                );

            if (!architecture) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Architecture not found",
                });
            }

            return res.status(200).json({
                success: true,
                message:
                    "Edge deleted successfully",
                version: architecture.version,
            });
        } catch (error) {
            console.error(
                "deleteEdge:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to delete edge",
            });
        }
    }

    // =========================================================
    // UPDATE VIEWPORT
    // =========================================================

    public async updateViewport(
        req: Request,
        res: Response
    ) {
        try {
            const architectureId = String(
                req.params.architectureId
            );

            const { x, y, zoom } = req.body;

            if (
                typeof x !== "number" ||
                typeof y !== "number" ||
                typeof zoom !== "number"
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "x, y and zoom must be numbers",
                });
            }

            const architecture =
                await Architecture.findByIdAndUpdate(
                    architectureId,
                    {
                        $set: {
                            viewport: {
                                x,
                                y,
                                zoom,
                            },
                        },
                    },
                    {
                        new: true,
                        runValidators: true,
                    }
                );

            if (!architecture) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Architecture not found",
                });
            }

            return res.status(200).json({
                success: true,
                message:
                    "Viewport updated successfully",
                viewport:
                    architecture.viewport,
            });
        } catch (error) {
            console.error(
                "updateViewport:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to update viewport",
            });
        }
    }

    // =========================================================
    // SAVE COMPLETE CANVAS
    // =========================================================

    public async saveArchitecture(
        req: Request,
        res: Response
    ) {
        try {
            const architectureId = String(
                req.params.architectureId
            );

            const {
                nodes,
                edges,
                viewport,
            } = req.body;

            if (
                !mongoose.Types.ObjectId.isValid(
                    architectureId
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid architecture ID",
                });
            }

            const updateData: Record<
                string,
                unknown
            > = {};

            if (nodes !== undefined) {
                updateData.nodes = nodes;
            }

            if (edges !== undefined) {
                updateData.edges = edges;
            }

            if (viewport !== undefined) {
                updateData.viewport = viewport;
            }

            updateData.version = {
                $literal: {
                    $add: ["$version", 1],
                },
            };

            const architecture =
                await Architecture.findByIdAndUpdate(
                    architectureId,
                    {
                        $set: {
                            ...(nodes !== undefined && {
                                nodes,
                            }),
                            ...(edges !== undefined && {
                                edges,
                            }),
                            ...(viewport !==
                                undefined && {
                                viewport,
                            }),
                        },
                        $inc: {
                            version: 1,
                        },
                    },
                    {
                        new: true,
                        runValidators: true,
                    }
                );

            if (!architecture) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Architecture not found",
                });
            }

            return res.status(200).json({
                success: true,
                message:
                    "Architecture saved successfully",
                architecture,
            });
        } catch (error) {
            console.error(
                "saveArchitecture:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to save architecture",
            });
        }
    }

    // =========================================================
    // DELETE ARCHITECTURE
    // =========================================================

    public async deleteArchitecture(
        req: Request,
        res: Response
    ) {
        try {
            const architectureId = String(
                req.params.architectureId
            );

            if (
                !mongoose.Types.ObjectId.isValid(
                    architectureId
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid architecture ID",
                });
            }

            const architecture =
                await Architecture.findByIdAndDelete(
                    architectureId
                );

            if (!architecture) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Architecture not found",
                });
            }

            return res.status(200).json({
                success: true,
                message:
                    "Architecture deleted successfully",
            });
        } catch (error) {
            console.error(
                "deleteArchitecture:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to delete architecture",
            });
        }
    }
}

export const architectureController =
    new ArchitectureController();