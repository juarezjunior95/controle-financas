"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { fetchAPI } from "@/lib/api";
import { GoalsList, GoalsEmptyState, GoalsLoading, GoalsError } from "@/components/goals/GoalsComponents";
import { Toast, useToast } from "@/components/ui/Toast";
import Link from "next/link";
import { Plus } from "lucide-react";

interface Goal {
  id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  progress: number;
  status: 'active' | 'completed' | 'cancelled';
  deadline?: string;
  icon?: string;
  color?: string;
}

export default function GoalsPage() {
  const { token, isAuthenticated } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { toast, showToast } = useToast();

  const loadGoals = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    const res = await fetchAPI<Goal[]>('/goals', { token });

    if (res.error) {
      setError(res.error.message || "Erro ao carregar metas");
    } else {
      setGoals(res.data || []);
    }
    setIsLoading(false);
  }, [token]);

  useEffect(() => {
    if (isAuthenticated && token) {
      loadGoals();
    }
  }, [isAuthenticated, token, loadGoals]);

  const handleUpdateProgress = async (id: string, amount: number, mode: 'increment' | 'set' = 'increment') => {
    if (!token) return;

    setIsUpdating(true);
    const res = await fetchAPI(`/goals/${id}/progress`, {
      method: 'PATCH',
      token,
      body: JSON.stringify({ amount, mode }),
    });
    setIsUpdating(false);

    if (res.error) {
      showToast(res.error.message || "Erro ao atualizar progresso", "error");
    } else {
      showToast("Progresso atualizado com sucesso!", "success");
      loadGoals();
    }
  };

  const handleUpdateGoal = async (id: string, data: Partial<Goal>) => {
    if (!token) return;

    setIsUpdating(true);
    const res = await fetchAPI(`/goals/${id}`, {
      method: 'PUT',
      token,
      body: JSON.stringify(data),
    });
    setIsUpdating(false);

    if (res.error) {
      showToast(res.error.message || "Erro ao atualizar meta", "error");
    } else {
      showToast("Meta atualizada com sucesso!", "success");
      loadGoals();
    }
  };

  const handleDeleteGoal = async (id: string) => {
    if (!token) return;

    setIsDeleting(true);
    const res = await fetchAPI(`/goals/${id}`, {
      method: 'DELETE',
      token,
    });
    setIsDeleting(false);

    if (res.error) {
      showToast(res.error.message || "Erro ao excluir meta", "error");
    } else {
      showToast("Meta excluída com sucesso.", "success");
      loadGoals();
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full h-full">
      <Toast toast={toast} />

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
        <div>
          <h2 className="text-3xl font-bold font-dm-sans tracking-tight text-[#b0c6ff] mb-2">
            Metas Financeiras
          </h2>
          <p className="text-on-surface-variant font-source-sans-3 text-lg opacity-80">
            Sua jornada para a liberdade financeira.
          </p>
        </div>
        <Link
          href="/new-goal"
          className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold shadow-lg shadow-primary/20 flex items-center gap-2 self-start md:self-auto hover:opacity-90 active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-primary outline-none"
        >
          <Plus className="w-5 h-5" />
          Nova Meta
        </Link>
      </header>

      {/* Main Content Area */}
      <div className="w-full">
        {isLoading ? (
          <GoalsLoading />
        ) : error ? (
          <GoalsError message={error} onRetry={loadGoals} />
        ) : goals.length === 0 ? (
          <GoalsEmptyState />
        ) : (
          <GoalsList
            goals={goals}
            onUpdateProgress={handleUpdateProgress}
            onUpdateGoal={handleUpdateGoal}
            onDeleteGoal={handleDeleteGoal}
            isUpdating={isUpdating}
            isDeleting={isDeleting}
          />
        )}
      </div>
    </div>
  );
}
