import React from "react";
import { Code2, Layers } from "lucide-react";
import TechStack from "@/components/TechStack/techStack";

interface ITechItem {
  name: string;
  description: string;
}

interface TechStackPreviewProps {
  project?: any;
  loading?: boolean;
}

const extractAllTechItems = (projectObj: any): Record<string, ITechItem[]> => {
  const categoriesMap: Record<string, ITechItem[]> = {
    frontend: [],
    backend: [],
    database: [],
    authentication: [],
    otherServices: [],
  };

  if (!projectObj) return categoriesMap;

  // Handle both top-level published project object or inner projectId document
  const targetObj = projectObj.projectId || projectObj;

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

    const exists = categoriesMap[targetCat].some(
      (existing) => existing.name.toLowerCase() === name.toLowerCase()
    );
    if (!exists) {
      categoriesMap[targetCat].push({ name, description });
    }
  };

  // 1. Extract from techStackId or techStack subdocument
  const tsObj =
    (typeof targetObj.techStackId === "object" && targetObj.techStackId) ||
    (typeof targetObj.techStack === "object" && targetObj.techStack) ||
    targetObj;

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

  // 2. Extract from architectureId.nodes if available
  const archNodes =
    targetObj.architectureId?.nodes ||
    targetObj.architecture?.nodes ||
    (Array.isArray(targetObj.nodes) ? targetObj.nodes : []);

  if (Array.isArray(archNodes)) {
    archNodes.forEach((node: any) => {
      const catKey = node.category || "otherServices";
      pushItem(catKey, node);
    });
  }

  return categoriesMap;
};

function TechStackPreview({ project, loading }: TechStackPreviewProps) {
  const techStackData = extractAllTechItems(project);

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
    <div className="py-12 flex flex-col gap-4">
      <div className="flex flex-col lg:px-6 gap-2">
        <div className="flex items-center gap-2 text-purple-500">
          <Code2 className="w-5 h-5" />
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            Tech Stack
          </h2>
        </div>
        <p className="text-sm text-zinc-700 dark:text-zinc-400">
          Technologies and tools powering this project.
        </p>
      </div>

      {loading ? (
        <div className="py-8 text-center text-xs text-zinc-400">
          Loading tech stack...
        </div>
      ) : activeCategories.length > 0 ? (
        <div className="space-y-6 lg:px-6">
          {activeCategories.map((cat) => (
            <div key={cat.title} className="space-y-3">
              <div className=" pb-2">
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
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 lg:mx-6 text-center rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-400 text-xs">
          <Layers className="w-8 h-8 mx-auto mb-2 text-zinc-300 dark:text-zinc-600" />
          No tech stack items configured for this project yet.
        </div>
      )}
    </div>
  );
}

export default TechStackPreview;