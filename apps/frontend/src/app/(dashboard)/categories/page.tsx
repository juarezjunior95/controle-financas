"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { fetchAPI } from "@/lib/api";
import { Toast, useToast } from "@/components/ui/Toast";
import { MonthSelector } from "@/components/dashboard/MonthSelector";

interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  monthlyAmount?: number;
  transactionCount?: number;
}

export default function CategoriesPage() {
  const { token, isAuthenticated } = useAuth();
  
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit / Delete State
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState("");
  const [editIcon, setEditIcon] = useState("label");
  const [editColor, setEditColor] = useState("#b0c6ff");
  const [actionLoading, setActionLoading] = useState(false);

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
  const { toast, showToast } = useToast();

  const handleMonthChange = useCallback((month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  }, []);

  const loadCategories = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    const month = selectedMonth + 1;
    const res = await fetchAPI(`/categories/stats?month=${month}&year=${selectedYear}`, { token });

    if (res.error) {
      setError(res.error.message || "Erro ao carregar categorias");
    } else {
      setCategories(res.data || []);
    }
    setIsLoading(false);
  }, [token, selectedMonth, selectedYear]);

  useEffect(() => {
    if (isAuthenticated && token) {
      loadCategories();
    }
  }, [isAuthenticated, token, loadCategories]);



  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleDelete = async () => {
    if (!deletingId || !token) return;
    setActionLoading(true);
    const res = await fetchAPI(`/categories/${deletingId}`, {
      method: "DELETE",
      token
    });
    setActionLoading(false);

    if (res.error) {
      setDeletingId(null);
      showToast("Erro ao excluir: " + (res.error.message || "Erro desconhecido"), "error");
    } else {
      setDeletingId(null);
      showToast("Categoria excluída com sucesso.", "success");
      loadCategories();
    }
  };

  const handleEdit = async () => {
    if (!editingCategory || !token || !editName.trim()) return;
    setActionLoading(true);
    const res = await fetchAPI(`/categories/${editingCategory.id}`, {
      method: "PUT",
      token,
      body: JSON.stringify({ 
        name: editName.trim(),
        icon: editIcon,
        color: editColor
      })
    });
    setActionLoading(false);

    if (res.error) {
      showToast("Erro ao salvar: " + (res.error.message || "Erro desconhecido"), "error");
    } else {
      setEditingCategory(null);
      setEditName("");
      showToast("Categoria atualizada com sucesso.", "success");
      loadCategories();
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <Toast toast={toast} />

      <header className="flex flex-col md:flex-row md:items-end justify-between w-full mb-4">
        <div>
          <h2 className="text-2xl font-bold font-dm-sans tracking-tight text-[#b0c6ff] mb-2">
            Categorias
          </h2>
          <MonthSelector
            month={selectedMonth}
            year={selectedYear}
            onChange={handleMonthChange}
          />
        </div>
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

        {/* Feedback / Linhas de Estado */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-surface-container-high rounded-2xl p-6 border border-outline-variant/10 animate-pulse"
              >
                <div className="w-12 h-12 rounded-xl bg-surface-container-highest mb-6" />
                <div className="h-5 w-3/4 bg-surface-container-highest rounded-lg mb-2" />
                <div className="h-3 w-1/2 bg-surface-container-highest rounded-lg" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-6 bg-error/10 border border-error/20 rounded-2xl text-center">
            <p className="text-error font-body font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-error text-on-error rounded-full font-bold text-sm"
            >
              Tentar novamente
            </button>
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-surface-container-low border border-outline-variant/10 rounded-2xl">
            <div className="w-16 h-16 bg-surface-container-highest rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-3xl text-on-surface-variant">category</span>
            </div>
            <h3 className="text-xl font-bold font-dm-sans mb-2">Nenhuma categoria encontrada</h3>
            <p className="text-on-surface-variant font-body mb-6 text-center max-w-sm">
              Você ainda não cadastrou nenhuma categoria. Cadastre a primeira para organizar suas transações.
            </p>
            <Link
              href="/add-category"
              className="bg-primary text-on-primary px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add_circle</span>
              Adicionar primeira categoria
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {categories.map((category) => {
              const icon = category.icon || 'label';
              const color = category.color || '#b0c6ff';
              
              return (
                <div 
                  key={category.id} 
                  className="relative bg-[#1a1a1a] rounded-[32px] p-8 flex flex-col justify-between group hover:bg-[#222] transition-all cursor-pointer border border-white/5 hover:border-white/10 overflow-hidden min-h-[180px]"
                >
                  {/* Background Icon Watermark */}
                  <div className="absolute -bottom-4 -right-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                    <span className="material-symbols-outlined text-[140px] rotate-12">
                      {icon}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setEditingCategory(category); 
                        setEditName(category.name); 
                        setEditIcon(icon);
                        setEditColor(color);
                      }}
                      className="w-10 h-10 rounded-full bg-white/5 hover:bg-primary hover:text-on-primary flex items-center justify-center transition-colors backdrop-blur-md"
                      title="Editar"
                    >
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeletingId(category.id); }}
                      className="w-10 h-10 rounded-full bg-white/5 hover:bg-error hover:text-on-error flex items-center justify-center transition-colors backdrop-blur-md"
                      title="Excluir"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>

                  <div className="flex items-start justify-between">
                    <div 
                      className="w-16 h-16 rounded-[20px] flex items-center justify-center mb-6 transition-all"
                      style={{ 
                        backgroundColor: color + '15',
                        border: `1px solid ${color}33`
                      }}
                    >
                      <span 
                        className="material-symbols-outlined text-3xl"
                        style={{ color: color }}
                      >
                        {icon}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-end justify-between mt-auto">
                    <div>
                      <h3 className="font-dm-sans text-2xl font-bold text-white mb-1">{category.name}</h3>
                      <p className="text-white/40 text-sm font-medium">
                        {category.name.toLowerCase() === 'outros' 
                          ? 'Despesas não categorizadas' 
                          : `${category.transactionCount || 0} ${category.transactionCount === 1 ? 'Transação' : 'Transações'} este mês`}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-lg font-bold font-dm-sans ${
                        (category.monthlyAmount || 0) > 0 ? "text-green-400" :
                        (category.monthlyAmount || 0) < 0 ? "text-red-400" : "text-white"
                      }`}>
                        {(category.monthlyAmount || 0) > 0 ? "+" : (category.monthlyAmount || 0) < 0 ? "-" : ""} {formatCurrency(Math.abs(category.monthlyAmount || 0))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        )}

        {/* Pro-tip/Visual Aid */}
        <div className="mt-12 w-full p-8 rounded-2xl bg-gradient-to-r from-secondary-container/20 to-transparent border-l-4 border-secondary">
          <div className="flex items-start gap-4">
            <span className="material-symbols-outlined text-secondary">
              lightbulb
            </span>
            <div>
              <h4 className="font-bold text-secondary mb-1">
                Dica do Finança Pró
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

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-surface-container-high rounded-3xl p-8 max-w-md w-full border border-outline-variant/20 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-error/10 text-error flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-2xl">warning</span>
            </div>
            <h3 className="text-xl font-bold font-headline mb-2 text-on-surface">Excluir Categoria?</h3>
            <p className="text-on-surface-variant font-body mb-8">
              Tem certeza que deseja excluir esta categoria? As transações associadas a ela poderão ficar sem categoria definida. Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-4 w-full cursor-auto">
              <button
                onClick={() => setDeletingId(null)}
                disabled={actionLoading}
                className="flex-1 py-3 rounded-full font-bold bg-surface-container hover:bg-surface-container-highest transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={actionLoading}
                className="flex-1 py-3 rounded-full font-bold bg-error text-on-error hover:scale-95 transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {actionLoading ? <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> : null}
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-surface-container-high rounded-3xl p-8 max-w-md w-full border border-outline-variant/20 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold font-headline text-on-surface">Editar Categoria</h3>
              <button
                onClick={() => setEditingCategory(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="space-y-6 mb-8 max-h-[60vh] overflow-y-auto px-2 custom-scrollbar">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-bold text-primary opacity-90">Nome da Categoria</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  autoFocus
                  className="w-full bg-surface-container border border-outline-variant/20 rounded-xl h-14 px-4 font-body outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-on-surface"
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs uppercase tracking-wider font-bold text-primary opacity-90">Ícone</label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 p-3 bg-surface-container rounded-xl border border-outline-variant/10 max-h-[200px] overflow-y-auto custom-scrollbar">
                  {icons.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setEditIcon(icon)}
                      className={`w-10 h-10 flex flex-shrink-0 items-center justify-center rounded-lg transition-all ${
                        editIcon === icon
                          ? "bg-primary text-on-primary"
                          : "hover:bg-surface-container-highest text-on-surface/60"
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl">{icon}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs uppercase tracking-wider font-bold text-primary opacity-90">Cor</label>
                <div className="flex flex-wrap gap-3 p-3 bg-surface-container rounded-xl border border-outline-variant/10">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setEditColor(color)}
                      className={`w-8 h-8 rounded-full transition-all ${
                        editColor === color
                          ? "ring-2 ring-primary ring-offset-2 ring-offset-surface-container"
                          : "hover:scale-110"
                      }`}
                      style={{ backgroundColor: color }}
                    ></button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 w-full">
              <button
                onClick={() => setEditingCategory(null)}
                disabled={actionLoading}
                className="flex-1 py-3 rounded-full font-bold bg-surface-container hover:bg-surface-container-highest transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleEdit}
                disabled={
                  actionLoading || 
                  !editName.trim() || 
                  (editName.trim() === editingCategory.name && 
                   editIcon === (editingCategory.icon || 'label') && 
                   editColor === (editingCategory.color || '#b0c6ff'))
                }
                className="flex-1 py-3 rounded-full font-bold bg-primary text-on-primary hover:scale-95 transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {actionLoading ? <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> : null}
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
