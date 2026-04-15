"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { fetchAPI } from "@/lib/api";

interface Category {
  id: string;
  name: string;
}

export default function CategoriesPage() {
  const { token, isAuthenticated } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit / Delete State
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const loadCategories = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    const res = await fetchAPI('/categories', { token });

    if (res.error) {
      setError(res.error.message || "Erro ao carregar categorias");
    } else {
      setCategories(res.data || []);
    }
    setIsLoading(false);
  }, [token]);

  useEffect(() => {
    if (isAuthenticated && token) {
      loadCategories();
    }
  }, [isAuthenticated, token, loadCategories]);

  // Função para retornar ícone visual baseado no nome (fallback temporário)
  const getVisualAids = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('alimentação') || lowerName.includes('comida')) return { icon: 'restaurant', color: 'primary' };
    if (lowerName.includes('transporte') || lowerName.includes('carro')) return { icon: 'directions_car', color: 'secondary' };
    if (lowerName.includes('moradia') || lowerName.includes('casa')) return { icon: 'home', color: 'tertiary' };
    if (lowerName.includes('saúde') || lowerName.includes('farmacia')) return { icon: 'medical_services', color: 'error' };
    if (lowerName.includes('lazer')) return { icon: 'sports_esports', color: 'primary' };
    if (lowerName.includes('estudo')) return { icon: 'school', color: 'on-surface' };
    return { icon: 'label', color: 'primary' };
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
      alert("Erro ao excluir: " + (res.error.message || "Erro desconhecido"));
    } else {
      setDeletingId(null);
      loadCategories();
    }
  };

  const handleEdit = async () => {
    if (!editingCategory || !token || !editName.trim()) return;
    setActionLoading(true);
    const res = await fetchAPI(`/categories/${editingCategory.id}`, {
      method: "PUT",
      token,
      body: JSON.stringify({ name: editName.trim() })
    });
    setActionLoading(false);

    if (res.error) {
      alert("Erro ao salvar: " + (res.error.message || "Erro desconhecido"));
    } else {
      setEditingCategory(null);
      setEditName("");
      loadCategories();
    }
  };

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

        {/* Feedback / Linhas de Estado */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
            <span className="material-symbols-outlined animate-spin text-4xl mb-4 text-primary">progress_activity</span>
            <p className="font-body">Carregando categorias...</p>
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
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
            {categories.map((category) => {
              const aids = getVisualAids(category.name);
              return (
                <div key={category.id} className="relative bg-surface-container-high rounded-2xl p-6 flex flex-col justify-between group hover:bg-surface-container-highest transition-all cursor-pointer border border-outline-variant/10 hover:border-primary/30 overflow-hidden">

                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditingCategory(category); setEditName(category.name); }}
                      className="w-8 h-8 rounded-full bg-surface-container hover:bg-primary hover:text-on-primary flex items-center justify-center transition-colors shadow-sm"
                      title="Editar"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeletingId(category.id); }}
                      className="w-8 h-8 rounded-full bg-surface-container hover:bg-error hover:text-on-error flex items-center justify-center transition-colors shadow-sm"
                      title="Excluir"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>

                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-${aids.color}-container/40 text-${aids.color}`}>
                    <span className="material-symbols-outlined text-2xl">
                      {aids.icon}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-dm-sans text-lg font-bold truncate" title={category.name}>{category.name}</h3>
                    {/* Placeholder para integração futura com saldo por categoria */}
                    <p className="text-on-surface-variant text-xs mt-1">
                      Gerenciamento ativo
                    </p>
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

            <div className="space-y-4 mb-8">
              <label className="text-xs uppercase tracking-wider font-bold text-primary opacity-90">Nome da Categoria</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                autoFocus
                className="w-full bg-surface-container border border-outline-variant/20 rounded-xl h-14 px-4 font-body outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-on-surface"
              />
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
                disabled={actionLoading || !editName.trim() || editName.trim() === editingCategory.name}
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
