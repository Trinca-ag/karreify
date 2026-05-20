"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Image from "next/image";
import { KeyRound, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

type Step = "email" | "code" | "success";

export default function ResetPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const sendingRef = useRef(false);

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const sendCode = useCallback(async () => {
    if (!email || sendingRef.current) return;
    sendingRef.current = true;
    setLoading(true);

    try {
      const res = await fetch("/api/send-reset-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Erro ao enviar código.");
        return;
      }

      if (data.fallback) {
        toast("Email não configurado. Código: " + data.code, { icon: "🔑", duration: 15000 });
      } else {
        toast.success("Código enviado para " + email);
      }

      setStep("code");
      setCooldown(60);
    } catch {
      toast.error("Erro ao enviar código. Verifique o email.");
    } finally {
      setLoading(false);
      sendingRef.current = false;
    }
  }, [email]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Digite seu email.");
      return;
    }
    await sendCode();
  };

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
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

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join("");

    if (code.length !== 6) {
      toast.error("Digite o código completo.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStep("success");
        toast.success("Senha redefinida com sucesso!");
      } else {
        toast.error(data.error || "Código inválido ou expirado.");
        setDigits(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch {
      toast.error("Erro ao redefinir senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-orange-500/10 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[128px]" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <Image
              src="/images/logo-karreify.png"
              alt="Karreify"
              width={220}
              height={110}
              className="object-contain h-12 sm:h-14 lg:h-20 w-auto"
            />
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-8">
          {step === "email" && (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <KeyRound className="w-8 h-8 text-orange-400" />
                </div>
                <h1 className="text-2xl font-heading font-bold text-white mb-2">
                  Recuperar senha
                </h1>
                <p className="text-gray-400 text-sm">
                  Digite seu email para receber o código de recuperação
                </p>
              </div>

              <form onSubmit={handleSendCode} action="javascript:void(0)" className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                />
                <Button type="submit" loading={loading} className="w-full" size="lg">
                  Enviar código
                </Button>
              </form>

              <div className="text-center mt-4">
                <Link
                  href="/auth/login"
                  className="text-sm text-gray-400 hover:text-primary-400 transition-colors inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar ao login
                </Link>
              </div>
            </>
          )}

          {step === "code" && (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-orange-400" />
                </div>
                <h1 className="text-2xl font-heading font-bold text-white mb-2">
                  Verificação
                </h1>
                <p className="text-gray-400 text-sm">
                  Digite o código enviado para
                </p>
                <p className="text-white font-medium text-sm flex items-center justify-center gap-1.5 mt-1">
                  <Mail className="w-4 h-4 text-orange-400" />
                  {email}
                </p>
              </div>

              <form onSubmit={handleResetPassword} action="javascript:void(0)" className="space-y-5">
                {/* Code inputs */}
                <div className="flex justify-center gap-2.5" onPaste={handlePaste}>
                  {digits.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { inputRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      className="w-12 h-14 text-center text-xl font-bold bg-white/[0.05] border border-white/[0.1] rounded-xl text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                    />
                  ))}
                </div>

                <Input
                  label="Nova senha"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                />

                <Input
                  label="Confirmar nova senha"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a nova senha"
                  required
                />

                <Button
                  type="submit"
                  loading={loading}
                  className="w-full"
                  size="lg"
                  disabled={digits.join("").length !== 6 || !newPassword || !confirmPassword}
                >
                  Redefinir senha
                </Button>
              </form>

              <div className="text-center mt-4">
                <button
                  onClick={sendCode}
                  disabled={cooldown > 0 || loading}
                  className="text-sm text-gray-400 hover:text-orange-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cooldown > 0
                    ? `Reenviar código em ${cooldown}s`
                    : "Reenviar código"}
                </button>
              </div>
            </>
          )}

          {step === "success" && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h1 className="text-2xl font-heading font-bold text-white mb-2">
                Senha redefinida!
              </h1>
              <p className="text-gray-400 text-sm mb-6">
                Sua senha foi alterada com sucesso. Faça login com a nova senha.
              </p>
              <Link href="/auth/login">
                <Button className="w-full" size="lg">
                  Ir para o login
                </Button>
              </Link>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          O código expira em 10 minutos. Verifique também a pasta de spam.
        </p>
      </div>
    </div>
  );
}
