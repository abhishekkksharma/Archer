"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { usePopup } from "@/components/Popup/PopupContext";
import { Settings } from "lucide-react";
import { getCookie } from "@/utils/cookie";
import UpdateProject from "@/components/Settings/UpdateProject";
import Link from "next/link";
import { Eye, Globe, GlobeLock } from "lucide-react";


export default function ProjectSettingsPage() {
  const params = useParams();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId || "";

  const { user, refetchUser } = useUser();
  const router = useRouter();
  const { showPopup } = usePopup();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Web Application");
  const [experienceLevel, setExperienceLevel] = useState("Beginner");
  const [status, setStatus] = useState("Planning");
  const [progress, setProgress] = useState(0);
  const [projectLiveLink, setProjectLiveLink] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [saving, setSaving] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    if (!id || !user?.projects) return;
    const found = user.projects.find((p: any) => p._id === id || p.id === id);
    if (found) {
      setName(found.name || "");
      setDescription(found.description || "");
      setType(found.type || "Web Application");
      setExperienceLevel(found.experienceLevel || "Beginner");
      setStatus(found.status || "Planning");
      setProgress(found.progress ?? 0);
      setProjectLiveLink(found.projectLiveLink || found.liveUrl || "");
      setGithubLink(found.githubLink || found.githubUrl || "");
      setIsPublished(found.isPublished)
    }
  }, [id, user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = getCookie("token") || getCookie("auth_token") || getCookie("jwt");
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

      const res = await fetch(`${backendUrl}/project/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name,
          description,
          type,
          experienceLevel,
          status,
          progress: Number(progress),
          projectLiveLink,
          githubLink,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showPopup("Project settings updated successfully!", "success");
        await refetchUser();
      } else {
        showPopup(data.message || "Failed to update project settings", "error");
      }
    } catch (err) {
      console.error(err);
      showPopup("Failed to update project settings", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      return;
    }

    try {
      const token = getCookie("token") || getCookie("auth_token") || getCookie("jwt");
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

      const res = await fetch(`${backendUrl}/project/${id}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (res.ok) {
        showPopup("Project deleted", "info");
        await refetchUser();
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePublishProject = async () => {
    try {
      const token = getCookie("token");
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

      const res = await fetch(`${backendUrl}/published/project`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          projectId: id,
          projectName: name,
          projectType: type,
          experienceLevel,
          projectDescription: description,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showPopup("Project published successfully!", "success");
        await refetchUser();
      } else {
        showPopup(data.message || "Failed to publish project", "error");
      }
    } catch (error) {
      console.log(error);
      showPopup("Failed to publish project", "error");
    }
  };

  const handleUnPublishProject = async () => {
    try {
      const token = getCookie("token");
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

      const res = await fetch(`${backendUrl}/published/project/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showPopup("Project Unpublished successfully!", "success");
        await refetchUser();
      } else {
        showPopup(data.message || "Failed to Unpublish project", "error");
      }
    } catch (error) {
      console.log(error);
      showPopup("Failed to Unpublish project", "error");
    }
  }

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center gap-2 text-zinc-500">
          <Settings className="w-5 h-5" />
          <div className="flex justify-between w-full">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Project Settings
            </h1>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={isPublished ? handleUnPublishProject : handlePublishProject}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${isPublished
                  ? "border border-red-200 bg-white text-red-600 hover:bg-red-50 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-950"
                  : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                  }`}
              >
                {isPublished ? <GlobeLock size={16} /> : <Globe size={16} />}
                {isPublished ? "Unpublish" : "Publish project"}
              </button>

              {isPublished && (
                <Link
                  href={`/publishes/${id}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-blue-400"
                >
                  <Eye size={16} />
                  View
                </Link>
              )}
            </div>

          </div>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Configure project details, workflow status, live URL, code repository link, or remove project.
        </p>
      </div>

      <UpdateProject
        name={name}
        setName={setName}
        description={description}
        setDescription={setDescription}
        type={type}
        setType={setType}
        experienceLevel={experienceLevel}
        setExperienceLevel={setExperienceLevel}
        status={status}
        setStatus={setStatus}
        projectLiveLink={projectLiveLink}
        setProjectLiveLink={setProjectLiveLink}
        githubLink={githubLink}
        setGithubLink={setGithubLink}
        saving={saving}
        handleUpdate={handleUpdate}
        handleDelete={handleDelete}
      />
    </div>
  );
}
