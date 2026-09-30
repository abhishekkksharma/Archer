"use client";

import React, { useState, useEffect } from "react";
import { Check, Copy, Code2 } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus, vs } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  language?: string;
  value: string;
}

export default function CodeBlock({ language = "text", value }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkDark();

    // Listen for theme class changes on <html>
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const cleanValue = value.replace(/\n$/, "");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cleanValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const displayLanguage = (language || "code").toLowerCase();

  return (
    <div
      className={`
        group relative my-4 overflow-hidden rounded-2xl border transition-colors duration-200
        ${
          isDark
            ? "border-zinc-800 bg-[#0d1117] shadow-xl"
            : "border-zinc-200/90 bg-[#f8fafc] shadow-sm"
        }
      `}
    >
      {/* IDE Window Header */}
      <div
        className={`
          flex h-10 items-center justify-between border-b px-4 transition-colors duration-200
          ${
            isDark
              ? "border-zinc-800/80 bg-[#161b22]"
              : "border-zinc-200/80 bg-zinc-100/90"
          }
        `}
      >
        {/* Mac-style Window Controls & Language Tag */}
        <div className="flex items-center gap-3">
          

          <div
            className={`
              flex items-center gap-1.5 text-xs font-mono font-medium
              ${isDark ? "text-zinc-400" : "text-zinc-600"}
            `}
          >
            <Code2 className={`h-3.5 w-3.5 ${isDark ? "text-zinc-500" : "text-zinc-400"}`} />
            <span className="capitalize">{displayLanguage}</span>
          </div>
        </div>

        {/* Copy Code Button */}
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code"
          className={`
            flex h-7 items-center gap-1.5 rounded-md border px-2.5 text-[11px] font-medium transition-all active:scale-95
            ${
              isDark
                ? "border-zinc-700/50 bg-zinc-800/60 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 shadow-2xs"
            }
          `}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-emerald-500 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className={`h-3.5 w-3.5 ${isDark ? "text-zinc-400" : "text-zinc-500"}`} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Syntax Highlighted Code Container */}
      <div className="relative text-xs sm:text-sm font-mono overflow-x-auto">
        <SyntaxHighlighter
          language={displayLanguage}
          style={isDark ? vscDarkPlus : vs}
          customStyle={{
            margin: 0,
            padding: "1rem 1.25rem",
            background: isDark ? "#0d1117" : "#f8fafc",
            fontSize: "0.825rem",
            lineHeight: "1.6",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          }}
          codeTagProps={{
            style: {
              fontFamily: "inherit",
            },
          }}
          wrapLongLines={true}
        >
          {cleanValue}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
