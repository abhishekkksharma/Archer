"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import DocsSidebar from "./DocsSidebar";
import { getDocPath } from "@/utils/docConfig";

function Document() {
  const [content, setContent] = useState("");
  const [hash, setHash] = useState("getting_started");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncHash = () => {
      setHash(window.location.hash.slice(1) || "getting_started");
    };

    syncHash();

    window.addEventListener("hashchange", syncHash);

    return () => {
      window.removeEventListener("hashchange", syncHash);
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadDocument() {
      setLoading(true);

      try {
        const path = getDocPath(`#${hash}`);

        const response = await fetch(path, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to load ${path}`);
        }

        const markdown = await response.text();
        setContent(markdown);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        setContent("# Document not found\n\nUnable to load this document.");
        console.error(error);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadDocument();

    return () => controller.abort();
  }, [hash]);

  return (
    <section className="mx-auto flex w-full max-w-6xl items-start gap-10 px-6 pt-24 pb-20">
      <aside className="sticky top-24 h-[calc(100vh-6.5rem)] w-60 shrink-0 overflow-y-auto border-r border-zinc-200 pr-4 dark:border-zinc-800">
        <DocsSidebar />
      </aside>

      <article
        className="prose prose-sm prose-slate min-w-0 flex-1 max-w-3xl px-4 py-2
          prose-headings:font-semibold
          prose-headings:tracking-tight
          prose-h1:text-2xl prose-h2:xl prose-h3:text-lg
          prose-a:text-blue-600 dark:prose-a:text-blue-400
          prose-code:text-zinc-800 dark:prose-code:text-zinc-200
          dark:prose-invert"
      >
        {loading ? (
          <div className="flex flex-col gap-4 animate-pulse pt-2">
            <div className="h-8 w-56 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-full rounded bg-zinc-100 dark:bg-zinc-850" />
            <div className="h-4 w-5/6 rounded bg-zinc-100 dark:bg-zinc-850" />
            <div className="h-4 w-4/6 rounded bg-zinc-100 dark:bg-zinc-850" />
          </div>
        ) : (
          <ReactMarkdown>{content}</ReactMarkdown>
        )}
      </article>
    </section>
  );
}

export default Document;