"use client";

import React from "react";
import Link from "next/link";

export default function NewGoalPage() {
  return (
    <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-12 bg-background">
      {/* Top Navigation Action */}
      <div className="mb-10">
        <Link 
          href="/goals" 
          className="flex items-center gap-2 text-on-surface/60 hover:text-primary transition-colors font-headline font-medium group"
        >
          <span className="material-symbols-outlined text-xl group-hover:-translate-x-1 transition-transform">
            arrow_back
          </span>
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

          <div className="space-y-8 bg-surface-container-low p-6 md:p-10 rounded-xl shadow-[0px_24px_48px_rgba(0,0,0,0.2)]">
            {/* Input: Name */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-primary px-1">
                Nome da Meta
              </label>
              <input 
                className="bg-surface-container-highest border-none rounded-xl py-4 px-5 text-on-surface focus:ring-2 focus:ring-primary/50 placeholder:text-on-surface/30 font-headline font-medium transition-all outline-none" 
                placeholder="Ex: Reserva de Emergência" 
                type="text" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Input: Value */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-primary px-1">
                  Valor Objetivo
                </label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface/40 font-headline font-bold">R$</span>
                  <input 
                    className="w-full bg-surface-container-highest border-none rounded-xl py-4 pl-12 pr-5 text-on-surface focus:ring-2 focus:ring-primary/50 placeholder:text-on-surface/30 font-headline font-bold text-xl transition-all outline-none" 
                    placeholder="0,00" 
                    type="text" 
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
                    className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-5 text-on-surface focus:ring-2 focus:ring-primary/50 font-headline font-medium transition-all [color-scheme:dark] outline-none" 
                    type="date" 
                  />
                  <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-on-surface/40 pointer-events-none">
                    calendar_today
                  </span>
                </div>
              </div>
            </div>

            {/* Icon Selector */}
            <div className="flex flex-col gap-4">
              <label className="text-[10px] uppercase tracking-widest font-bold text-primary px-1">
                Selecione um Ícone
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                <button className="aspect-square bg-primary-container text-on-primary-container rounded-xl flex items-center justify-center hover:scale-105 transition-transform group">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
                </button>
                <button className="aspect-square bg-surface-container-highest text-on-surface/40 rounded-xl flex items-center justify-center hover:bg-surface-bright hover:text-on-surface transition-all">
                  <span className="material-symbols-outlined text-2xl">directions_car</span>
                </button>
                <button className="aspect-square bg-surface-container-highest text-on-surface/40 rounded-xl flex items-center justify-center hover:bg-surface-bright hover:text-on-surface transition-all">
                  <span className="material-symbols-outlined text-2xl">flight</span>
                </button>
                <button className="aspect-square bg-surface-container-highest text-on-surface/40 rounded-xl flex items-center justify-center hover:bg-surface-bright hover:text-on-surface transition-all">
                  <span className="material-symbols-outlined text-2xl">emergency</span>
                </button>
                <button className="aspect-square bg-surface-container-highest text-on-surface/40 rounded-xl flex items-center justify-center hover:bg-surface-bright hover:text-on-surface transition-all">
                  <span className="material-symbols-outlined text-2xl">favorite</span>
                </button>
                <button className="aspect-square bg-surface-container-highest text-on-surface/40 rounded-xl flex items-center justify-center hover:bg-surface-bright hover:text-on-surface transition-all">
                  <span className="material-symbols-outlined text-2xl">grade</span>
                </button>
              </div>
            </div>

            {/* Color Selector */}
            <div className="flex flex-col gap-4">
              <label className="text-[10px] uppercase tracking-widest font-bold text-primary px-1">
                Cor de Destaque
              </label>
              <div className="flex flex-wrap gap-4">
                <button className="w-10 h-10 rounded-full bg-[#b0c6ff] ring-offset-4 ring-offset-[#131313] ring-2 ring-primary scale-110"></button>
                <button className="w-10 h-10 rounded-full bg-[#ffb59b] hover:scale-110 transition-transform"></button>
                <button className="w-10 h-10 rounded-full bg-[#a1b4eb] hover:scale-110 transition-transform"></button>
                <button className="w-10 h-10 rounded-full bg-[#0058cb] hover:scale-110 transition-transform"></button>
                <button className="w-10 h-10 rounded-full bg-[#324575] hover:scale-110 transition-transform"></button>
                <button className="w-10 h-10 rounded-full bg-[#93000a] hover:scale-110 transition-transform"></button>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-12 flex items-center gap-6">
            <button className="flex-1 md:flex-none bg-primary-container text-on-primary-container px-12 py-4 rounded-full font-headline font-bold text-lg hover:brightness-110 active:scale-95 transition-all shadow-[0_8px_30px_rgb(0,88,203,0.3)]">
              Criar Meta
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
          <div className="bg-surface-container p-8 rounded-xl border border-on-surface/5 overflow-hidden relative group">
            {/* Background Decoration */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-12">
                <div className="p-4 bg-primary/10 rounded-xl text-primary">
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    home
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface/40">Status</p>
                  <span className="bg-surface-container-highest text-on-surface/60 px-3 py-1 rounded-full text-xs font-bold border border-on-surface/10">
                    Novo Objetivo
                  </span>
                </div>
              </div>
              <div className="space-y-1 mb-8">
                <h3 className="text-2xl font-headline font-extrabold text-on-surface">Minha Nova Meta</h3>
                <p className="text-on-surface/60 font-body">
                  Meta estimada: <span className="text-on-surface font-semibold">R$ 0,00</span>
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-3xl font-headline font-black text-on-surface tracking-tighter">0%</span>
                  <span className="text-on-surface/40 font-bold text-[10px] uppercase tracking-wider">Aguardando Início</span>
                </div>
                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-1 rounded-full"></div>
                </div>
              </div>
              <div className="mt-12 pt-8 border-t border-on-surface/5 flex justify-between items-center">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface/40">Prazo</p>
                  <p className="text-sm font-headline font-bold">Defina uma data</p>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-lg">event</span>
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
          <div className="mt-8 p-6 bg-surface-container-low rounded-xl border-l-4 border-tertiary">
            <div className="flex gap-4">
              <span className="material-symbols-outlined text-tertiary">lightbulb</span>
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
