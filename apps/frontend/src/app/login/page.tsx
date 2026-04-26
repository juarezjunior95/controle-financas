"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { SignIn, SignUp } from "@clerk/nextjs";

export default function LoginPage() {
  const router = useRouter();
  const { isLoading: authLoading } = useAuth();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  return (
    <div className="font-body text-on-surface min-h-[100dvh] flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full -z-10"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-tertiary/5 blur-[100px] rounded-full -z-10"></div>

      <main className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-8 items-center z-10">
        {/* Branding & Editorial Section */}
        <div className="hidden lg:flex flex-col space-y-8 pr-12">
          <div>
            <span className="text-xl font-black text-on-surface tracking-tighter font-headline">Finança Pró</span>
            <h1 className="text-5xl font-bold font-headline leading-tight mt-6 tracking-tight">
              Sua liberdade <br />
              <span className="text-primary">financeira</span> começa <br />
              no silêncio.
            </h1>
            <p className="text-on-surface-variant text-lg mt-6 max-w-md font-body leading-relaxed">
              Acesse o ecossistema financeiro mais seguro e minimalista do mercado. Controle seu patrimônio sem ruídos.
            </p>
          </div>
          
          {/* Bento-style Feature Preview */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-surface-container-low p-6 rounded-xl space-y-3">
              <span className="material-symbols-outlined text-primary" translate="no">lock</span>
              <h3 className="font-bold font-headline text-on-surface">Segurança Total</h3>
              <p className="text-sm text-on-surface-variant">Criptografia de ponta a ponta em cada transação.</p>
            </div>
            <div className="bg-surface-container-highest p-6 rounded-xl space-y-3">
              <span className="material-symbols-outlined text-tertiary" translate="no">insights</span>
              <h3 className="font-bold font-headline text-on-surface">Análise Pura</h3>
              <p className="text-sm text-on-surface-variant">Dashboards limpos para decisões inteligentes.</p>
            </div>
          </div>
        </div>

        {/* Auth Card Container */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <div className="bg-surface-container-low p-8 md:p-10 rounded-2xl shadow-[24px_24px_64px_rgba(0,0,0,0.5)] border border-outline-variant/10">
            
            {/* Toggle Switches */}
            <div className="flex p-1 bg-background rounded-full mb-10">
              <button
                onClick={() => { setIsLoginMode(true); setErrorMessage(null); }}
                className={`flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-all ${
                  isLoginMode
                    ? "bg-gradient-to-br from-[#b0c6ff] to-[#0058cb] text-on-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Entrar
              </button>
              <button
                onClick={() => { setIsLoginMode(false); setErrorMessage(null); }}
                className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
                  !isLoginMode
                    ? "bg-gradient-to-br from-[#b0c6ff] to-[#0058cb] text-on-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Criar conta
              </button>
            </div>
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold font-headline text-on-surface">
                {isLoginMode ? "Bem-vindo de volta" : "Crie sua conta"}
              </h2>
              <p className="text-on-surface-variant text-sm mt-2">
                {isLoginMode
                  ? "Acesse sua conta para gerenciar seus ativos."
                  : "Comece a controlar suas finanças agora."}
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-400 text-sm font-medium">{errorMessage}</p>
              </div>
            )}
            
            {/* Auth Form — Clerk Integration */}
            <div className="w-full clerk-theme-provider">
              {isLoginMode ? (
                <SignIn 
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "bg-transparent shadow-none border-none p-0",
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                      socialButtonsBlockButton: "bg-surface-container-highest border-none text-on-surface hover:bg-surface-container-high transition-all rounded-xl py-3",
                      formButtonPrimary: "bg-gradient-to-br from-[#b0c6ff] to-[#0058cb] hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all rounded-full py-4 text-sm font-bold",
                      formFieldInput: "bg-surface-container-highest border-none rounded-xl py-4 text-on-surface",
                      footerAction: "hidden",
                      dividerRow: "hidden",
                      formFieldLabel: "text-xs font-semibold text-on-surface-variant uppercase tracking-wider ml-1 mb-1",
                      identityPreviewText: "text-on-surface",
                      identityPreviewEditButton: "text-primary"
                    }
                  }}
                  routing="hash"
                  afterSignInUrl="/dashboard"
                />
              ) : (
                <SignUp 
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "bg-transparent shadow-none border-none p-0",
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                      socialButtonsBlockButton: "bg-surface-container-highest border-none text-on-surface hover:bg-surface-container-high transition-all rounded-xl py-3",
                      formButtonPrimary: "bg-gradient-to-br from-[#b0c6ff] to-[#0058cb] hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all rounded-full py-4 text-sm font-bold",
                      formFieldInput: "bg-surface-container-highest border-none rounded-xl py-4 text-on-surface",
                      footerAction: "hidden",
                      dividerRow: "hidden",
                      formFieldLabel: "text-xs font-semibold text-on-surface-variant uppercase tracking-wider ml-1 mb-1"
                    }
                  }}
                  routing="hash"
                  afterSignUpUrl="/dashboard"
                />
              )}
            </div>
            
            <p className="text-center text-on-surface-variant text-xs mt-10">
              Ao continuar, você concorda com nossos <br />
              <Link className="underline hover:text-primary transition-colors" href="#">Termos de Serviço</Link> e <Link className="underline hover:text-primary transition-colors" href="#">Política de Privacidade</Link>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
