"use client";

import React, { useState, useEffect } from "react";
import { Goal } from "./GoalCard";
import { X, Edit2, Save } from "lucide-react";

interface EditGoalModalProps {
  goal: Goal;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: Partial<Goal>) => void;
  isUpdating: boolean;
}

export function EditGoalModal({ goal, isOpen, onClose, onConfirm, isUpdating }: EditGoalModalProps) {
  const [formData, setFormData] = useState({
    title: goal.title,
    target_amount: goal.target_amount.toString(),
    deadline: goal.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : ""
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: goal.title,
        target_amount: goal.target_amount.toString(),
        deadline: goal.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : ""
      });
    }
  }, [isOpen, goal]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({
      title: formData.title,
      target_amount: parseFloat(formData.target_amount),
      deadline: formData.deadline || undefined
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-surface-container-low border border-outline-variant/20 rounded-[40px] p-10 w-full max-w-lg shadow-[0_30px_100px_rgba(0,0,0,0.5)] animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 overflow-y-auto max-h-[90vh]">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-on-surface-variant hover:text-on-surface p-2 rounded-full hover:bg-surface-container-high transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
            <Edit2 className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-3xl font-dm-sans font-black mb-2 tracking-tight">Editar Meta</h3>
          <p className="text-on-surface-variant font-source-sans-3 text-lg opacity-80">
            Ajuste os detalhes do seu objetivo financeiro.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-primary px-1">
              Título da Meta
            </label>
            <input
              required
              className="bg-surface-container-highest/50 border border-outline-variant/10 rounded-2xl py-4 px-5 text-on-surface focus:ring-4 focus:ring-primary/10 transition-all outline-none"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-primary px-1">
                Valor Objetivo
              </label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface/40 font-bold">R$</span>
                <input
                  required
                  className="w-full bg-surface-container-highest/50 border border-outline-variant/10 rounded-2xl py-4 pl-12 pr-5 text-on-surface focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.target_amount}
                  onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-primary px-1">
                Data Limite
              </label>
              <input
                className="bg-surface-container-highest/50 border border-outline-variant/10 rounded-2xl py-4 px-5 text-on-surface focus:ring-4 focus:ring-primary/10 transition-all [color-scheme:dark] outline-none"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-5 px-6 rounded-[24px] font-black text-on-surface-variant hover:bg-surface-container-high transition-all text-sm uppercase tracking-widest"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="flex-[1.5] py-5 px-10 bg-primary text-on-primary rounded-[24px] font-black shadow-2xl shadow-primary/30 hover:scale-95 transition-all active:scale-90 disabled:opacity-30 disabled:scale-100 flex items-center justify-center gap-3 text-sm uppercase tracking-widest"
            >
              {isUpdating ? (
                <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Salvar</span>
                  <Save className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
