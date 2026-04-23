"use client";

import React, { useState } from "react";
import { X, PlusCircle, Target } from "lucide-react";

export type ProgressMode = "increment" | "set";

interface UpdateProgressModalProps {
  goalId: string;
  goalTitle: string;
  currentAmount: number;
  targetAmount: number;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number, mode: ProgressMode) => void;
  isUpdating: boolean;
}

export function UpdateProgressModal({
  goalTitle,
  currentAmount,
  targetAmount,
  isOpen,
  onClose,
  onConfirm,
  isUpdating,
}: UpdateProgressModalProps) {
  const [amount, setAmount] = useState<string>("");
  const [mode, setMode] = useState<ProgressMode>("increment");

  if (!isOpen) return null;

  const val = parseFloat(amount);
  const isValid = !isNaN(val) && val > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onConfirm(val, mode);
    setAmount("");
  };

  const handleClose = () => {
    setAmount("");
    setMode("increment");
    onClose();
  };

  const remaining = Math.max(0, targetAmount - currentAmount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={handleClose}
      />

      <div className="relative bg-surface-container-low border border-outline-variant/20 rounded-[40px] p-10 w-full max-w-md shadow-[0_30px_100px_rgba(0,0,0,0.5)] animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
        <button
          onClick={handleClose}
          aria-label="Fechar modal"
          className="absolute top-8 right-8 text-on-surface-variant hover:text-on-surface p-2 rounded-full hover:bg-surface-container-high transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
            {mode === "increment" ? (
              <PlusCircle className="w-8 h-8 text-primary" />
            ) : (
              <Target className="w-8 h-8 text-primary" />
            )}
          </div>
          <h3 className="text-3xl font-dm-sans font-black mb-3 pr-8 tracking-tight">
            {mode === "increment" ? "Vou economizar agora!" : "Definir valor guardado"}
          </h3>
          <p className="text-on-surface-variant font-source-sans-3 text-lg opacity-80 leading-relaxed">
            Meta:{" "}
            <span className="text-primary font-black">"{goalTitle}"</span>
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex p-1 bg-surface-container-highest rounded-full mb-8" role="group" aria-label="Modo de atualização">
          <button
            type="button"
            onClick={() => setMode("increment")}
            aria-pressed={mode === "increment"}
            className={`flex-1 py-2.5 px-4 rounded-full text-sm font-bold transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary outline-none ${
              mode === "increment"
                ? "bg-primary text-on-primary shadow-lg"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Aportar
          </button>
          <button
            type="button"
            onClick={() => setMode("set")}
            aria-pressed={mode === "set"}
            className={`flex-1 py-2.5 px-4 rounded-full text-sm font-bold transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary outline-none ${
              mode === "set"
                ? "bg-primary text-on-primary shadow-lg"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Definir valor
          </button>
        </div>

        {/* Contextual hint */}
        {mode === "increment" && remaining > 0 && (
          <p className="text-xs text-on-surface-variant mb-6 opacity-70">
            Faltam{" "}
            <span className="text-primary font-bold">
              R${" "}
              {remaining.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </span>{" "}
            para completar a meta.
          </p>
        )}
        {mode === "set" && (
          <p className="text-xs text-on-surface-variant mb-6 opacity-70">
            Define diretamente quanto você já tem guardado para essa meta.
            Valor máximo:{" "}
            <span className="text-primary font-bold">
              R${" "}
              {targetAmount.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </span>
            .
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="relative group">
            <label htmlFor="progress-amount" className="sr-only">
              {mode === "increment" ? "Valor a aportar" : "Valor guardado atual"}
            </label>
            <span className="absolute left-8 top-1/2 -translate-y-1/2 text-on-surface/40 font-dm-sans font-black text-2xl group-focus-within:text-primary transition-colors">
              R$
            </span>
            <input
              id="progress-amount"
              autoFocus
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-surface-container-highest/50 border border-outline-variant/10 rounded-[32px] py-8 pl-20 pr-8 text-4xl font-dm-sans font-black text-on-surface focus:ring-4 focus:ring-primary focus:bg-surface-container-highest transition-all placeholder:text-on-surface/10 outline-none"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-5 px-6 rounded-[24px] font-black text-on-surface-variant hover:bg-surface-container-high transition-all text-sm uppercase tracking-widest focus-visible:ring-2 focus-visible:ring-primary outline-none"
            >
              Agora não
            </button>
            <button
              type="submit"
              disabled={isUpdating || !isValid}
              className="flex-[1.5] py-5 px-10 bg-primary text-on-primary rounded-[24px] font-black shadow-2xl shadow-primary/30 hover:scale-95 transition-all active:scale-90 disabled:opacity-30 disabled:scale-100 flex items-center justify-center gap-3 text-sm uppercase tracking-widest focus-visible:ring-2 focus-visible:ring-primary outline-none"
            >
              {isUpdating ? (
                <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === "increment" ? "Registrar" : "Definir"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
