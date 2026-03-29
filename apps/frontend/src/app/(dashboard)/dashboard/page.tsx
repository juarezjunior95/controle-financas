"use client";

import Link from "next/link";

export default function DashboardPage() {
  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h2 className="text-[#e5e2e1] text-3xl font-bold font-dm-sans tracking-tight mb-2">
            Resumo Financeiro
          </h2>
          <div className="flex items-center gap-2 text-[#c3c6d6] font-source-sans-3">
            <span className="material-symbols-outlined text-sm" translate="no">calendar_month</span>
            <select className="bg-transparent border-none p-0 text-sm focus:ring-0 cursor-pointer hover:text-[#b0c6ff] transition-colors">
              <option>Outubro 2023</option>
              <option>Setembro 2023</option>
              <option>Agosto 2023</option>
            </select>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          <div className="flex -space-x-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#131313] bg-surface-container-high flex items-center justify-center text-[10px] font-bold">JD</div>
            <div className="w-10 h-10 rounded-full border-2 border-[#131313] bg-[#b0c6ff] flex items-center justify-center text-[10px] text-[#001945] font-bold">MT</div>
          </div>
          <button className="bg-surface-container-highest text-[#e5e2e1] px-5 py-2.5 rounded-full text-sm font-medium hover:bg-surface-bright transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-lg" translate="no">ios_share</span>
            Exportar
          </button>
        </div>
      </div>

      {/* Bento Grid: Main Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Saldo Atual (Primary Anchor) */}
        <div className="md:col-span-1 bg-gradient-to-br from-[#b0c6ff]/10 to-transparent p-8 rounded-xl border border-[#b0c6ff]/10 shadow-[0_24px_48px_rgba(0,0,0,0.4)] relative overflow-hidden">
          <div className="absolute -top-4 -right-4 w-32 h-32 bg-[#b0c6ff]/5 rounded-full blur-3xl"></div>
          <div className="flex justify-between items-start mb-8">
            <div className="p-3 bg-[#b0c6ff]/20 rounded-2xl text-[#b0c6ff]">
              <span className="material-symbols-outlined" translate="no">account_balance</span>
            </div>
            <span className="text-[10px] font-bold tracking-widest text-[#b0c6ff] bg-[#b0c6ff]/10 px-2 py-1 rounded">ATUALIZADO</span>
          </div>
          <p className="text-[#c3c6d6] text-xs font-source-sans-3 mb-1">Saldo Atual</p>
          <div className="flex items-baseline gap-1">
            <span className="text-[#b0c6ff] text-lg font-dm-sans">R$</span>
            <h3 className="text-[#e5e2e1] text-4xl font-bold font-dm-sans tracking-tighter">12.450,00</h3>
          </div>
        </div>

        {/* Receitas */}
        <div className="bg-surface-container-low p-8 rounded-xl hover:bg-surface-container-high transition-colors group">
          <div className="flex justify-between items-start mb-8">
            <div className="p-3 bg-primary-container/20 rounded-2xl text-primary">
              <span className="material-symbols-outlined" translate="no">trending_up</span>
            </div>
            <span className="text-[10px] font-bold tracking-widest text-[#b0c6ff]">+12% vs mês ant.</span>
          </div>
          <p className="text-[#c3c6d6] text-xs font-source-sans-3 mb-1">Receitas</p>
          <div className="flex items-baseline gap-1">
            <span className="text-[#c3c6d6] text-sm font-dm-sans">R$</span>
            <h3 className="text-[#e5e2e1] text-3xl font-bold font-dm-sans tracking-tight">8.200,50</h3>
          </div>
        </div>

        {/* Despesas */}
        <div className="bg-surface-container-low p-8 rounded-xl hover:bg-surface-container-high transition-colors group">
          <div className="flex justify-between items-start mb-8">
            <div className="p-3 bg-tertiary-container/20 rounded-2xl text-tertiary">
              <span className="material-symbols-outlined" translate="no">trending_down</span>
            </div>
            <span className="text-[10px] font-bold tracking-widest text-[#ffb59b]">-5% vs mês ant.</span>
          </div>
          <p className="text-[#c3c6d6] text-xs font-source-sans-3 mb-1">Despesas</p>
          <div className="flex items-baseline gap-1">
            <span className="text-[#c3c6d6] text-sm font-dm-sans">R$</span>
            <h3 className="text-[#e5e2e1] text-3xl font-bold font-dm-sans tracking-tight">3.140,20</h3>
          </div>
        </div>
      </div>

      {/* Secondary Section: Charts & Metas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Gastos por Categoria (Donut Visualization) */}
        <div className="lg:col-span-8 bg-surface-container-low p-8 rounded-xl">
          <div className="flex justify-between items-center mb-10">
            <h4 className="font-dm-sans text-lg font-bold text-[#e5e2e1]">Gastos por Categoria</h4>
            <span className="material-symbols-outlined text-[#c3c6d6] cursor-pointer" translate="no">more_horiz</span>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-12">
            
            {/* Donut Mockup */}
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" fill="transparent" r="80" stroke="#353534" strokeWidth="20"></circle>
                <circle cx="96" cy="96" fill="transparent" r="80" stroke="#b0c6ff" strokeDasharray="502" strokeDashoffset="150" strokeLinecap="round" strokeWidth="20"></circle>
                <circle cx="96" cy="96" fill="transparent" r="80" stroke="#ffb59b" strokeDasharray="502" strokeDashoffset="400" strokeLinecap="round" strokeWidth="20"></circle>
              </svg>
              <div className="absolute text-center">
                <p className="text-[10px] uppercase tracking-widest text-[#c3c6d6]">Total</p>
                <p className="text-xl font-bold font-dm-sans">R$ 3.1k</p>
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex-1 w-full space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#b0c6ff]"></div>
                  <span className="text-sm font-source-sans-3">Alimentação</span>
                </div>
                <span className="font-bold text-sm">45%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#ffb59b]"></div>
                  <span className="text-sm font-source-sans-3">Transporte</span>
                </div>
                <span className="font-bold text-sm">28%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#a1b4eb]"></div>
                  <span className="text-sm font-source-sans-3">Lazer</span>
                </div>
                <span className="font-bold text-sm">15%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#424654]"></div>
                  <span className="text-sm font-source-sans-3">Outros</span>
                </div>
                <span className="font-bold text-sm">12%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Próximas Metas (Mini Widget) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#1c1b1b] p-8 rounded-xl border border-[#424654]/10 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-dm-sans text-lg font-bold text-[#e5e2e1]">Próximas Metas</h4>
              <span className="material-symbols-outlined text-[#b0c6ff] text-sm cursor-pointer" style={{ fontVariationSettings: "'FILL' 1" }} translate="no">stars</span>
            </div>
            
            <div className="space-y-6 flex-1">
              {/* Meta 1 */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#e5e2e1]">Viagem Japão 2024</span>
                  <span className="text-[#c3c6d6]">75%</span>
                </div>
                <div className="w-full bg-[#353534] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#b0c6ff] h-full w-3/4"></div>
                </div>
              </div>
              
              {/* Meta 2 */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#e5e2e1]">Reserva Emergência</span>
                  <span className="text-[#c3c6d6]">40%</span>
                </div>
                <div className="w-full bg-[#353534] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[40%]"></div>
                </div>
              </div>
              
              {/* Meta 3 */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#e5e2e1]">Novo Setup</span>
                  <span className="text-[#c3c6d6]">90%</span>
                </div>
                <div className="w-full bg-[#353534] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-tertiary h-full w-[90%]"></div>
                </div>
              </div>
            </div>
            
            <Link href="/goals" className="mt-8 text-[#b0c6ff] text-sm font-bold flex items-center justify-center gap-2 hover:underline">
              Ver todos os objetivos
              <span className="material-symbols-outlined text-sm" translate="no">arrow_forward</span>
            </Link>
          </div>
        </div>

      </div>
    </>
  );
}
