export const docs = {
  getting_started: {
    label: "Getting Started",
    path: "/data/getting_started.md",
    children: {
      introduction: {
        label: "Introduction",
        path: "/data/getting_started/introduction.md",
      },
      contributing: {
        label: "Contributing",
        path: "/data/getting_started/contributing.md",
      },
    },
  },
  projects: {
    label: "Projects",
    path: "/data/projects.md",
    children: {
      overview: {
        label: "Overview",
        path: "/data/projects/overview.md",
      },
      project_structure: {
        label: "Project Structure",
        path: "/data/projects/project_structure.md",
      },
      creating_projects: {
        label: "Creating Projects",
        path: "/data/projects/creating_projects.md",
      },
    },
  },
  architecture: {
    label: "Architecture",
    path: "/data/architecture.md",
    children: {
      overview: {
        label: "Overview",
        path: "/data/architecture/overview.md",
      },
      frontend: {
        label: "Frontend",
        path: "/data/architecture/frontend.md",
      },
      backend: {
        label: "Backend",
        path: "/data/architecture/backend.md",
      },
    },
  },
  roadmaps: {
    label: "Roadmaps",
    path: "/data/roadmaps.md",
    children: {
      current_roadmap: {
        label: "Current Roadmap",
        path: "/data/roadmaps/current_roadmap.md",
      },
      upcoming_features: {
        label: "Upcoming Features",
        path: "/data/roadmaps/upcoming_features.md",
      },
    },
  },
  github_stats: {
    label: "GitHub Stats",
    path: "/data/github_stats.md",
    children: {
      contributors: {
        label: "Contributors",
        path: "/data/github_stats/contributors.md",
      },
      commits: {
        label: "Commits",
        path: "/data/github_stats/commits.md",
      },
      pull_requests: {
        label: "Pull Requests",
        path: "/data/github_stats/pull_requests.md",
      },
    },
  },
} as const;

export type DocKey = keyof typeof docs;

export interface ActiveDocInfo {
  parentKey: string;
  childKey?: string;
}

export function getDocPath(hash: string): string {
  const key = hash.replace(/^#/, "").trim() || "getting_started";

  // 1. Direct parent match (e.g., "getting_started", "projects")
  if (key in docs) {
    return docs[key as DocKey].path;
  }

  // 2. Hierarchical parent/child format (e.g., "projects/overview", "architecture/overview")
  if (key.includes("/")) {
    const [parentKey, childKey] = key.split("/");
    if (parentKey in docs) {
      const parentDoc = docs[parentKey as DocKey];
      if (childKey in parentDoc.children) {
        return (parentDoc.children as Record<string, { path: string }>)[childKey].path;
      }
    }
  }

  // 3. Fallback search across all children (e.g., "introduction", "creating_projects")
  for (const doc of Object.values(docs)) {
    if (key in doc.children) {
      return (doc.children as Record<string, { path: string }>)[key].path;
    }
  }

  return docs.getting_started.path;
}

export function getDocKeyFromPath(path: string): ActiveDocInfo {
  for (const [parentKey, doc] of Object.entries(docs)) {
    if (doc.path === path) {
      return { parentKey };
    }

    for (const [childKey, child] of Object.entries(doc.children)) {
      if (child.path === path) {
        return { parentKey, childKey };
      }
    }
  }

  // Handle aliases
  if (path === "/data/contibution.md" || path === "/data/contributing.md") {
    return { parentKey: "getting_started", childKey: "contributing" };
  }

  return { parentKey: "getting_started" };
}