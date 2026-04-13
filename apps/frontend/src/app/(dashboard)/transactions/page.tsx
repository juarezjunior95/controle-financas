"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { fetchAPI } from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Category {
  id: string;
  name: string;
}

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: string;
  occurredOn: string;
  description: string | null;
  category: Category;
}

interface MonthlySummary {
  month: number;
  year: number;
  income: number;
  expense: number;
  balance: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.toDateString() === today.toDateString()) {
    return `Hoje, ${d.toLocaleDateString("pt-BR", { day: "numeric", month: "long" })}`;
  }
  if (d.toDateString() === yesterday.toDateString()) {
    return `Ontem, ${d.toLocaleDateString("pt-BR", { day: "numeric", month: "long" })}`;
  }
  return d.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
}

function groupByDate(transactions: Transaction[]): Record<string, Transaction[]> {
  return transactions.reduce((acc, t) => {
    const key = t.occurredOn.slice(0, 10);
    if (!acc[key]) acc[key] = [];
    acc[key].push(t);
    return acc;
  }, {} as Record<string, Transaction[]>);
}

function getDayTotal(transactions: Transaction[]): number {
  return transactions.reduce((sum, t) => {
    const val = Number(t.amount);
    return t.type === "income" ? sum + val : sum - val;
  }, 0);
}

