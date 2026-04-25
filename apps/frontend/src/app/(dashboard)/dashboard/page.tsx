"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MonthSelector } from "@/components/dashboard/MonthSelector";
import { EditBalanceModal } from "@/components/dashboard/EditBalanceModal";
import { FinancialInsightsCard } from "@/components/dashboard/FinancialInsightsCard";

import { useAuth } from "@/lib/auth";
import { fetchAPI } from "@/lib/api";
import { formatCurrency } from "@/lib/storage";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DashboardSummary {
  initialBalance: number;
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyBalance: number;
}

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

interface CategoryStat {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

// ─── Color palette para categorias (sem ícone da API ainda) ──────────────────
const CATEGORY_COLORS = [
  "#b0c6ff", "#ffb59b", "#a1b4eb", "#b388ff",
  "#69f0ae", "#ffd740", "#ff8a80", "#82b1ff",
];

function getCategoryColor(index: number): string {
  return CATEGORY_COLORS[index % CATEGORY_COLORS.length];
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { token } = useAuth();
  const router = useRouter();

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showBalanceModal, setShowBalanceModal] = useState(false);

  const [isSavingBalance, setIsSavingBalance] = useState(false);

  // ─── Fetch dashboard summary + transactions do mês ─────────────────────────
  const fetchData = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);

    const month = selectedMonth + 1; // API usa 1-12, JS usa 0-11
    const year = selectedYear;

    const [summaryResult, txResult] = await Promise.all([
      fetchAPI<DashboardSummary>(`/dashboard/summary?month=${month}&year=${year}`, { token }),
      fetchAPI<Transaction[]>(`/transactions?month=${month}&year=${year}`, { token }),
    ]);

    if (summaryResult.error) {
      setError(summaryResult.error.message);
    } else {
      setSummary(summaryResult.data ?? null);
    }

    if (!txResult.error) {
      setTransactions(txResult.data ?? []);
    }

    setIsLoading(false);
  }, [token, selectedMonth, selectedYear]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ─── Variação vs mês anterior ────────────────────────────────────────────

  const calcVariation = (current: number, prev: number) =>
    prev > 0 ? ((current - prev) / prev) * 100 : current > 0 ? 100 : 0;

  // ─── Gastos por categoria (calculado a partir das transações do mês) ────────

  const expensesByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      const name = t.category.name;
      acc[name] = (acc[name] || 0) + Number(t.amount);
      return acc;
    }, {} as Record<string, number>);

  const totalExpenseMonth = Object.values(expensesByCategory).reduce((a, b) => a + b, 0);

  const categoryData: CategoryStat[] = Object.entries(expensesByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name, amount], index) => ({
      name,
      amount,
      percentage: totalExpenseMonth > 0 ? (amount / totalExpenseMonth) * 100 : 0,
      color: getCategoryColor(index),
    }));

  // ─── Handlers ────────────────────────────────────────────────────────────

  const handleSaveBalance = useCallback(
    async (value: number) => {
      if (!token) return;
      setIsSavingBalance(true);
      const { data, error: err } = await fetchAPI<{ initialBalance: number }>(
        "/users/initial-balance",
        { method: "PUT", token, body: JSON.stringify({ initialBalance: value }) }
      );
      if (err) {
        alert("Erro ao salvar saldo: " + err.message);
      } else if (data) {
        setSummary((prev) =>
          prev
            ? {
                ...prev,
                initialBalance: data.initialBalance,
                totalBalance:
                  data.initialBalance +
                  (prev.totalBalance - prev.initialBalance),
              }
            : prev
        );
        setShowBalanceModal(false);
        router.refresh();
      }
      setIsSavingBalance(false);
    },
    [token]
  );



  const handleMonthChange = useCallback((month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  }, []);

  // ─── Loading ──────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">
          progress_activity
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-on-surface-variant">
        <span className="material-symbols-outlined text-5xl text-error">cloud_off</span>
        <p className="text-sm text-center max-w-xs">{error}</p>
        <button
          onClick={fetchData}
          className="text-primary text-sm hover:underline flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">refresh</span>
          Tentar novamente
        </button>
      </div>
    );
  }

  const income = summary?.monthlyIncome ?? 0;
  const expense = summary?.monthlyExpenses ?? 0;
  const currentBalance = summary?.totalBalance ?? 0;
  const initialBalance = summary?.initialBalance ?? 0;

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h2 className="text-[#e5e2e1] text-3xl font-bold font-dm-sans tracking-tight mb-2">
            Resumo Financeiro
          </h2>
          <MonthSelector
            month={selectedMonth}
            year={selectedYear}
            onChange={handleMonthChange}
          />
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/new-transaction"
            className="bg-primary text-on-primary px-5 py-2.5 rounded-full text-sm font-bold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg focus-visible:ring-2 focus-visible:ring-primary outline-none"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            Novo Lançamento
          </Link>
        </div>
      </div>

      {/* Bento Grid: Cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Saldo Atual */}
        <div className="bg-gradient-to-br from-[#b0c6ff]/10 to-transparent p-8 rounded-xl border border-[#b0c6ff]/10 shadow-[0_24px_48px_rgba(0,0,0,0.4)] relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 w-32 h-32 bg-[#b0c6ff]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div className="p-3 bg-[#b0c6ff]/20 rounded-2xl text-[#b0c6ff]">
              <span className="material-symbols-outlined" translate="no">account_balance</span>
            </div>
            <button
              onClick={() => setShowBalanceModal(true)}
              className="p-2 rounded-full bg-[#b0c6ff]/10 hover:bg-[#b0c6ff]/30 transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none"
              title="Editar saldo inicial"
              aria-label="Editar saldo inicial"
            >
              <span className="material-symbols-outlined text-[#b0c6ff] text-sm">edit</span>
            </button>
          </div>
          <p className="text-[#c3c6d6] text-xs font-source-sans-3 mb-1">Saldo Atual</p>
          <div className="flex items-baseline gap-1">
            <span className="text-[#b0c6ff] text-lg font-dm-sans">R$</span>
            <h3
              className={`text-4xl font-bold font-dm-sans tracking-tighter ${
                currentBalance >= 0 ? "text-[#e5e2e1]" : "text-red-400"
              }`}
            >
              {formatCurrency(currentBalance).replace("R$", "").trim()}
            </h3>
          </div>
          {initialBalance > 0 && (
            <p className="text-[10px] text-[#c3c6d6] mt-2">
              Saldo inicial: {formatCurrency(initialBalance)}
            </p>
          )}
        </div>

        {/* Receitas */}
        <div className="bg-surface-container-low p-8 rounded-xl hover:bg-surface-container-high transition-colors">
          <div className="flex justify-between items-start mb-8">
            <div className="p-3 bg-green-500/20 rounded-2xl text-green-400">
              <span className="material-symbols-outlined" translate="no">trending_up</span>
            </div>
          </div>
          <p className="text-[#c3c6d6] text-xs font-source-sans-3 mb-1">Receitas do Mês</p>
          <div className="flex items-baseline gap-1">
            <span className="text-[#c3c6d6] text-sm font-dm-sans">R$</span>
            <h3 className="text-green-400 text-3xl font-bold font-dm-sans tracking-tight">
              {formatCurrency(income).replace("R$", "").trim()}
            </h3>
          </div>
        </div>

        {/* Despesas */}
        <div className="bg-surface-container-low p-8 rounded-xl hover:bg-surface-container-high transition-colors">
          <div className="flex justify-between items-start mb-8">
            <div className="p-3 bg-red-500/20 rounded-2xl text-red-400">
              <span className="material-symbols-outlined" translate="no">trending_down</span>
            </div>
          </div>
          <p className="text-[#c3c6d6] text-xs font-source-sans-3 mb-1">Despesas do Mês</p>
          <div className="flex items-baseline gap-1">
            <span className="text-[#c3c6d6] text-sm font-dm-sans">R$</span>
            <h3 className="text-red-400 text-3xl font-bold font-dm-sans tracking-tight">
              {formatCurrency(expense).replace("R$", "").trim()}
            </h3>
          </div>
        </div>

        {/* Balanço do Mês */}
        <div className="bg-[#1c1b1b] p-8 rounded-xl border border-[#424654]/10 flex flex-col hover:bg-[#252424] transition-colors min-h-[220px]">
          <div className="flex justify-between items-start mb-6">
            <h4 className="font-dm-sans text-sm font-bold text-[#e5e2e1]">Balanço do Mês</h4>
            <span
              className="material-symbols-outlined text-sm"
              style={{
                color: income - expense >= 0 ? "#69f0ae" : "#ff8a80",
                fontVariationSettings: "'FILL' 1",
              }}
            >
              {income - expense >= 0 ? "trending_up" : "trending_down"}
            </span>
          </div>

          <div className="flex-1">
            <p className="text-[#c3c6d6] text-[10px] mb-1">
              {income - expense >= 0 ? "Você economizou" : "Você gastou a mais"}
            </p>
            <div className="flex items-baseline gap-1 mb-4">
              <span className={`text-lg font-bold font-dm-sans ${income - expense >= 0 ? "text-green-400" : "text-red-400"}`}>R$</span>
              <h3
                className={`text-3xl font-bold font-dm-sans tracking-tight ${
                  income - expense >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {formatCurrency(Math.abs(income - expense)).replace("R$", "").trim()}
              </h3>
            </div>

            <div className="space-y-1 mb-6">
              <p className="text-[#c3c6d6] text-[10px] flex justify-between">
                <span>Receitas:</span>
                <span className="text-on-surface">{formatCurrency(income)}</span>
              </p>
              <p className="text-[#c3c6d6] text-[10px] flex justify-between">
                <span>Despesas:</span>
                <span className="text-on-surface">{formatCurrency(expense)}</span>
              </p>
            </div>
          </div>

          <Link
            href="/goals"
            className="text-[#b0c6ff] text-[11px] font-bold flex items-center gap-1 hover:underline mt-auto"
          >
            Ver metas financeiras
            <span className="material-symbols-outlined text-xs" translate="no">arrow_forward</span>
          </Link>
        </div>
      </div>

      {/* Row 2: Charts & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {/* Gastos por Categoria */}
        <div className="bg-surface-container-low p-8 rounded-xl">
          <div className="flex justify-between items-center mb-10">
            <h4 className="font-dm-sans text-lg font-bold text-[#e5e2e1]">Gastos por Categoria</h4>
            <Link href="/categories" className="text-primary text-sm hover:underline">
              Ver todas
            </Link>
          </div>

          {categoryData.length > 0 ? (
            <div className="flex flex-col sm:flex-row items-center gap-8">
              {/* Donut */}
              <div className="relative w-40 h-40 flex items-center justify-center flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="80" cy="80" fill="transparent" r="65"
                    stroke="#353534" strokeWidth="15"
                  />
                  {categoryData.map((cat, index) => {
                    const circumference = 2 * Math.PI * 65;
                    const offset = categoryData
                      .slice(0, index)
                      .reduce((sum, c) => sum + (c.percentage / 100) * circumference, 0);
                    const dashArray = (cat.percentage / 100) * circumference;
                    return (
                      <circle
                        key={cat.name}
                        cx="80" cy="80" fill="transparent" r="65"
                        stroke={cat.color}
                        strokeWidth="15"
                        strokeDasharray={`${dashArray} ${circumference}`}
                        strokeDashoffset={-offset}
                        strokeLinecap="round"
                      />
                    );
                  })}
                </svg>
                <div className="absolute text-center">
                  <p className="text-[8px] uppercase tracking-widest text-[#c3c6d6]">Total</p>
                  <p className="text-sm font-bold font-dm-sans">{formatCurrency(totalExpenseMonth)}</p>
                </div>
              </div>

              {/* Legend */}
              <div className="flex-1 w-full space-y-3">
                {categoryData.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-xs font-source-sans-3 truncate max-w-[80px]">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#c3c6d6]">{formatCurrency(cat.amount)}</span>
                      <span className="font-bold text-xs w-10 text-right">{cat.percentage.toFixed(0)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <span className="material-symbols-outlined text-5xl text-[#424654] mb-3">pie_chart</span>
              <p className="text-[#c3c6d6] text-sm mb-2">Nenhuma despesa</p>
            </div>
          )}
        </div>

        {/* AI Insights Card */}
        <FinancialInsightsCard />
      </div>

      {/* Últimas Transações do Mês */}
      {transactions.length > 0 && (
        <div className="mt-8 bg-surface-container-low p-8 rounded-xl">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-dm-sans text-lg font-bold text-[#e5e2e1]">Últimas Transações</h4>
            <Link href="/transactions" className="text-primary text-sm hover:underline">
              Ver todas
            </Link>
          </div>

          <div className="space-y-3">
            {transactions.slice(0, 5).map((txn) => (
              <div
                key={txn.id}
                className="flex items-center justify-between p-4 bg-surface-container-high rounded-xl"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      txn.type === "income"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {txn.type === "income" ? "payments" : "shopping_bag"}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-on-surface">
                      {txn.description || txn.category.name}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      {txn.category.name} •{" "}
                      {new Date(txn.occurredOn.split("T")[0] + "T00:00:00").toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
                <span
                  className={`font-bold ${
                    txn.type === "income" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {txn.type === "income" ? "+" : "-"} {formatCurrency(Number(txn.amount))}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modais */}
      <EditBalanceModal
        isOpen={showBalanceModal}
        onClose={() => setShowBalanceModal(false)}
        currentBalance={initialBalance}
        onSave={handleSaveBalance}
      />

      {/* FAB Mobile */}
      <Link
        href="/new-transaction"
        className="fixed bottom-24 right-6 md:hidden w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all z-40"
      >
        <span className="material-symbols-outlined text-2xl">add</span>
      </Link>
    </>
  );
}
