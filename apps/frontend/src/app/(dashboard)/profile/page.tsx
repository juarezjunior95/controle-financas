"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser as useClerkUser } from "@clerk/nextjs";
import { useAuth } from "@/lib/auth";
import { fetchAPI } from "@/lib/api";
import { formatNumber, parseCurrency } from "@/lib/storage";

type FormStatus = "idle" | "loading" | "success" | "error";

export default function ProfilePage() {
  const router = useRouter();
  const { user: clerkUser } = useClerkUser();
  const { user, token, updateDisplayName, updateAvatarUrl } = useAuth();

  // ── Display Name State ─────────────────────────────────────────────
  const [displayName, setDisplayName] = useState("");
  const [originalName, setOriginalName] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // ── Initial Balance State ──────────────────────────────────────────
  const [initialBalance, setInitialBalance] = useState<number | null>(null);
  const [balanceInput, setBalanceInput] = useState("");
  const [originalBalance, setOriginalBalance] = useState<number | null>(null);
  const [balanceStatus, setBalanceStatus] = useState<FormStatus>("idle");
  const [balanceErrorMsg, setBalanceErrorMsg] = useState("");
  const [balanceSuccessMsg, setBalanceSuccessMsg] = useState("");

  // ── Avatar Upload State ────────────────────────────────────────────
  const [avatarStatus, setAvatarStatus] = useState<FormStatus>("idle");
  const [avatarMsg, setAvatarMsg] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // ── Gemini API Key State ───────────────────────────────────────────
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [originalApiKey, setOriginalApiKey] = useState("");
  const [aiStatus, setAiStatus] = useState<FormStatus>("idle");
  const [aiErrorMsg, setAiErrorMsg] = useState("");
  const [aiSuccessMsg, setAiSuccessMsg] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load current name
  useEffect(() => {
    if (user) {
      const name = user.displayName || user.nome || "";
      setDisplayName(name);
      setOriginalName(name);
    }
  }, [user]);

  // Load initial balance
  useEffect(() => {
    if (!token) return;
    fetchAPI<{ initialBalance: number }>("/users/initial-balance", {
      method: "GET",
      token,
    }).then(({ data, error }) => {
      if (data) {
        const val = data.initialBalance ?? 0;
        setInitialBalance(val);
        setOriginalBalance(val);
        setBalanceInput(formatNumber(val));
      }
    });

    // Load full profile (to get geminiApiKey)
    fetchAPI<{ geminiApiKey: string | null }>("/clients/me", {
      method: "GET",
      token,
    }).then(({ data, error }) => {
      if (data) {
        const key = data.geminiApiKey ?? "";
        setGeminiApiKey(key);
        setOriginalApiKey(key);
      } else if (error) {
        console.error("[Profile] Erro ao carregar perfil completo:", error.message);
      }
    });
  }, [token]);

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // ── Derived State ──────────────────────────────────────────────────
  const trimmedName = displayName.trim();
  const hasChanged = trimmedName !== originalName;
  const validationError = getValidationError(trimmedName);
  const canSave = hasChanged && !validationError && status !== "loading";

  // ── Balance Derived State ──────────────────────────────────────────
  const parsedBalance = parseCurrency(balanceInput);
  const balanceChanged = initialBalance !== null && parsedBalance !== originalBalance;
  const balanceValidationError = getBalanceValidationError(parsedBalance, balanceInput);
  const canSaveBalance =
    balanceChanged && !balanceValidationError && balanceStatus !== "loading";

  // ── AI Derived State ───────────────────────────────────────────────
  const aiKeyChanged = geminiApiKey !== originalApiKey;
  const canSaveAi = aiKeyChanged && aiStatus !== "loading";

  function getValidationError(name: string): string | null {
    if (!name) return "O nome não pode estar vazio.";
    if (name.length < 2) return "O nome deve ter pelo menos 2 caracteres.";
    if (name.length > 50) return "O nome não pode ter mais de 50 caracteres.";
    return null;
  }

  function getBalanceValidationError(value: number, raw: string): string | null {
    if (raw.trim() === "") return "O saldo inicial não pode estar vazio.";
    if (isNaN(value)) return "Digite um valor numérico válido.";
    if (value < 0) return "O saldo inicial não pode ser negativo.";
    if (value > 999_999_999) return "Valor acima do limite permitido.";
    return null;
  }

  // ── Save Display Name ──────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    if (!canSave) return;

    setStatus("loading");
    setErrorMsg("");
    setSuccessMsg("");

    const result = await fetchAPI("/users/profile", {
      method: "PUT",
      token,
      body: JSON.stringify({ display_name: trimmedName }),
    });

    if (result.error) {
      setStatus("error");
      setErrorMsg(result.error.message || "Falha ao atualizar o nome.");
      return;
    }

    updateDisplayName(trimmedName);
    setOriginalName(trimmedName);
    setStatus("success");
    setSuccessMsg("Nome atualizado com sucesso!");

    setTimeout(() => {
      setStatus("idle");
      setSuccessMsg("");
    }, 3000);
  }, [canSave, token, trimmedName, updateDisplayName]);

  const handleCancel = useCallback(() => {
    setDisplayName(originalName);
    setStatus("idle");
    setErrorMsg("");
    setSuccessMsg("");
  }, [originalName]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && canSave) {
        e.preventDefault();
        handleSave();
      }
    },
    [canSave, handleSave]
  );

  // ── Save Initial Balance ───────────────────────────────────────────
  const handleSaveBalance = useCallback(async () => {
    if (!canSaveBalance || !token) return;

    setBalanceStatus("loading");
    setBalanceErrorMsg("");
    setBalanceSuccessMsg("");

    const { data, error } = await fetchAPI<{ initialBalance: number }>(
      "/clients/me",
      {
        method: "PUT",
        token,
        body: JSON.stringify({ initialBalance: parsedBalance }),
      }
    );

    if (error) {
      setBalanceStatus("error");
      setBalanceErrorMsg(error.message || "Falha ao atualizar o saldo.");
      return;
    }

    if (data) {
      setOriginalBalance(data.initialBalance);
      setBalanceStatus("success");
      setBalanceSuccessMsg("Saldo inicial atualizado com sucesso!");
      setTimeout(() => {
        setBalanceStatus("idle");
        setBalanceSuccessMsg("");
      }, 3000);
    }
  }, [canSaveBalance, token, parsedBalance]);

  const handleCancelBalance = useCallback(() => {
    setBalanceInput(formatNumber(originalBalance ?? 0));
    setBalanceStatus("idle");
    setBalanceErrorMsg("");
    setBalanceSuccessMsg("");
  }, [originalBalance]);

  // ── Save Gemini API Key ────────────────────────────────────────────
  const handleSaveAiConfig = useCallback(async () => {
    if (!canSaveAi || !token) return;

    setAiStatus("loading");
    setAiErrorMsg("");
    setAiSuccessMsg("");

    const { data, error } = await fetchAPI<{ geminiApiKey: string | null }>(
      "/users/ai-config",
      {
        method: "PUT",
        token,
        body: JSON.stringify({ geminiApiKey: geminiApiKey.trim() || null }),
      }
    );

    if (error) {
      setAiStatus("error");
      setAiErrorMsg(error.message || "Falha ao atualizar a chave de IA.");
      return;
    }

    if (data) {
      const saved = data.geminiApiKey ?? "";
      setGeminiApiKey(saved);
      setOriginalApiKey(saved);
      setAiStatus("success");
      setAiSuccessMsg("Configuração de IA atualizada com sucesso!");
      setTimeout(() => {
        setAiStatus("idle");
        setAiSuccessMsg("");
      }, 3000);
    }
  }, [canSaveAi, token, geminiApiKey]);

  const handleCancelAi = useCallback(() => {
    setGeminiApiKey(originalApiKey);
    setAiStatus("idle");
    setAiErrorMsg("");
    setAiSuccessMsg("");
  }, [originalApiKey]);

  // ── Avatar Upload ──────────────────────────────────────────────────
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setAvatarStatus("error");
        setAvatarMsg("A imagem deve ter no máximo 5MB.");
        setTimeout(() => { setAvatarStatus("idle"); setAvatarMsg(""); }, 4000);
        return;
      }

      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setAvatarStatus("error");
        setAvatarMsg("Formato inválido. Use JPG, PNG, WebP ou GIF.");
        setTimeout(() => { setAvatarStatus("idle"); setAvatarMsg(""); }, 4000);
        return;
      }

      // Show preview
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
      setAvatarStatus("loading");
      setAvatarMsg("");

      try {
        if (!clerkUser) throw new Error("Usuário não encontrado.");

        // Upload via Clerk SDK (stores in Clerk's CDN)
        const imageResource = await clerkUser.setProfileImage({ file });

        // Update global state with new URL
        if (imageResource?.publicUrl) {
          updateAvatarUrl(imageResource.publicUrl);
        }

        setAvatarStatus("success");
        setAvatarMsg("Foto atualizada com sucesso!");
        setPreviewUrl(null);

        setTimeout(() => { setAvatarStatus("idle"); setAvatarMsg(""); }, 3000);
      } catch (err: any) {
        console.error("[Profile] Erro ao fazer upload da foto:", err);
        setAvatarStatus("error");
        setAvatarMsg(err?.message || "Falha ao atualizar a foto.");
        setPreviewUrl(null);
        setTimeout(() => { setAvatarStatus("idle"); setAvatarMsg(""); }, 4000);
      }

      // Clear file input so same file can be re-selected
      e.target.value = "";
    },
    [clerkUser, updateAvatarUrl]
  );

  const handleRemoveAvatar = useCallback(async () => {
    if (!clerkUser) return;

    setAvatarStatus("loading");
    setAvatarMsg("");

    try {
      await clerkUser.setProfileImage({ file: null });
      updateAvatarUrl(null);
      setAvatarStatus("success");
      setAvatarMsg("Foto removida.");
      setTimeout(() => { setAvatarStatus("idle"); setAvatarMsg(""); }, 3000);
    } catch (err: any) {
      console.error("[Profile] Erro ao remover foto:", err);
      setAvatarStatus("error");
      setAvatarMsg("Falha ao remover a foto.");
      setTimeout(() => { setAvatarStatus("idle"); setAvatarMsg(""); }, 4000);
    }
  }, [clerkUser, updateAvatarUrl]);

  // ── Initials ───────────────────────────────────────────────────────
  const initials = (user?.displayName || user?.nome || user?.email || "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const displayedAvatar = previewUrl || user?.avatarUrl;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back + Page Header */}
      <div className="mb-10">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-[#c3c6d6] hover:text-[#b0c6ff] transition-colors mb-6"
        >
          <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">
            arrow_back
          </span>
          <span className="font-source-sans-3 text-sm">Voltar</span>
        </button>

        <h1 className="text-[#e5e2e1] text-3xl font-bold font-dm-sans tracking-tight mb-2">
          Meu Perfil
        </h1>
        <p className="text-[#c3c6d6] font-source-sans-3 text-sm">
          Gerencie suas informações pessoais
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-[#1c1b1b] rounded-2xl border border-[#424654]/20 overflow-hidden">
        {/* Header gradient bar */}
        <div className="h-28 bg-gradient-to-r from-[#b0c6ff]/20 via-[#0058cb]/20 to-[#b0c6ff]/10 relative" />

        {/* Avatar Section */}
        <div className="px-8 -mt-14 mb-6">
          <div className="flex items-end gap-5">
            {/* Avatar with upload overlay */}
            <div className="relative group">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileChange}
                className="hidden"
                id="avatar-upload"
              />

              <button
                onClick={handleAvatarClick}
                disabled={avatarStatus === "loading"}
                className="relative block rounded-2xl overflow-hidden border-4 border-[#1c1b1b] shadow-xl focus:outline-none focus:ring-2 focus:ring-[#b0c6ff]/50 focus:ring-offset-2 focus:ring-offset-[#1c1b1b] transition-all"
                title="Alterar foto de perfil"
              >
                {/* Image / Initials */}
                {displayedAvatar ? (
                  <img
                    src={displayedAvatar}
                    alt="Avatar"
                    className="w-24 h-24 object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-br from-[#b0c6ff] to-[#0058cb] flex items-center justify-center">
                    <span className="text-3xl font-bold text-[#001945]">
                      {initials}
                    </span>
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {avatarStatus === "loading" ? (
                    <span className="material-symbols-outlined text-white text-2xl animate-spin">
                      progress_activity
                    </span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-white text-xl mb-0.5">
                        photo_camera
                      </span>
                      <span className="text-white text-[10px] font-source-sans-3">
                        Alterar
                      </span>
                    </>
                  )}
                </div>
              </button>

              {/* Loading spinner visible even without hover */}
              {avatarStatus === "loading" && (
                <div className="absolute inset-0 rounded-2xl border-4 border-[#1c1b1b] bg-black/40 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-2xl animate-spin">
                    progress_activity
                  </span>
                </div>
              )}
            </div>

            {/* Name + actions */}
            <div className="pb-1 flex-1 min-w-0">
              <h2 className="text-[#e5e2e1] text-lg font-bold font-dm-sans truncate">
                {user?.displayName || user?.nome || "Usuário"}
              </h2>
              <p className="text-[#c3c6d6] text-xs font-source-sans-3 truncate mb-2">
                {user?.email}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAvatarClick}
                  disabled={avatarStatus === "loading"}
                  className="text-xs text-[#b0c6ff] hover:text-[#b0c6ff]/80 font-source-sans-3 font-semibold transition-colors"
                >
                  Alterar foto
                </button>
                {user?.avatarUrl && (
                  <>
                    <span className="text-[#424654] text-xs">•</span>
                    <button
                      onClick={handleRemoveAvatar}
                      disabled={avatarStatus === "loading"}
                      className="text-xs text-red-400/70 hover:text-red-400 font-source-sans-3 font-semibold transition-colors"
                    >
                      Remover
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Avatar feedback */}
          {avatarMsg && (
            <div
              className={`mt-4 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-source-sans-3 animate-in ${
                avatarStatus === "success"
                  ? "bg-green-500/10 border border-green-500/20 text-green-400"
                  : avatarStatus === "error"
                  ? "bg-red-500/10 border border-red-500/20 text-red-400"
                  : ""
              }`}
            >
              <span
                className="material-symbols-outlined text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {avatarStatus === "success" ? "check_circle" : "cancel"}
              </span>
              {avatarMsg}
            </div>
          )}

          <p className="mt-3 text-[10px] text-[#c3c6d6]/40 font-source-sans-3">
            JPG, PNG, WebP ou GIF • Máximo 5MB
          </p>
        </div>

        <div className="border-t border-[#424654]/10 mx-8" />

        {/* Content */}
        <div className="px-8 pt-6 pb-8">
          {/* Email (read-only) */}
          <div className="mb-8">
            <label className="block text-[#c3c6d6] text-xs font-source-sans-3 uppercase tracking-widest mb-1">
              E-mail
            </label>
            <div className="flex items-center gap-2 text-[#e5e2e1]/60">
              <span className="material-symbols-outlined text-sm">mail</span>
              <span className="text-sm font-source-sans-3">
                {user?.email || "—"}
              </span>
              <span
                className="material-symbols-outlined text-xs text-[#b0c6ff]"
                title="Verificado"
              >
                verified
              </span>
            </div>
          </div>

          {/* Display Name (editable) */}
          <div className="mb-8">
            <label
              htmlFor="display-name-input"
              className="block text-[#c3c6d6] text-xs font-source-sans-3 uppercase tracking-widest mb-2"
            >
              Nome de exibição
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#c3c6d6]/50 text-lg">
                person
              </span>
              <input
                ref={inputRef}
                id="display-name-input"
                type="text"
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                  if (status === "error" || status === "success") {
                    setStatus("idle");
                    setErrorMsg("");
                    setSuccessMsg("");
                  }
                }}
                onKeyDown={handleKeyDown}
                placeholder="Digite seu nome"
                maxLength={50}
                className={`w-full bg-[#131313] text-[#e5e2e1] pl-11 pr-16 py-3.5 rounded-xl border transition-all duration-200 outline-none font-source-sans-3 text-sm placeholder:text-[#c3c6d6]/30 ${
                  validationError && displayName
                    ? "border-red-500/50 focus:border-red-400 focus:ring-1 focus:ring-red-400/30"
                    : "border-[#424654]/30 focus:border-[#b0c6ff]/50 focus:ring-1 focus:ring-[#b0c6ff]/20"
                }`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-[#c3c6d6]/40 font-mono">
                {trimmedName.length}/50
              </span>
            </div>

            {/* Inline validation */}
            {validationError && displayName && (
              <p className="mt-2 text-red-400 text-xs flex items-center gap-1.5 animate-in">
                <span className="material-symbols-outlined text-xs">error</span>
                {validationError}
              </p>
            )}
          </div>

          {/* Feedback Messages */}
          {status === "success" && successMsg && (
            <div className="mb-6 flex items-center gap-3 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl text-sm font-source-sans-3 animate-in">
              <span
                className="material-symbols-outlined text-lg"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
              {successMsg}
            </div>
          )}

          {status === "error" && errorMsg && (
            <div className="mb-6 flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm font-source-sans-3 animate-in">
              <span
                className="material-symbols-outlined text-lg"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                cancel
              </span>
              {errorMsg}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={!canSave}
              className={`relative px-6 py-3 rounded-full text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                canSave
                  ? "bg-gradient-to-br from-[#b0c6ff] to-[#0058cb] text-[#001945] hover:opacity-90 active:scale-95 shadow-lg shadow-[#0058cb]/20"
                  : "bg-[#353534] text-[#c3c6d6]/40 cursor-not-allowed"
              }`}
            >
              {status === "loading" ? (
                <>
                  <span className="material-symbols-outlined text-lg animate-spin">
                    progress_activity
                  </span>
                  Salvando...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">save</span>
                  Salvar alterações
                </>
              )}
            </button>

            {hasChanged && status !== "loading" && (
              <button
                onClick={handleCancel}
                className="px-6 py-3 rounded-full text-sm font-bold text-[#c3c6d6] hover:text-[#e5e2e1] hover:bg-[#353534] transition-all duration-200"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Additional Info Card */}
      <div className="mt-6 bg-[#1c1b1b] rounded-2xl border border-[#424654]/20 p-8">
        <h3 className="text-[#e5e2e1] font-dm-sans font-bold mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#b0c6ff]">account_balance_wallet</span>
          Configurações financeiras
        </h3>

        <div className="space-y-2">
          <label
            htmlFor="initial-balance-input"
            className="block text-[#c3c6d6] text-xs font-source-sans-3 uppercase tracking-widest mb-2"
          >
            Saldo inicial
          </label>
          <p className="text-[#c3c6d6]/60 text-xs font-source-sans-3 mb-3">
            Valor que você possuía antes de começar a usar o app. Usado como base para calcular seu saldo total.
          </p>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c3c6d6]/50 text-sm font-bold select-none">
              R$
            </span>
            {initialBalance === null ? (
              <div className="w-full bg-[#131313] border border-[#424654]/30 rounded-xl py-3.5 pl-11 pr-4 h-[50px] animate-pulse" />
            ) : (
              <input
                id="initial-balance-input"
                type="text"
                inputMode="decimal"
                value={balanceInput}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^\d,]/g, "");
                  setBalanceInput(raw);
                  if (balanceStatus === "error" || balanceStatus === "success") {
                    setBalanceStatus("idle");
                    setBalanceErrorMsg("");
                    setBalanceSuccessMsg("");
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && canSaveBalance) {
                    e.preventDefault();
                    handleSaveBalance();
                  }
                }}
                placeholder="0,00"
                className={`w-full bg-[#131313] text-[#e5e2e1] pl-11 pr-4 py-3.5 rounded-xl border transition-all duration-200 outline-none font-source-sans-3 text-sm placeholder:text-[#c3c6d6]/30 ${
                  balanceValidationError && balanceInput
                    ? "border-red-500/50 focus:border-red-400 focus:ring-1 focus:ring-red-400/30"
                    : "border-[#424654]/30 focus:border-[#b0c6ff]/50 focus:ring-1 focus:ring-[#b0c6ff]/20"
                }`}
              />
            )}
          </div>

          {/* Inline validation */}
          {balanceValidationError && balanceInput && (
            <p className="mt-2 text-red-400 text-xs flex items-center gap-1.5 animate-in">
              <span className="material-symbols-outlined text-xs">error</span>
              {balanceValidationError}
            </p>
          )}
        </div>

        {/* Feedback Messages */}
        {balanceStatus === "success" && balanceSuccessMsg && (
          <div className="mt-4 flex items-center gap-3 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl text-sm font-source-sans-3 animate-in">
            <span
              className="material-symbols-outlined text-lg"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
            {balanceSuccessMsg}
          </div>
        )}

        {balanceStatus === "error" && balanceErrorMsg && (
          <div className="mt-4 flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm font-source-sans-3 animate-in">
            <span
              className="material-symbols-outlined text-lg"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              cancel
            </span>
            {balanceErrorMsg}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={handleSaveBalance}
            disabled={!canSaveBalance}
            className={`relative px-6 py-3 rounded-full text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
              canSaveBalance
                ? "bg-gradient-to-br from-[#b0c6ff] to-[#0058cb] text-[#001945] hover:opacity-90 active:scale-95 shadow-lg shadow-[#0058cb]/20"
                : "bg-[#353534] text-[#c3c6d6]/40 cursor-not-allowed"
            }`}
          >
            {balanceStatus === "loading" ? (
              <>
                <span className="material-symbols-outlined text-lg animate-spin">
                  progress_activity
                </span>
                Salvando...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">save</span>
                Salvar alterações
              </>
            )}
          </button>

          {balanceChanged && balanceStatus !== "loading" && (
            <button
              onClick={handleCancelBalance}
              className="px-6 py-3 rounded-full text-sm font-bold text-[#c3c6d6] hover:text-[#e5e2e1] hover:bg-[#353534] transition-all duration-200"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      {/* IA Config Card */}
      <div className="mt-6 bg-[#1c1b1b] rounded-2xl border border-[#424654]/20 p-8">
        <h3 className="text-[#e5e2e1] font-dm-sans font-bold mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#b0c6ff]">psychology</span>
          Inteligência Artificial
        </h3>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="gemini-api-key-input"
              className="block text-[#c3c6d6] text-xs font-source-sans-3 uppercase tracking-widest mb-2"
            >
              Gemini API Key
            </label>
            <p className="text-[#c3c6d6]/60 text-xs font-source-sans-3 mb-3">
              Configure sua própria chave do Google Gemini para ter insights personalizados. 
              Sua chave é armazenada de forma segura e usada apenas para suas análises.
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#b0c6ff] hover:underline ml-1 inline-flex items-center gap-0.5"
              >
                Obter chave gratuita <span className="material-symbols-outlined text-[10px]">open_in_new</span>
              </a>
            </p>

            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#c3c6d6]/50 text-lg">
                key
              </span>
              <input
                id="gemini-api-key-input"
                type="password"
                value={geminiApiKey}
                onChange={(e) => {
                  setGeminiApiKey(e.target.value);
                  if (aiStatus === "error" || aiStatus === "success") {
                    setAiStatus("idle");
                    setAiErrorMsg("");
                    setAiSuccessMsg("");
                  }
                }}
                placeholder="Cole sua chave aqui (AIza...)"
                className="w-full bg-[#131313] text-[#e5e2e1] pl-11 pr-4 py-3.5 rounded-xl border border-[#424654]/30 focus:border-[#b0c6ff]/50 focus:ring-1 focus:ring-[#b0c6ff]/20 transition-all duration-200 outline-none font-source-sans-3 text-sm placeholder:text-[#c3c6d6]/30"
              />
            </div>
          </div>

          {/* Feedback Messages */}
          {aiStatus === "success" && aiSuccessMsg && (
            <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl text-sm font-source-sans-3 animate-in">
              <span className="material-symbols-outlined text-lg">check_circle</span>
              {aiSuccessMsg}
            </div>
          )}

          {aiStatus === "error" && aiErrorMsg && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm font-source-sans-3 animate-in">
              <span className="material-symbols-outlined text-lg">cancel</span>
              {aiErrorMsg}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSaveAiConfig}
              disabled={!canSaveAi}
              className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                canSaveAi
                  ? "bg-gradient-to-br from-[#b0c6ff] to-[#0058cb] text-[#001945] hover:opacity-90 active:scale-95 shadow-lg shadow-[#0058cb]/20"
                  : "bg-[#353534] text-[#c3c6d6]/40 cursor-not-allowed"
              }`}
            >
              {aiStatus === "loading" ? (
                <>
                  <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                  Salvando...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">save</span>
                  Salvar chave
                </>
              )}
            </button>

            {aiKeyChanged && aiStatus !== "loading" && (
              <button
                onClick={handleCancelAi}
                className="px-6 py-3 rounded-full text-sm font-bold text-[#c3c6d6] hover:text-[#e5e2e1] hover:bg-[#353534] transition-all duration-200"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Additional Info Card */}
      <div className="mt-6 bg-[#1c1b1b] rounded-2xl border border-[#424654]/20 p-8">
        <h3 className="text-[#e5e2e1] font-dm-sans font-bold mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#b0c6ff]">info</span>
          Informações da conta
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-[#424654]/10">
            <span className="text-[#c3c6d6] text-sm font-source-sans-3">
              Membro desde
            </span>
            <span className="text-[#e5e2e1] text-sm font-source-sans-3">
              {clerkUser?.createdAt
                ? new Date(clerkUser.createdAt).toLocaleDateString("pt-BR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "—"}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-[#424654]/10">
            <span className="text-[#c3c6d6] text-sm font-source-sans-3">
              Status da conta
            </span>
            <span className="inline-flex items-center gap-1.5 text-green-400 text-sm font-source-sans-3">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Ativa
            </span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-[#c3c6d6] text-sm font-source-sans-3">
              Plano
            </span>
            <span className="inline-flex items-center gap-1.5 bg-[#b0c6ff]/10 text-[#b0c6ff] text-xs font-bold px-3 py-1 rounded-full">
              <span
                className="material-symbols-outlined text-xs"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                diamond
              </span>
              Premium
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
