"use client";

import { useState } from "react";
import {
  User,
  Mail,
  MessageSquare,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  type LucideIcon,
} from "lucide-react";

type Topic = "help" | "terms" | "privacy";

type Theme = {
  badgeBg: string;
  badgeText: string;
  ring: string;
  button: string;
  radial: string;
};

const themes: Record<Topic, Theme> = {
  help: {
    badgeBg: "bg-primary-500/10 border-primary-500/20",
    badgeText: "text-primary-300",
    ring: "focus-within:border-primary-500/50 focus-within:ring-primary-500/20",
    button: "from-primary-600 to-accent-violet",
    radial: "bg-radial-blue",
  },
  terms: {
    badgeBg: "bg-accent-violet/10 border-accent-violet/20",
    badgeText: "text-accent-violet",
    ring: "focus-within:border-accent-violet/50 focus-within:ring-accent-violet/20",
    button: "from-primary-600 to-accent-violet",
    radial: "bg-radial-violet",
  },
  privacy: {
    badgeBg: "bg-emerald-500/10 border-emerald-500/20",
    badgeText: "text-emerald-300",
    ring: "focus-within:border-emerald-500/50 focus-within:ring-emerald-500/20",
    button: "from-emerald-500 to-primary-500",
    radial: "bg-radial-blue",
  },
};

interface ContactFormProps {
  topic: Topic;
  badge: string;
  title: string;
  description: string;
  successMessage?: string;
  presetSubjects?: string[];
}

export default function ContactForm({
  topic,
  badge,
  title,
  description,
  successMessage = "Mensagem enviada! Vamos retornar em breve no e-mail informado.",
  presetSubjects,
}: ContactFormProps) {
  const theme = themes[topic];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(presetSubjects?.[0] ?? "");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const isValid =
    name.trim().length > 1 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
    subject.trim().length > 1 &&
    message.trim().length > 5;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading" || !isValid) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message, topic }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Erro inesperado");
      setStatus("success");
      setName("");
      setEmail("");
      setSubject(presetSubjects?.[0] ?? "");
      setMessage("");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Erro inesperado");
      setStatus("error");
    }
  };

  return (
    <div className="glass-card gradient-border !rounded-3xl p-6 sm:p-10 relative overflow-hidden">
      <div className={`absolute inset-0 ${theme.radial} opacity-40 pointer-events-none`} />

      {/* Header */}
      <div className="relative text-center mb-8">
        <div
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${theme.badgeBg} border ${theme.badgeText} text-sm font-semibold tracking-wide mb-4`}
        >
          {badge}
        </div>
        <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white">
          {title}
        </h3>
        <p className="mt-3 text-gray-400 max-w-lg mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      {/* Success state */}
      {status === "success" && (
        <div className="relative text-center py-6 animate-fade-in">
          <div className="inline-flex w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 items-center justify-center mb-5 animate-modal-pop">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <h4 className="text-xl font-heading font-bold text-white">
            Mensagem enviada!
          </h4>
          <p className="mt-2 text-gray-400 max-w-md mx-auto">
            {successMessage}
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-sm text-gray-300 font-medium rounded-xl border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all duration-300"
          >
            Enviar outra mensagem
          </button>
        </div>
      )}

      {/* Form */}
      {status !== "success" && (
      <form
        onSubmit={handleSubmit}
        className="relative space-y-4 animate-fade-in"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            id="cf-name"
            label="Nome completo"
            icon={User}
            value={name}
            onChange={setName}
            placeholder="Seu nome"
            ringClass={theme.ring}
            disabled={status === "loading"}
          />
          <Field
            id="cf-email"
            label="E-mail"
            icon={Mail}
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="seu@email.com"
            ringClass={theme.ring}
            disabled={status === "loading"}
          />
        </div>

        {presetSubjects && presetSubjects.length > 0 ? (
          <SubjectSelect
            value={subject}
            onChange={setSubject}
            options={presetSubjects}
            ringClass={theme.ring}
            disabled={status === "loading"}
          />
        ) : (
          <Field
            id="cf-subject"
            label="Assunto"
            icon={MessageSquare}
            value={subject}
            onChange={setSubject}
            placeholder="Sobre o que você quer falar?"
            ringClass={theme.ring}
            disabled={status === "loading"}
          />
        )}

        <TextAreaField
          id="cf-message"
          label="Mensagem"
          value={message}
          onChange={setMessage}
          placeholder="Conte com detalhes para que possamos te ajudar..."
          ringClass={theme.ring}
          disabled={status === "loading"}
          maxLength={4000}
        />

        {status === "error" && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm animate-fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{errorMsg || "Algo deu errado. Tente novamente."}</span>
          </div>
        )}

        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-4">
          <p className="text-[11px] text-gray-500 leading-relaxed">
            Ao enviar, você concorda com nossa Política de Privacidade. Não
            compartilhamos seus dados.
          </p>
          <button
            type="submit"
            disabled={!isValid || status === "loading"}
            className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r ${theme.button} text-white font-semibold rounded-xl btn-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none whitespace-nowrap`}
          >
            {status === "loading" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Enviar mensagem
              </>
            )}
          </button>
        </div>
      </form>
      )}
    </div>
  );
}

interface FieldProps {
  id: string;
  label: string;
  icon: LucideIcon;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  ringClass: string;
  disabled?: boolean;
}

function Field({
  id,
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
  type = "text",
  ringClass,
  disabled,
}: FieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2"
      >
        {label}
      </label>
      <div
        className={`flex items-center gap-2 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 ring-1 ring-transparent transition-all duration-300 ${ringClass}`}
      >
        <Icon className="w-4 h-4 text-gray-500 flex-shrink-0" />
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-600 disabled:cursor-not-allowed"
        />
      </div>
    </div>
  );
}

interface SubjectSelectProps {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  ringClass: string;
  disabled?: boolean;
}

function SubjectSelect({
  value,
  onChange,
  options,
  ringClass,
  disabled,
}: SubjectSelectProps) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
        Assunto
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              disabled={disabled}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium border transition-all duration-300 ${
                active
                  ? `bg-white/10 border-white/20 text-white ${ringClass}`
                  : "bg-white/[0.02] border-white/5 text-gray-400 hover:text-white hover:bg-white/[0.05] hover:border-white/10"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface TextAreaProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  ringClass: string;
  disabled?: boolean;
  maxLength: number;
}

function TextAreaField({
  id,
  label,
  value,
  onChange,
  placeholder,
  ringClass,
  disabled,
  maxLength,
}: TextAreaProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label
          htmlFor={id}
          className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider"
        >
          {label}
        </label>
        <span className="text-[11px] text-gray-600">
          {value.length}/{maxLength}
        </span>
      </div>
      <div
        className={`px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 ring-1 ring-transparent transition-all duration-300 ${ringClass}`}
      >
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
          placeholder={placeholder}
          disabled={disabled}
          rows={5}
          className="w-full bg-transparent outline-none text-sm text-white placeholder-gray-600 resize-none disabled:cursor-not-allowed"
        />
      </div>
    </div>
  );
}
