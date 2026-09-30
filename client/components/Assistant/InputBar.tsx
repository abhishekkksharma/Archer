"use client";

import React, { useState } from "react";
import { Mic, MicOff, ArrowUp } from "lucide-react";

interface InputBarProps {
  prompt?: string;
  buttonDisabled?: boolean;
  onSubmit?: (value: string) => void;
}

interface SpeechRecognitionResultEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;

  start(): void;
  stop(): void;

  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

interface SpeechRecognitionWindow extends Window {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
}

function InputBar({
  prompt = "",
  buttonDisabled = false,
  onSubmit,
}: InputBarProps) {
  const [value, setValue] = useState(prompt);
  const [isListening, setIsListening] = useState(false);

  const isSendDisabled = buttonDisabled || !value.trim();

  const handleSubmit = () => {
    const trimmedValue = value.trim();

    if (!trimmedValue || buttonDisabled) {
      return;
    }

    onSubmit?.(trimmedValue);
    setValue("");
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handleMic = () => {
    const speechWindow = window as SpeechRecognitionWindow;

    const SpeechRecognition =
      speechWindow.SpeechRecognition ||
      speechWindow.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Speech recognition is not supported in this browser."
      );
      return;
    }

    if (isListening) {
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript =
        event.results[0][0].transcript;

      setValue((previousValue) =>
        `${previousValue} ${transcript}`.trim()
      );
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div
      className="
        flex w-full max-w-2xl items-center gap-2
        rounded-[26px]
        border-2 border-zinc-200/50
        bg-white
        p-2
        absolute
        bottom-6
        shadow-lg
        transition-all duration-500
        fixed
        focus-within:border-zinc-300
        focus-within:shadow-md

        dark:border-zinc-800
        dark:bg-zinc-900
        dark:focus-within:border-zinc-700
      "
    >
      <input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything..."
        disabled={buttonDisabled}
        className="
          min-w-0
          flex-1
          bg-transparent
          px-4
          py-2
          text-sm
          text-zinc-900
          outline-none
          placeholder:text-zinc-400

          disabled:cursor-not-allowed
          disabled:opacity-50

          dark:text-zinc-100
          dark:placeholder:text-zinc-400
        "
      />

      <div className="flex shrink-0 items-center gap-1.5">
        <button
          type="button"
          onClick={handleMic}
          disabled={buttonDisabled}
          aria-label={
            isListening
              ? "Listening"
              : "Use microphone"
          }
          className={`
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            transition-all
            duration-200

            disabled:cursor-not-allowed
            disabled:opacity-40

            ${
              isListening
                ? `
                  bg-red-500
                  text-white
                  hover:bg-red-600
                  animate-pulse
                `
                : `
                  bg-zinc-100
                  text-zinc-600
                  hover:bg-zinc-200

                  dark:bg-zinc-900
                  dark:text-zinc-400
                  dark:hover:bg-zinc-800
                `
            }
          `}
        >
          {isListening ? (
            <MicOff className="h-[18px] w-[18px]" />
          ) : (
            <Mic className="h-[18px] w-[18px]" />
          )}
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSendDisabled}
          aria-label="Send message"
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full

            bg-black
            text-white

            transition-all
            duration-200

            hover:scale-105
            hover:bg-zinc-800

            active:scale-95

            disabled:cursor-not-allowed
            disabled:scale-100
            disabled:bg-zinc-200
            disabled:text-zinc-400

            dark:bg-white
            dark:text-black
            dark:hover:bg-zinc-200

            dark:disabled:bg-zinc-800
            dark:disabled:text-zinc-600
          "
        >
          <ArrowUp className="h-[18px] w-[18px]" />
        </button>
      </div>
    </div>
  );
}

export default InputBar;