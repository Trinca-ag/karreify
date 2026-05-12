"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import toast from "react-hot-toast";

export default function AdminRegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim() || !email.trim() || !password || !confirmPassword) {
      toast.error("Preencha todos os campos.");
      return;
    }
    if (!/^[a-z0-9_]{3,20}$/.test(username)) {
      toast.error("Username deve ter 3-20 caracteres (letras, números, _).");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }
    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          username: username.toLowerCase().trim(),
          email: email.toLowerCase().trim(),
          password,
        }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Erro ao criar conta."); return; }
      toast.success("Administrador criado com sucesso!");
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-900/20 via-dark-900 to-dark-900" />
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-primary-600/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] bg-violet-600/6 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[420px] relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/">
            <Image src="/images/logo_nextcv_new.png" alt="NextCV" width={150} height={38} className="h-10 w-auto mb-4" />
          </Link>
          <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 text-xs font-bold rounded-lg border border-amber-500/20 tracking-widest uppercase">
            Painel Administrativo
          </span>
        </div>

        {/* Card */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8 shadow-2xl shadow-black/40">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-white font-heading">Novo administrador</h1>
            <p className="text-sm text-gray-500 mt-1">Preencha os dados para criar a conta</p>
          </div>

          <form onSubmit={handleSubmit} action="javascript:void(0)" className="space-y-4">
            <Input
              label="Nome completo"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Seu nome"
              required
            />
            <Input
              label="Username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
              placeholder="ex: joao_silva"
              required
            />
            <Input
              label="E-mail"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
            <Input
              label="Senha"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
            />
            <Input
              label="Confirmar senha"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Repita a senha"
              required
            />
            <Button type="submit" loading={loading} className="w-full" size="lg">
              Criar conta
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/[0.06] text-center">
            <Link href="/admin/login" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
              Já tem uma conta? <span className="text-primary-400">Entrar</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
