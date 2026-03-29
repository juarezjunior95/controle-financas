import React from "react";
import Link from "next/link";

export default function CategoriesPage() {
  return (
    <div className="flex flex-col gap-8 w-full">
      <header className="flex items-center gap-4 w-full">
        <h2 className="text-2xl font-bold font-dm-sans tracking-tight text-[#b0c6ff]">
          Categorias
        </h2>
      </header>

      {/* Category Content */}
      <div className="mt-4 w-full">
        {/* Category Management Action */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 w-full">
          <div>
            <p className="text-on-surface-variant font-source-sans-3 max-w-md">
              Organize seus gastos e receitas. Gerencie suas categorias para
              ter uma visão clara do seu fluxo financeiro.
            </p>
          </div>
          <Link href="/add-category" className="bg-primary-container text-on-primary-container px-6 py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:scale-95 transition-all shadow-lg">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              add_circle
            </span>
            <span>Adicionar Categoria</span>
          </Link>
        </div>

        {/* Categories Grid (Asymmetric Bento Style) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 w-full">
          {/* Alimentação - Hero Card */}
          <div className="md:col-span-8 bg-surface-container-high rounded-2xl p-6 flex items-center justify-between group hover:bg-surface-container-highest transition-colors cursor-pointer relative overflow-hidden">
            <div className="flex items-center gap-5 z-10">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-4xl">
                  restaurant
                </span>
              </div>
              <div>
                <h3 className="font-dm-sans text-xl font-bold">Alimentação</h3>
                <p className="text-sm text-on-surface-variant">
                  32 Transações este mês
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end z-10">
              <span className="text-primary font-bold text-lg">
                R$ 1.240,00
              </span>
              <span className="text-xs text-on-surface-variant uppercase tracking-widest font-bold">
                Essencial
              </span>
            </div>
            {/* Background Accent */}
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-[120px]">
                restaurant
              </span>
            </div>
          </div>

          {/* Transporte */}
          <div className="md:col-span-4 bg-surface-container-high rounded-2xl p-6 flex flex-col justify-between group hover:bg-surface-container-highest transition-colors cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-secondary-container/40 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-2xl">
                directions_car
              </span>
            </div>
            <div className="mt-8">
              <h3 className="font-dm-sans text-lg font-bold">Transporte</h3>
              <p className="text-primary text-sm font-semibold mt-1">
                R$ 450,00
              </p>
            </div>
          </div>

          {/* Moradia */}
          <div className="md:col-span-4 bg-surface-container-high rounded-2xl p-6 flex flex-col justify-between group hover:bg-surface-container-highest transition-colors cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-tertiary-container/40 flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-2xl">home</span>
            </div>
            <div className="mt-8">
              <h3 className="font-dm-sans text-lg font-bold">Moradia</h3>
              <p className="text-primary text-sm font-semibold mt-1">
                R$ 2.800,00
              </p>
            </div>
          </div>

          {/* Saúde */}
          <div className="md:col-span-4 bg-surface-container-high rounded-2xl p-6 flex flex-col justify-between group hover:bg-surface-container-highest transition-colors cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-error-container/40 flex items-center justify-center text-error">
              <span className="material-symbols-outlined text-2xl">
                medical_services
              </span>
            </div>
            <div className="mt-8">
              <h3 className="font-dm-sans text-lg font-bold">Saúde</h3>
              <p className="text-primary text-sm font-semibold mt-1">
                R$ 210,00
              </p>
            </div>
          </div>

          {/* Lazer */}
          <div className="md:col-span-4 bg-surface-container-high rounded-2xl p-6 flex flex-col justify-between group hover:bg-surface-container-highest transition-colors cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-primary-container/40 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl">
                sports_esports
              </span>
            </div>
            <div className="mt-8">
              <h3 className="font-dm-sans text-lg font-bold">Lazer</h3>
              <p className="text-primary text-sm font-semibold mt-1">
                R$ 680,00
              </p>
            </div>
          </div>

          {/* Estudos e trabalho */}
          <div className="md:col-span-6 bg-surface-container-high rounded-2xl p-6 flex items-center gap-6 group hover:bg-surface-container-highest transition-colors cursor-pointer">
            <div className="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface border border-outline-variant/20">
              <span className="material-symbols-outlined text-2xl">school</span>
            </div>
            <div className="flex-1">
              <h3 className="font-dm-sans text-lg font-bold">
                Estudos e trabalho
              </h3>
              <div className="h-1.5 w-full bg-surface-container rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-primary w-[65%] rounded-full"></div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-primary font-bold">R$ 950,00</p>
            </div>
          </div>

          {/* Outros */}
          <div className="md:col-span-6 bg-surface-container-low border border-outline-variant/10 rounded-2xl p-6 flex items-center gap-6 group hover:bg-surface-container-high transition-colors cursor-pointer">
            <div className="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined text-2xl">
                more_horiz
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-dm-sans text-lg font-bold">Outros</h3>
              <p className="text-xs text-on-surface-variant">
                Despesas não categorizadas
              </p>
            </div>
            <div className="text-right">
              <p className="text-on-surface-variant font-bold">R$ 120,50</p>
            </div>
          </div>
        </div>

        {/* Pro-tip/Visual Aid */}
        <div className="mt-12 w-full p-8 rounded-2xl bg-gradient-to-r from-secondary-container/20 to-transparent border-l-4 border-secondary">
          <div className="flex items-start gap-4">
            <span className="material-symbols-outlined text-secondary">
              lightbulb
            </span>
            <div>
              <h4 className="font-bold text-secondary mb-1">
                Dica do Vault
              </h4>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Categorias com cores personalizadas ajudam você a identificar
                padrões de gastos instantaneamente no seu Dashboard. Tente
                separar 'Essenciais' de 'Estilo de Vida' usando tons
                diferentes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
