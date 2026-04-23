"use client";

import React, { useState } from "react";
import { Goal, GoalCard } from "./GoalCard";
import { UpdateProgressModal, type ProgressMode } from "./UpdateProgressModal";
import { EditGoalModal } from "./EditGoalModal";
import { DeleteGoalModal } from "./DeleteGoalModal";
import Link from "next/link";
import { Plus, Target, ArrowRight, AlertTriangle } from "lucide-react";

interface GoalsListProps {
  goals: Goal[];
  onUpdateProgress: (id: string, amount: number, mode: ProgressMode) => void;
  onUpdateGoal: (id: string, data: Partial<Goal>) => void;
  onDeleteGoal: (id: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function GoalsList({ goals, onUpdateProgress, onUpdateGoal, onDeleteGoal, isUpdating, isDeleting }: GoalsListProps) {
  const [selectedGoalForProgress, setSelectedGoalForProgress] = useState<{ id: string, title: string, currentAmount: number, targetAmount: number } | null>(null);
  const [selectedGoalForEdit, setSelectedGoalForEdit] = useState<Goal | null>(null);
  const [selectedGoalForDelete, setSelectedGoalForDelete] = useState<Goal | null>(null);

  const handleUpdateProgressClick = (id: string, title: string, currentAmount: number, targetAmount: number) => {
    setSelectedGoalForProgress({ id, title, currentAmount, targetAmount });
  };

  const handleEditClick = (goal: Goal) => {
    setSelectedGoalForEdit(goal);
  };

  const handleDeleteClick = (goal: Goal) => {
    setSelectedGoalForDelete(goal);
  };

  const handleConfirmProgress = async (amount: number, mode: ProgressMode) => {
    if (selectedGoalForProgress) {
      await onUpdateProgress(selectedGoalForProgress.id, amount, mode);
      setSelectedGoalForProgress(null);
    }
  };

  const handleConfirmEdit = async (data: Partial<Goal>) => {
    if (selectedGoalForEdit) {
      await onUpdateGoal(selectedGoalForEdit.id, data);
      setSelectedGoalForEdit(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedGoalForDelete) {
      await onDeleteGoal(selectedGoalForDelete.id);
      setSelectedGoalForDelete(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      {goals.map((goal) => (
        <GoalCard 
          key={goal.id} 
          goal={goal} 
          onUpdateClick={handleUpdateProgressClick}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
        />
      ))}
      
      {/* Botão de Adição (Card interativo) */}
      <Link 
        href="/new-goal" 
        className="border-2 border-dashed border-outline-variant/20 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 hover:border-primary/40 hover:bg-primary/5 transition-all group min-h-[220px]"
      >
        <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center group-hover:bg-primary/20 transition-all group-hover:scale-110 shadow-inner">
          <Plus className="w-8 h-8 text-on-surface-variant group-hover:text-primary transition-colors" />
        </div>
        <div className="text-center">
          <span className="block text-on-surface font-black text-sm tracking-tight group-hover:text-primary transition-colors">
            Nova Meta
          </span>
          <span className="text-[10px] text-on-surface-variant opacity-60 uppercase font-black tracking-widest">
            Planejar futuro
          </span>
        </div>
      </Link>

      {/* Modal de Atualização de Progresso */}
      {selectedGoalForProgress && (
        <UpdateProgressModal
          goalId={selectedGoalForProgress.id}
          goalTitle={selectedGoalForProgress.title}
          currentAmount={selectedGoalForProgress.currentAmount}
          targetAmount={selectedGoalForProgress.targetAmount}
          isOpen={!!selectedGoalForProgress}
          onClose={() => setSelectedGoalForProgress(null)}
          onConfirm={handleConfirmProgress}
          isUpdating={isUpdating}
        />
      )}

      {/* Modal de Edição */}
      {selectedGoalForEdit && (
        <EditGoalModal
          goal={selectedGoalForEdit}
          isOpen={!!selectedGoalForEdit}
          onClose={() => setSelectedGoalForEdit(null)}
          onConfirm={handleConfirmEdit}
          isUpdating={isUpdating}
        />
      )}

      {/* Modal de Exclusão */}
      {selectedGoalForDelete && (
        <DeleteGoalModal
          goalTitle={selectedGoalForDelete.title}
          isOpen={!!selectedGoalForDelete}
          onClose={() => setSelectedGoalForDelete(null)}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}

// --- Empty State ---
export function GoalsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 bg-surface-container-low border border-outline-variant/10 rounded-3xl text-center animate-in zoom-in-95 duration-500">
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 relative">
        <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-10"></div>
        <Target className="w-12 h-12 text-primary drop-shadow-[0_0_15px_rgba(176,198,255,0.4)]" />
      </div>
      <h3 className="text-2xl font-dm-sans font-black mb-3">Sua jornada começa aqui</h3>
      <p className="text-on-surface-variant font-source-sans-3 mb-10 max-w-sm leading-relaxed text-lg">
        Você ainda não criou nenhuma meta. Definir objetivos é o primeiro passo para conquistar o que você sempre sonhou.
      </p>
      <Link 
        href="/new-goal" 
        className="bg-primary text-on-primary px-10 py-4 rounded-full font-black shadow-2xl shadow-primary/40 hover:scale-95 transition-all active:scale-90 flex items-center gap-2"
      >
        <span>Criar minha primeira meta</span>
        <ArrowRight className="w-5 h-5" />
      </Link>
    </div>
  );
}

// --- Loading State ---
export function GoalsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-surface-container-low border border-outline-variant/10 rounded-2xl p-6 h-[240px] animate-pulse relative overflow-hidden">
          <div className="w-12 h-12 bg-surface-container-highest rounded-2xl mb-8"></div>
          <div className="h-6 bg-surface-container-highest rounded-md w-3/4 mb-4"></div>
          <div className="h-10 bg-surface-container-highest rounded-md w-1/2 mb-10"></div>
          <div className="h-3 bg-surface-container-highest rounded-full w-full"></div>
        </div>
      ))}
    </div>
  );
}

// --- Error State ---
export function GoalsError({ message, onRetry }: { message: string, onRetry: () => void }) {
  return (
    <div className="p-12 bg-surface-container-low border border-error/20 rounded-3xl text-center shadow-xl">
      <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mb-6 mx-auto">
         <AlertTriangle className="w-10 h-10 text-error" />
      </div>
      <h4 className="text-2xl font-dm-sans font-black mb-3 text-on-surface">Ops! Algo deu errado</h4>
      <p className="text-on-surface-variant font-source-sans-3 mb-10 text-lg">{message}</p>
      <button
        onClick={onRetry}
        className="px-10 py-4 bg-error text-on-error rounded-full font-black shadow-xl shadow-error/20 hover:scale-95 hover:bg-error/90 transition-all active:scale-90"
      >
        Tentar novamente
      </button>
    </div>
  );
}