// ─── Month/Year selector ──────────────────────────────────────────────────────

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function generateMonthOptions(): { label: string; month: number; year: number }[] {
  const options = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    options.push({ label: `${MONTHS[d.getMonth()]} ${d.getFullYear()}`, month: d.getMonth() + 1, year: d.getFullYear() });
  }
  return options;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TransactionsPage() {
  const { token } = useAuth();

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [typeFilter, setTypeFilter] = useState<"" | "income" | "expense">("");
  const [search, setSearch] = useState("");

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const monthOptions = generateMonthOptions();

  const fetchData = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);

    const params = new URLSearchParams({ month: String(selectedMonth), year: String(selectedYear) });
    if (typeFilter) params.set("type", typeFilter);

    const [txResult, summaryResult] = await Promise.all([
      fetchAPI<Transaction[]>(`/transactions?${params}`, { token }),
      fetchAPI<MonthlySummary>(`/transactions/summary?month=${selectedMonth}&year=${selectedYear}`, { token }),
    ]);

    if (txResult.error) {
      setError(txResult.error.message);
    } else {
      setTransactions(txResult.data ?? []);
    }

    if (summaryResult.data) {
      setSummary(summaryResult.data);
    }

    setIsLoading(false);
  }, [token, selectedMonth, selectedYear, typeFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (!token || !confirm("Tem certeza que deseja excluir este lançamento?")) return;
    setDeletingId(id);
    const { error: err } = await fetchAPI(`/transactions/${id}`, { method: "DELETE", token });
    if (err) {
      alert("Erro ao excluir: " + err.message);
    } else {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      if (summary) {
        setSummary((prev) => {
          if (!prev) return prev;
          const tx = transactions.find((t) => t.id === id);
          if (!tx) return prev;
          const val = Number(tx.amount);
          return {
            ...prev,
            income: tx.type === "income" ? prev.income - val : prev.income,
            expense: tx.type === "expense" ? prev.expense - val : prev.expense,
            balance: tx.type === "income" ? prev.balance - val : prev.balance + val,
          };
        });
      }
    }
    setDeletingId(null);
  };

  const filteredTransactions = search.trim()
    ? transactions.filter((t) =>
        t.description?.toLowerCase().includes(search.toLowerCase()) ||
        t.category.name.toLowerCase().includes(search.toLowerCase())
      )
    : transactions;

  const grouped = groupByDate(filteredTransactions);
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Header */}
      <header className="flex items-center justify-between w-full">
        <div className="flex flex-col">
          <span className="text-xl font-black text-[#e5e2e1] tracking-tighter md:hidden">VAULT</span>
          <h2 className="text-2xl font-bold font-headline tracking-tight text-on-surface">Transações</h2>
        </div>
        <Link
          href="/new-transaction"
          className="bg-primary-container text-on-primary-container px-6 py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:scale-95 transition-all shadow-lg text-sm"
        >
          <span className="material-symbols-outlined text-xl">add_circle</span>
          <span className="hidden sm:inline">Novo Lançamento</span>
        </Link>
      </header>

      {/* Filters */}
      <section className="space-y-4 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Search */}
          <div className="lg:col-span-6 relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-60">
              search
            </span>
            <input
              className="w-full bg-surface-container-high border-none rounded-2xl py-3.5 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary transition-all"
              placeholder="Pesquisar por descrição ou categoria..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Month selector */}
          <div className="lg:col-span-3 relative">
            <select
              className="w-full appearance-none bg-surface-container-high border-none rounded-2xl py-3.5 px-4 text-sm text-on-surface font-medium focus:ring-1 focus:ring-primary transition-all pr-10"
              value={`${selectedYear}-${selectedMonth}`}
              onChange={(e) => {
                const [y, m] = e.target.value.split("-").map(Number);
                setSelectedYear(y);
                setSelectedMonth(m);
              }}
            >
              {monthOptions.map((o) => (
                <option key={`${o.year}-${o.month}`} value={`${o.year}-${o.month}`}>
                  {o.label}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
              keyboard_arrow_down
            </span>
          </div>

          {/* Type filter */}
          <div className="lg:col-span-3 relative">
            <select
              className="w-full appearance-none bg-surface-container-high border-none rounded-2xl py-3.5 px-4 text-sm text-on-surface font-medium focus:ring-1 focus:ring-primary transition-all pr-10"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as "" | "income" | "expense")}
            >
              <option value="">Todos os tipos</option>
              <option value="income">Entradas</option>
              <option value="expense">Saídas</option>
            </select>
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
              keyboard_arrow_down
            </span>
          </div>
        </div>
      </section>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-high rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
          <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">Entradas Mensais</p>
          <h3 className="font-headline text-2xl font-bold text-primary">
            {summary ? formatCurrency(summary.income) : "—"}
          </h3>
        </div>
        <div className="bg-surface-container-high rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-error/5 rounded-full blur-2xl group-hover:bg-error/10 transition-colors" />
          <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">Saídas Mensais</p>
          <h3 className="font-headline text-2xl font-bold text-error">
            {summary ? formatCurrency(summary.expense) : "—"}
          </h3>
        </div>
        <div className="bg-surface-container-high rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-on-surface/5 rounded-full blur-2xl group-hover:bg-on-surface/10 transition-colors" />
          <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">Saldo do Período</p>
          <h3
            className={`font-headline text-2xl font-bold ${
              summary && summary.balance >= 0 ? "text-primary" : "text-error"
            }`}
          >
            {summary ? formatCurrency(summary.balance) : "—"}
          </h3>
        </div>
      </section>

      {/* Transaction List */}
      <section className="flex-1 w-full pb-12">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl animate-spin">progress_activity</span>
            <p className="text-sm">Carregando transações...</p>
          </div>
        )}

        {!isLoading && error && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-error">
            <span className="material-symbols-outlined text-4xl">error</span>
            <p className="text-sm">{error}</p>
            <button
              onClick={fetchData}
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">refresh</span>
              Tentar novamente
            </button>
          </div>
        )}

        {!isLoading && !error && filteredTransactions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl opacity-30">receipt_long</span>
            <p className="font-medium text-on-surface">Nenhuma transação encontrada</p>
            <p className="text-sm opacity-60">
              {search ? "Tente outra pesquisa ou limpe os filtros." : "Adicione um novo lançamento para começar."}
            </p>
            {!search && (
              <Link
                href="/new-transaction"
                className="mt-2 bg-primary-container text-on-primary-container px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 hover:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-base">add_circle</span>
                Novo Lançamento
              </Link>
            )}
          </div>
        )}

        {!isLoading && !error && sortedDates.length > 0 && (
          <div className="space-y-6">
            {sortedDates.map((date) => {
              const dayTxs = grouped[date];
              const dayTotal = getDayTotal(dayTxs);
              return (
                <div key={date}>
                  <div className="flex items-center justify-between mb-4 px-2">
                    <h4 className="font-label text-sm font-bold text-on-surface-variant opacity-80">
                      {formatDateLabel(date)}
                    </h4>
                    <span
                      className={`text-xs font-medium ${
                        dayTotal >= 0 ? "text-primary" : "text-error"
                      }`}
                    >
                      {dayTotal >= 0 ? "+" : ""}
                      {formatCurrency(dayTotal)}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {dayTxs.map((tx) => (
                      <div
                        key={tx.id}
                        className="bg-surface-container-low hover:bg-surface-container-highest transition-all duration-200 rounded-2xl p-4 flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              tx.type === "income"
                                ? "bg-primary-container/20 text-primary"
                                : "bg-surface-container-high text-on-surface"
                            }`}
                          >
                            <span
                              className="material-symbols-outlined"
                              style={tx.type === "income" ? { fontVariationSettings: "'FILL' 1" } : undefined}
                            >
                              {tx.type === "income" ? "payments" : "shopping_bag"}
                            </span>
                          </div>
                          <div>
                            <h5 className="font-bold text-on-surface">
                              {tx.description || tx.category.name}
                            </h5>
                            <p className="text-xs text-on-surface-variant">
                              {tx.category.name} • {formatTime(tx.occurredOn)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <span
                            className={`font-headline font-bold ${
                              tx.type === "income" ? "text-primary" : "text-error"
                            }`}
                          >
                            {tx.type === "income" ? "+ " : "- "}
                            {formatCurrency(Number(tx.amount))}
                          </span>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center hover:text-primary transition-colors"
                              title="Editar"
                              onClick={() => alert("Edição em breve!")}
                            >
                              <span className="material-symbols-outlined text-sm">edit</span>
                            </button>
                            <button
                              className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center hover:text-error transition-colors disabled:opacity-40"
                              title="Excluir"
                              disabled={deletingId === tx.id}
                              onClick={() => handleDelete(tx.id)}
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
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
