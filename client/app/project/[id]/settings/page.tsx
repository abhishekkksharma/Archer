"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { usePopup } from "@/components/Popup/PopupContext";
import { Settings } from "lucide-react";
import { getCookie } from "@/utils/cookie";
import UpdateProject from "@/components/Settings/UpdateProject";

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

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center gap-2 text-zinc-500">
          <Settings className="w-5 h-5" />
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Project Settings
          </h1>
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
