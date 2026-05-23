"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser, loginWithGoogle } from "@/services/firebase-auth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Image from "next/image";
import { Gift, CreditCard, Sparkles, Check } from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptTerms) {
      toast.error("Você precisa aceitar os Termos de Uso e a Política de Privacidade.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("As senhas nao coincidem.");
      return;
    }

    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      await registerUser(email, password, name);
      toast.success("Conta criada com sucesso!");
      router.push("/auth/verify");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "";
      if (message.includes("email-already-in-use")) {
        toast.error("Este email ja esta em uso.");
      } else {
        toast.error("Erro ao criar conta. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!acceptTerms) {
      toast.error("Você precisa aceitar os Termos de Uso e a Política de Privacidade.");
      return;
    }
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success("Conta criada com sucesso!");
      router.push("/dashboard");
    } catch {
      // Any failure — including admin-account-not-allowed — surfaces as a
      // generic Google error to avoid leaking admin-account existence.
      toast.error("Erro ao criar conta com Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Left side - branding with futuristic design */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12">
        {/* Background grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

        {/* Gradient orbs */}
        <div className="absolute top-1/3 -left-16 w-96 h-96 bg-primary-600/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-accent-violet/20 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-2/3 left-1/4 w-64 h-64 bg-primary-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />

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
              Comece sua{" "}
              <span className="gradient-text">jornada</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-md">
              Crie sua conta e descubra como a IA pode transformar sua carreira.
            </p>
          </div>

          <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 bg-white/[0.05] border border-white/[0.08] rounded-xl flex items-center justify-center group-hover:border-primary-500/30 transition-colors">
                <Gift className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <span className="text-gray-300 text-sm font-medium">5 creditos gratuitos</span>
                <p className="text-gray-500 text-xs">Comece a usar sem pagar nada</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 bg-white/[0.05] border border-white/[0.08] rounded-xl flex items-center justify-center group-hover:border-primary-500/30 transition-colors">
                <CreditCard className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <span className="text-gray-300 text-sm font-medium">Sem cartao de credito</span>
                <p className="text-gray-500 text-xs">Nenhum compromisso financeiro</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 bg-white/[0.05] border border-white/[0.08] rounded-xl flex items-center justify-center group-hover:border-primary-500/30 transition-colors">
                <Sparkles className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <span className="text-gray-300 text-sm font-medium">IA de ultima geracao</span>
                <p className="text-gray-500 text-xs">Powered by DeepSeek AI</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-gray-500 text-sm animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          &copy; {new Date().getFullYear()} Karreify. Todos os direitos reservados.
        </div>
      </div>

      {/* Right side - form */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
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
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-8 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <h1 className="text-2xl font-heading font-bold text-white mb-2">Criar conta</h1>
            <p className="text-gray-400 mb-8">
              Ja tem uma conta?{" "}
              <Link href="/auth/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                Entrar
              </Link>
            </p>

            {/* Google OAuth button */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
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

            {/* Register form */}
            <form onSubmit={handleRegister} action="javascript:void(0)" className="space-y-4">
              <Input
                label="Nome completo"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                required
              />
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
              <Input
                label="Senha"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimo 6 caracteres"
                required
              />
              <Input
                label="Confirmar senha"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a senha"
                required
              />

              {/* Terms acceptance */}
              <label
                htmlFor="accept-terms"
                className="flex items-start gap-3 cursor-pointer group select-none pt-1"
              >
                <input
                  id="accept-terms"
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="sr-only peer"
                />
                <span
                  className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    acceptTerms
                      ? "bg-gradient-to-br from-primary-500 to-accent-violet border-transparent shadow-lg shadow-primary-500/30"
                      : "bg-white/[0.04] border-white/15 group-hover:border-primary-400/50"
                  }`}
                  aria-hidden
                >
                  <Check
                    className={`w-3.5 h-3.5 text-white transition-all duration-300 ${
                      acceptTerms ? "scale-100 opacity-100" : "scale-50 opacity-0"
                    }`}
                  />
                </span>
                <span className="text-xs text-gray-400 leading-relaxed">
                  Li e concordo com os{" "}
                  <Link
                    href="/terms"
                    target="_blank"
                    className="text-primary-400 hover:text-primary-300 font-medium underline-offset-2 hover:underline transition-colors"
                  >
                    Termos de Uso
                  </Link>{" "}
                  e com a{" "}
                  <Link
                    href="/privacy"
                    target="_blank"
                    className="text-primary-400 hover:text-primary-300 font-medium underline-offset-2 hover:underline transition-colors"
                  >
                    Política de Privacidade
                  </Link>
                  .
                </span>
              </label>

              <Button
                type="submit"
                loading={loading}
                disabled={!acceptTerms}
                className="w-full"
                size="lg"
              >
                Criar conta
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
