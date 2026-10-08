import mongoose from "mongoose";
import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { PublishedProject } from "../models/publishedProjects.model";
import "../models/project.model";
import "../models/techStack.model";
import "../models/roadmap.model";
import "../models/architecture.model";

class PublishedProjectController {
    public async addProject(req: AuthRequest, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }

            const {
                projectId,
                projectName,
                projectType,
                projectGithubLink,
                projectLiveLink,
                projectDescription,
            } = req.body;

            if (!projectId || !projectName || !projectType) {
                return res.status(400).json({
                    success: false,
                    message:
                        "projectId, projectName and projectType are required",
                });
            }

            if (!mongoose.Types.ObjectId.isValid(projectId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid projectId",
                });
            }

            const alreadyPublished = await PublishedProject.findOne({
                projectId,
                publishedBy: req.user.userId,
            });

            if (alreadyPublished) {
                return res.status(409).json({
                    success: false,
                    message: "Project is already published",
                    project: alreadyPublished,
                });
            }

            const project = await PublishedProject.create({
                projectId,
                publishedBy: req.user.userId,
                projectName,
                projectType,
                projectGithubLink: projectGithubLink || "",
                projectLiveLink: projectLiveLink || "",
                projectDescription: projectDescription || "",
            });

            return res.status(201).json({
                success: true,
                message: "Project published successfully",
                project,
            });
        } catch (error) {
            console.error("Error publishing project:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to publish project",
            });
        }
    }

    public async getProjects(req: AuthRequest, res: Response) {
        try {
            const { projectType } = req.query;

            const filter: {
                projectType?: string;
            } = {};

            if (typeof projectType === "string" && projectType.trim()) {
                filter.projectType = projectType.trim();
            }

            const projects = await PublishedProject.find(filter)
                .populate("publishedBy", "name avatar")
                .sort({ createdAt: -1 });

            return res.status(200).json({
                success: true,
                count: projects.length,
                projects,
            });
        } catch (error) {
            console.error("Error fetching published projects:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch published projects",
            });
        }
    }

    public async getProject(req: AuthRequest, res: Response) {
        try {
            const { projectId } = req.params;

            if (!projectId || Array.isArray(projectId)) {
                return res.status(400).json({
                    success: false,
                    message: "Project ID is required",
                });
            }

            if (!mongoose.Types.ObjectId.isValid(projectId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid projectId",
                });
            }

            const project = await PublishedProject.findOne({
                projectId: projectId,
            })
                .populate("publishedBy", "name avatar")
                .populate({
                    path: "projectId",
                    populate: [
                        { path: "techStackId" },
                        { path: "roadmapId" },
                        { path: "architectureId" },
                    ],
                });

            if (!project) {
                return res.status(404).json({
                    success: false,
                    message: "Published project not found",
                });
            }

            return res.status(200).json({
                success: true,
                project,
            });
        } catch (error) {
            console.error("Error fetching published project:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch published project",
            });
        }
    }

    public async deleteProject(req: AuthRequest, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }

            const { projectId } = req.params;

            if (!projectId || Array.isArray(projectId)) {
                return res.status(400).json({
                    success: false,
                    message: "Project ID is required",
                });
            }

            if (!mongoose.Types.ObjectId.isValid(projectId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid projectId",
                });
            }

            const project = await PublishedProject.findOne({
                _id: projectId,
                publishedBy: req.user.userId,
            });

            if (!project) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Published project not found or you don't have permission to delete it",
                });
            }

            await PublishedProject.findByIdAndDelete(projectId);

            return res.status(200).json({
                success: true,
                message: "Project unpublished successfully",
            });
        } catch (error) {
            console.error("Error deleting published project:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to delete project",
            });
        }
    }
}

export const publishedProjectController =
    new PublishedProjectController();