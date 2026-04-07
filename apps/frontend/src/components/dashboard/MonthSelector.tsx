"use client";

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

interface MonthSelectorProps {
  month: number;
  year: number;
  onChange: (month: number, year: number) => void;
}

export function MonthSelector({ month, year, onChange }: MonthSelectorProps) {
  const handlePrevious = () => {
    if (month === 0) {
      onChange(11, year - 1);
    } else {
      onChange(month - 1, year);
    }
  };

  const handleNext = () => {
    const now = new Date();
    const isCurrentMonth = month === now.getMonth() && year === now.getFullYear();
    
    if (isCurrentMonth) return; // Não permite ir para o futuro
    
    if (month === 11) {
      onChange(0, year + 1);
    } else {
      onChange(month + 1, year);
    }
  };

  const now = new Date();
  const isCurrentMonth = month === now.getMonth() && year === now.getFullYear();

  return (
    <div className="flex items-center gap-2 text-[#c3c6d6] font-source-sans-3">
      <button
        onClick={handlePrevious}
        className="p-1 rounded-full hover:bg-surface-container-high transition-colors"
      >
        <span className="material-symbols-outlined text-sm">chevron_left</span>
      </button>
      
      <div className="flex items-center gap-2 min-w-[160px] justify-center">
        <span className="material-symbols-outlined text-sm" translate="no">
          calendar_month
        </span>
        <span className="text-sm font-medium">
          {MONTHS[month]} {year}
        </span>
      </div>
      
      <button
        onClick={handleNext}
        disabled={isCurrentMonth}
        className={`p-1 rounded-full transition-colors ${
          isCurrentMonth 
            ? "opacity-30 cursor-not-allowed" 
            : "hover:bg-surface-container-high"
        }`}
      >
        <span className="material-symbols-outlined text-sm">chevron_right</span>
      </button>
    </div>
  );
}
