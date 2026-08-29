"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

type PopupType = "success" | "error" | "info";

interface PopupMessage {
  id: string;
  message: string;
  type: PopupType;
}

interface PopupContextType {
  showPopup: (message: string, type: PopupType) => void;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export function PopupProvider({ children }: { children: React.ReactNode }) {
  const [popups, setPopups] = useState<PopupMessage[]>([]);

  const showPopup = (message: string, type: PopupType) => {
    const id = Math.random().toString(36).substring(2, 9);
    setPopups((prev) => [...prev, { id, message, type }]);
  };

  const removePopup = (id: string) => {
    setPopups((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <PopupContext.Provider value={{ showPopup }}>
      {children}
      
      {/* Popups Container */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <style>{`
          @keyframes popupSlideIn {
            0% {
              opacity: 0;
              transform: translateX(100%) translateY(-10px);
            }
            100% {
              opacity: 1;
              transform: translateX(0) translateY(0);
            }
          }
          .animate-popup-in {
            animation: popupSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}</style>

        {popups.map((popup) => (
          <PopupCard
            key={popup.id}
            id={popup.id}
            message={popup.message}
            type={popup.type}
            onClose={removePopup}
          />
        ))}
      </div>
    </PopupContext.Provider>
  );
}

function PopupCard({
  id,
  message,
  type,
  onClose,
}: {
  id: string;
  message: string;
  type: PopupType;
  onClose: (id: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 4000);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />;
      case "error":
        return <XCircle className="h-5 w-5 text-rose-500 shrink-0" />;
      case "info":
        return <Info className="h-5 w-5 text-sky-500 shrink-0" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case "success":
        return "border-emerald-500/20 bg-emerald-50/70 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200 shadow-emerald-500/5";
      case "error":
        return "border-rose-500/20 bg-rose-50/70 dark:bg-rose-950/20 text-rose-900 dark:text-rose-200 shadow-rose-500/5";
      case "info":
        return "border-sky-500/20 bg-sky-50/70 dark:bg-sky-950/20 text-sky-900 dark:text-sky-200 shadow-sky-500/5";
    }
  };

  return (
    <div
      className={`
        animate-popup-in pointer-events-auto
        flex items-start gap-3 w-full p-4 rounded-xl border
        backdrop-blur-md shadow-lg
        transition-all duration-300
        ${getStyles()}
      `}
    >
      {getIcon()}
      
      <div className="flex-1 text-sm font-medium leading-relaxed">
        {message}
      </div>

      <button
        onClick={() => onClose(id)}
        className="opacity-60 hover:opacity-100 transition-opacity p-0.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 shrink-0"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function usePopup() {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error("usePopup must be used within a PopupProvider");
  }
  return context;
}
