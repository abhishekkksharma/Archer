import mongoose, { Schema } from "mongoose";

interface ProjectI {
  
}

const projectSchema = new Schema<ProjectI>({
  
});

const Project = mongoose.model<ProjectI>("Project", projectSchema);

export default Project;