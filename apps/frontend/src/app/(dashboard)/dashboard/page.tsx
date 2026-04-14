"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { MonthSelector } from "@/components/dashboard/MonthSelector";
import { EditBalanceModal } from "@/components/dashboard/EditBalanceModal";
import { QuickTransactionModal } from "@/components/dashboard/QuickTransactionModal";
import { formatCurrency, getInitialBalance, setInitialBalance } from "@/lib/storage";
import { fetchAPI } from "@/lib/api";
import { useAuth } from "@/lib/auth";

interface ApiTransaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  description: string | null;
  occurredOn: string;
  category: {
    id: string;
    name: string;
    color: string | null;
    icon: string | null;
  };
}

interface MonthlySummary {
  month: number;
  year: number;
  income: number;
  expense: number;
  balance: number;
  byCategory: Record<string, { income: number; expense: number }>;
  transactionCount: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  Alimentação: "#b0c6ff",
  Transporte: "#ffb59b",
  Moradia: "#a1b4eb",
  Saúde: "#ff8a80",
  Lazer: "#b388ff",
  Estudos: "#82b1ff",
  "Estudos e trabalho": "#82b1ff",
  Salário: "#69f0ae",
  Freelance: "#ffd740",
  Outros: "#90a4ae",
};

export default function DashboardPage() {
  const { token } = useAuth();

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [transactions, setTransactions] = useState<ApiTransaction[]>([]);
  const [initialBalance, setInitialBalanceState] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Modais
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  // Saldo inicial ainda em localStorage (endpoint /users/me/settings ainda não implementado)
  useEffect(() => {
    setInitialBalanceState(getInitialBalance());
  }, []);

  const fetchDashboardData = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);

    const [summaryResult, transactionsResult] = await Promise.all([
      fetchAPI<MonthlySummary>(
        `/transactions/summary?month=${selectedMonth}&year=${selectedYear}`,
        { token }
      ),
      fetchAPI<ApiTransaction[]>(
        `/transactions?month=${selectedMonth}&year=${selectedYear}`,
        { token }
      ),
    ]);

    if (summaryResult.data) setSummary(summaryResult.data);
    if (transactionsResult.data) setTransactions(transactionsResult.data);

    setIsLoading(false);
  }, [token, selectedMonth, selectedYear]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const income = summary?.income ?? 0;
  const expense = summary?.expense ?? 0;
  const currentBalance = initialBalance + income - expense;

  // Gastos por categoria do mês (vem do summary da API)
  const categoryData = summary
    ? Object.entries(summary.byCategory)
        .map(([name, values]) => ({
          id: name,
          name,
          color: CATEGORY_COLORS[name] ?? "#90a4ae",
          amount: values.expense,
          percentage: expense > 0 ? (values.expense / expense) * 100 : 0,
        }))
        .filter((c) => c.amount > 0)
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 4)
    : [];

  const totalExpenseMonth = expense;

  const handleSaveBalance = useCallback((value: number) => {
    setInitialBalance(value);
    setInitialBalanceState(value);
  }, []);

  const handleTransactionSaved = useCallback(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleMonthChange = useCallback((month: number, year: number) => {
    // MonthSelector usa índice 0-based; a API usa 1-based
    setSelectedMonth(month + 1);
    setSelectedYear(year);
  }, []);

  if (isLoading && !summary) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">
          progress_activity
        </span>
      </div>
    );
  }

  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h2 className="text-[#e5e2e1] text-3xl font-bold font-dm-sans tracking-tight mb-2">
            Resumo Financeiro
          </h2>
          <MonthSelector
            month={selectedMonth - 1}
            year={selectedYear}
            onChange={handleMonthChange}
          />
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowTransactionModal(true)}
            className="bg-primary text-on-primary px-5 py-2.5 rounded-full text-sm font-bold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Nova Transação
          </button>
        </div>
      </div>

      {/* Bento Grid: Main Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Saldo Atual (Primary Anchor) */}
        <div className="md:col-span-1 bg-gradient-to-br from-[#b0c6ff]/10 to-transparent p-8 rounded-xl border border-[#b0c6ff]/10 shadow-[0_24px_48px_rgba(0,0,0,0.4)] relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 w-32 h-32 bg-[#b0c6ff]/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div className="p-3 bg-[#b0c6ff]/20 rounded-2xl text-[#b0c6ff]">
              <span className="material-symbols-outlined" translate="no">account_balance</span>
            </div>
            <button
              onClick={() => setShowBalanceModal(true)}
              className="p-2 rounded-full bg-[#b0c6ff]/10 hover:bg-[#b0c6ff]/30 transition-colors"
              title="Editar saldo inicial"
            >
              <span className="material-symbols-outlined text-[#b0c6ff] text-sm">edit</span>
            </button>
          </div>
          <p className="text-[#c3c6d6] text-xs font-source-sans-3 mb-1">Saldo Atual</p>
          <div className="flex items-baseline gap-1">
            <span className="text-[#b0c6ff] text-lg font-dm-sans">R$</span>
            <h3 className={`text-4xl font-bold font-dm-sans tracking-tighter ${
              currentBalance >= 0 ? "text-[#e5e2e1]" : "text-red-400"
            }`}>
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
        <div className="bg-surface-container-low p-8 rounded-xl hover:bg-surface-container-high transition-colors group">
          <div className="flex justify-between items-start mb-8">
            <div className="p-3 bg-green-500/20 rounded-2xl text-green-400">
              <span className="material-symbols-outlined" translate="no">trending_up</span>
            </div>
            <span className="text-[10px] font-bold tracking-widest text-green-400/60 uppercase">
              Receitas
            </span>
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
        <div className="bg-surface-container-low p-8 rounded-xl hover:bg-surface-container-high transition-colors group">
          <div className="flex justify-between items-start mb-8">
            <div className="p-3 bg-red-500/20 rounded-2xl text-red-400">
              <span className="material-symbols-outlined" translate="no">trending_down</span>
            </div>
            <span className="text-[10px] font-bold tracking-widest text-red-400/60 uppercase">
              Despesas
            </span>
          </div>
          <p className="text-[#c3c6d6] text-xs font-source-sans-3 mb-1">Despesas do Mês</p>
          <div className="flex items-baseline gap-1">
            <span className="text-[#c3c6d6] text-sm font-dm-sans">R$</span>
            <h3 className="text-red-400 text-3xl font-bold font-dm-sans tracking-tight">
              {formatCurrency(expense).replace("R$", "").trim()}
            </h3>
          </div>
        </div>
      </div>

      {/* Secondary Section: Charts & Metas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Gastos por Categoria */}
        <div className="lg:col-span-8 bg-surface-container-low p-8 rounded-xl">
          <div className="flex justify-between items-center mb-10">
            <h4 className="font-dm-sans text-lg font-bold text-[#e5e2e1]">Gastos por Categoria</h4>
            <Link href="/categories" className="text-primary text-sm hover:underline">
              Ver todas
            </Link>
          </div>
          
          {categoryData.length > 0 ? (
            <div className="flex flex-col md:flex-row items-center gap-12">
              {/* Donut Chart */}
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="96" cy="96" fill="transparent" r="80" stroke="#353534" strokeWidth="20"></circle>
                  {categoryData.map((cat, index) => {
                    const circumference = 2 * Math.PI * 80;
                    const offset = categoryData
                      .slice(0, index)
                      .reduce((sum, c) => sum + (c.percentage / 100) * circumference, 0);
                    const dashArray = (cat.percentage / 100) * circumference;
                    
                    return (
                      <circle
                        key={cat.id}
                        cx="96"
                        cy="96"
                        fill="transparent"
                        r="80"
                        stroke={cat.color}
                        strokeWidth="20"
                        strokeDasharray={`${dashArray} ${circumference}`}
                        strokeDashoffset={-offset}
                        strokeLinecap="round"
                      />
                    );
                  })}
                </svg>
                <div className="absolute text-center">
                  <p className="text-[10px] uppercase tracking-widest text-[#c3c6d6]">Total</p>
                  <p className="text-xl font-bold font-dm-sans">{formatCurrency(totalExpenseMonth)}</p>
                </div>
              </div>
              
              {/* Legend */}
              <div className="flex-1 w-full space-y-4">
                {categoryData.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                      <span className="text-sm font-source-sans-3">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-[#c3c6d6]">{formatCurrency(cat.amount)}</span>
                      <span className="font-bold text-sm w-12 text-right">{cat.percentage.toFixed(0)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="material-symbols-outlined text-6xl text-[#424654] mb-4">
                pie_chart
              </span>
              <p className="text-[#c3c6d6] mb-2">Nenhuma despesa neste mês</p>
              <button
                onClick={() => setShowTransactionModal(true)}
                className="text-primary text-sm hover:underline"
              >
                Adicionar primeira transação
              </button>
            </div>
          )}
        </div>

        {/* Próximas Metas (Mini Widget) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#1c1b1b] p-8 rounded-xl border border-[#424654]/10 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-dm-sans text-lg font-bold text-[#e5e2e1]">Balanço do Mês</h4>
              <span 
                className="material-symbols-outlined text-sm"
                style={{ 
                  color: income - expense >= 0 ? "#69f0ae" : "#ff8a80",
                  fontVariationSettings: "'FILL' 1" 
                }}
              >
                {income - expense >= 0 ? "trending_up" : "trending_down"}
              </span>
            </div>
            
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-[#c3c6d6] text-xs mb-2">
                {income - expense >= 0 ? "Você economizou" : "Você gastou a mais"}
              </p>
              <p className={`text-4xl font-bold font-dm-sans ${
                income - expense >= 0 ? "text-green-400" : "text-red-400"
              }`}>
                {formatCurrency(Math.abs(income - expense))}
              </p>
              <p className="text-[#c3c6d6] text-xs mt-4">
                Receitas: {formatCurrency(income)}<br/>
                Despesas: {formatCurrency(expense)}
              </p>
            </div>
            
            <Link href="/goals" className="mt-8 text-[#b0c6ff] text-sm font-bold flex items-center justify-center gap-2 hover:underline">
              Ver metas financeiras
              <span className="material-symbols-outlined text-sm" translate="no">arrow_forward</span>
            </Link>
          </div>
        </div>

      </div>

      {/* Últimas Transações */}
      {transactions.length > 0 && (
        <div className="mt-8 bg-surface-container-low p-8 rounded-xl">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-dm-sans text-lg font-bold text-[#e5e2e1]">
              Últimas Transações
            </h4>
            <Link href="/transactions" className="text-primary text-sm hover:underline">
              Ver todas
            </Link>
          </div>
          
          <div className="space-y-3">
            {transactions.slice(0, 5).map((txn) => {
              const catColor = txn.category.color ?? CATEGORY_COLORS[txn.category.name] ?? "#90a4ae";
              return (
                <div
                  key={txn.id}
                  className="flex items-center justify-between p-4 bg-surface-container-high rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${catColor}20` }}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ color: catColor }}
                      >
                        {txn.category.icon ?? "receipt"}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-on-surface">
                        {txn.description || txn.category.name}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        {new Date(txn.occurredOn).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  <span className={`font-bold ${
                    txn.type === "income" ? "text-green-400" : "text-red-400"
                  }`}>
                    {txn.type === "income" ? "+" : "-"} {formatCurrency(Number(txn.amount))}
                  </span>
                </div>
              );
            })}
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

      <QuickTransactionModal
        isOpen={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
        onSave={handleTransactionSaved}
      />

      {/* FAB Mobile */}
      <button
        onClick={() => setShowTransactionModal(true)}
        className="fixed bottom-24 right-6 md:hidden w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all z-40"
      >
        <span className="material-symbols-outlined text-2xl">add</span>
      </button>
    </>
  );
}
