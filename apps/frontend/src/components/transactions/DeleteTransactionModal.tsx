"use client";

import { Modal } from "@/components/ui/Modal";

interface DeleteTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  transactionData?: {
    description: string;
    amount: number;
    type: "income" | "expense";
  };
}

export function DeleteTransactionModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  transactionData,
}: DeleteTransactionModalProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Excluir Transação" maxWidth="max-w-md">
      <div className="flex flex-col items-center text-center space-y-6 py-2">
        {/* Warning Icon */}
        <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center animate-bounce-subtle">
          <span className="material-symbols-outlined text-4xl text-error" style={{ fontVariationSettings: "'FILL' 1" }}>
            warning
          </span>
        </div>

        <div className="space-y-2">
          <h4 className="text-xl font-bold text-on-surface">Tem certeza disso?</h4>
          <p className="text-on-surface-variant text-sm leading-relaxed max-w-[280px]">
            Esta ação não pode ser desfeita. A transação será removida permanentemente do seu histórico.
          </p>
        </div>

        {transactionData && (
          <div className="w-full bg-surface-container-high rounded-2xl p-4 flex items-center justify-between border border-outline-variant/10">
            <div className="text-left">
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Transação</p>
              <p className="font-bold text-on-surface truncate max-w-[150px]">{transactionData.description}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Valor</p>
              <p className={`font-bold ${transactionData.type === "income" ? "text-green-400" : "text-red-400"}`}>
                {transactionData.type === "income" ? "+" : "-"} {formatCurrency(Math.abs(transactionData.amount))}
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-3 w-full pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3.5 px-4 rounded-full border border-outline-variant/20 text-on-surface-variant font-bold hover:bg-surface-container-highest transition-all disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-3.5 px-4 rounded-full bg-error text-on-error font-bold hover:bg-error/90 transition-all shadow-lg shadow-error/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-on-error/30 border-t-on-error rounded-full animate-spin" />
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">delete_forever</span>
                Excluir
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
