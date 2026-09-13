"use client";

import React, { useEffect, useState } from "react";

interface GithubStats {
  repository: {
    name: string;
    stars: number;
    forks: number;
    issues: number;
    language: string;
  };
  activity: {
    total_commits: number;
    commits: {
      committer: { login: string; avatar_url: string; html_url: string } | null;
      message: string;
    }[];
    url: string;
  };
  contributors: {
    username: string;
    contributions: number;
  }[];
}

export default function ProjectGithubStats({ projectId, githubLink }: { projectId: string; githubLink?: string }) {
  const [stats, setStats] = useState<GithubStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId && !githubLink) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token") || getCookie("token") || getCookie("auth_token") || getCookie("jwt");
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

        const url = projectId
          ? `${backendUrl}/project/${projectId}/githubstats`
          : `${backendUrl}/project/githubstats?githubLink=${encodeURIComponent(githubLink || "")}`;

        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        const data = await res.json();

        if (res.ok && data.success) {
          setStats(data.data);
        } else {
          setError(data.message || "Failed to load GitHub stats");
        }
      } catch (err: any) {
        setError(err.message || "Error fetching GitHub stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [projectId, githubLink]);

  // =========================================================
  // CASE 1: Loading State
  // =========================================================
  if (loading) {
    return (
      <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30 animate-pulse space-y-4">
        <div className="h-6 w-48 bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  // =========================================================
  // CASE 2: Error / No Link State
  // =========================================================
  if (error || !stats) {
    return (
      <div className="p-8 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/20 text-center space-y-3">
        <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
          GitHub Stats Unavailable
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
          {error || "No GitHub repository URL is linked to this project yet."}
        </p>
        <div className="pt-2">
          <a
            href={`/project/${projectId}/settings`}
            className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
          >
            Add Repository Link in Settings
          </a>
        </div>
      </div>
    );
  }

  // =========================================================
  // CASE 3: Success Display
  // =========================================================
  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              {stats.repository.name}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Live GitHub repository statistics
            </p>
          </div>
          {stats.repository.language && (
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              {stats.repository.language}
            </span>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 block font-medium">Stars</span>
            <span className="text-2xl font-bold text-zinc-900 dark:text-white">{stats.repository.stars}</span>
          </div>
          <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 block font-medium">Forks</span>
            <span className="text-2xl font-bold text-zinc-900 dark:text-white">{stats.repository.forks}</span>
          </div>
          <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 block font-medium">Open Issues</span>
            <span className="text-2xl font-bold text-zinc-900 dark:text-white">{stats.repository.issues}</span>
          </div>
          <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 block font-medium">Recent Commits</span>
            <span className="text-2xl font-bold text-zinc-900 dark:text-white">{stats.activity.total_commits}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Commits */}
        <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-4">
          <h3 className="text-base font-semibold text-zinc-900 dark:text-white flex items-center justify-between">
            <span>Recent Activity</span>
            <a
              href={stats.activity.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:underline"
            >
              View on GitHub &rarr;
            </a>
          </h3>

          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {stats.activity.commits && stats.activity.commits.length > 0 ? (
              stats.activity.commits.map((c, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-zinc-50/70 dark:bg-zinc-800/30 border border-zinc-200/40 dark:border-zinc-800/40">
                  {c.committer?.avatar_url ? (
                    <img src={c.committer.avatar_url} alt={c.committer.login} className="w-8 h-8 rounded-full shrink-0 mt-0.5" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-zinc-300 dark:bg-zinc-700 shrink-0 flex items-center justify-center text-xs font-bold text-zinc-600 dark:text-zinc-300">
                      {(c.committer?.login || "C")[0].toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate">{c.message}</p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">by {c.committer?.login || "Contributor"}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-500">No recent commit activity found.</p>
            )}
          </div>
        </div>

        {/* Top Contributors */}
        <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-4">
          <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
            Top Contributors
          </h3>

          <div className="space-y-3">
            {stats.contributors && stats.contributors.length > 0 ? (
              stats.contributors.map((contrib, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-zinc-50/70 dark:bg-zinc-800/30 border border-zinc-200/40 dark:border-zinc-800/40">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-xs">
                      #{i + 1}
                    </div>
                    <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">{contrib.username}</span>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded bg-zinc-200/60 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold">
                    {contrib.contributions} {contrib.contributions === 1 ? "commit" : "commits"}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-500">No contributors data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper to retrieve cookie if using cookies
function getCookie(name: string): string | null {
  if (typeof window === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}
