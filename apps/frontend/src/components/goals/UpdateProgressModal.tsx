"use client";

import React, { useState } from "react";
import { X, PlusCircle, ArrowRight } from "lucide-react";

interface UpdateProgressModalProps {
  goalId: string;
  goalTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  isUpdating: boolean;
}

export function UpdateProgressModal({ goalTitle, isOpen, onClose, onConfirm, isUpdating }: UpdateProgressModalProps) {
  const [amount, setAmount] = useState<string>("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return;
    onConfirm(val);
    setAmount("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-surface-container-low border border-outline-variant/20 rounded-[40px] p-10 w-full max-w-md shadow-[0_30px_100px_rgba(0,0,0,0.5)] animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-on-surface-variant hover:text-on-surface p-2 rounded-full hover:bg-surface-container-high transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mb-10">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
            <PlusCircle className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-3xl font-dm-sans font-black mb-3 pr-8 tracking-tight">Vou economizar agora!</h3>
          <p className="text-on-surface-variant font-source-sans-3 text-lg opacity-80 leading-relaxed">
            Quanto você deseja aportar na meta <span className="text-primary font-black">"{goalTitle}"</span>?
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="relative group">
             <span className="absolute left-8 top-1/2 -translate-y-1/2 text-on-surface/40 font-dm-sans font-black text-2xl group-focus-within:text-primary transition-colors">R$</span>
             <input
               autoFocus
               type="number"
               step="0.01"
               placeholder="0,00"
               value={amount}
               onChange={(e) => setAmount(e.target.value)}
               className="w-full bg-surface-container-highest/50 border border-outline-variant/10 rounded-[32px] py-8 pl-20 pr-8 text-4xl font-dm-sans font-black text-on-surface focus:ring-8 focus:ring-primary/10 focus:bg-surface-container-highest transition-all placeholder:text-on-surface/10 outline-none"
             />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-5 px-6 rounded-[24px] font-black text-on-surface-variant hover:bg-surface-container-high transition-all text-sm uppercase tracking-widest"
            >
              Agora não
            </button>
            <button
              type="submit"
              disabled={isUpdating || !amount || parseFloat(amount) <= 0}
              className="flex-[1.5] py-5 px-10 bg-primary text-on-primary rounded-[24px] font-black shadow-2xl shadow-primary/30 hover:scale-95 transition-all active:scale-90 disabled:opacity-30 disabled:scale-100 flex items-center justify-center gap-3 text-sm uppercase tracking-widest"
            >
              {isUpdating ? (
                <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Registrar</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
