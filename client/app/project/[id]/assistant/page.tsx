"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import InputBar from "@/components/Assistant/InputBar";
import MessagesMapper, { MessageData } from "@/components/Assistant/MessagesMapper";

function getCookie(name: string): string | null {
  if (typeof window === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return (
    getCookie("token") ||
    getCookie("auth_token") ||
    getCookie("jwt") ||
    localStorage.getItem("token") ||
    localStorage.getItem("auth_token")
  );
}

export default function ProjectAssistantPage() {
  const params = useParams();
  const projectId = (params?.id as string) || "";

  const [messages, setMessages] = useState<MessageData[]>([]);
  const [sending, setSending] = useState<boolean>(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

  const fetchChatHistory = useCallback(async () => {
    if (!projectId) return;

    try {
      const token = getToken();
      const res = await fetch(`${backendUrl}/assistant/project/${projectId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await res.json();
      if (res.ok && data.success && data.data?.messages) {
        setMessages(data.data.messages);
      }
    } catch (err) {
      console.error("Failed to fetch chat history:", err);
    }
  }, [projectId, backendUrl]);

  useEffect(() => {
    fetchChatHistory();
  }, [fetchChatHistory]);

  const handlePrompt = async (value: string) => {
    if (!value.trim() || sending || !projectId) return;

    const userMsg: MessageData = {
      role: "user",
      content: value.trim(),
      message: value.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setSending(true);

    try {
      const token = getToken();
      const res = await fetch(`${backendUrl}/assistant/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          projectId,
          message: value.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (data.data?.chat?.messages) {
          setMessages(data.data.chat.messages);
        } else if (data.data?.response) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: data.data.response,
              message: data.data.response,
            },
          ]);
        }
      }
    } catch (err) {
      console.error("Failed to send prompt:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="px-[20%]">
      <div>
        <MessagesMapper messages={messages} isLoading={sending} />
      </div>
      <div className="flex justify-center">
        <InputBar onSubmit={handlePrompt} buttonDisabled={sending} />
      </div>
    </div>
  );
}
