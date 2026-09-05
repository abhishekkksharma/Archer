"use client";

import React from "react";
import { useParams } from "next/navigation";
import TasksComponent from "@/components/Tasks/task";

export default function ProjectTasksPage() {
  const params = useParams();
  const rawId = params?.id;
  const projectId = Array.isArray(rawId) ? rawId[0] : rawId || "";

  return <TasksComponent projectId={projectId} />;
}
