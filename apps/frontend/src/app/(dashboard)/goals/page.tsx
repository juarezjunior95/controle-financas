import React from "react";
import Link from "next/link";

export default function GoalsPage() {
  return (
    <div className="flex flex-col w-full h-full">
      {/* Hero Section / Header */}
      <section className="mb-12">
        <h2 className="text-4xl md:text-5xl font-dm-sans font-bold tracking-tight text-on-surface mb-2">
          Metas
        </h2>
        <p className="text-on-surface-variant font-source-sans-3 text-lg">
          Seu patrimônio em construção.
        </p>
      </section>

      {/* Bento Grid for Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {/* Featured Goal (Large) */}
        <div className="lg:col-span-2 lg:row-span-2 bg-surface-container-high rounded-xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-start mb-12">
              <div>
                <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full mb-4">
                  ALTA PRIORIDADE
                </span>
                <h3 className="text-3xl font-dm-sans font-bold text-on-surface">
                  Compra do Imóvel
                </h3>
              </div>
              <div className="p-3 bg-surface-container-highest rounded-2xl">
                <span className="material-symbols-outlined text-primary text-3xl">
                  home
                </span>
              </div>
            </div>
            <div className="mt-auto">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-on-surface-variant text-sm font-medium mb-1">
                    Acumulado
                  </p>
                  <p className="text-4xl font-dm-sans font-black tracking-tighter text-on-surface">
                    R$ 145.200,00
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-on-surface-variant text-sm font-medium mb-1">
                    Objetivo
                  </p>
                  <p className="text-xl font-dm-sans font-bold text-on-surface opacity-60">
                    R$ 450.000,00
                  </p>
                </div>
              </div>
              {/* Large Progress Bar */}
              <div className="relative h-4 w-full bg-surface-container-highest rounded-full overflow-hidden mb-2">
                <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-secondary w-[32%] rounded-full shadow-[0_0_20px_rgba(176,198,255,0.4)]"></div>
              </div>
              <div className="flex justify-between text-xs font-source-sans-3 font-bold text-primary">
                <span>32% concluído</span>
                <span className="text-on-surface-variant opacity-50">
                  Faltam R$ 304.800,00
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Standard Goal Card 1 */}
        <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-6 hover:bg-surface-container-high transition-all duration-300">
          <div className="flex justify-between mb-8">
            <div className="p-2 bg-tertiary/10 rounded-xl">
              <span className="material-symbols-outlined text-tertiary">
                flight_takeoff
              </span>
            </div>
            <button className="text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined">more_vert</span>
            </button>
          </div>
          <h4 className="text-xl font-dm-sans font-bold mb-6">Viagem Japão</h4>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Progresso</span>
              <span className="text-on-surface font-bold">
                R$ 12.000 / R$ 15.000
              </span>
            </div>
            <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full bg-tertiary w-[80%] rounded-full"></div>
            </div>
            <p className="text-xs text-right text-tertiary font-bold">80%</p>
          </div>
        </div>

        {/* Standard Goal Card 2 */}
        <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-6 hover:bg-surface-container-high transition-all duration-300">
          <div className="flex justify-between mb-8">
            <div className="p-2 bg-primary/10 rounded-xl">
              <span className="material-symbols-outlined text-primary">
                directions_car
              </span>
            </div>
            <button className="text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined">more_vert</span>
            </button>
          </div>
          <h4 className="text-xl font-dm-sans font-bold mb-6">
            Troca de Carro
          </h4>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Progresso</span>
              <span className="text-on-surface font-bold">
                R$ 28.500 / R$ 85.000
              </span>
            </div>
            <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[33%] rounded-full"></div>
            </div>
            <p className="text-xs text-right text-primary font-bold">33%</p>
          </div>
        </div>

        {/* Standard Goal Card 3 */}
        <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-6 hover:bg-surface-container-high transition-all duration-300">
          <div className="flex justify-between mb-8">
            <div className="p-2 bg-secondary/10 rounded-xl">
              <span className="material-symbols-outlined text-secondary">
                school
              </span>
            </div>
            <button className="text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined">more_vert</span>
            </button>
          </div>
          <h4 className="text-xl font-dm-sans font-bold mb-6">Pós Graduação</h4>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Progresso</span>
              <span className="text-on-surface font-bold">
                R$ 4.200 / R$ 22.000
              </span>
            </div>
            <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full bg-secondary w-[19%] rounded-full"></div>
            </div>
            <p className="text-xs text-right text-secondary font-bold">19%</p>
          </div>
        </div>

        {/* Add New Goal Card (Placeholder) */}
        <Link href="/new-goal" className="border-2 border-dashed border-outline-variant/20 rounded-xl p-6 flex flex-col items-center justify-center gap-4 hover:border-primary/40 hover:bg-primary/5 transition-all group min-h-[220px]">
          <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary">
              add
            </span>
          </div>
          <span className="text-on-surface-variant font-medium">
            Nova Meta Financeira
          </span>
        </Link>
      </div>

      {/* Motivation Banner */}
      <section className="mt-16 bg-gradient-to-r from-surface-container-highest to-surface-container-low rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 border border-outline-variant/10 w-full mb-12">
        <div className="flex-1">
          <h3 className="text-2xl font-dm-sans font-bold mb-2">
            Você está no caminho certo.
          </h3>
          <p className="text-on-surface-variant font-source-sans-3 leading-relaxed">
            Neste mês, você economizou{" "}
            <span className="text-primary font-bold">R$ 2.450,00</span> a mais
            do que o planejado. Continue assim para atingir sua meta de 'Compra
            do Imóvel' 4 meses antes do previsto.
          </p>
        </div>
        <div className="flex -space-x-3">
          <div className="w-12 h-12 rounded-full border-2 border-background bg-primary-container flex items-center justify-center">
            <span
              className="material-symbols-outlined text-white text-sm"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              trending_up
            </span>
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-background bg-secondary-container flex items-center justify-center">
            <span
              className="material-symbols-outlined text-white text-sm"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              stars
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
