"use client";

import React from "react";
import { 
  Home, 
  Car, 
  Plane, 
  GraduationCap, 
  ShoppingBag, 
  Heart, 
  Briefcase, 
  Utensils, 
  Gamepad2, 
  CircleDollarSign,
  Edit2,
  Trash2,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';

export interface Goal {
  id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  progress: number;
  status: 'active' | 'completed' | 'cancelled';
  deadline?: string;
  icon?: string;
  color?: string;
}

interface GoalCardProps {
  goal: Goal;
  onUpdateClick: (id: string, title: string, currentAmount: number, targetAmount: number) => void;
  onEditClick: (goal: Goal) => void;
  onDeleteClick: (goal: Goal) => void;
}

export function GoalCard({ goal, onUpdateClick, onEditClick, onDeleteClick }: GoalCardProps) {
  const isCompleted = goal.status === 'completed';
  const progressPercent = Math.min(goal.progress, 100);

  // Helper para ícones
  const getIcon = (title: string, customIcon?: string) => {
    const iconName = customIcon || 'savings';
    
    switch (iconName) {
      case 'savings': return <CircleDollarSign className="w-6 h-6" />;
      case 'home': return <Home className="w-6 h-6" />;
      case 'car': return <Car className="w-6 h-6" />;
      case 'plane': return <Plane className="w-6 h-6" />;
      case 'graduation-cap': return <GraduationCap className="w-6 h-6" />;
      case 'shopping-bag': return <ShoppingBag className="w-6 h-6" />;
      case 'heart': return <Heart className="w-6 h-6" />;
      case 'briefcase': return <Briefcase className="w-6 h-6" />;
      case 'utensils': return <Utensils className="w-6 h-6" />;
      case 'gamepad': return <Gamepad2 className="w-6 h-6" />;
      default:
        // Fallback baseado no título
        const t = title.toLowerCase();
        if (t.includes('carro')) return <Car className="w-6 h-6" />;
        if (t.includes('casa') || t.includes('imóvel')) return <Home className="w-6 h-6" />;
        if (t.includes('viagem')) return <Plane className="w-6 h-6" />;
        if (t.includes('estudo')) return <GraduationCap className="w-6 h-6" />;
        return <CircleDollarSign className="w-6 h-6" />;
    }
  };

  return (
    <div className={`relative bg-surface-container-low border border-outline-variant/10 rounded-2xl p-6 hover:bg-surface-container-high transition-all duration-500 group overflow-hidden ${isCompleted ? 'ring-2 ring-primary/30 shadow-[0_0_30px_rgba(176,198,255,0.1)]' : ''}`}>
      {/* Background Glow */}
      <div 
        className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] -mr-16 -mt-16 transition-all duration-700 opacity-20 group-hover:opacity-40`}
        style={{ backgroundColor: goal.color || (isCompleted ? '#b0c6ff' : '#a1b4eb') }}
      ></div>

      <div className="flex justify-between items-start mb-6">
        <div 
          className="p-3 rounded-2xl" 
          style={{ 
            backgroundColor: `${goal.color || '#b0c6ff'}20`, 
            color: goal.color || '#b0c6ff' 
          }}
        >
          {getIcon(goal.title, goal.icon)}
        </div>

        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={(e) => { e.stopPropagation(); onEditClick(goal); }}
            className="w-10 h-10 rounded-xl bg-surface-container-highest text-on-surface-variant hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center shadow-lg active:scale-90"
            title="Editar"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDeleteClick(goal); }}
            className="w-10 h-10 rounded-xl bg-surface-container-highest text-on-surface-variant hover:bg-error hover:text-on-error transition-all flex items-center justify-center shadow-lg active:scale-90"
            title="Excluir"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
        
        {isCompleted && (
          <div className="flex items-center gap-1 bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            Concluída
          </div>
        )}
      </div>

      <div className="mb-8">
        <h4 className="text-xl font-dm-sans font-bold text-on-surface mb-2 group-hover:text-primary transition-colors truncate" 
          style={{ color: goal.color && !isCompleted ? goal.color : undefined }}
          title={goal.title}
        >
          {goal.title}
        </h4>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black font-dm-sans tracking-tight text-on-surface">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(goal.current_amount)}
          </span>
          <span className="text-xs text-on-surface-variant font-medium opacity-60">
            de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(goal.target_amount)}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <span className="text-xs font-bold" style={{ color: goal.color || '#b0c6ff' }}>{progressPercent}%</span>
          <span className="text-[10px] text-on-surface-variant opacity-50 font-medium">
            {isCompleted ? 'Objetivo alcançado!' : `Faltam ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Math.max(0, goal.target_amount - goal.current_amount))}`}
          </span>
        </div>
        
        {/* Progress Bar Container */}
        <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden shadow-inner p-[2px]">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ease-out relative ${isCompleted ? 'bg-gradient-to-r from-primary to-secondary shadow-[0_0_10px_rgba(176,198,255,0.4)]' : ''}`}
            style={{ 
              width: `${progressPercent}%`,
              backgroundColor: isCompleted ? undefined : (goal.color || '#b0c6ff')
            }}
          >
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
            
            {/* Shine animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-full -translate-x-full group-hover:animate-shine"></div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      {!isCompleted && (
        <button 
          onClick={() => onUpdateClick(goal.id, goal.title, goal.current_amount, goal.target_amount)}
          className="mt-6 w-full py-3 bg-surface-container-highest rounded-xl text-on-surface font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-sm"
        >
          <span>Atualizar Progresso</span>
          <TrendingUp className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      )}
    </div>
  );
}
