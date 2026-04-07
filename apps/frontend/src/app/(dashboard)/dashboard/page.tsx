"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { MonthSelector } from "@/components/dashboard/MonthSelector";
import { EditBalanceModal } from "@/components/dashboard/EditBalanceModal";
import { QuickTransactionModal } from "@/components/dashboard/QuickTransactionModal";
import {
  getInitialBalance,
  setInitialBalance,
  getTransactions,
  addTransaction,
  calculateTotals,
  formatCurrency,
  Transaction,
  getCategories,
  Category,
} from "@/lib/storage";

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [initialBalance, setInitialBalanceState] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Mês/Ano selecionado
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  
  // Modais
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  // Carregar dados do localStorage
  useEffect(() => {
    setMounted(true);
    setInitialBalanceState(getInitialBalance());
    setTransactions(getTransactions());
    setCategories(getCategories());
  }, []);

  // Calcular totais do mês selecionado
  const { income, expense, transactions: monthTransactions } = calculateTotals(
    transactions,
    selectedMonth,
    selectedYear
  );

  // Saldo atual = Saldo inicial + todas receitas - todas despesas
  const allTimeIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const allTimeExpense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const currentBalance = initialBalance + allTimeIncome - allTimeExpense;

  // Calcular gastos por categoria do mês
  const expensesByCategory = monthTransactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.categoryId] = (acc[t.categoryId] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const totalExpenseMonth = Object.values(expensesByCategory).reduce((a, b) => a + b, 0);

  const categoryData = Object.entries(expensesByCategory)
    .map(([catId, amount]) => {
      const category = categories.find(c => c.id === catId);
      return {
        id: catId,
        name: category?.name || "Outros",
        color: category?.color || "#90a4ae",
        amount,
        percentage: totalExpenseMonth > 0 ? (amount / totalExpenseMonth) * 100 : 0,
      };
    })
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 4);

  // Handlers
  const handleSaveBalance = useCallback((value: number) => {
    setInitialBalance(value);
    setInitialBalanceState(value);
  }, []);

  const handleAddTransaction = useCallback((data: {
    type: "income" | "expense";
    amount: number;
    categoryId: string;
    description: string;
    date: string;
  }) => {
    const newTransaction = addTransaction(data);
    setTransactions(prev => [...prev, newTransaction]);
  }, []);

  const handleMonthChange = useCallback((month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  }, []);

  // Variação vs mês anterior (simplificado)
  const prevMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
  const prevYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear;
  const { income: prevIncome, expense: prevExpense } = calculateTotals(
    transactions,
    prevMonth,
    prevYear
  );
  
  const incomeVariation = prevIncome > 0 
    ? ((income - prevIncome) / prevIncome) * 100 
    : income > 0 ? 100 : 0;
  const expenseVariation = prevExpense > 0 
    ? ((expense - prevExpense) / prevExpense) * 100 
    : expense > 0 ? 100 : 0;

  if (!mounted) {
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
            month={selectedMonth}
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
          <div className="absolute -top-4 -right-4 w-32 h-32 bg-[#b0c6ff]/5 rounded-full blur-3xl"></div>
          <div className="flex justify-between items-start mb-8">
            <div className="p-3 bg-[#b0c6ff]/20 rounded-2xl text-[#b0c6ff]">
              <span className="material-symbols-outlined" translate="no">account_balance</span>
            </div>
            <button
              onClick={() => setShowBalanceModal(true)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full hover:bg-[#b0c6ff]/20"
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
            {incomeVariation !== 0 && (
              <span className={`text-[10px] font-bold tracking-widest ${
                incomeVariation > 0 ? "text-green-400" : "text-red-400"
              }`}>
                {incomeVariation > 0 ? "+" : ""}{incomeVariation.toFixed(0)}% vs mês ant.
              </span>
            )}
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
            {expenseVariation !== 0 && (
              <span className={`text-[10px] font-bold tracking-widest ${
                expenseVariation < 0 ? "text-green-400" : "text-red-400"
              }`}>
                {expenseVariation > 0 ? "+" : ""}{expenseVariation.toFixed(0)}% vs mês ant.
              </span>
            )}
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
      {monthTransactions.length > 0 && (
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
            {monthTransactions.slice(-5).reverse().map((txn) => {
              const category = categories.find(c => c.id === txn.categoryId);
              return (
                <div
                  key={txn.id}
                  className="flex items-center justify-between p-4 bg-surface-container-high rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${category?.color}20` }}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ color: category?.color }}
                      >
                        {category?.icon || "receipt"}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-on-surface">
                        {txn.description || category?.name || "Transação"}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        {new Date(txn.date).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  <span className={`font-bold ${
                    txn.type === "income" ? "text-green-400" : "text-red-400"
                  }`}>
                    {txn.type === "income" ? "+" : "-"} {formatCurrency(txn.amount)}
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
        onSave={handleAddTransaction}
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
