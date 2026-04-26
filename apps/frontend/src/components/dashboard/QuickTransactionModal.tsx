"use client";

import { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { parseCurrency, getCategories } from "@/lib/storage";
import { useAuth } from "@/lib/auth";
import { fetchAPI } from "@/lib/api";

interface ApiCategory {
  id: string;
  name: string;
  isSystem: boolean;
  icon?: string;
  color?: string;
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: {
    type: "income" | "expense";
    amount: number;
    category: string;
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
  const { token } = useAuth();

  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const getLocalDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [date, setDate] = useState(getLocalDate());

  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Busca categorias da API; cai no localStorage como fallback
  useEffect(() => {
    if (!isOpen) return;

    async function load() {
      setLoadingCategories(true);
      if (token) {
        const { data } = await fetchAPI<ApiCategory[]>("/categories", { token });
        if (data && data.length > 0) {
          setCategories(data);
          setLoadingCategories(false);
          return;
        }
      }
      // Fallback: categorias locais
      const local = getCategories().map((c) => ({ id: c.id, name: c.name, isSystem: c.isDefault }));
      setCategories(local);
      setLoadingCategories(false);
    }

    load();
  }, [isOpen, token]);

  // Pré-preenche ao editar
  useEffect(() => {
    if (initialData && isOpen) {
      setType(initialData.type);
      setAmount(
        initialData.amount
          .toLocaleString("pt-BR", { minimumFractionDigits: 2 })
          .replace("R$", "")
          .trim()
      );
      setDescription(initialData.description || "");
      setDate(initialData.date.split("T")[0]);
      setCategoryName(initialData.category.name);
    } else if (isOpen) {
      setType("expense");
      setAmount("");
      setDescription("");
      setCategoryName("");
      setDate(getLocalDate());
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const numericAmount = parseCurrency(amount);
    if (numericAmount <= 0) {
      alert("Digite um valor válido");
      return;
    }
    if (!categoryName) {
      alert("Selecione uma categoria");
      return;
    }

    onSave({ type, amount: numericAmount, category: categoryName, description, date });
    onClose();
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value.replace(/[^\d,]/g, ""));
  };

  // Mostra todas as categorias cadastradas
  const displayCategories = categories;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Editar Transação" : "Nova Transação"} maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Tipo */}
        <div className="flex p-1 bg-background rounded-full" role="group" aria-label="Tipo de transação">
          <button
            type="button"
            onClick={() => { setType("expense"); setCategoryName(""); }}
            aria-pressed={type === "expense"}
            className={`flex-1 py-2.5 px-4 rounded-full text-sm font-semibold transition-all flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-primary outline-none ${
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
            onClick={() => { setType("income"); setCategoryName(""); }}
            aria-pressed={type === "income"}
            className={`flex-1 py-2.5 px-4 rounded-full text-sm font-semibold transition-all flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-primary outline-none ${
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
          <label htmlFor="qt-amount" className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Valor</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">R$</span>
            <input
              id="qt-amount"
              type="text"
              value={amount}
              onChange={handleAmountChange}
              className={`w-full bg-surface-container-highest border-none rounded-xl py-2.5 pl-12 pr-4 text-xl font-bold focus:ring-2 transition-all text-right outline-none ${
                type === "income" ? "text-green-400 focus:ring-green-500" : "text-red-400 focus:ring-red-500"
              }`}
              placeholder="0,00"
              autoFocus
            />
          </div>
        </div>

        {/* Categoria */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Categoria</label>
          {loadingCategories ? (
            <div className="flex items-center gap-2 text-on-surface-variant text-sm py-2">
              <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
              Carregando categorias...
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-1.5">
              {displayCategories.map((cat) => {
                const icon = cat.icon || 'label';
                const color = cat.color || '#b0c6ff';
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryName(cat.name)}
                    aria-pressed={categoryName === cat.name}
                    className={`p-1.5 rounded-xl flex flex-col items-center gap-1 transition-all focus-visible:ring-2 focus-visible:ring-primary outline-none ${
                      categoryName === cat.name
                        ? "bg-primary/20 ring-2 ring-primary shadow-lg scale-105"
                        : "bg-surface-container-highest hover:bg-surface-container-high hover:scale-105"
                    }`}
                  >
                    <span className="material-symbols-outlined" style={{ color: color }}>
                      {icon}
                    </span>
                    <span className="text-[10px] text-on-surface-variant font-medium truncate w-full text-center">
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Descrição */}
        <div className="space-y-1.5">
          <label htmlFor="qt-description" className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
            Descrição (opcional)
          </label>
          <input
            id="qt-description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-surface-container-highest border-none rounded-xl py-2 px-4 text-sm text-on-surface focus:ring-2 focus:ring-primary transition-all outline-none"
            placeholder="Ex: Supermercado, Uber, etc."
          />
        </div>

        {/* Data */}
        <div className="space-y-1.5">
          <label htmlFor="qt-date" className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Data</label>
          <input
            id="qt-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-surface-container-highest border-none rounded-xl py-2 px-4 text-sm text-on-surface focus:ring-2 focus:ring-primary transition-all outline-none"
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
            <span className="material-symbols-outlined text-lg">{initialData ? "save" : "add"}</span>
            {initialData ? "Salvar Alterações" : "Adicionar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
