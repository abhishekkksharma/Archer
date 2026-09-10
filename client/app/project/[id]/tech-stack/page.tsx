"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { Code2, Layers } from "lucide-react";
import TechStack from "@/components/TechStack/techStack";
import AddNewTechButton from "@/components/TechStack/AddNewTechButton";
import NewTechInput from "@/components/TechStack/NewTechInput";

interface ITechItem {
  name: string;
  description: string;
}

function getCookie(name: string): string | null {
  if (typeof window === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

// Extract tech items from techStackId, architectureId.nodes, or direct project properties
const extractAllTechItems = (projectObj: any): Record<string, ITechItem[]> => {
  const categoriesMap: Record<string, ITechItem[]> = {
    frontend: [],
    backend: [],
    database: [],
    authentication: [],
    otherServices: [],
  };

  if (!projectObj) return categoriesMap;

  const pushItem = (catKey: string, rawItem: any) => {
    if (!rawItem) return;
    const name =
      typeof rawItem === "string"
        ? rawItem
        : rawItem.name || rawItem.technology || rawItem.label;
    if (!name || typeof name !== "string") return;

    const description =
      (typeof rawItem === "object" &&
        (rawItem.description || rawItem.reason)) ||
      `${name} technology component.`;

    const normalizedCat = (catKey || "").toLowerCase().trim();
    let targetCat = "otherServices";
    if (normalizedCat.includes("front")) targetCat = "frontend";
    else if (
      normalizedCat.includes("back") ||
      normalizedCat.includes("server") ||
      normalizedCat.includes("api")
    )
      targetCat = "backend";
    else if (
      normalizedCat.includes("data") ||
      normalizedCat.includes("db") ||
      normalizedCat.includes("storage")
    )
      targetCat = "database";
    else if (
      normalizedCat.includes("auth") ||
      normalizedCat.includes("security")
    )
      targetCat = "authentication";

    if (!categoriesMap[targetCat]) {
      categoriesMap[targetCat] = [];
    }

    // Avoid duplicates
    const exists = categoriesMap[targetCat].some(
      (existing) => existing.name.toLowerCase() === name.toLowerCase(),
    );
    if (!exists) {
      categoriesMap[targetCat].push({ name, description });
    }
  };

  // 1. Extract from techStackId or techStack subdocuments
  const tsObj =
    (typeof projectObj.techStackId === "object" && projectObj.techStackId) ||
    (typeof projectObj.techStack === "object" && projectObj.techStack) ||
    projectObj;

  [
    "frontend",
    "backend",
    "database",
    "authentication",
    "otherServices",
  ].forEach((catKey) => {
    if (Array.isArray(tsObj[catKey])) {
      tsObj[catKey].forEach((item: any) => pushItem(catKey, item));
    }
  });

  // 2. Extract from architectureId.nodes or architecture.nodes if available
  const archNodes =
    projectObj.architectureId?.nodes ||
    projectObj.architecture?.nodes ||
    (Array.isArray(projectObj.nodes) ? projectObj.nodes : []);

  if (Array.isArray(archNodes)) {
    archNodes.forEach((node: any) => {
      const catKey = node.category || "otherServices";
      pushItem(catKey, node);
    });
  }

  return categoriesMap;
};

export default function ProjectTechStackPage() {
  const [showTechInput, setShowTechInput] = useState(false);
  const params = useParams();
  const id = (params?.id as string) || "";

  const { user } = useUser();
  const [techStackData, setTechStackData] = useState<
    Record<string, ITechItem[]>
  >({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;

    // Check user context for cached project
    if (user?.projects && Array.isArray(user.projects)) {
      const found = user.projects.find((p: any) => p._id === id || p.id === id);
      if (found) {
        const extracted = extractAllTechItems(found);
        const hasItems = Object.values(extracted).some((arr) => arr.length > 0);
        if (hasItems) {
          setTechStackData(extracted);
        }
      }
    }

    // Fetch single project with fully populated techStackId and architectureId
    const fetchTechStack = async () => {
      try {
        const token =
          getCookie("token") ||
          getCookie("auth_token") ||
          getCookie("jwt") ||
          (typeof window !== "undefined"
            ? localStorage.getItem("token")
            : null);

        const backendUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

        const res = await fetch(`${backendUrl}/project/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.project) {
            const extracted = extractAllTechItems(data.project);
            setTechStackData(extracted);
          }
        }
      } catch (err) {
        console.error("Failed to fetch project tech stack from backend:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTechStack();
  }, [id, user]);

  const handleDeleteTech = async (categoryKey: string, techName: string) => {
    setTechStackData((prev) => ({
      ...prev,
      [categoryKey]: (prev[categoryKey] || []).filter(
        (item) => item.name.toLowerCase() !== techName.toLowerCase()
      ),
    }));

    try {
      if (id) {
        const token =
          getCookie("token") ||
          getCookie("auth_token") ||
          getCookie("jwt") ||
          (typeof window !== "undefined"
            ? localStorage.getItem("token")
            : null);

        const backendUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

        await fetch(`${backendUrl}/project/${id}/tech-stack`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            category: categoryKey,
            name: techName,
          }),
        });
      }
    } catch (err) {
      console.error("Failed to delete tech item from backend:", err);
    }
  };

  const categoryTitles: Record<string, string> = {
    frontend: "Frontend",
    backend: "Backend",
    database: "Database",
    authentication: "Authentication",
    otherServices: "Other Services",
  };

  const activeCategories = Object.keys(categoryTitles)
    .map((key) => ({
      key,
      title: categoryTitles[key],
      items: techStackData[key] || [],
    }))
    .filter((cat) => cat.items.length > 0);

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-5xl mx-auto text-zinc-900 dark:text-zinc-100">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 text-purple-500">
            <Code2 className="w-5 h-5" />
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Tech Stack
            </h1>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Technologies and tools powering this project.
          </p>
        </div>
        <div>
          <AddNewTechButton onClick={() => setShowTechInput(true)} />

          {showTechInput && (
            <NewTechInput
              projectId={id}
              onClose={() => setShowTechInput(false)}
              onAdd={(tech) => {
                const targetCat = tech.category || "otherServices";
                setTechStackData((prev) => {
                  const categoryItems = prev[targetCat] ? [...prev[targetCat]] : [];
                  const exists = categoryItems.some(
                    (item) => item.name.toLowerCase() === tech.name.toLowerCase()
                  );
                  if (!exists) {
                    categoryItems.push({
                      name: tech.name,
                      description: tech.description || tech.reason || `${tech.name} technology component.`,
                    });
                  }
                  return {
                    ...prev,
                    [targetCat]: categoryItems,
                  };
                });
                setShowTechInput(false);
              }}
            />
          )}
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-zinc-400">
          Loading tech stack...
        </div>
      ) : activeCategories.length > 0 ? (
        <div className="space-y-6">
          {activeCategories.map((cat) => (
            <div key={cat.title} className="space-y-3">
              <div className="border-b border-zinc-100 dark:border-zinc-900 p-2">
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {cat.title}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {cat.items.map((item, idx) => (
                  <TechStack
                    key={`${cat.title}-${idx}-${item.name}`}
                    name={item.name}
                    description={item.description}
                    onDelete={() => handleDeleteTech(cat.key, item.name)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-400 text-xs">
          <Layers className="w-8 h-8 mx-auto mb-2 text-zinc-300 dark:text-zinc-600" />
          No tech stack items configured for this project yet.
        </div>
      )}
    </div>
  );
}
