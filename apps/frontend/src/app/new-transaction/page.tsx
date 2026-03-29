"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewTransactionPage() {
  const router = useRouter();
  const [type, setType] = useState<"expense" | "income">("expense");

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary/30 min-h-screen flex items-center justify-center p-4 md:p-8">
      {/* Background Decorative Elements */}
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full -z-10"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-tertiary-container/5 blur-[100px] rounded-full -z-10"></div>

      {/* Modal Container */}
      <div className="w-full max-w-2xl bg-surface-container-low rounded-xl overflow-hidden shadow-[0_24px_48px_rgba(0,0,0,0.4)] flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Visual Anchor */}
        <div className="hidden md:flex md:w-1/3 bg-gradient-to-br from-primary-container to-surface-container-highest p-8 flex-col justify-between relative overflow-hidden">
          <div 
            className="absolute inset-0 opacity-20" 
            style={{ 
              backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCz60aeQXOGgNfAT_i87PPE7bsBSd8oiTC5xhsuHK-OuWYS1cB6SutLkn3p0bkjAEDqIWIqTstvLVNqcGeQ3av8a2Zcyo2hb6jEISDkWTm3A8buWkqhtAtsIho__sDbNDGPAteVlwt188fvJ_2qPgdKEIrihr7Y7eirSAMeBdLAnw1mCQpo_fPZzCAC7MosqoEjpl4eb_0cOgjAGoyqWjyBXnBSMA98CgbTO5bhjA1Rq9btOvr9o05U_JIzf6bk0fcG5Vu0DO_YWXg')", 
              backgroundSize: 'cover', 
              backgroundPosition: 'center' 
            }}
          ></div>
          <div className="relative z-10">
            <span className="text-xs font-bold tracking-[0.2em] text-on-primary-container uppercase opacity-80">Vault Premium</span>
            <h1 className="font-headline text-3xl font-black text-on-primary-container mt-4 leading-tight tracking-tighter">Novo Lançamento</h1>
            <p className="text-on-primary-container/70 mt-4 text-sm font-medium">Organize seu fluxo financeiro com precisão cirúrgica em nosso cofre digital.</p>
          </div>
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-bright/30 backdrop-blur-md flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary-container">shield</span>
            </div>
            <span className="text-xs text-on-primary-container font-semibold tracking-wide">Transação Criptografada</span>
          </div>
        </div>

        {/* Main Form Area */}
        <div className="flex-1 p-6 md:p-10 flex flex-col">
          {/* Mobile Header */}
          <div className="flex md:hidden items-center justify-between mb-8">
            <h1 className="font-headline text-xl font-bold text-on-surface tracking-tight">Novo Lançamento</h1>
            <button 
              onClick={() => router.back()}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-highest text-on-surface"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <form className="space-y-8 flex-1" onSubmit={(e) => e.preventDefault()}>
            {/* Toggle: Income / Expense */}
            <div className="flex p-1 bg-surface-container-highest rounded-full w-full max-w-xs mx-auto md:mx-0">
              <button 
                type="button"
                onClick={() => setType("expense")}
                className={`flex-1 py-2 px-4 rounded-full text-sm font-bold transition-all duration-300 ${type === 'expense' ? 'bg-error text-on-error shadow-lg' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                Despesa
              </button>
              <button 
                type="button"
                onClick={() => setType("income")}
                className={`flex-1 py-2 px-4 rounded-full text-sm font-bold transition-all duration-300 ${type === 'income' ? 'bg-primary text-on-primary shadow-lg' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                Receita
              </button>
            </div>

            {/* Input: Value (Currency) */}
            <div className="group">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Valor da Transação</label>
              <div className="relative flex items-baseline">
                <span className="text-2xl font-headline font-light text-primary mr-2">R$</span>
                <input 
                  className="bg-transparent border-none p-0 text-5xl md:text-6xl font-headline font-black text-on-surface placeholder:text-surface-variant focus:ring-0 w-full tracking-tighter" 
                  placeholder="0,00" 
                  type="text"
                />
              </div>
              <div className="h-px w-full bg-outline-variant/20 group-focus-within:bg-primary transition-colors mt-2"></div>
            </div>

            {/* Grid for Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date Picker */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Data</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary text-xl">calendar_today</span>
                  <input 
                    className="w-full bg-surface-container-high border-none rounded-xl py-4 pl-12 pr-4 text-on-surface font-medium focus:ring-2 focus:ring-primary/20 appearance-none" 
                    type="date" 
                    defaultValue="2023-10-27"
                  />
                </div>
              </div>

              {/* Category Dropdown */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Categoria</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary text-xl">category</span>
                  <select className="w-full bg-surface-container-high border-none rounded-xl py-4 pl-12 pr-10 text-on-surface font-medium focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer">
                    <option>Alimentação</option>
                    <option>Transporte</option>
                    <option>Moradia</option>
                    <option>Saúde</option>
                    <option>Lazer</option>
                    <option>Trabalho</option>
                    <option>Outros</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                </div>
              </div>
            </div>

            {/* Description / Note */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Observação</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-4 text-primary text-xl">notes</span>
                <textarea 
                  className="w-full bg-surface-container-high border-none rounded-xl py-4 pl-12 pr-4 text-on-surface font-medium focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface-variant/40 resize-none custom-scrollbar" 
                  placeholder="Ex: Almoço com a equipe de design..." 
                  rows={3}
                ></textarea>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 flex flex-col md:flex-row-reverse gap-4">
              <button 
                className="flex-1 bg-gradient-to-r from-primary to-primary-container text-on-primary font-black py-4 rounded-full shadow-[0_8px_20px_rgba(0,88,203,0.3)] hover:scale-[1.02] active:scale-95 transition-all duration-200 uppercase tracking-widest text-sm" 
                type="submit"
              >
                Salvar Lançamento
              </button>
              <button 
                type="button"
                onClick={() => router.back()}
                className="flex-1 border border-outline-variant/30 text-on-surface-variant font-bold py-4 rounded-full hover:bg-surface-container-highest transition-colors uppercase tracking-widest text-sm"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
