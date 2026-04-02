"use client";

import Link from "next/link";
import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";

export default function ForgotPasswordPage() {
  const { isLoaded, signIn } = useSignIn();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showResetForm, setShowResetForm] = useState(false);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signIn) return;

    setMessage(null);
    setIsSubmitting(true);

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });

      setMessage({
        type: "success",
        text: "Código de verificação enviado para seu email!",
      });
      setShowResetForm(true);
    } catch (error: any) {
      console.error("Erro ao solicitar reset:", error);
      setMessage({
        type: "error",
        text: error?.errors?.[0]?.longMessage || "Erro ao enviar código. Verifique o email.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signIn) return;

    setMessage(null);
    setIsSubmitting(true);

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password: newPassword,
      });

      if (result.status === "complete") {
        setMessage({
          type: "success",
          text: "Senha alterada com sucesso! Redirecionando...",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        setMessage({
          type: "error",
          text: "Não foi possível completar a alteração. Tente novamente.",
        });
      }
    } catch (error: any) {
      console.error("Erro ao resetar senha:", error);
      setMessage({
        type: "error",
        text: error?.errors?.[0]?.longMessage || "Código inválido ou expirado.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-body text-on-surface min-h-[100dvh] flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full -z-10"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-tertiary/5 blur-[100px] rounded-full -z-10"></div>

      <main className="w-full max-w-md mx-auto z-10">
        <div className="bg-surface-container-low p-8 md:p-10 rounded-2xl shadow-[24px_24px_64px_rgba(0,0,0,0.5)] border border-outline-variant/10">
          <Link href="/login" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-8">
            <span className="material-symbols-outlined text-sm" translate="no">arrow_back</span>
            Voltar ao login
          </Link>

          <div className="mb-8">
            <h2 className="text-2xl font-bold font-headline text-on-surface">
              {showResetForm ? "Redefinir senha" : "Recuperar senha"}
            </h2>
            <p className="text-on-surface-variant text-sm mt-2">
              {showResetForm
                ? "Digite o código recebido por email e sua nova senha."
                : "Digite seu e-mail para receber um código de verificação."}
            </p>
          </div>

          {message && (
            <div
              className={`mb-6 p-4 rounded-xl ${
                message.type === "success"
                  ? "bg-green-500/10 border border-green-500/20"
                  : "bg-red-500/10 border border-red-500/20"
              }`}
            >
              <p
                className={`text-sm font-medium ${
                  message.type === "success" ? "text-green-400" : "text-red-400"
                }`}
              >
                {message.text}
              </p>
            </div>
          )}

          {!showResetForm ? (
            <form className="space-y-6" onSubmit={handleRequestReset}>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider ml-1">
                  E-mail
                </label>
                <div className="relative group">
                  <span
                    className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors"
                    translate="no"
                  >
                    mail
                  </span>
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

              <button
                className="w-full bg-gradient-to-br from-[#b0c6ff] to-[#0058cb] text-on-primary font-bold py-4 rounded-full shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                type="submit"
                disabled={isSubmitting || !isLoaded}
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined text-sm animate-spin" translate="no">
                      progress_activity
                    </span>
                    Enviando...
                  </>
                ) : (
                  <>
                    Enviar código
                    <span className="material-symbols-outlined text-sm" translate="no">
                      send
                    </span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleResetPassword}>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider ml-1">
                  Código de verificação
                </label>
                <input
                  className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-4 text-on-surface focus:ring-2 focus:ring-primary transition-all placeholder:text-outline/50 text-center text-2xl tracking-widest"
                  placeholder="000000"
                  type="text"
                  required
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider ml-1">
                  Nova senha
                </label>
                <div className="relative group">
                  <span
                    className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors"
                    translate="no"
                  >
                    key
                  </span>
                  <input
                    className="w-full bg-surface-container-highest border-none rounded-xl py-4 pl-12 pr-4 text-on-surface focus:ring-2 focus:ring-primary transition-all placeholder:text-outline/50"
                    placeholder="Mínimo 8 caracteres"
                    type="password"
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                className="w-full bg-gradient-to-br from-[#b0c6ff] to-[#0058cb] text-on-primary font-bold py-4 rounded-full shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                type="submit"
                disabled={isSubmitting || !isLoaded}
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined text-sm animate-spin" translate="no">
                      progress_activity
                    </span>
                    Alterando...
                  </>
                ) : (
                  <>
                    Alterar senha
                    <span className="material-symbols-outlined text-sm" translate="no">
                      lock_reset
                    </span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowResetForm(false);
                  setCode("");
                  setNewPassword("");
                  setMessage(null);
                }}
                className="w-full text-on-surface-variant text-sm hover:text-primary transition-colors"
              >
                Voltar e tentar outro email
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
