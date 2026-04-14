"use client";

import { useState } from "react";
import { Modal } from "../ui/Modal";
import { parseCurrency, DEFAULT_CATEGORIES } from "@/lib/storage";
import { fetchAPI } from "@/lib/api";
import { useAuth } from "@/lib/auth";

interface QuickTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function QuickTransactionModal({
  isOpen,
  onClose,
  onSave,
}: QuickTransactionModalProps) {
  const { token } = useAuth();
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const categories = DEFAULT_CATEGORIES;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const numericAmount = parseCurrency(amount);
    if (numericAmount <= 0) {
      setErrorMsg("Digite um valor válido.");
      return;
    }

    if (!categoryName) {
      setErrorMsg("Selecione uma categoria.");
      return;
    }

    setIsSubmitting(true);

    const { error } = await fetchAPI("/transactions", {
      method: "POST",
      token,
      body: JSON.stringify({
        type,
        amount: numericAmount,
        category: categoryName,
        description,
        date,
      }),
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    // Reset form
    setAmount("");
    setDescription("");
    setCategoryName("");
    setDate(new Date().toISOString().split("T")[0]);
    onSave();
    onClose();
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d,]/g, "");
    setAmount(raw);
  };

  const incomeCategories = categories.filter((c) =>
    ["Salário", "Freelance", "Outros"].includes(c.name)
  );
  const expenseCategories = categories.filter(
    (c) => !["Salário", "Freelance"].includes(c.name)
  );
  const filteredCategories =
    type === "income" ? incomeCategories : expenseCategories;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nova Transação">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Tipo */}
        <div className="flex p-1 bg-background rounded-full">
          <button
            type="button"
            onClick={() => { setType("expense"); setCategoryName(""); }}
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
            onClick={() => { setType("income"); setCategoryName(""); }}
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
              onChange={(e) => setAmount(e.target.value.replace(/[^\d,]/g, ""))}
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
                onClick={() => setCategoryName(cat.name)}
                className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
                  categoryName === cat.name
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

        {/* Erro */}
        {errorMsg && (
          <p className="text-red-400 text-sm text-center">{errorMsg}</p>
        )}

        {/* Botões */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-3 px-4 rounded-full border border-outline-variant/20 text-on-surface-variant font-medium hover:bg-surface-container-high transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 py-3 px-4 rounded-full font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-60 ${
              type === "income"
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            {isSubmitting ? (
              <span className="material-symbols-outlined text-lg animate-spin">
                progress_activity
              </span>
            ) : (
              <span className="material-symbols-outlined text-lg">add</span>
            )}
            {isSubmitting ? "Salvando..." : "Adicionar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
