"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { fetchAPI } from "@/lib/api";

export default function AddCategoryPage() {
  const router = useRouter();
  const [selectedIcon, setSelectedIcon] = useState("shopping_bag");
  const [selectedFlow, setSelectedFlow] = useState<"expense" | "income" | "both">("expense");
  const [categoryName, setCategoryName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedColor, setSelectedColor] = useState("#b0c6ff");
  const { token } = useAuth();

  const colors = [
    "#b0c6ff", "#ffb59b", "#82f9d8", "#f8b0ff", "#ffe082",
    "#ff8a80", "#b39ddb", "#4dd0e1", "#81c784", "#ffb74d"
  ];
  
  const handleCreateCategory = async () => {
    if (!categoryName.trim()) {
      setErrorMsg("O nome da categoria é obrigatório.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    const res = await fetchAPI('/categories', {
      method: 'POST',
      token,
      body: JSON.stringify({ 
        name: categoryName.trim(),
        icon: selectedIcon,
        color: selectedColor
      })
    });

    setIsSubmitting(false);

    if (res.error) {
      setErrorMsg(res.error.message || "Erro ao criar categoria.");
      return;
    }

    // Sucesso, voltar e/ou redirecionar
    router.back();
  };

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

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary selection:text-on-primary min-h-screen">
      {/* TopNavBar */}
      <header className="fixed top-0 w-full z-50 bg-[#131313]/40 backdrop-blur-xl transition-all">
        <div className="flex justify-between items-center px-8 h-20 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.back()}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface/60"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
              </button>
              <h2 className="text-xl font-bold tracking-tighter text-[#e5e2e1] font-headline">Nova Categoria</h2>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center bg-surface-container px-4 py-2 rounded-full text-on-surface/60 focus-within:text-primary transition-colors border border-outline-variant/10">
              <span className="material-symbols-outlined text-xl">search</span>
              <input
                className="bg-transparent border-none focus:ring-0 text-sm w-48 font-body ml-2"
                placeholder="Search data..."
                type="text"
              />
            </div>
            <div className="flex items-center gap-3">
              <button className="text-on-surface/60 hover:text-primary transition-colors">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button className="text-on-surface/60 hover:text-primary transition-colors">
                <span className="material-symbols-outlined">settings</span>
              </button>
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 bg-surface-container flex items-center justify-center">
                <span className="material-symbols-outlined">person</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="pt-24 pb-12 min-h-screen">
        <div className="max-w-4xl mx-auto px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Form Column */}
            <div className="lg:col-span-7 space-y-8">
              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3">
                  <span className="material-symbols-outlined">error</span>
                  <p className="font-body text-sm font-medium">{errorMsg}</p>
                </div>
              )}
              <section className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.15em] font-bold text-primary opacity-90">Identificação</label>
                  <input
                    className="w-full bg-surface-container border border-outline-variant/10 rounded-xl h-14 px-5 text-on-surface placeholder:text-on-surface/30 focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-body text-lg outline-none"
                    placeholder="Ex: Assinaturas Digitais"
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] uppercase tracking-[0.15em] font-bold text-primary opacity-90">Símbolo Visual</label>
                    <span className="text-xs text-on-surface/40 font-body italic">Escolha um ícone representativo</span>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 p-4 bg-surface-container-low rounded-xl border border-outline-variant/10 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {/* Icon Grid */}
                    {icons.map((icon) => (
                      <button
                        key={icon}
                        onClick={() => setSelectedIcon(icon)}
                        className={`w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl transition-all duration-200 ${selectedIcon === icon
                            ? "bg-surface-container-highest text-primary ring-2 ring-primary"
                            : "hover:bg-surface-container-high text-on-surface/60"
                          }`}
                      >
                        <span className="material-symbols-outlined">{icon}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-[0.15em] font-bold text-primary opacity-90">Acento Cromático</label>
                  <div className="flex flex-wrap gap-4 p-4 bg-surface-container-low rounded-xl border border-outline-variant/10">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full transition-all duration-200 ${
                          selectedColor === color
                            ? "ring-4 ring-offset-4 ring-offset-surface-container-low scale-110"
                            : "hover:scale-110"
                        }`}
                        style={{
                          backgroundColor: color,
                          ...(selectedColor === color ? { boxShadow: `0 0 0 4px ${color}33` } : {}),
                        }}
                      ></button>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* Type & Preview Column */}
            <div className="lg:col-span-5 space-y-8">
              <section className="space-y-6">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-[0.15em] font-bold text-primary opacity-90">Fluxo de Caixa</label>
                  <div className="grid grid-cols-5 gap-3">
                    <label
                      className={`flex items-center justify-between p-4 bg-surface-container-low rounded-xl cursor-pointer hover:bg-surface-container transition-all border ${selectedFlow === 'expense' ? 'border-primary/30 ring-1 ring-primary/30' : 'border-outline-variant/10'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-error/10 text-error flex items-center justify-center">
                          <span className="material-symbols-outlined text-xl">trending_down</span>
                        </div>
                        <span className="font-headline font-semibold">Apenas Despesa</span>
                      </div>
                      <input
                        className="hidden"
                        name="flow"
                        type="radio"
                        checked={selectedFlow === 'expense'}
                        onChange={() => setSelectedFlow('expense')}
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedFlow === 'expense' ? 'border-primary' : 'border-outline/30'}`}>
                        {selectedFlow === 'expense' && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                      </div>
                    </label>

                    <label
                      className={`flex items-center justify-between p-4 bg-surface-container-low rounded-xl cursor-pointer hover:bg-surface-container transition-all border ${selectedFlow === 'income' ? 'border-primary/30 ring-1 ring-primary/30' : 'border-outline-variant/10'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                          <span className="material-symbols-outlined text-xl">trending_up</span>
                        </div>
                        <span className="font-headline font-semibold">Apenas Receita</span>
                      </div>
                      <input
                        className="hidden"
                        name="flow"
                        type="radio"
                        checked={selectedFlow === 'income'}
                        onChange={() => setSelectedFlow('income')}
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedFlow === 'income' ? 'border-primary' : 'border-outline/30'}`}>
                        {selectedFlow === 'income' && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                      </div>
                    </label>

                    <label
                      className={`flex items-center justify-between p-4 bg-surface-container-low rounded-xl cursor-pointer hover:bg-surface-container transition-all border ${selectedFlow === 'both' ? 'border-primary/30 ring-1 ring-primary/30' : 'border-outline-variant/10'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-tertiary/10 text-tertiary flex items-center justify-center">
                          <span className="material-symbols-outlined text-xl">sync_alt</span>
                        </div>
                        <span className="font-headline font-semibold">Ambos</span>
                      </div>
                      <input
                        className="hidden"
                        name="flow"
                        type="radio"
                        checked={selectedFlow === 'both'}
                        onChange={() => setSelectedFlow('both')}
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedFlow === 'both' ? 'border-primary' : 'border-outline/30'}`}>
                        {selectedFlow === 'both' && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                      </div>
                    </label>
                  </div>
                </div>

                {/* Preview Card */}
                <div className="space-y-4 pt-4">
                  <label className="text-[10px] uppercase tracking-[0.15em] font-bold text-on-surface/40">Visualização em Tempo Real</label>
                  <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-surface-container to-surface-container-low p-6 shadow-editorial border border-white/5 group transition-all duration-500">
                    <div
                      className="absolute -right-12 -top-12 w-32 h-32 rounded-full blur-3xl transition-all"
                      style={{ backgroundColor: `${selectedColor}0D` }}
                    ></div>
                    <div className="flex items-center gap-5 relative z-10 font-poppins">
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300"
                        style={{
                          backgroundColor: selectedColor,
                          boxShadow: `0px 8px 24px ${selectedColor}4D`,
                        }}
                      >
                        <span className="material-symbols-outlined text-3xl text-[#131313]">{selectedIcon}</span>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold font-headline text-on-surface tracking-tight truncate max-w-[180px]">
                          {categoryName || "Nova Categoria"}
                        </h4>
                        <p className="text-on-surface/60 text-sm font-body">
                          Tipo: {selectedFlow === 'expense' ? 'Despesa' : selectedFlow === 'income' ? 'Receita' : 'Ambos'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Action Bar */}
          <footer className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-end gap-4">
            <button
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-10 h-14 rounded-full font-headline font-bold text-on-surface/60 hover:text-on-surface hover:bg-surface-container transition-all active:scale-95 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button 
              onClick={handleCreateCategory}
              disabled={isSubmitting || !categoryName.trim()}
              className="w-full sm:w-auto px-12 h-14 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-extrabold shadow-[0px_12px_24px_rgba(0,88,203,0.3)] hover:shadow-[0px_16px_32px_rgba(0,88,203,0.4)] hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                  Criando...
                </>
              ) : (
                "Criar Categoria"
              )}
            </button>
          </footer>
        </div>
      </main>

      {/* Floating Feedback (Toast-like) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-surface-container-highest/90 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 flex items-center gap-3 shadow-2xl z-50 pointer-events-none opacity-0 translate-y-4">
        <span className="material-symbols-outlined text-primary">info</span>
        <span className="text-sm font-body text-on-surface">Pressione ESC para cancelar</span>
      </div>
    </div>
  );
}
