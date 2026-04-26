"use client";

import { useState, useEffect } from "react";
import { fetchAPI } from "@/lib/api";
import { useAuth } from "@/lib/auth";

interface FinancialInsightsCardProps {
  className?: string;
}

export function FinancialInsightsCard({ className }: FinancialInsightsCardProps) {
  const { token } = useAuth();
  const [insights, setInsights] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadInsights() {
      if (!token) return;
      
      setIsLoading(true);
      setError(null);
      
      const { data, error: apiError } = await fetchAPI<string[]>("/ai/insights", { token });
      
      if (apiError) {
        setError(apiError.message);
      } else if (data) {
        setInsights(data);
      }
      
      setIsLoading(false);
    }

    loadInsights();
  }, [token]);

  if (isLoading && insights.length === 0) {
    return (
      <div className={`bg-surface-container-low p-8 rounded-xl animate-pulse ${className}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/20 rounded-xl" />
          <div className="h-6 w-48 bg-surface-container-high rounded" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 w-full bg-surface-container-high rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-surface-container-low p-8 rounded-xl border border-error/20 ${className}`}>
        <div className="flex items-center gap-3 mb-4 text-error">
          <span className="material-symbols-outlined">error</span>
          <h4 className="font-dm-sans text-lg font-bold">Insights de IA</h4>
        </div>
        <p className="text-sm text-on-surface-variant mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="text-primary text-sm font-bold hover:underline flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">refresh</span>
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-[#b0c6ff]/15 via-transparent to-transparent p-8 rounded-xl border border-[#b0c6ff]/10 shadow-2xl relative overflow-hidden group transition-all hover:shadow-[#b0c6ff]/5 ${className}`}>
      {/* Decorative AI Glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#b0c6ff]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#b0c6ff]/15 transition-all duration-700" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-4 mb-8 relative z-10">
        <div className="w-12 h-12 bg-gradient-to-tr from-primary to-[#82b1ff] rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-on-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            smart_toy
          </span>
        </div>
        <div>
          <h4 className="font-dm-sans text-xl font-bold text-[#e5e2e1] tracking-tight">Insights de IA</h4>
          <p className="text-[10px] uppercase tracking-widest text-[#b0c6ff] font-bold">Powered by Gemini</p>
        </div>
      </div>

      <div className="space-y-6 relative z-10">
        {insights.length > 0 ? (
          insights.map((insight, index) => (
            <div key={index} className="flex gap-4 group/item">
              <div className="mt-1.5 flex-shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(176,198,255,0.8)] group-hover/item:scale-125 transition-transform" />
              </div>
              <p className="text-[#c3c6d6] text-sm leading-relaxed font-source-sans-3 group-hover/item:text-[#e5e2e1] transition-colors">
                {insight}
              </p>
            </div>
          ))
        ) : (
          <p className="text-[#c3c6d6] text-sm italic">Nenhum insight disponível no momento.</p>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-[#b0c6ff]/10 flex justify-between items-center relative z-10">
        <span className="text-[10px] text-[#c3c6d6]/50 font-source-sans-3 italic">
          Análise baseada nos últimos 30 dias
        </span>
        <div className="flex gap-1">
          <div className="w-1 h-1 rounded-full bg-primary/30 animate-pulse" />
          <div className="w-1 h-1 rounded-full bg-primary/30 animate-pulse [animation-delay:200ms]" />
          <div className="w-1 h-1 rounded-full bg-primary/30 animate-pulse [animation-delay:400ms]" />
        </div>
      </div>
    </div>
  );
}
