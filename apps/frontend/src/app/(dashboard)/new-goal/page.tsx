"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { fetchAPI } from "@/lib/api";
import { 
  ArrowLeft,
  AlertCircle,
  Loader2,
  Lightbulb,
  Calendar
} from 'lucide-react';

export default function NewGoalPage() {
  const router = useRouter();
  const { token } = useAuth();
  
  const icons = [
    // Finance/Goals
    "savings", "account_balance", "credit_card", "monetization_on", "wallet", "receipt_long", "trending_up", "account_balance_wallet",
    // Lifestyle
    "shopping_bag", "directions_car", "home", "medical_services", "restaurant", "flight",
    // Activities & Objects
    "sports_esports", "fitness_center", "school", "pets", "celebration", "star", "shopping_cart", "check_circle",
    // Others
    "payments", "more_horiz"
  ];

  const colors = [
    "#b0c6ff", "#ffb59b", "#82f9d8", "#f8b0ff", "#ffe082",
    "#ff8a80", "#b39ddb", "#4dd0e1", "#81c784", "#ffb74d"
  ];

  const [formData, setFormData] = useState({
    title: "",
    target_amount: "",
    deadline: "",
    icon: "savings",
    color: "#b0c6ff"
  });

  // Helper function to render the selected icon in preview
  const renderIcon = (iconName: string, className?: string) => {
    return (
      <span className={`material-symbols-outlined ${className || "text-3xl"}`}>
        {iconName}
      </span>
    );
  };
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!token) return;
    if (!formData.title || !formData.target_amount) {
      setError("Título e valor objetivo são obrigatórios.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const res = await fetchAPI("/goals", {
      method: "POST",
      token,
      body: JSON.stringify({
        title: formData.title,
        target_amount: parseFloat(formData.target_amount),
        deadline: formData.deadline || undefined,
        icon: formData.icon,
        color: formData.color,
      }),
    });

    setIsSubmitting(true); 

    if (res.error) {
      setIsSubmitting(false);
      setError(res.error.message || "Erro ao criar meta. Tente novamente.");
    } else {
      router.push("/goals");
    }
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-12 bg-background">
      {/* Top Navigation Action */}
      <div className="mb-10">
        <Link
          href="/goals"
          className="flex items-center gap-2 text-on-surface/60 hover:text-primary transition-colors font-headline font-medium group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Lista de Metas</span>
        </Link>
      </div>

      <div className="grid grid-cols-12 gap-12 items-start">
        {/* Form Section (Left Column) */}
        <section className="col-span-12 lg:col-span-12 xl:col-span-8">
          <header className="mb-10">
            <h2 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface mb-2">
              Nova Meta Financeira
            </h2>
            <p className="text-on-surface/60 text-lg">
              Defina um objetivo para o seu patrimônio.
            </p>
          </header>

          <div className="space-y-8 bg-surface-container-low p-6 md:p-10 rounded-xl shadow-[0px_24px_48px_rgba(0,0,0,0.2)] border border-white/5">
            {/* Input: Name */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-primary px-1">
                Nome da Meta
              </label>
              <input
                className="bg-surface-container-highest border border-white/5 rounded-xl py-4 px-5 text-on-surface focus:ring-2 focus:ring-primary/50 placeholder:text-on-surface/30 font-headline font-medium transition-all outline-none"
                placeholder="Ex: Reserva de Emergência"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            {error && (
              <div className="bg-error/10 border border-error/20 p-4 rounded-xl text-error text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Input: Value */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-primary px-1">
                  Valor Objetivo
                </label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface/40 font-headline font-bold">R$</span>
                  <input
                    className="w-full bg-surface-container-highest border border-white/5 rounded-xl py-4 pl-12 pr-5 text-on-surface focus:ring-2 focus:ring-primary/50 placeholder:text-on-surface/30 font-headline font-bold text-xl transition-all outline-none"
                    placeholder="0,00"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.target_amount}
                    onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                  />
                </div>
              </div>

              {/* Input: Date */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-primary px-1">
                  Data Limite
                </label>
                <div className="relative">
                  <input
                    className="w-full bg-surface-container-highest border border-white/5 rounded-xl py-4 px-5 text-on-surface focus:ring-2 focus:ring-primary/50 font-headline font-medium transition-all [color-scheme:dark] outline-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-5 [&::-webkit-calendar-picker-indicator]:w-5 [&::-webkit-calendar-picker-indicator]:h-5 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  />
                  <Calendar className="absolute right-5 top-1/2 -translate-y-1/2 text-on-surface/40 w-5 h-5 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Icon Selector */}
            <div className="flex flex-col gap-4">
              <label className="text-[10px] uppercase tracking-widest font-bold text-primary px-1">
                Selecione um Ícone
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 p-4 bg-surface-container rounded-xl border border-white/5 max-h-[300px] overflow-y-auto custom-scrollbar">
                {icons.map((icon) => (
                  <button 
                    key={icon}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon })}
                    className={`aspect-square rounded-xl flex items-center justify-center transition-all ${formData.icon === icon ? 'bg-primary text-on-primary scale-110 shadow-lg' : 'bg-surface-container-highest text-on-surface/40 hover:bg-surface-bright'}`}
                  >
                    <span className="material-symbols-outlined">{icon}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div className="flex flex-col gap-4">
              <label className="text-[10px] uppercase tracking-widest font-bold text-primary px-1">
                Cor de Destaque
              </label>
              <div className="flex flex-wrap gap-4 p-4 bg-surface-container rounded-xl border border-white/5">
                {colors.map((color) => (
                  <button 
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-10 h-10 rounded-full transition-all ${formData.color === color ? 'ring-offset-4 ring-offset-background ring-2 ring-primary scale-110' : 'hover:scale-110'}`}
                    style={{ backgroundColor: color }}
                  ></button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-12 flex items-center gap-6">
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 md:flex-none bg-primary text-on-primary px-12 py-4 rounded-full font-headline font-bold text-lg hover:brightness-110 active:scale-95 transition-all shadow-[0_8px_30px_rgb(0,88,203,0.3)] disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
              {isSubmitting ? "Criando..." : "Criar Meta"}
            </button>
            <Link
              href="/goals"
              className="text-on-surface/60 hover:text-on-surface px-8 py-4 rounded-full font-headline font-bold transition-all"
            >
              Cancelar
            </Link>
          </div>
        </section>

        {/* Preview Sidebar (Right Column) - Hidden on Mobile */}
        <aside className="hidden xl:block xl:col-span-4 sticky top-12">
          <div className="bg-surface-container p-8 rounded-xl border border-on-surface/5 overflow-hidden relative group shadow-2xl">
            {/* Background Decoration */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-12">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300" 
                  style={{ 
                    backgroundColor: `${formData.color}20`, 
                    color: formData.color,
                    boxShadow: `0 8px 32px ${formData.color}33`
                  }}
                >
                  {renderIcon(formData.icon, "text-3xl")}
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface/40">Status</p>
                  <span className="bg-surface-container-highest text-on-surface/60 px-3 py-1 rounded-full text-xs font-bold border border-on-surface/10">
                    Novo Objetivo
                  </span>
                </div>
              </div>
              <div className="space-y-1 mb-8">
                <h3 className="text-2xl font-headline font-extrabold text-on-surface truncate">
                  {formData.title || "Minha Nova Meta"}
                </h3>
                <p className="text-on-surface/60 font-body">
                  Meta estimada: <span className="text-on-surface font-semibold">
                    {formData.target_amount ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(formData.target_amount)) : "R$ 0,00"}
                  </span>
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-3xl font-headline font-black text-on-surface tracking-tighter">0%</span>
                  <span className="text-on-surface/40 font-bold text-[10px] uppercase tracking-wider">Aguardando Início</span>
                </div>
                {/* Progress Bar */}
                <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-1 rounded-full"></div>
                </div>
              </div>
              <div className="mt-12 pt-8 border-t border-on-surface/5 flex justify-between items-center">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface/40">Prazo</p>
                  <p className="text-sm font-headline font-bold text-on-surface">
                    {formData.deadline ? new Date(formData.deadline).toLocaleDateString('pt-BR') : "Defina uma data"}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-primary/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
              </div>
            </div>
            {/* Preview Tag */}
            <div className="absolute top-4 right-4 rotate-12">
              <div className="bg-tertiary text-on-tertiary text-[10px] font-black px-3 py-1 rounded-sm uppercase tracking-tighter shadow-sm">
                Preview
              </div>
            </div>
          </div>
          <div className="mt-8 p-6 bg-surface-container-low rounded-xl border-l-4 border-tertiary shadow-lg">
            <div className="flex gap-4">
              <Lightbulb className="w-6 h-6 text-tertiary flex-shrink-0" />
              <div>
                <h4 className="font-headline font-bold text-on-surface text-sm">Dica de Gestão</h4>
                <p className="text-on-surface/60 text-xs mt-1 leading-relaxed">
                  Metas com prazos realistas e ícones visuais claros aumentam em 40% a probabilidade de conclusão bem-sucedida.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
