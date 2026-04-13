"use client";

import { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { Category, getCategories, parseCurrency } from "@/lib/storage";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: {
    type: "income" | "expense";
    amount: number;
    categoryId: string;
    description: string;
    date: string;
  }) => void;
  initialData?: {
    id: string;
    type: "income" | "expense";
    amount: number;
    description: string;
    date: string;
    category: {
      name: string;
    };
  };
}

export function TransactionModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: TransactionModalProps) {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [categories] = useState<Category[]>(getCategories());

  useEffect(() => {
    if (initialData && isOpen) {
      setType(initialData.type);
      // Formata o valor de volta para string com vírgula para o input
      setAmount(initialData.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 }).replace('R$', '').trim());
      setDescription(initialData.description || "");
      setDate(new Date(initialData.date).toISOString().split("T")[0]);
      
      // Tenta encontrar a categoria pelo nome para marcar no grid (simplificação temporária)
      const cat = categories.find(c => c.name === initialData.category.name);
      if (cat) setCategoryId(cat.id);
    } else if (isOpen) {
      // Reset para nova transação
      setType("expense");
      setAmount("");
      setDescription("");
      setCategoryId("");
      setDate(new Date().toISOString().split("T")[0]);
    }
  }, [initialData, isOpen, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const numericAmount = parseCurrency(amount);
    if (numericAmount <= 0) {
      alert("Digite um valor válido");
      return;
    }

    if (!categoryId) {
      alert("Selecione uma categoria");
      return;
    }

    onSave({
      type,
      amount: numericAmount,
      categoryId,
      description,
      date,
    });

    onClose();
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d,]/g, "");
    setAmount(raw);
  };

  const filteredCategories = categories.filter(c => {
    const isIncomeCat = ["Salário", "Freelance", "Outros"].includes(c.name);
    return type === "income" ? isIncomeCat : !isIncomeCat;
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Editar Transação" : "Nova Transação"}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Tipo */}
        <div className="flex p-1 bg-background rounded-full">
          <button
            type="button"
            onClick={() => { setType("expense"); setCategoryId(""); }}
            className={`flex-1 py-2.5 px-4 rounded-full text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              type === "expense"
                ? "bg-red-500/20 text-red-400"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-lg">trending_down</span>
            Despesa
          </button>
          <button
            type="button"
            onClick={() => { setType("income"); setCategoryId(""); }}
            className={`flex-1 py-2.5 px-4 rounded-full text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              type === "income"
                ? "bg-green-500/20 text-green-400"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-lg">trending_up</span>
            Receita
          </button>
        </div>

        {/* Valor */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
            Valor
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">
              R$
            </span>
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              className={`w-full bg-surface-container-highest border-none rounded-xl py-4 pl-12 pr-4 text-2xl font-bold focus:ring-2 transition-all text-right ${
                type === "income" 
                  ? "text-green-400 focus:ring-green-500" 
                  : "text-red-400 focus:ring-red-500"
              }`}
              placeholder="0,00"
              autoFocus
            />
          </div>
        </div>

        {/* Categoria */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
            Categoria
          </label>
          <div className="grid grid-cols-3 gap-2">
            {filteredCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryId(cat.id)}
                className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
                  categoryId === cat.id
                    ? "bg-primary/20 ring-2 ring-primary"
                    : "bg-surface-container-highest hover:bg-surface-container-high"
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ color: cat.color }}
                >
                  {cat.icon}
                </span>
                <span className="text-[10px] text-on-surface-variant truncate w-full text-center">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Descrição */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
            Descrição (opcional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-surface-container-highest border-none rounded-xl py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary transition-all"
            placeholder="Ex: Supermercado, Uber, etc."
          />
        </div>

        {/* Data */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
            Data
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-surface-container-highest border-none rounded-xl py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary transition-all"
          />
        </div>

        {/* Botões */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-full border border-outline-variant/20 text-on-surface-variant font-medium hover:bg-surface-container-high transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className={`flex-1 py-3 px-4 rounded-full font-bold transition-colors flex items-center justify-center gap-2 ${
              type === "income"
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            <span className="material-symbols-outlined text-lg">
              {initialData ? "save" : "add"}
            </span>
            {initialData ? "Salvar Alterações" : "Adicionar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
