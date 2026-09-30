"use client";

import React, { useState } from "react";
import { Bot, Send, Sparkles } from "lucide-react";
import InputBar from "@/components/Assistant/InputBar";
import MessagesMapper from "@/components/Assistant/MessagesMapper";

export default function ProjectAssistantPage() {
  const handlePrompt = (value: string) => {
    console.log("User prompt:", value);
  };

  return (
    <div className="px-[16%]">
      <div>
        <MessagesMapper/>
      </div>
      <div className="flex justify-center">
        <InputBar onSubmit={handlePrompt} />
      </div>
    </div>
  );
}
