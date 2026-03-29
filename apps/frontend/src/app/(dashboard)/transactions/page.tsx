import React from "react";
import Link from "next/link";

export default function TransactionsPage() {
  return (
    <div className="flex flex-col gap-8 w-full">
      <header className="flex items-center justify-between w-full">
        <div className="flex flex-col">
          <span className="text-xl font-black text-[#e5e2e1] tracking-tighter md:hidden">
            VAULT
          </span>
          <h2 className="text-2xl font-bold font-headline tracking-tight text-on-surface">
            Transações
          </h2>
        </div>
        <Link 
          href="/new-transaction"
          className="bg-primary-container text-on-primary-container px-6 py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:scale-95 transition-all shadow-lg text-sm"
        >
          <span className="material-symbols-outlined text-xl">add_circle</span>
          <span className="hidden sm:inline">Novo Lançamento</span>
        </Link>
      </header>

      {/* Search & Filters Bar */}
      <section className="space-y-4 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Search Input */}
          <div className="lg:col-span-6 relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-60">
              search
            </span>
            <input
              className="w-full bg-surface-container-high border-none rounded-2xl py-3.5 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary transition-all"
              placeholder="Pesquisar por descrição ou tag..."
              type="text"
            />
          </div>
          {/* Filters */}
          <div className="lg:col-span-6 grid grid-cols-3 gap-3">
            <div className="relative">
              <select className="w-full appearance-none bg-surface-container-high border-none rounded-2xl py-3.5 px-4 text-sm text-on-surface font-medium focus:ring-1 focus:ring-primary transition-all pr-10">
                <option>Outubro 2023</option>
                <option>Setembro 2023</option>
                <option>Agosto 2023</option>
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                keyboard_arrow_down
              </span>
            </div>
            <div className="relative">
              <select className="w-full appearance-none bg-surface-container-high border-none rounded-2xl py-3.5 px-4 text-sm text-on-surface font-medium focus:ring-1 focus:ring-primary transition-all pr-10">
                <option>Categorias</option>
                <option>Alimentação</option>
                <option>Moradia</option>
                <option>Transporte</option>
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                keyboard_arrow_down
              </span>
            </div>
            <div className="relative">
              <select className="w-full appearance-none bg-surface-container-high border-none rounded-2xl py-3.5 px-4 text-sm text-on-surface font-medium focus:ring-1 focus:ring-primary transition-all pr-10">
                <option>Tipo</option>
                <option>Entrada</option>
                <option>Saída</option>
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                keyboard_arrow_down
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content Canvas */}
      <section className="flex-1 w-full pb-12">
        {/* Summary Stats (Mini Bento) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-surface-container-high rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>
            <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">
              Entradas Mensais
            </p>
            <div className="flex items-end gap-2">
              <h3 className="font-headline text-2xl font-bold text-primary">
                R$ 12.450,00
              </h3>
              <span className="text-xs text-primary mb-1">+4.2%</span>
            </div>
          </div>
          <div className="bg-surface-container-high rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-error/5 rounded-full blur-2xl group-hover:bg-error/10 transition-colors"></div>
            <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">
              Saídas Mensais
            </p>
            <div className="flex items-end gap-2">
              <h3 className="font-headline text-2xl font-bold text-error">
                R$ 7.820,45
              </h3>
              <span className="text-xs text-error mb-1">-2.1%</span>
            </div>
          </div>
          <div className="bg-surface-container-high rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-on-surface/5 rounded-full blur-2xl group-hover:bg-on-surface/10 transition-colors"></div>
            <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">
              Saldo Projetado
            </p>
            <div className="flex items-end gap-2">
              <h3 className="font-headline text-2xl font-bold text-on-surface">
                R$ 4.629,55
              </h3>
            </div>
          </div>
        </div>

        {/* Transaction List State: FILLED */}
        <div className="space-y-6">
          {/* Date Group 1 */}
          <div>
            <div className="flex items-center justify-between mb-4 px-2">
              <h4 className="font-label text-sm font-bold text-on-surface-variant opacity-80">
                Hoje, 24 de Outubro
              </h4>
              <span className="text-xs text-on-surface-variant">
                R$ -420,00
              </span>
            </div>
            <div className="space-y-3">
              {/* Transaction Item */}
              <div className="bg-surface-container-low hover:bg-surface-container-highest transition-all duration-200 rounded-2xl p-4 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-surface-container-high rounded-xl flex items-center justify-center text-on-surface">
                    <span className="material-symbols-outlined">
                      shopping_cart
                    </span>
                  </div>
                  <div>
                    <h5 className="font-bold text-on-surface">
                      Supermercado Pão de Açúcar
                    </h5>
                    <p className="text-xs text-on-surface-variant">
                      Alimentação • 14:20
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-headline font-bold text-error">
                    - R$ 345,60
                  </span>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-sm">
                        edit
                      </span>
                    </button>
                    <button className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center hover:text-error transition-colors">
                      <span className="material-symbols-outlined text-sm">
                        delete
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              {/* Transaction Item */}
              <div className="bg-surface-container-low hover:bg-surface-container-highest transition-all duration-200 rounded-2xl p-4 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-surface-container-high rounded-xl flex items-center justify-center text-on-surface">
                    <span className="material-symbols-outlined">
                      directions_car
                    </span>
                  </div>
                  <div>
                    <h5 className="font-bold text-on-surface">
                      Posto Shell Alvorada
                    </h5>
                    <p className="text-xs text-on-surface-variant">
                      Transporte • 09:15
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-headline font-bold text-error">
                    - R$ 74,40
                  </span>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-sm">
                        edit
                      </span>
                    </button>
                    <button className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center hover:text-error transition-colors">
                      <span className="material-symbols-outlined text-sm">
                        delete
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Date Group 2 */}
          <div>
            <div className="flex items-center justify-between mb-4 px-2">
              <h4 className="font-label text-sm font-bold text-on-surface-variant opacity-80">
                Ontem, 23 de Outubro
              </h4>
              <span className="text-xs text-on-surface-variant">
                R$ +5.000,00
              </span>
            </div>
            <div className="space-y-3">
              {/* Transaction Item */}
              <div className="bg-surface-container-low hover:bg-surface-container-highest transition-all duration-200 rounded-2xl p-4 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-container/20 rounded-xl flex items-center justify-center text-primary">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      payments
                    </span>
                  </div>
                  <div>
                    <h5 className="font-bold text-on-surface">
                      Salário • Software House Corp
                    </h5>
                    <p className="text-xs text-on-surface-variant">
                      Rendimentos • 10:00
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-headline font-bold text-primary">
                    + R$ 5.000,00
                  </span>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-sm">
                        edit
                      </span>
                    </button>
                    <button className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center hover:text-error transition-colors">
                      <span className="material-symbols-outlined text-sm">
                        delete
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
