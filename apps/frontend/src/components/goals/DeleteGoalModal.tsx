"use client";

import React from "react";
import { X, Trash2 } from "lucide-react";

interface DeleteGoalModalProps {
  goalTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export function DeleteGoalModal({ goalTitle, isOpen, onClose, onConfirm, isDeleting }: DeleteGoalModalProps) {
  if (!isOpen) return null;

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
        
        <div className="mb-10 text-center">
          <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mb-6 mx-auto">
            <Trash2 className="w-10 h-10 text-error" />
          </div>
          <h3 className="text-3xl font-dm-sans font-black mb-3 tracking-tight">Excluir Meta?</h3>
          <p className="text-on-surface-variant font-source-sans-3 text-lg opacity-80 leading-relaxed">
            Você está prestes a excluir a meta <span className="text-error font-black">"{goalTitle}"</span>. 
            Esta ação não pode ser desfeita e todo o progresso será perdido.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-5 px-6 rounded-[24px] font-black text-on-surface-variant hover:bg-surface-container-high transition-all text-sm uppercase tracking-widest"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-[1.5] py-5 px-10 bg-error text-on-error rounded-[24px] font-black shadow-2xl shadow-error/30 hover:scale-95 transition-all active:scale-90 disabled:opacity-30 disabled:scale-100 flex items-center justify-center gap-3 text-sm uppercase tracking-widest"
          >
            {isDeleting ? (
              <div className="w-5 h-5 border-2 border-on-error/30 border-t-on-error rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Excluir</span>
                <Trash2 className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
