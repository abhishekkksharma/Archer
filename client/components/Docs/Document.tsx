
"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import DocsSidebar from "./DocsSidebar";

function Document() {
  const [content, setContent] = useState("");
  const [section, setSection] = useState("");

  useEffect(() => {
    const loadDocument = async () => {
      const hash = window.location.hash.slice(1);
      setSection(hash);

      const fileMap: Record<string, string> = {
        "getting-started": "/data/getting_started.md",
        installation: "/data/installation.md",
        contributing: "/data/contibution.md",
      };

      const file = fileMap[hash] ?? "/data/getting_started.md";

      try {
        const response = await fetch(file);

        if (!response.ok) {
          throw new Error("Failed to load documentation");
        }

        setContent(await response.text());
      } catch (error) {
        console.error(error);
        setContent("Failed to load documentation.");
      }
    };

    loadDocument();

    const handleHashChange = () => loadDocument();

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <section className="flex gap-10 px-6 pt-20">
      <aside className="sticky top-20 h-[calc(100vh-5rem)] w-56 shrink-0 overflow-y-auto border-r border-gray-200 pr-4 dark:border-gray-800">
        <DocsSidebar />
      </aside>

      <article
        className="prose prose-sm prose-slate w-full max-w-3xl
          prose-headings:font-medium
          prose-headings:tracking-normal
          prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
          dark:prose-invert pb-30 pt-8 px-6"
      >
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>
    </section>
  );
}

export default Document;
