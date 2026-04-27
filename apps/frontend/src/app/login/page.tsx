"use client";

import Link from "next/link";
import { useState } from "react";
import { SignIn, SignUp } from "@clerk/nextjs";

// Appearance compartilhada entre SignIn e SignUp
const clerkAppearance = {
  variables: {
    colorBackground: "transparent",
    colorInputBackground: "#353534",
    colorInputText: "#e5e2e1",
    colorText: "#e5e2e1",
    colorTextSecondary: "#c3c6d6",
    colorPrimary: "#b0c6ff",
    colorDanger: "#ffb4ab",
    borderRadius: "0.75rem",
    fontFamily: "var(--font-source-sans)",
    fontSize: "14px",
    spacingUnit: "18px",
  },
  elements: {
    rootBox: "w-full",
    card: "bg-transparent shadow-none border-none p-0 m-0",
    headerTitle: "hidden",
    headerSubtitle: "hidden",
    socialButtonsBlockButton:
      "bg-surface-container-highest border border-outline-variant/20 text-on-surface hover:bg-surface-container-high transition-all rounded-xl",
    socialButtonsBlockButtonText: "font-semibold text-sm",
    formButtonPrimary:
      "bg-gradient-to-br from-[#b0c6ff] to-[#0058cb] hover:opacity-90 hover:scale-[1.01] active:scale-[0.98] transition-all rounded-full font-bold normal-case shadow-lg shadow-[#0058cb]/20",
    formFieldLabel:
      "text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1",
    formFieldInput:
      "bg-surface-container-highest text-on-surface rounded-xl border border-outline-variant/20 focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all",
    formFieldErrorText: "text-red-400 text-xs mt-1",
    footerAction: "hidden",
    footer: "hidden",
    dividerRow: "hidden",
    identityPreviewText: "text-on-surface",
    identityPreviewEditButton: "text-primary hover:text-primary/80",
    alertText: "text-sm",
    formResendCodeLink: "text-primary hover:text-primary/80 text-sm",
    otpCodeFieldInput:
      "bg-surface-container-highest border border-outline-variant/20 text-on-surface rounded-xl text-center text-lg font-bold",
  },
};

export default function LoginPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);

  return (
    <div className="font-body text-on-surface min-h-[100dvh] flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Background blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full -z-10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-tertiary/5 blur-[100px] rounded-full -z-10" />

      <main className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">

        {/* ── Branding ── */}
        <div className="hidden lg:flex flex-col space-y-8 pr-8">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-lg" translate="no" style={{ fontVariationSettings: "'FILL' 1" }}>
                  account_balance_wallet
                </span>
              </div>
              <span className="text-2xl font-black text-on-surface tracking-tighter font-headline">
                Finança Pró
              </span>
            </div>

            <h1 className="text-5xl font-bold font-headline leading-tight tracking-tight">
              Sua liberdade <br />
              <span className="text-primary">financeira</span> começa <br />
              no silêncio.
            </h1>
            <p className="text-on-surface-variant text-lg mt-6 max-w-md font-body leading-relaxed">
              Acesse o ecossistema financeiro mais seguro e minimalista do
              mercado. Controle seu patrimônio sem ruídos.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-low p-6 rounded-xl space-y-3 border border-outline-variant/10">
              <span className="material-symbols-outlined text-primary" translate="no">lock</span>
              <h3 className="font-bold font-headline text-on-surface">Segurança Total</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Criptografia de ponta a ponta em cada transação.
              </p>
            </div>
            <div className="bg-surface-container-highest p-6 rounded-xl space-y-3 border border-outline-variant/10">
              <span className="material-symbols-outlined text-tertiary" translate="no">insights</span>
              <h3 className="font-bold font-headline text-on-surface">Análise Pura</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Dashboards limpos para decisões inteligentes.
              </p>
            </div>
          </div>
        </div>

        {/* ── Auth Card ── */}
        <div className="w-full max-w-lg mx-auto lg:mx-0">
          <div className="bg-surface-container-low p-10 md:p-12 rounded-2xl border border-outline-variant/10 shadow-[0_32px_64px_rgba(0,0,0,0.5)]">

            {/* Toggle */}
            <div className="flex p-1 bg-surface-container-highest rounded-full mb-10">
              <button
                onClick={() => setIsLoginMode(true)}
                className={`flex-1 py-2.5 px-4 rounded-full text-sm font-semibold transition-all duration-200 ${
                  isLoginMode
                    ? "bg-gradient-to-br from-[#b0c6ff] to-[#0058cb] text-[#001945] shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Entrar
              </button>
              <button
                onClick={() => setIsLoginMode(false)}
                className={`flex-1 py-2.5 px-4 rounded-full text-sm font-semibold transition-all duration-200 ${
                  !isLoginMode
                    ? "bg-gradient-to-br from-[#b0c6ff] to-[#0058cb] text-[#001945] shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Criar conta
              </button>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold font-headline text-on-surface">
                {isLoginMode ? "Bem-vindo de volta" : "Crie sua conta"}
              </h2>
              <p className="text-on-surface-variant text-sm mt-2">
                {isLoginMode
                  ? "Acesse sua conta para gerenciar seus ativos."
                  : "Comece a controlar suas finanças agora."}
              </p>
            </div>

            {/* Clerk form */}
            <div className="w-full">
              {isLoginMode ? (
                <SignIn
                  appearance={clerkAppearance}
                  routing="hash"
                  afterSignInUrl="/dashboard"
                />
              ) : (
                <SignUp
                  appearance={clerkAppearance}
                  routing="hash"
                  afterSignUpUrl="/dashboard"
                />
              )}
            </div>

            <p className="text-center text-on-surface-variant text-xs mt-8">
              Ao continuar, você concorda com nossos{" "}
              <Link
                className="underline hover:text-primary transition-colors"
                href="#"
              >
                Termos de Serviço
              </Link>{" "}
              e{" "}
              <Link
                className="underline hover:text-primary transition-colors"
                href="#"
              >
                Política de Privacidade
              </Link>
              .
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
