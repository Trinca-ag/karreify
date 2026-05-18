"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { createVerificationCode, verifyCode } from "@/services/verification";
import { registerDevice } from "@/services/device-manager";
import { getDeviceId, getDeviceInfo } from "@/utils/device-fingerprint";
import { auth } from "@/lib/firebase";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Image from "next/image";
import { ShieldCheck, Mail } from "lucide-react";
import toast from "react-hot-toast";

export default function VerifyPage() {
  const { user, loading: authLoading, deviceVerified, isAdmin, markDeviceVerified } = useAuthContext();
  const router = useRouter();
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const sendingRef = useRef(false);

  const sendCode = useCallback(async () => {
    if (!user?.email || !user?.uid || sendingRef.current) return;
    sendingRef.current = true;
    setSending(true);
    try {
      const deviceId = getDeviceId();
      const code = await createVerificationCode(user.uid, user.email, deviceId);

      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "verification", email: user.email, code }),
      });

      const data = await res.json();

      if (data.fallback) {
        toast("Email não configurado. Código: " + code, { icon: "🔑", duration: 15000 });
      } else if (data.success) {
        toast.success("Código enviado para " + user.email);
      } else {
        toast("Código gerado: " + code, { icon: "🔑", duration: 15000 });
      }

      setCodeSent(true);
      setCooldown(60);
    } catch {
      toast.error("Erro ao enviar código.");
    } finally {
      setSending(false);
      sendingRef.current = false;
    }
  }, [user]);

  // Redirect if already verified
  useEffect(() => {
    if (authLoading) return;
    if (isAdmin) {
      // Defensive — admin sessions don't go through device verification.
      router.push("/admin");
      return;
    }
    if (!user) {
      // Firebase may have the user set even if the provider context hasn't
      // propagated yet (e.g. right after a fresh register). Only bounce to
      // login if the SDK itself confirms no session.
      if (!auth.currentUser) {
        router.push("/auth/login");
      }
      return;
    }
    if (deviceVerified) {
      router.push("/dashboard");
    }
  }, [authLoading, isAdmin, user, deviceVerified, router]);

  // Send code on mount
  useEffect(() => {
    if (authLoading) return;
    if (user && !deviceVerified && !codeSent) {
      sendCode();
    }
  }, [authLoading, user, deviceVerified, codeSent, sendCode]);

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

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

  const handleVerify = async () => {
    if (!user) return;
    const code = digits.join("");
    if (code.length !== 6) {
      toast.error("Digite o código completo.");
      return;
    }

    setLoading(true);
    try {
      const result = await verifyCode(user.uid, code);
      if (result.valid) {
        const deviceId = getDeviceId();
        const info = getDeviceInfo();
        await registerDevice(user.uid, deviceId, info);
        markDeviceVerified();
        toast.success("Dispositivo verificado com sucesso!");
        router.push("/dashboard");
      } else {
        toast.error("Código inválido ou expirado.");
        setDigits(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch {
      toast.error("Erro ao verificar código.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <LoadingSpinner size="lg" text="Carregando..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-600/10 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-accent-violet/10 rounded-full blur-[128px]" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <Image
              src="/images/logo_nextcv_new.png"
              alt="NextCV"
              width={220}
              height={110}
              className="object-contain h-20 w-auto"
            />
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8 text-primary-400" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-white mb-2">
              Verificação de segurança
            </h1>
            <p className="text-gray-400 text-sm">
              Enviamos um código de 6 dígitos para
            </p>
            <p className="text-white font-medium text-sm flex items-center justify-center gap-1.5 mt-1">
              <Mail className="w-4 h-4 text-primary-400" />
              {user.email}
            </p>
          </div>

          {/* Code inputs */}
          <div className="flex justify-center gap-2.5 mb-6" onPaste={handlePaste}>
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
                className="w-12 h-14 text-center text-xl font-bold bg-white/[0.05] border border-white/[0.1] rounded-xl text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
              />
            ))}
          </div>

          <Button
            onClick={handleVerify}
            loading={loading}
            className="w-full mb-4"
            size="lg"
            disabled={digits.join("").length !== 6}
          >
            Verificar
          </Button>

          <div className="text-center">
            <button
              onClick={sendCode}
              disabled={cooldown > 0 || sending}
              className="text-sm text-gray-400 hover:text-primary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending
                ? "Enviando..."
                : cooldown > 0
                ? `Reenviar código em ${cooldown}s`
                : "Reenviar código"}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          O código expira em 10 minutos. Verifique também a pasta de spam.
        </p>
      </div>
    </div>
  );
}
