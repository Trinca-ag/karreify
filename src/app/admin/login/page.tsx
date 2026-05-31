"use client";

import { useEffect, useState, useRef } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { ArrowLeft, CheckCircle, Lock } from "lucide-react";
import toast from "react-hot-toast";
import TurnstileWidget, {
  turnstileEnabled,
  verifyCaptchaToken,
  type TurnstileHandle,
} from "@/components/ui/TurnstileWidget";

const TRUST_MS = 30 * 24 * 60 * 60 * 1000;

// Compartilhado com /auth/login — bloqueio em uma página reflete na outra.
const LOGIN_LOCK_STORAGE_KEY = "karreify_login_lock_until";

function formatRemaining(ms: number): string {
  if (ms <= 0) return "";
  const s = Math.ceil(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const sec = s % 60;
  if (m < 60) return `${m}m ${sec.toString().padStart(2, "0")}s`;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${h}h ${mm.toString().padStart(2, "0")}m`;
}

function isTrustedDevice(email: string): boolean {
  try {
    const raw = localStorage.getItem(`adminTrust_${email}`);
    if (!raw) return false;
    const { verifiedAt } = JSON.parse(raw);
    return Date.now() - verifiedAt < TRUST_MS;
  } catch {
    return false;
  }
}

function saveTrustedDevice(email: string) {
  localStorage.setItem(`adminTrust_${email}`, JSON.stringify({ verifiedAt: Date.now() }));
}

export default function AdminLoginPage() {
  const [step, setStep] = useState<"credentials" | "code" | "reset-email" | "reset-code" | "reset-success">("credentials");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  // Holds the resolved email and password for the final sign-in after 2FA
  const [resolvedEmail, setResolvedEmail] = useState("");
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [credCaptcha, setCredCaptcha] = useState("");
  const credTurnstileRef = useRef<TurnstileHandle>(null);

  // Reset password state
  const [resetEmail, setResetEmail] = useState("");
  const [resetDigits, setResetDigits] = useState(["", "", "", "", "", ""]);
  const resetInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetCooldown, setResetCooldown] = useState(0);
  const [resetCaptcha, setResetCaptcha] = useState("");
  const resetTurnstileRef = useRef<TurnstileHandle>(null);

  // Lockout visual compartilhado com /auth/login.
  const [lockUntil, setLockUntil] = useState<number>(0);
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOGIN_LOCK_STORAGE_KEY);
      if (!raw) return;
      const v = parseInt(raw, 10);
      if (Number.isFinite(v) && v > Date.now()) setLockUntil(v);
      else localStorage.removeItem(LOGIN_LOCK_STORAGE_KEY);
    } catch {}
  }, []);

  useEffect(() => {
    if (lockUntil <= 0) return;
    const id = setInterval(() => {
      const cur = Date.now();
      setNow(cur);
      if (cur >= lockUntil) {
        setLockUntil(0);
        try { localStorage.removeItem(LOGIN_LOCK_STORAGE_KEY); } catch {}
      }
    }, 1000);
    return () => clearInterval(id);
  }, [lockUntil]);

  const remainingMs = Math.max(0, lockUntil - now);
  const isLocked = remainingMs > 0;

  const applyLock = (seconds: number | undefined) => {
    if (!seconds || seconds <= 0) return;
    const until = Date.now() + seconds * 1000;
    setLockUntil(until);
    setNow(Date.now());
    try { localStorage.setItem(LOGIN_LOCK_STORAGE_KEY, String(until)); } catch {}
  };

  const startCooldown = () => {
    setCooldown(60);
    const timer = setInterval(() => setCooldown(c => {
      if (c <= 1) { clearInterval(timer); return 0; }
      return c - 1;
    }), 1000);
  };

  const sendCode = async (email: string): Promise<boolean> => {
    setSending(true);
    try {
      const res = await fetch("/api/admin/send-login-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Erro ao enviar código."); return false; }
      if (data.fallback) {
        toast(`Email não configurado. Código: ${data.code}`, { icon: "🔑", duration: 15000 });
      } else {
        toast.success(`Código enviado para ${email}`);
      }
      return true;
    } finally {
      setSending(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    if (!identifier.trim() || !password) return;
    if (turnstileEnabled && !credCaptcha) {
      toast.error("Confirme que você não é um robô.");
      return;
    }
    setLoading(true);
    try {
      if (turnstileEnabled) {
        const human = await verifyCaptchaToken(credCaptcha);
        credTurnstileRef.current?.reset();
        setCredCaptcha("");
        if (!human) {
          toast.error("Falha na verificação anti-robô. Tente novamente.");
          return;
        }
      }

      // 1. Resolve email (API call only — no Firebase Auth yet)
      let email = identifier.trim().toLowerCase();
      if (!email.includes("@")) {
        const res = await fetch("/api/admin/get-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: email }),
        });
        const data = await res.json();
        if (!res.ok) { toast.error("Administrador não encontrado."); return; }
        email = data.email;
      }

      // 2. Pre-check no rate-limit escalonado da senha (Firebase Auth não passa
      // pelo nosso server, então fazemos defesa client-side aqui também).
      const precheck = await fetch("/api/auth/login-rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, action: "check" }),
      });
      const precheckData = await precheck.json();
      if (!precheck.ok) {
        applyLock(precheckData?.retryAfterSeconds);
        toast.error(precheckData?.error || "Muitas tentativas. Aguarde antes de tentar novamente.");
        return;
      }

      // 3. Check device trust (localStorage only, no Firebase)
      if (isTrustedDevice(email)) {
        // Trusted device — sign in directly (no signOut needed)
        try {
          await signInWithEmailAndPassword(auth, email, password);
          // Sucesso — zera contador
          fetch("/api/auth/login-rate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, action: "success" }),
          }).catch(() => {});
          // AdminAuthProvider will redirect to /admin
        } catch {
          // Senha errada em device trusted — incrementa contador
          const failRes = await fetch("/api/auth/login-rate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, action: "fail" }),
          }).catch(() => null);
          if (failRes && !failRes.ok) {
            const failData = await failRes.json().catch(() => ({}));
            applyLock(failData?.retryAfterSeconds);
            toast.error(failData?.error || "Muitas tentativas. Conta bloqueada temporariamente.");
            return;
          }
          toast.error("Credenciais inválidas.");
        }
        return;
      }

      // 4. Not trusted — send code WITHOUT signing into Firebase
      //    We keep password in state for the final sign-in after code verification
      setResolvedEmail(email);
      const sent = await sendCode(email);
      if (sent) {
        setStep("code");
        startCooldown();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || sending) return;
    const sent = await sendCode(resolvedEmail);
    if (sent) startCooldown();
  };

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...digits];
    next[index] = value.slice(-1);
    setDigits(next);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerifyCode = async () => {
    const code = digits.join("");
    if (code.length !== 6) { toast.error("Digite o código completo."); return; }
    setLoading(true);
    try {
      // 1. Verify code server-side (still no Firebase Auth)
      const res = await fetch("/api/admin/verify-login-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resolvedEmail, code }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Código inválido."); return; }

      // 2. Code valid — save device trust and sign into Firebase
      saveTrustedDevice(resolvedEmail);
      try {
        await signInWithEmailAndPassword(auth, resolvedEmail, password);
        // Sucesso — zera contador do rate-limit da senha
        fetch("/api/auth/login-rate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: resolvedEmail, action: "success" }),
        }).catch(() => {});
        // AdminAuthProvider will handle redirect to /admin
      } catch {
        // Senha errada após 2FA OK — incrementa contador
        const failRes = await fetch("/api/auth/login-rate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: resolvedEmail, action: "fail" }),
        }).catch(() => null);
        if (failRes && !failRes.ok) {
          const failData = await failRes.json().catch(() => ({}));
          applyLock(failData?.retryAfterSeconds);
          toast.error(failData?.error || "Muitas tentativas. Conta bloqueada temporariamente.");
          setStep("credentials");
          return;
        }
        toast.error("Senha incorreta. Volte e tente novamente.");
        setStep("credentials");
      }
    } catch {
      toast.error("Erro ao verificar código.");
    } finally {
      setLoading(false);
    }
  };

  const startResetCooldown = () => {
    setResetCooldown(60);
    const timer = setInterval(() => setResetCooldown(c => {
      if (c <= 1) { clearInterval(timer); return 0; }
      return c - 1;
    }), 1000);
  };

  const handleSendResetCode = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!resetEmail.trim()) return;
    if (isLocked) return;
    if (turnstileEnabled && !resetCaptcha) {
      toast.error("Confirme que você não é um robô.");
      return;
    }
    setLoading(true);
    try {
      if (turnstileEnabled) {
        const human = await verifyCaptchaToken(resetCaptcha);
        resetTurnstileRef.current?.reset();
        setResetCaptcha("");
        if (!human) {
          toast.error("Falha na verificação anti-robô. Tente novamente.");
          return;
        }
      }
      const res = await fetch("/api/send-reset-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail.trim().toLowerCase(), context: "admin" }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 429) applyLock(data?.retryAfterSeconds);
        toast.error(data.error || "Erro ao enviar código.");
        return;
      }
      if (data.fallback) {
        toast(`Email não configurado. Código: ${data.code}`, { icon: "🔑", duration: 15000 });
      } else {
        toast.success(`Código enviado para ${resetEmail}`);
      }
      setStep("reset-code");
      startResetCooldown();
    } finally {
      setLoading(false);
    }
  };

  const handleResendResetCode = async () => {
    if (resetCooldown > 0 || loading) return;
    if (isLocked) return;
    setLoading(true);
    try {
      const res = await fetch("/api/send-reset-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail.trim().toLowerCase(), context: "admin" }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 429) applyLock(data?.retryAfterSeconds);
        toast.error(data.error || "Erro ao reenviar código.");
        return;
      }
      if (data.fallback) {
        toast(`Código: ${data.code}`, { icon: "🔑", duration: 15000 });
      } else {
        toast.success("Código reenviado.");
      }
      startResetCooldown();
    } finally {
      setLoading(false);
    }
  };

  const handleResetDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...resetDigits];
    next[index] = value.slice(-1);
    setResetDigits(next);
    if (value && index < 5) resetInputRefs.current[index + 1]?.focus();
  };

  const handleResetKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !resetDigits[index] && index > 0) {
      resetInputRefs.current[index - 1]?.focus();
    }
  };

  const handleResetPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setResetDigits(pasted.split(""));
      resetInputRefs.current[5]?.focus();
    }
  };

  const handleResetPassword = async () => {
    const code = resetDigits.join("");
    if (code.length !== 6) { toast.error("Digite o código completo."); return; }
    if (!newPassword || newPassword.length < 6) { toast.error("A senha deve ter pelo menos 6 caracteres."); return; }
    if (newPassword !== confirmPassword) { toast.error("As senhas não coincidem."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail.trim().toLowerCase(), code, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Código inválido ou expirado."); return; }
      setStep("reset-success");
    } catch {
      toast.error("Erro ao redefinir senha.");
    } finally {
      setLoading(false);
    }
  };

  const goBackToLogin = () => {
    setStep("credentials");
    setResetEmail("");
    setResetDigits(["", "", "", "", "", ""]);
    setNewPassword("");
    setConfirmPassword("");
    setResetCooldown(0);
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-900/20 via-dark-900 to-dark-900" />
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-primary-600/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] bg-violet-600/6 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[420px] relative z-10">
        <div className="flex flex-col items-center mb-8">
          <Link href="/">
            <Image src="/images/logo-karreify.png" alt="Karreify" width={150} height={38} className="h-10 w-auto mb-4" />
          </Link>
          <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 text-xs font-bold rounded-lg border border-amber-500/20 tracking-widest uppercase">
            Painel Administrativo
          </span>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8 shadow-2xl shadow-black/40">
          {step === "credentials" ? (
            <>
              <div className="mb-6">
                <h1 className="text-xl font-bold text-white font-heading">Bem-vindo de volta</h1>
                <p className="text-sm text-gray-500 mt-1">Entre com suas credenciais de administrador</p>
              </div>
              {isLocked && (
                <div className="flex items-start gap-3 px-4 py-3 mb-5 bg-red-500/10 border border-red-500/25 rounded-xl text-sm">
                  <Lock className="w-4 h-4 text-red-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-200">Login bloqueado temporariamente</p>
                    <p className="text-red-200/80 text-xs mt-0.5">
                      Muitas tentativas falhadas. Tente novamente em{" "}
                      <span className="font-mono font-semibold text-white">{formatRemaining(remainingMs)}</span>.
                    </p>
                  </div>
                </div>
              )}
              <form onSubmit={handleLogin} action="javascript:void(0)" className="space-y-4">
                <Input
                  label="Usuário ou e-mail"
                  type="text"
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  placeholder="username ou email@exemplo.com"
                  required
                />
                <Input
                  label="Senha"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  required
                />
                <TurnstileWidget
                  ref={credTurnstileRef}
                  onToken={setCredCaptcha}
                  className="flex justify-center"
                />
                <Button
                  type="submit"
                  loading={loading || sending}
                  disabled={isLocked}
                  className="w-full"
                  size="lg"
                >
                  {isLocked ? `Bloqueado · ${formatRemaining(remainingMs)}` : "Entrar"}
                </Button>
              </form>
              <div className="mt-4 text-center">
                <button
                  onClick={() => setStep("reset-email")}
                  className="text-sm text-gray-500 hover:text-primary-400 transition-colors"
                >
                  Esqueceu sua senha?
                </button>
              </div>
            </>
          ) : step === "reset-email" ? (
            <div className="space-y-5">
              <div>
                <button
                  onClick={goBackToLogin}
                  className="flex items-center gap-1.5 text-gray-500 hover:text-gray-300 transition-colors text-sm mb-4"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao login
                </button>
                <h1 className="text-xl font-bold text-white font-heading mb-1">Recuperar senha</h1>
                <p className="text-sm text-gray-500">Informe seu e-mail para receber o código de recuperação</p>
              </div>
              {isLocked && (
                <div className="flex items-start gap-3 px-4 py-3 bg-red-500/10 border border-red-500/25 rounded-xl text-sm">
                  <Lock className="w-4 h-4 text-red-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-200">Recuperação bloqueada temporariamente</p>
                    <p className="text-red-200/80 text-xs mt-0.5">
                      Muitas tentativas. Tente novamente em{" "}
                      <span className="font-mono font-semibold text-white">{formatRemaining(remainingMs)}</span>.
                    </p>
                  </div>
                </div>
              )}
              <form onSubmit={handleSendResetCode} action="javascript:void(0)" className="space-y-4">
                <Input
                  label="E-mail"
                  type="email"
                  value={resetEmail}
                  onChange={e => setResetEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                  required
                />
                <TurnstileWidget
                  ref={resetTurnstileRef}
                  onToken={setResetCaptcha}
                  className="flex justify-center"
                />
                <Button
                  type="submit"
                  loading={loading}
                  disabled={isLocked}
                  className="w-full"
                  size="lg"
                >
                  {isLocked ? `Bloqueado · ${formatRemaining(remainingMs)}` : "Enviar código"}
                </Button>
              </form>
            </div>
          ) : step === "reset-code" ? (
            <div className="space-y-5">
              <div>
                <button
                  onClick={() => setStep("reset-email")}
                  className="flex items-center gap-1.5 text-gray-500 hover:text-gray-300 transition-colors text-sm mb-4"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Voltar
                </button>
                <h1 className="text-xl font-bold text-white font-heading mb-1">Nova senha</h1>
                <p className="text-sm text-gray-500">
                  Enviamos um código para <span className="text-gray-300 font-medium">{resetEmail}</span>
                </p>
              </div>

              <div className="flex justify-center gap-2" onPaste={handleResetPaste}>
                {resetDigits.map((d, i) => (
                  <input
                    key={i}
                    ref={el => { resetInputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={e => handleResetDigitChange(i, e.target.value)}
                    onKeyDown={e => handleResetKeyDown(i, e)}
                    className="w-12 h-14 text-center text-xl font-bold text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all"
                  />
                ))}
              </div>

              <div className="space-y-3">
                <Input
                  label="Nova senha"
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                />
                <Input
                  label="Confirmar nova senha"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repita a nova senha"
                />
              </div>

              <Button onClick={handleResetPassword} loading={loading} className="w-full" size="lg">
                Redefinir senha
              </Button>

              <div className="text-center">
                <button
                  onClick={handleResendResetCode}
                  disabled={resetCooldown > 0 || loading}
                  className="text-sm text-primary-400 hover:text-primary-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {resetCooldown > 0 ? `Reenviar em ${resetCooldown}s` : "Reenviar código"}
                </button>
              </div>
            </div>
          ) : step === "reset-success" ? (
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white font-heading mb-2">Senha redefinida!</h1>
                <p className="text-sm text-gray-500">Sua senha foi alterada com sucesso. Faça login com a nova senha.</p>
              </div>
              <Button onClick={goBackToLogin} className="w-full" size="lg">
                Voltar ao login
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-bold text-white font-heading mb-1">Verificação de dispositivo</h1>
                <p className="text-sm text-gray-500">
                  Enviamos um código para <span className="text-gray-300 font-medium">{resolvedEmail}</span>
                </p>
              </div>

              <div className="flex justify-center gap-2" onPaste={handlePaste}>
                {digits.map((d, i) => (
                  <input
                    key={i}
                    ref={el => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={e => handleDigitChange(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    className="w-12 h-14 text-center text-xl font-bold text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all"
                  />
                ))}
              </div>

              <Button onClick={handleVerifyCode} loading={loading} className="w-full" size="lg">
                Verificar e entrar
              </Button>

              <div className="flex items-center justify-between text-sm">
                <button
                  onClick={() => { setStep("credentials"); setDigits(["", "", "", "", "", ""]); }}
                  className="flex items-center gap-1.5 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Voltar
                </button>
                <button
                  onClick={handleResend}
                  disabled={cooldown > 0 || sending}
                  className="text-primary-400 hover:text-primary-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {cooldown > 0 ? `Reenviar em ${cooldown}s` : "Reenviar código"}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
