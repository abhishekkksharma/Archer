"use client";

import React from "react";
import { useParams } from "next/navigation";
import ProjectGithubStats from "@/components/Github";

export default function GithubStatsPage() {
  const params = useParams();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId || "";

  if (!id) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <ProjectGithubStats projectId={id} />
    </div>
  );
}