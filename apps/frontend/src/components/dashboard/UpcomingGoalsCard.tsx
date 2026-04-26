"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchAPI } from "@/lib/api";
import { useAuth } from "@/lib/auth";

interface Goal {
  id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  progress: number;
  status: string;
  deadline?: string;
  icon?: string;
  color?: string;
}

export function UpcomingGoalsCard() {
  const { token } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadGoals() {
      if (!token) return;
      
      setIsLoading(true);
      setError(null);
      
      const { data, error: apiError } = await fetchAPI<Goal[]>("/goals", { token });
      
      if (apiError) {
        setError(apiError.message);
      } else if (data) {
        setGoals(data);
      }
      
      setIsLoading(false);
    }

    loadGoals();
  }, [token]);

  const displayedGoals = goals
    .filter(g => g.status === 'active')
    .slice(0, 3);

  if (isLoading) {
    return (
      <div className="bg-[#1c1b1b] p-8 rounded-2xl border border-[#424654]/10 animate-pulse min-h-[340px]">
        <div className="h-6 w-32 bg-[#252424] rounded mb-8" />
        <div className="space-y-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-3">
              <div className="flex justify-between">
                <div className="h-4 w-24 bg-[#252424] rounded" />
                <div className="h-4 w-8 bg-[#252424] rounded" />
              </div>
              <div className="h-2 w-full bg-[#252424] rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#1c1b1b] p-8 rounded-2xl border border-error/20 min-h-[340px]">
        <h4 className="font-dm-sans text-lg font-bold text-[#e5e2e1] mb-4">Próximas Metas</h4>
        <p className="text-sm text-on-surface-variant mb-4">Erro ao carregar metas: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1c1b1b] p-8 rounded-2xl border border-[#424654]/10 flex flex-col hover:bg-[#252424] transition-all group min-h-[340px]">
      <div className="flex justify-between items-center mb-8">
        <h4 className="font-dm-sans text-lg font-bold text-[#e5e2e1]">Próximas Metas</h4>
        <span className="material-symbols-outlined text-[#b0c6ff] text-xl" translate="no">
          stars
        </span>
      </div>

      <div className="flex-1 space-y-8 mb-8">
        {displayedGoals.length > 0 ? (
          displayedGoals.map((goal) => (
            <div key={goal.id} className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-[#e5e2e1] truncate max-w-[150px]">{goal.title}</span>
                <span className="text-xs font-bold text-[#c3c6d6]">{Math.round(goal.progress)}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#252424] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(goal.progress, 100)}%`,
                    backgroundColor: goal.color || "#b0c6ff",
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-4 text-center h-full">
            <span className="material-symbols-outlined text-4xl text-[#424654] mb-3">flag</span>
            <p className="text-[#c3c6d6] text-xs">Nenhuma meta em andamento</p>
          </div>
        )}
      </div>

      <Link
        href="/goals"
        className="mt-auto text-[#b0c6ff] text-sm font-bold flex items-center justify-center gap-2 hover:underline group/link"
      >
        Ver metas financeiras
        <span className="material-symbols-outlined text-sm transition-transform group-hover/link:translate-x-1" translate="no">
          arrow_forward
        </span>
      </Link>
    </div>
  );
}
