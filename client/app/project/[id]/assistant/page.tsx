"use client";

import React, { useState } from "react";
import { Bot, Send, Sparkles } from "lucide-react";

export default function ProjectAssistantPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hello! I'm your AI project assistant. How can I help you build or refine this project today?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages((prev) => [
      ...prev,
      { role: "user", text: userMsg },
      { role: "assistant", text: `Thanks for asking about "${userMsg}". Your project architecture and tech stack look great!` },
    ]);
    setInput("");
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-4xl mx-auto flex flex-col h-[calc(100vh-4rem)]">
      <div>
        <div className="flex items-center gap-2 text-indigo-500">
          <Bot className="w-5 h-5" />
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            AI Assistant
          </h1>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Interactive AI coding and project planning guidance.
        </p>
      </div>

      <div className="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 overflow-y-auto space-y-3">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 text-xs ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {m.role === "assistant" && (
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
            )}
            <div
              className={`p-3 rounded-xl max-w-md ${
                m.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI assistant anything about this project..."
          className="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 text-xs text-zinc-900 dark:text-white outline-none focus:border-indigo-500 transition-colors"
        />
        <button
          type="submit"
          className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4" />
          Send
        </button>
      </form>
    </div>
  );
}
