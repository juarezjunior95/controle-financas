"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const HELP_SECTIONS = [
  {
    id: "dashboard",
    icon: "dashboard",
    title: "Dashboard e Resumo",
    description: "Entenda como funciona sua visão geral financeira.",
    content: (
      <div className="space-y-4">
        <p>O Dashboard é o coração do seu controle financeiro. Nele você encontra:</p>
        <ul className="list-disc pl-5 space-y-2 text-on-surface-variant">
          <li><strong>Saldo Atual:</strong> Representa o valor total acumulado em todas as suas contas.</li>
          <li><strong>Receitas e Despesas:</strong> Valores totais de entradas e saídas no mês selecionado.</li>
          <li><strong>Balanço Mensal:</strong> A diferença entre o que você ganhou e gastou no mês.</li>
          <li><strong>Gastos por Categoria:</strong> Um gráfico interativo para visualizar onde você está gastando mais.</li>
        </ul>
        <div className="p-4 bg-primary/10 border-l-4 border-primary rounded-r-lg mt-4">
          <p className="text-sm italic text-primary">
            Dica: Use o seletor de mês no topo da página para navegar entre diferentes períodos e comparar sua evolução.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "transactions",
    icon: "account_balance_wallet",
    title: "Gerenciando Transações",
    description: "Saiba como registrar e organizar seus lançamentos.",
    content: (
      <div className="space-y-4">
        <p>Manter seus registros atualizados é fundamental para um bom controle.</p>
        <div className="space-y-3">
          <h4 className="font-bold text-on-surface">Como adicionar um lançamento:</h4>
          <p className="text-sm">Clique no botão <span className="text-primary font-bold">"Novo Lançamento"</span> no sidebar ou no dashboard. Preencha o valor, descrição, categoria e a data da transação.</p>
          
          <h4 className="font-bold text-on-surface">Tipos de Lançamento:</h4>
          <ul className="list-disc pl-5 space-y-2 text-on-surface-variant">
            <li><strong>Receita:</strong> Dinheiro que entra (salário, rendimentos, etc).</li>
            <li><strong>Despesa:</strong> Dinheiro que sai (contas, lazer, compras).</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: "categories",
    icon: "pie_chart",
    title: "Categorias e Organização",
    description: "Organize suas finanças para uma melhor análise.",
    content: (
      <div className="space-y-4">
        <p>As categorias permitem que você entenda exatamente para onde seu dinheiro está indo.</p>
        <ul className="list-disc pl-5 space-y-2 text-on-surface-variant">
          <li><strong>Personalização:</strong> Você pode criar categorias com cores e ícones específicos.</li>
          <li><strong>Fluxo de Caixa:</strong> Ao criar uma categoria, você pode definir se ela deve aparecer nos cálculos de fluxo de caixa do dashboard.</li>
          <li><strong>Análise Mensal:</strong> Na tela de categorias, você vê o saldo líquido de cada uma (Receitas - Despesas) para aquele mês.</li>
        </ul>
      </div>
    ),
  },
  {
    id: "goals",
    icon: "flag",
    title: "Metas Financeiras",
    description: "Planeje e alcance seus objetivos de curto e longo prazo.",
    content: (
      <div className="space-y-4">
        <p>As metas ajudam você a economizar para o que realmente importa.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-surface-container-high rounded-xl">
            <h5 className="font-bold mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">add_task</span>
              Criação
            </h5>
            <p className="text-xs text-on-surface-variant">Defina um valor alvo e uma data limite para seu objetivo.</p>
          </div>
          <div className="p-4 bg-surface-container-high rounded-xl">
            <h5 className="font-bold mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">trending_up</span>
              Progresso
            </h5>
            <p className="text-xs text-on-surface-variant">O sistema calcula automaticamente quanto falta para você atingir sua meta baseada em suas economias.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "ai",
    icon: "psychology",
    title: "IA Financeira (Insights)",
    description: "Inteligência artificial analisando seus hábitos financeiros.",
    content: (
      <div className="space-y-4">
        <p>Nosso sistema utiliza IA para fornecer análises personalizadas sobre sua saúde financeira.</p>
        <p className="text-on-surface-variant">
          A IA analisa seus padrões de gastos, identifica tendências e sugere onde você pode economizar. Procure pelo card de <strong>"Insights de IA"</strong> no seu dashboard para ver dicas exclusivas baseadas nos seus dados.
        </p>
        <div className="p-3 bg-tertiary/10 rounded-lg border border-tertiary/20 flex items-start gap-3">
          <span className="material-symbols-outlined text-tertiary">info</span>
          <p className="text-xs text-on-surface-variant">
            Os dados são processados de forma segura e utilizados apenas para gerar suas recomendações personalizadas.
          </p>
        </div>
      </div>
    ),
  },
];

export default function HelpPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<string | null>("dashboard");

  return (
    <div className="max-w-4xl mx-auto animate-in">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-8 group"
      >
        <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
        <span className="font-source-sans-3 font-bold text-sm">Voltar</span>
      </button>

      {/* Header */}
      <div className="mb-12 text-center md:text-left">
        <h1 className="text-4xl font-bold font-dm-sans tracking-tight mb-4 text-[#e5e2e1]">
          Central de Ajuda
        </h1>
        <p className="text-on-surface-variant text-lg font-source-sans-3 max-w-2xl">
          Tudo o que você precisa saber para dominar suas finanças e tirar o máximo proveito do Finança Pró.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-4 space-y-2">
          {HELP_SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full text-left p-4 rounded-xl transition-all flex items-center gap-4 group ${
                activeSection === section.id
                  ? "bg-primary text-on-primary shadow-lg scale-[1.02]"
                  : "bg-surface-container-low text-on-surface hover:bg-surface-container-high"
              }`}
            >
              <span className={`material-symbols-outlined ${
                activeSection === section.id ? "text-on-primary" : "text-primary"
              }`}>
                {section.icon}
              </span>
              <div>
                <h3 className="font-bold text-sm leading-tight">{section.title}</h3>
                <p className={`text-[10px] leading-tight mt-1 opacity-70 ${
                  activeSection === section.id ? "text-on-primary" : "text-on-surface-variant"
                }`}>
                  {section.description}
                </p>
              </div>
              <span className={`material-symbols-outlined ml-auto text-sm transition-transform ${
                activeSection === section.id ? "translate-x-1" : "opacity-0"
              }`}>
                arrow_forward
              </span>
            </button>
          ))}

          <div className="mt-8 p-6 bg-gradient-to-br from-[#b0c6ff]/10 to-transparent rounded-2xl border border-[#b0c6ff]/10">
            <h4 className="font-bold text-sm mb-2">Ainda com dúvidas?</h4>
            <p className="text-xs text-on-surface-variant mb-4">Nossa equipe está pronta para ajudar você.</p>
            <button className="w-full py-2 bg-surface-container-highest text-primary text-xs font-bold rounded-lg hover:bg-surface-container-high transition-colors">
              Falar com Suporte
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-8">
          {activeSection ? (
            <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant/10 min-h-[400px] shadow-editorial">
              {HELP_SECTIONS.find(s => s.id === activeSection) && (
                <div className="animate-in">
                  <div className="flex items-center gap-4 mb-8 pb-6 border-b border-outline-variant/10">
                    <div className="p-3 bg-primary/20 rounded-2xl text-primary">
                      <span className="material-symbols-outlined">
                        {HELP_SECTIONS.find(s => s.id === activeSection)?.icon}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold font-dm-sans">
                      {HELP_SECTIONS.find(s => s.id === activeSection)?.title}
                    </h2>
                  </div>
                  <div className="font-source-sans-3 text-on-surface-variant leading-relaxed">
                    {HELP_SECTIONS.find(s => s.id === activeSection)?.content}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center bg-surface-container-low p-8 rounded-2xl border border-dashed border-outline-variant/30 min-h-[400px]">
              <span className="material-symbols-outlined text-6xl text-outline-variant/30 mb-4">
                ads_click
              </span>
              <p className="text-on-surface-variant text-center">
                Selecione um tópico ao lado para ver os detalhes.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer / Call to action */}
      <div className="mt-16 p-8 bg-surface-container-low rounded-3xl text-center border border-outline-variant/10">
        <h3 className="text-xl font-bold mb-2">Pronto para começar?</h3>
        <p className="text-on-surface-variant mb-8">Agora que você conhece as ferramentas, que tal registrar suas finanças de hoje?</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/dashboard"
            className="px-8 py-3 bg-primary text-on-primary font-bold rounded-full hover:shadow-lg transition-all active:scale-95"
          >
            Ir para Dashboard
          </Link>
          <Link
            href="/new-transaction"
            className="px-8 py-3 bg-surface-container-highest text-on-surface font-bold rounded-full hover:bg-surface-container-high transition-all active:scale-95 border border-outline-variant/20"
          >
            Novo Lançamento
          </Link>
        </div>
      </div>
    </div>
  );
}
