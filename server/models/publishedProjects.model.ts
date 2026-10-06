import mongoose, { Schema } from "mongoose";

export interface IPublishedProject {
    projectId: mongoose.Types.ObjectId;
    publishedBy: mongoose.Types.ObjectId;
    projectName: string;
    projectType: string;
    projectLiveLink?: string;
    projectGithubLink?: string;
    projectDescription: string;
}

const publishedProjectSchema = new Schema<IPublishedProject>({
    projectId: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },

    publishedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    projectName: {
        type: String,
        required: true,
        default: "Untitled Project",
    },

    projectType: {
        type: String,
        required: true,
        default: "Web Application",
    },

    projectGithubLink: {
        type: String,
        default: "",
    },

    projectLiveLink: {
        type: String,
        default: "",
    },

    projectDescription: {
        type: String,
        default: "",
    },
    }, 
    { timestamps: true },
);

export const PublishedProject = mongoose.model<IPublishedProject>(
    "PublishedProject",
    publishedProjectSchema
);