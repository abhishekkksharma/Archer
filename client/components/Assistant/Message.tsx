"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import SystemMessage from "./SystemMessage";

interface MessageProps {
  message: string;
  role: "system" | "user" | "assistant";
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
        {isUser ? (
          <div
            className="
              max-w-[85%]
              rounded-2xl
              rounded-br-none
              bg-zinc-200/50
              px-4
              py-3
              text-sm
              leading-6
              text-zinc-800
              shadow-sm

              sm:max-w-[75%]
              lg:max-w-[65%]

              dark:bg-zinc-800
              dark:text-white
            "
          >
            <p className="whitespace-pre-wrap break-words">
              {message}
            </p>
          </div>
        ) : (
          <SystemMessage message={message} />
        )}
      </div>

      <div
        className={`
          flex
          h-7
          items-center
          px-2
          pt-1
          opacity-0
          transition-opacity
          duration-150
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
            transition-all
            duration-150

            hover:bg-zinc-100
            hover:text-zinc-700

            active:scale-90

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