"use client";

import { useState, useCallback } from "react";

export type ToastKind = "success" | "error";

interface ToastState {
  message: string;
  kind: ToastKind;
}

export function useToast(durationMs = 3000) {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback(
    (message: string, kind: ToastKind) => {
      setToast({ message, kind });
      setTimeout(() => setToast(null), durationMs);
    },
    [durationMs]
  );

  return { toast, showToast };
}

interface ToastProps {
  toast: ToastState | null;
}

export function Toast({ toast }: ToastProps) {
  if (!toast) return null;

  const isSuccess = toast.kind === "success";

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-source-sans-3 font-semibold animate-in fade-in slide-in-from-bottom-4 duration-300 ${
        isSuccess
          ? "bg-green-500/15 border border-green-500/25 text-green-400"
          : "bg-red-500/15 border border-red-500/25 text-red-400"
      }`}
      role="status"
      aria-live="polite"
    >
      <span
        className="material-symbols-outlined text-lg"
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        {isSuccess ? "check_circle" : "cancel"}
      </span>
      {toast.message}
    </div>
  );
}
