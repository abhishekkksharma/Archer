"use client";

import React, { useEffect, useRef } from "react";
import Message from "./Message";
import AssistantSkeleton from "./AssistantSkeleton";

export interface MessageData {
  _id?: string;
  id?: string | number;
  role: "system" | "user" | "assistant";
  content?: string;
  message?: string;
}

interface MessagesMapperProps {
  messages?: MessageData[];
  isLoading?: boolean;
}

function MessagesMapper({ messages = [], isLoading = false }: MessagesMapperProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages.length, isLoading]);

  return (
    <div
      className="
        h-full
        w-full
        overflow-y-auto
        px-3
        sm:px-5
      "
    >
      <div
        className="
          flex
          min-h-full
          flex-col
          gap-2
          pt-6
          pb-30
        "
      >
        {messages.map((message, index) => (
          <Message
            key={message._id || message.id || `msg-${index}`}
            role={message.role}
            message={message.message || message.content || ""}
          />
        ))}

        {isLoading && <AssistantSkeleton />}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}

export default MessagesMapper;