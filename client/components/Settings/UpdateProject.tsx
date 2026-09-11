import React from "react";
export interface UpdateProjectProps {
  name: string;
  setName: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  type: string;
  setType: (val: string) => void;
  experienceLevel: string;
  setExperienceLevel: (val: string) => void;
  status: string;
  setStatus: (val: string) => void;
  projectLiveLink: string;
  setProjectLiveLink: (val: string) => void;
  githubLink: string;
  setGithubLink: (val: string) => void;
  saving: boolean;
  handleUpdate: (e: React.FormEvent) => void;
  handleDelete: () => void;
}
export default function UpdateProject({
  name,
  setName,
  description,
  setDescription,
  type,
  setType,
  experienceLevel,
  setExperienceLevel,
  status,
  setStatus,
  projectLiveLink,
  setProjectLiveLink,
  githubLink,
  setGithubLink,
  saving,
  handleUpdate,
  handleDelete,
}: UpdateProjectProps) {
  return (
    <form onSubmit={handleUpdate} className="space-y-0">
      {" "}
      {/* General Information */}{" "}
      <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4">
        {" "}
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-2">
          {" "}
          General Information{" "}
        </h2>{" "}
        <div className="mt-4 space-y-3">
          {" "}
          <div className="space-y-1.5">
            {" "}
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              {" "}
              Project Name <span className="text-rose-500">*</span>{" "}
            </label>{" "}
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Acme Dashboard"
              className="w-full rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black px-3 py-2.5 text-xs text-zinc-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
            />{" "}
          </div>{" "}
          <div className="space-y-1.5">
            {" "}
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              {" "}
              Description <span className="text-rose-500">*</span>{" "}
            </label>{" "}
            <textarea
              required
              value={description}
              rows={3}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the main goal, features, and target audience of your project..."
              className="w-full rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black px-3 py-2.5 text-xs text-zinc-900 dark:text-white outline-none focus:border-blue-500 transition-colors resize-y"
            />{" "}
          </div>{" "}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {" "}
            <div className="space-y-1.5">
              {" "}
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                {" "}
                Project Type{" "}
              </label>{" "}
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black px-3 py-2.5 text-xs text-zinc-900 dark:text-white outline-none focus:border-blue-500 transition-colors cursor-pointer"
              >
                {" "}
                <option value="Web Application">Web Application</option>{" "}
                <option value="Mobile App">Mobile App</option>{" "}
                <option value="Desktop App">Desktop App</option>{" "}
                <option value="API Service">API Service</option>{" "}
                <option value="CLI Tool">CLI Tool</option>{" "}
                <option value="AI/ML Project">AI/ML Project</option>{" "}
                <option value="Fullstack App">Fullstack App</option>{" "}
                <option value="Other">Other</option>{" "}
              </select>{" "}
            </div>{" "}
            <div className="space-y-1.5">
              {" "}
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                {" "}
                Target Experience Level{" "}
              </label>{" "}
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black px-3 py-2.5 text-xs text-zinc-900 dark:text-white outline-none focus:border-blue-500 transition-colors cursor-pointer"
              >
                {" "}
                <option value="Beginner">Beginner</option>{" "}
                <option value="Intermediate">Intermediate</option>{" "}
                <option value="Advanced">Advanced</option>{" "}
                <option value="Expert">Expert</option>{" "}
              </select>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Status */}{" "}
      <div className="border-x border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4">
        {" "}
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-2">
          {" "}
          Status{" "}
        </h2>{" "}
        <div className="mt-4 space-y-1.5">
          {" "}
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            {" "}
            Current Status{" "}
          </label>{" "}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black px-3 py-2.5 text-xs text-zinc-900 dark:text-white outline-none focus:border-blue-500 transition-colors cursor-pointer"
          >
            {" "}
            <option value="Planning">Planning</option>{" "}
            <option value="In Progress">In Progress</option>{" "}
            <option value="Completed">Completed</option>{" "}
            <option value="On Hold">On Hold</option>{" "}
          </select>{" "}
        </div>{" "}
      </div>{" "}
      {/* Links */}{" "}
      <div className="border-x border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4">
        {" "}
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-2">
          {" "}
          Links{" "}
        </h2>{" "}
        <div className="mt-4 space-y-3">
          {" "}
          <div className="space-y-1.5">
            {" "}
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              {" "}
              Live Deployment / Demo URL{" "}
            </label>{" "}
            <input
              type="url"
              value={projectLiveLink}
              onChange={(e) => setProjectLiveLink(e.target.value)}
              placeholder="https://my-app.vercel.app"
              className="w-full rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black px-3 py-2.5 text-xs text-zinc-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
            />{" "}
            <p className="text-[11px] text-zinc-400">
              {" "}
              Adding a live URL will enable the interactive browser preview
              frame on your project dashboard.{" "}
            </p>{" "}
          </div>{" "}
          <div className="space-y-1.5">
            {" "}
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              {" "}
              GitHub Repository URL{" "}
            </label>{" "}
            <input
              type="url"
              value={githubLink}
              onChange={(e) => setGithubLink(e.target.value)}
              placeholder="https://github.com/username/repository"
              className="w-full rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black px-3 py-2.5 text-xs text-zinc-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
            />{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Actions */}{" "}
      <div className="flex items-center justify-between border-x border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4">
        {" "}
        <button
          type="button"
          onClick={handleDelete}
          className="px-3 py-2 text-rose-500 text-xs font-semibold rounded border border-rose-200 dark:border-rose-900/50 hover:bg-rose-500/10 transition-colors cursor-pointer"
        >
          {" "}
          Delete Project{" "}
        </button>{" "}
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded transition-colors cursor-pointer disabled:opacity-50"
        >
          {" "}
          {saving ? "Saving..." : "Save Changes"}{" "}
        </button>{" "}
      </div>{" "}
    </form>
  );
}
