import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./CodeBlock";

interface SystemMessageProps {
  message: string;
}

function SystemMessage({ message }: SystemMessageProps) {
  return (
    <div className="w-full">
      <div className="max-w-[85%] sm:max-w-[75%] lg:max-w-[80%] text-sm text-zinc-800 dark:text-zinc-200">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-4 mb-2 border-b border-zinc-200 dark:border-zinc-800 pb-1.5">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-3.5 mb-1.5">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mt-2.5 mb-1">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="mb-2.5 text-xs sm:text-sm leading-relaxed text-zinc-800 dark:text-zinc-200 last:mb-0">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-outside pl-5 my-2 space-y-1 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-outside pl-5 my-2 space-y-1 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="leading-relaxed pl-0.5">{children}</li>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                {children}
              </strong>
            ),
            em: ({ children }) => (
              <em className="italic text-zinc-800 dark:text-zinc-200">{children}</em>
            ),
            code: ({ node, inline, className, children, ...props }: any) => {
              const match = /language-(\w+)/.exec(className || "");
              const codeString = String(children || "").replace(/\n$/, "");
              const isMultiLine = codeString.includes("\n") || Boolean(match);

              if (!inline && isMultiLine) {
                return (
                  <CodeBlock
                    language={match ? match[1] : "text"}
                    value={codeString}
                  />
                );
              }

              return (
                <code
                  className="rounded bg-zinc-100 dark:bg-zinc-800/90 px-1.5 py-0.5 text-[11px] sm:text-xs font-mono font-medium text-blue-600 dark:text-blue-400 border border-zinc-200/80 dark:border-zinc-700/80"
                  {...props}
                >
                  {children}
                </code>
              );
            },
            blockquote: ({ children }) => (
              <blockquote className="my-2.5 border-l-3 border-blue-500/80 pl-3.5 italic text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm">
                {children}
              </blockquote>
            ),
            table: ({ children }) => (
              <div className="my-3 overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
                <table className="w-full text-xs text-left border-collapse">{children}</table>
              </div>
            ),
            th: ({ children }) => (
              <th className="bg-zinc-100 dark:bg-zinc-800/80 px-3 py-2 font-semibold text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-700">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800/50 text-zinc-700 dark:text-zinc-300">
                {children}
              </td>
            ),
            hr: () => (
              <hr className="my-4 border-zinc-200 dark:border-zinc-800" />
            ),
          }}
        >
          {message}
        </ReactMarkdown>
      </div>
    </div>
  );
}

export default SystemMessage;