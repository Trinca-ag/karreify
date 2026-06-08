"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser, loginWithGoogle } from "@/services/firebase-auth";
import { captureRefFromUrl } from "@/services/referral";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Image from "next/image";
import { Sparkles, Shield, Zap, Lock } from "lucide-react";
import toast from "react-hot-toast";
import TurnstileWidget, {
  turnstileEnabled,
  verifyCaptchaToken,
  type TurnstileHandle,
} from "@/components/ui/TurnstileWidget";

const LOGIN_LOCK_STORAGE_KEY = "karreify_login_lock_until";

// Firebase Auth pode "pendurar" indefinidamente em conexões instáveis (o SDK
// não tem timeout interno). Sem isto, o botão ficava preso em loading e só
// recarregando a página destravava.
const LOGIN_TIMEOUT_MS = 15000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const id = setTimeout(() => reject(new Error("login-timeout")), ms);
    promise.then(
      (v) => { clearTimeout(id); resolve(v); },
      (e) => { clearTimeout(id); reject(e); },
    );
  });
}

interface LoginRateResponse {
  allowed?: boolean;
  error?: string;
  retryAfterSeconds?: number;
}

async function callLoginRate(email: string, action: "check" | "fail" | "success"): Promise<LoginRateResponse> {
  try {
    console.log(`[login-rate] -> ${action} ${email}`);
    const res = await fetch("/api/auth/login-rate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, action }),
    });
    const data = (await res.json()) as LoginRateResponse;
    console.log(`[login-rate] <- ${res.status}`, data);
    if (!res.ok) return { allowed: false, error: data?.error, retryAfterSeconds: data?.retryAfterSeconds };
    return data;
  } catch (err) {
    console.warn("[login-rate] network error:", err);
    // Fail-open: erro de rede no nosso tracking não bloqueia login legítimo.
    return { allowed: true };
  }
}

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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  // `lockUntil` = epoch ms até quando os botões devem ficar bloqueados. É
  // persistido em localStorage pra sobreviver a refreshes/troca de aba (o
  // bloqueio também roda no servidor, isto é só UX).
  const [lockUntil, setLockUntil] = useState<number>(0);
  const [now, setNow] = useState<number>(() => Date.now());
  // Guarda síncrona — `loading` (useState) só atualiza no próximo render, então
  // cliques duplos muito rápidos passavam pelo `if (loading) return`.
  const inflightRef = useRef(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const turnstileRef = useRef<TurnstileHandle>(null);
  const router = useRouter();

  // Captura ?ref= no carregamento (caso o link de indicação aponte para o login
  // ou o usuário navegue para cá) e persiste em cookie até a atribuição.
  useEffect(() => {
    captureRefFromUrl();
  }, []);

  // Carrega lock persistido (caso o user dê F5 ou abra nova aba).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOGIN_LOCK_STORAGE_KEY);
      if (!raw) return;
      const v = parseInt(raw, 10);
      if (Number.isFinite(v) && v > Date.now()) setLockUntil(v);
      else localStorage.removeItem(LOGIN_LOCK_STORAGE_KEY);
    } catch {}
  }, []);

  // Tick pra atualizar o contador. Só roda enquanto há bloqueio ativo.
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

  const handleLogin = async () => {
    if (inflightRef.current) return;
    if (isLocked) return;
    if (!email.trim()) return;
    inflightRef.current = true;
    setLoading(true);
    try {
      // Verificação anti-robô (Cloudflare Turnstile) antes de qualquer tentativa.
      if (turnstileEnabled && !captchaToken) {
        toast.error("Confirme que você não é um robô.");
        return;
      }
      if (turnstileEnabled) {
        const human = await verifyCaptchaToken(captchaToken);
        // Token é single-use — reseta já pra ter um novo na próxima tentativa.
        turnstileRef.current?.reset();
        setCaptchaToken("");
        if (!human) {
          toast.error("Falha na verificação anti-robô. Tente novamente.");
          return;
        }
      }

      // Pre-check no nosso rate-limit escalonado (Firebase Auth não tem como
      // ser bloqueado pelo nosso server, então fazemos defesa client-side).
      const precheck = await callLoginRate(email, "check");
      if (precheck.allowed === false) {
        applyLock(precheck.retryAfterSeconds);
        toast.error(precheck.error || "Muitas tentativas. Aguarde antes de tentar novamente.");
        return;
      }

      await withTimeout(loginUser(email, password), LOGIN_TIMEOUT_MS);
      // Sucesso — zera contador pra esse email.
      void callLoginRate(email, "success");
      toast.success("Login realizado com sucesso!");
      router.push("/dashboard");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao fazer login";
      // Firebase pode retornar `auth/invalid-credential` (mais novo, unificado),
      // `auth/wrong-password`, `auth/user-not-found`, `auth/invalid-email` ou
      // `auth/invalid-login-credentials`. Tratamos todos como credencial inválida.
      const isCredFailure =
        message.includes("invalid-credential") ||
        message.includes("invalid-login-credentials") ||
        message.includes("wrong-password") ||
        message.includes("user-not-found") ||
        message.includes("invalid-email") ||
        message.includes("admin-account-not-allowed");
      const isNetworkFailure =
        message.includes("login-timeout") || message.includes("network-request-failed");
      console.log("[login] error:", message, "credFailure?", isCredFailure);

      // Só conta como tentativa falhada quando o erro foi de credencial.
      // Falhas de rede/timeout não devem queimar tentativas do user.
      if (isCredFailure) {
        const failResult = await callLoginRate(email, "fail");
        if (failResult.allowed === false) {
          applyLock(failResult.retryAfterSeconds);
          toast.error(failResult.error || "Muitas tentativas. Conta bloqueada temporariamente.");
          return;
        }
      }

      // admin-account-not-allowed is masked as a generic credential failure to
      // avoid leaking that the email belongs to an admin account.
      if (isCredFailure) {
        toast.error("Email ou senha incorretos.");
      } else if (isNetworkFailure) {
        toast.error("Conexão instável. Verifique sua internet e tente novamente.");
      } else if (message.includes("too-many-requests")) {
        toast.error("Muitas tentativas. Aguarde alguns minutos.");
      } else {
        toast.error("Erro ao fazer login. Tente novamente.");
      }
    } finally {
      setLoading(false);
      inflightRef.current = false;
    }
  };

  const handleGoogleLogin = async () => {
    if (inflightRef.current) return;
    if (isLocked) return;
    inflightRef.current = true;
    setLoading(true);
    try {
      await withTimeout(loginWithGoogle(), LOGIN_TIMEOUT_MS);
      toast.success("Login realizado com sucesso!");
      router.push("/dashboard");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "";
      // Same masking rationale as above
      if (message.includes("admin-account-not-allowed")) {
        toast.error("Email ou senha incorretos.");
      } else if (message.includes("popup-closed-by-user") || message.includes("cancelled-popup-request")) {
        // Usuário fechou o popup — não mostrar erro
      } else if (message.includes("login-timeout") || message.includes("network-request-failed")) {
        toast.error("Conexão instável. Verifique sua internet e tente novamente.");
      } else {
        toast.error("Erro ao fazer login com Google.");
      }
    } finally {
      setLoading(false);
      inflightRef.current = false;
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex overflow-x-hidden">
      {/* Left side - branding with futuristic design */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12">
        {/* Background grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

        {/* Gradient orbs */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-600/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-accent-violet/20 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-primary-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />

        {/* Content */}
        <div className="relative z-10 animate-fade-in-up">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/images/logo-karreify.png"
              alt="Karreify"
              width={240}
              height={120}
              className="object-contain h-24 w-auto"
            />
          </Link>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <h2 className="text-4xl font-heading font-bold text-white mb-4 leading-tight">
              Bem-vindo de{" "}
              <span className="gradient-text">volta</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-md">
              Continue impulsionando sua carreira com inteligencia artificial.
            </p>
          </div>

          <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 bg-white/[0.05] border border-white/[0.08] rounded-xl flex items-center justify-center group-hover:border-primary-500/30 transition-colors">
                <Sparkles className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <span className="text-gray-300 text-sm font-medium">Análise com IA</span>
                <p className="text-gray-500 text-xs">Feedback detalhado do seu currículo</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 bg-white/[0.05] border border-white/[0.08] rounded-xl flex items-center justify-center group-hover:border-primary-500/30 transition-colors">
                <Zap className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <span className="text-gray-300 text-sm font-medium">Resultados rápidos</span>
                <p className="text-gray-500 text-xs">Melhore seu currículo em minutos</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 bg-white/[0.05] border border-white/[0.08] rounded-xl flex items-center justify-center group-hover:border-primary-500/30 transition-colors">
                <Shield className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <span className="text-gray-300 text-sm font-medium">Dados seguros</span>
                <p className="text-gray-500 text-xs">Seus dados protegidos com criptografia</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-gray-500 text-sm animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          &copy; {new Date().getFullYear()} Karreify. Todos os direitos reservados.
        </div>
      </div>

      {/* Right side - form */}
      <div className="flex-1 min-w-0 flex items-center justify-center p-8 relative">
        {/* Subtle background orb for right side */}
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-primary-600/5 rounded-full blur-[100px]" />

        <div className="w-full max-w-lg lg:max-w-md relative z-10">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 animate-fade-in-up">
            <Link href="/" className="flex items-center justify-center gap-2">
              <Image
                src="/images/logo-karreify.png"
                alt="Karreify"
                width={200}
                height={100}
                className="object-contain h-12 sm:h-14 w-auto"
              />
            </Link>
          </div>

          {/* Form card */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6 sm:p-8 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <h1 className="text-2xl font-heading font-bold text-white mb-2">Entrar</h1>
            <p className="text-gray-400 mb-8">
              Nao tem uma conta?{" "}
              <Link href="/auth/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                Criar conta
              </Link>
            </p>

            {isLocked && (
              <div className="flex items-start gap-3 px-4 py-3 mb-6 bg-red-500/10 border border-red-500/25 rounded-xl text-sm">
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

            {/* Google OAuth button */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading || isLocked}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-200 font-medium text-gray-300 mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continuar com Google
            </button>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-dark-900 text-gray-500">ou</span>
              </div>
            </div>

            {/* Login form */}
            {/* Usamos type="button" + onClick (em vez de type="submit") para evitar
                o submit nativo do <form> caso o usuário clique antes do React hidratar
                (que causava reload com URL virando /auth/login?). onKeyDown cobre o UX
                de Enter-para-enviar. */}
            <form
              onSubmit={(e) => { e.preventDefault(); handleLogin(); }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) {
                  e.preventDefault();
                  handleLogin();
                }
              }}
              className="space-y-4"
            >
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
              <div>
                <Input
                  label="Senha"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  required
                />
                <div className="text-right mt-1.5">
                  <Link
                    href="/auth/reset-password"
                    className="text-sm text-gray-400 hover:text-primary-400 transition-colors"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
              </div>
              <TurnstileWidget
                ref={turnstileRef}
                onToken={setCaptchaToken}
                className="flex justify-center"
              />
              <Button
                type="button"
                onClick={() => handleLogin()}
                loading={loading}
                disabled={isLocked}
                className="w-full"
                size="lg"
              >
                {isLocked ? `Bloqueado · ${formatRemaining(remainingMs)}` : "Entrar"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
