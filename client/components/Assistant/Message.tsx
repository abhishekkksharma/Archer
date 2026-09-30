"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

interface MessageProps {
  message: string;
  role: "system" | "user";
}

function Message({ message, role }: MessageProps) {
  const [copied, setCopied] = useState(false);

  const isUser = role === "user";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (error) {
      console.error("Failed to copy message:", error);
    }
  };

  return (
    <div className="group w-full">
      <div
        className={`
          flex w-full
          ${isUser ? "justify-end" : "justify-start"}
        `}
      >
        <div
          className={`
            max-w-[85%]
            px-4 py-3
            text-sm leading-6
            shadow-sm
            transition-colors
            sm:max-w-[75%]
            lg:max-w-[65%]

            ${
              isUser
                ? `
                  rounded-2xl
                  rounded-tr-md
                  bg-black
                  text-white
                  dark:bg-zinc-100
                  dark:text-black
                `
                : `
                  rounded-2xl
                  rounded-tl-md
                  bg-zinc-100
                  text-zinc-800
                  dark:bg-zinc-900
                  dark:text-zinc-200
                `
            }
          `}
        >
          <p className="whitespace-pre-wrap break-words">
            {message}
          </p>
        </div>
      </div>

      <div
        className={`
          flex
          h-7
          items-center
          px-2
          pt-1
          transition-opacity
          duration-150
          opacity-0
          group-hover:opacity-100
          group-focus-within:opacity-100
          ${isUser ? "justify-end" : "justify-start"}
        `}
      >
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "Copied" : "Copy message"}
          className="
            flex
            h-6
            w-6
            items-center
            justify-center
            rounded-md

            text-zinc-400
            transition-colors

            hover:bg-zinc-100
            hover:text-zinc-700

            dark:text-zinc-500
            dark:hover:bg-zinc-800
            dark:hover:text-zinc-200
          "
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}

export default Message;