"use client";

import { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { formatNumber, parseCurrency } from "@/lib/storage";

interface EditBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
  onSave: (value: number) => void;
}

export function EditBalanceModal({
  isOpen,
  onClose,
  currentBalance,
  onSave,
}: EditBalanceModalProps) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (isOpen) {
      setValue(formatNumber(currentBalance));
    }
  }, [isOpen, currentBalance]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericValue = parseCurrency(value);
    onSave(numericValue);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d,]/g, "");
    setValue(raw);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Saldo Inicial">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="edit-balance" className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
            Saldo Inicial
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">
              R$
            </span>
            <input
              id="edit-balance"
              type="text"
              value={value}
              onChange={handleChange}
              className="w-full bg-surface-container-highest border-none rounded-xl py-4 pl-12 pr-4 text-on-surface text-2xl font-bold focus:ring-2 focus:ring-primary transition-all text-right outline-none"
              placeholder="0,00"
              autoFocus
            />
          </div>
          <p className="text-xs text-on-surface-variant">
            Este é o valor que você tinha antes de começar a usar o app.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-full border border-outline-variant/20 text-on-surface-variant font-medium hover:bg-surface-container-high transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 py-3 px-4 rounded-full bg-primary text-on-primary font-bold hover:bg-primary/90 transition-colors"
          >
            Salvar
          </button>
        </div>
      </form>
    </Modal>
  );
}
