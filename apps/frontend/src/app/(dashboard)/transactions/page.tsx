"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { fetchAPI } from "@/lib/api";
import { TransactionModal } from "@/components/dashboard/QuickTransactionModal";
import { DeleteTransactionModal } from "@/components/transactions/DeleteTransactionModal";

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  occurredOn: string;
  category: {
    name: string;
    icon?: string;
    color?: string;
  };
}

type Toast = { message: string; kind: "success" | "error" };

export default function TransactionsPage() {
  const router = useRouter();
  const { token, isAuthenticated, isLoading: authLoading } = useAuth();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const showToast = useCallback((message: string, kind: "success" | "error") => {
    setToast({ message, kind });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const loadTransactions = useCallback(async () => {
    if (authLoading || !isAuthenticated || !token) {
      if (!authLoading) setLoading(false);
      return;
    }

    setLoading(true);

    // API espera mês 1-12; selectedMonth é 0-11
    const params = new URLSearchParams({
      month: (selectedMonth + 1).toString(),
      year: selectedYear.toString(),
    });

    if (selectedType !== "all") {
      params.append("type", selectedType);
    }

    const { data, error: apiError } = await fetchAPI<Transaction[]>(
      `/transactions?${params.toString()}`,
      { token }
    );

    if (apiError) {
      setError(apiError.message);
    } else {
      setTransactions(data || []);
      setError(null);
    }

    setLoading(false);
  }, [authLoading, isAuthenticated, token, selectedMonth, selectedYear, selectedType]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const handleDelete = async () => {
    if (!transactionToDelete) return;
    const id = transactionToDelete.id;

    setDeletingId(id);
    const { error: apiError } = await fetchAPI(`/transactions/${id}`, {
      method: "DELETE",
      token,
    });
    setDeletingId(null);

    if (apiError) {
      showToast("Falha ao excluir: " + apiError.message, "error");
    } else {
      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
      showToast("Transação excluída com sucesso.", "success");
      // Invalida cache do Next.js para que o dashboard recarregue ao voltar
      router.refresh();
      setTransactionToDelete(null);
    }
  };

  const handleUpdate = async (data: {
    type: "income" | "expense";
    amount: number;
    category: string;
    description: string;
    date: string;
  }) => {
    if (!editingTransaction || !token) return;

    const { error: apiError } = await fetchAPI(
      `/transactions/${editingTransaction.id}`,
      {
        method: "PUT",
        token,
        body: JSON.stringify({
          type: data.type,
          amount: data.amount,
          category: data.category,
          description: data.description,
          date: data.date,
        }),
      }
    );

    if (apiError) {
      showToast("Falha ao atualizar: " + apiError.message, "error");
    } else {
      setEditingTransaction(null);
      showToast("Transação atualizada com sucesso.", "success");
      loadTransactions();
      router.refresh();
    }
  };

  const formatCurrency = (value: number | string) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value));

  const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Hoje";
    if (date.toDateString() === yesterday.toDateString()) return "Ontem";

    return date.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" });
  };

  const { groupedTransactions, totals } = useMemo(() => {
    const filtered = transactions.filter(
      (tx) =>
        (tx.description?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        tx.category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const groups: Record<string, { dateLabel: string; items: Transaction[]; total: number }> = {};
    let income = 0;
    let expense = 0;

    filtered.forEach((tx) => {
      const dateKey = tx.occurredOn.split("T")[0];
      const val = Number(tx.amount);

      if (tx.type === "income") income += val;
      else expense += val;

      if (!groups[dateKey]) {
        groups[dateKey] = { dateLabel: formatDateLabel(dateKey), items: [], total: 0 };
      }
      groups[dateKey].items.push(tx);
      groups[dateKey].total += tx.type === "income" ? val : -val;
    });

    return {
      groupedTransactions: Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0])),
      totals: { income, expense, balance: income - expense },
    };
  }, [transactions, searchQuery]);

  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ];
  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - i);

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl text-sm font-bold transition-all animate-in fade-in slide-in-from-top-2 ${
            toast.kind === "success"
              ? "bg-green-500/10 border border-green-500/30 text-green-400"
              : "bg-error/10 border border-error/30 text-error"
          }`}
        >
          <span className="material-symbols-outlined text-base">
            {toast.kind === "success" ? "check_circle" : "error"}
          </span>
          {toast.message}
        </div>
      )}

      <header className="flex items-center justify-between w-full">
        <div className="flex flex-col">
          <span className="text-xl font-black text-[#e5e2e1] tracking-tighter md:hidden">VAULT</span>
          <h2 className="text-2xl font-bold font-headline tracking-tight text-on-surface">
            Transações
          </h2>
        </div>
        <Link
          href="/new-transaction"
          className="bg-primary-container text-on-primary-container px-6 py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:scale-95 transition-all shadow-lg text-sm focus-visible:ring-2 focus-visible:ring-primary outline-none"
        >
          <span className="material-symbols-outlined text-xl">add_circle</span>
          <span className="hidden sm:inline">Novo Lançamento</span>
        </Link>
      </header>

      {/* Filters */}
      <section className="space-y-4 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-6 relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-60">
              search
            </span>
            <input
              aria-label="Pesquisar transações"
              className="w-full bg-surface-container-high border-none rounded-2xl py-3.5 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary transition-all outline-none"
              placeholder="Pesquisar transações..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="lg:col-span-6 grid grid-cols-3 gap-3">
            <select
              aria-label="Filtrar por mês"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="bg-surface-container-high border-none rounded-2xl py-3 px-4 text-sm text-on-surface focus:ring-1 focus:ring-primary outline-none"
            >
              {months.map((m, i) => (
                <option key={m} value={i}>{m}</option>
              ))}
            </select>
            <select
              aria-label="Filtrar por ano"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-surface-container-high border-none rounded-2xl py-3 px-4 text-sm text-on-surface focus:ring-1 focus:ring-primary outline-none"
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <select
              aria-label="Filtrar por tipo"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-surface-container-high border-none rounded-2xl py-3 px-4 text-sm text-on-surface focus:ring-1 focus:ring-primary outline-none"
            >
              <option value="all">Tipo</option>
              <option value="income">Entradas</option>
              <option value="expense">Saídas</option>
            </select>
          </div>
        </div>
      </section>

      {/* Summary Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-high rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
          <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">Entradas</p>
          <h3 className="font-headline text-2xl font-bold text-primary">{formatCurrency(totals.income)}</h3>
        </div>
        <div className="bg-surface-container-high rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-error/5 rounded-full blur-2xl" />
          <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">Saídas</p>
          <h3 className="font-headline text-2xl font-bold text-error">{formatCurrency(totals.expense)}</h3>
        </div>
        <div className="bg-surface-container-high rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-on-surface/5 rounded-full blur-2xl" />
          <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">Saldo</p>
          <h3
            className={`font-headline text-2xl font-bold ${
              totals.balance >= 0 ? "text-primary" : "text-error"
            }`}
          >
            {formatCurrency(totals.balance)}
          </h3>
        </div>
      </section>

      {/* Content */}
      <section className="flex-1 w-full pb-12">
        {error && (
          <div className="bg-error/10 border border-error/20 text-error p-4 rounded-2xl mb-8 flex items-center gap-3">
            <span className="material-symbols-outlined">error</span>
            <p className="font-medium">{error}</p>
            <button onClick={loadTransactions} className="ml-auto text-sm underline">
              Tentar novamente
            </button>
          </div>
        )}

        {loading && transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-on-surface-variant animate-pulse">Carregando dados...</p>
          </div>
        ) : groupedTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-surface-container-low rounded-3xl border-2 border-dashed border-outline-variant/30">
            <div className="w-20 h-20 bg-surface-container-highest rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">receipt_long</span>
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-2">Nenhuma transação encontrada</h3>
            <p className="text-on-surface-variant max-w-xs mb-8">
              Não encontramos registros para o período ou filtro selecionado.
            </p>
            <button
              onClick={() => { setSelectedMonth(now.getMonth()); setSelectedType("all"); setSearchQuery(""); }}
              className="text-primary hover:underline font-bold"
            >
              Limpar Filtros
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {groupedTransactions.map(([dateKey, group]) => (
              <div key={dateKey}>
                <div className="flex items-center justify-between mb-4 px-2">
                  <h4 className="font-label text-sm font-bold text-on-surface-variant opacity-80 uppercase tracking-tighter">
                    {group.dateLabel}
                  </h4>
                  <span className={`text-xs font-bold ${group.total >= 0 ? "text-primary" : "text-error"}`}>
                    {group.total >= 0 ? "+" : "-"} {formatCurrency(Math.abs(group.total))}
                  </span>
                </div>
                <div className="space-y-3">
                  {group.items.map((tx) => (
                    <div
                      key={tx.id}
                      className="bg-surface-container-low hover:bg-surface-container-highest transition-all duration-200 rounded-2xl p-4 flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                          style={{ 
                            backgroundColor: `${tx.category.color || (tx.type === 'income' ? '#82f9d8' : '#ffb59b')}20`,
                            color: tx.category.color || (tx.type === 'income' ? '#82f9d8' : '#ffb59b')
                          }}
                        >
                          <span className="material-symbols-outlined">
                            {tx.category.icon || (tx.type === 'income' ? 'payments' : 'shopping_cart')}
                          </span>
                        </div>
                        <div>
                          <h5 className="font-bold text-on-surface">{tx.description || tx.category.name}</h5>
                          <p className="text-xs text-on-surface-variant">{tx.category.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <span
                          className={`font-headline font-bold ${
                            tx.type === "income" ? "text-primary" : "text-error"
                          }`}
                        >
                          {tx.type === "income" ? "+" : "-"} {formatCurrency(tx.amount)}
                        </span>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setEditingTransaction(tx)}
                            className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none"
                            title="Editar"
                            aria-label="Editar transação"
                          >
                            <span className="material-symbols-outlined text-sm">edit</span>
                          </button>
                          <button
                            onClick={() => setTransactionToDelete(tx)}
                            disabled={deletingId === tx.id}
                            className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center hover:text-error transition-colors disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-error outline-none"
                            title="Excluir"
                            aria-label="Excluir transação"
                          >
                            {deletingId === tx.id ? (
                              <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                            ) : (
                              <span className="material-symbols-outlined text-sm">delete</span>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {editingTransaction && (
        <TransactionModal
          isOpen={!!editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onSave={handleUpdate}
          initialData={{
            ...editingTransaction,
            date: editingTransaction.occurredOn,
          }}
        />
      )}

      <DeleteTransactionModal
        isOpen={!!transactionToDelete}
        onClose={() => setTransactionToDelete(null)}
        onConfirm={handleDelete}
        isLoading={!!deletingId}
        transactionData={transactionToDelete ? {
          description: transactionToDelete.description,
          amount: transactionToDelete.amount,
          type: transactionToDelete.type
        } : undefined}
      />
    </div>
  );
}
