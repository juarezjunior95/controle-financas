"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const { login, register, isLoading: authLoading } = useAuth();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      let result;

      if (isLoginMode) {
        result = await login(email, password);
      } else {
        result = await register(email, password, firstName, lastName);
      }

      if (result.success) {
        router.push("/dashboard");
      } else {
        setErrorMessage(result.error || "Ocorreu um erro. Tente novamente.");
      }
    } catch {
      setErrorMessage("Erro de conexão com o servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-body text-on-surface min-h-[100dvh] flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full -z-10"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-tertiary/5 blur-[100px] rounded-full -z-10"></div>

      <main className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-8 items-center z-10">
        {/* Branding & Editorial Section */}
        <div className="hidden lg:flex flex-col space-y-8 pr-12">
          <div>
            <span className="text-xl font-black text-on-surface tracking-tighter font-headline">Vault</span>
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
            
            {/* Auth Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Name fields — only in register mode */}
              {!isLoginMode && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider ml-1">Nome</label>
                    <input
                      className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-4 text-on-surface focus:ring-2 focus:ring-primary transition-all placeholder:text-outline/50"
                      placeholder="João"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider ml-1">Sobrenome</label>
                    <input
                      className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-4 text-on-surface focus:ring-2 focus:ring-primary transition-all placeholder:text-outline/50"
                      placeholder="Silva"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider ml-1">E-mail</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" translate="no">mail</span>
                  <input
                    className="w-full bg-surface-container-highest border-none rounded-xl py-4 pl-12 pr-4 text-on-surface focus:ring-2 focus:ring-primary transition-all placeholder:text-outline/50"
                    placeholder="nome@exemplo.com"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Senha</label>
                  {isLoginMode && (
                    <Link href="#" className="text-xs font-medium text-primary hover:text-on-primary-container transition-colors">Esqueceu a senha?</Link>
                  )}
                </div>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" translate="no">key</span>
                  <input
                    className="w-full bg-surface-container-highest border-none rounded-xl py-4 pl-12 pr-12 text-on-surface focus:ring-2 focus:ring-primary transition-all placeholder:text-outline/50"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined text-sm" translate="no">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>
              
              <button
                className="w-full bg-gradient-to-br from-[#b0c6ff] to-[#0058cb] text-on-primary font-bold py-4 rounded-full shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                type="submit"
                disabled={isSubmitting || authLoading}
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined text-sm animate-spin" translate="no">progress_activity</span>
                    {isLoginMode ? "Entrando..." : "Criando conta..."}
                  </>
                ) : (
                  <>
                    {isLoginMode ? "Entrar na Vault" : "Criar minha conta"}
                    <span className="material-symbols-outlined text-sm" translate="no">arrow_forward</span>
                  </>
                )}
              </button>
            </form>
            
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
