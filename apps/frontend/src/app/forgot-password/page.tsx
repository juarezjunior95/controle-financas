"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsSubmitting(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api/v1"}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage({
          type: "success",
          text: "Se o email existir em nossa base, você receberá um link para redefinir sua senha.",
        });
        setEmail("");
      } else {
        setMessage({
          type: "error",
          text: data.error?.message || "Erro ao processar solicitação.",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Erro de conexão com o servidor.",
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
              Recuperar senha
            </h2>
            <p className="text-on-surface-variant text-sm mt-2">
              Digite seu e-mail e enviaremos um link para redefinir sua senha.
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

          <form className="space-y-6" onSubmit={handleSubmit}>
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
              disabled={isSubmitting}
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
                  Enviar link de recuperação
                  <span className="material-symbols-outlined text-sm" translate="no">
                    send
                  </span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
