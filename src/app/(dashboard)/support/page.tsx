"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, LifeBuoy, Sparkles, Search } from "lucide-react";
import Button from "@/components/ui/Button";
import TicketCard from "@/components/support/TicketCard";
import NewTicketModal from "@/components/support/NewTicketModal";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { createTicket, subscribeUserTickets } from "@/services/tickets";
import type { Ticket } from "@/types";
import toast from "react-hot-toast";

type Tab = "open" | "closed";

export default function SupportPage() {
  const { user, loading: authLoading } = useAuthContext();
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("open");
  const [newOpen, setNewOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Wait for auth to fully resolve. Without this, after a logout + login
    // cycle the listener could subscribe while Firestore still considers the
    // session unauthenticated (or with a stale token) and the query falls back
    // to permission-denied / no-results.
    if (authLoading) return;
    if (!user?.uid) return;
    setLoading(true);
    const unsub = subscribeUserTickets(
      user.uid,
      (list) => {
        setTickets(list);
        setLoading(false);
      },
      (err) => {
        console.error("[support] subscribeUserTickets failed:", err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [user?.uid, authLoading]);

  const counts = useMemo(
    () => ({
      open: tickets.filter((t) => t.status === "open").length,
      closed: tickets.filter((t) => t.status === "closed").length,
    }),
    [tickets]
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return tickets
      .filter((t) => (tab === "open" ? t.status === "open" : t.status === "closed"))
      .filter((t) => {
        if (!term) return true;
        return (
          t.title.toLowerCase().includes(term) ||
          t.id.includes(term) ||
          t.description.toLowerCase().includes(term)
        );
      });
  }, [tickets, tab, search]);

  const handleCreate = async (input: { title: string; description: string; images: File[] }) => {
    const ticket = await createTicket(input);
    setNewOpen(false);
    toast.success(`Chamado #${ticket.id} aberto`);
    router.push(`/support/${ticket.id}`);
  };

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-3xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl">
        <div className="absolute -top-20 -left-16 w-80 h-80 bg-primary-500/20 rounded-full blur-[120px] animate-pulse-glow pointer-events-none" />
        <div
          className="absolute -bottom-32 -right-10 w-96 h-96 bg-accent-violet/20 rounded-full blur-[140px] animate-pulse-glow pointer-events-none"
          style={{ animationDelay: "1.5s" }}
        />
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
        <div className="relative p-8 md:p-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-xs font-medium text-primary-300 mb-4">
            <Sparkles className="w-3 h-3" />
            Atendimento humano
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white font-heading leading-[1.1] tracking-tight">
            Central de <span className="gradient-text">suporte</span>
          </h1>
          <p className="text-gray-400 mt-4 text-base md:text-lg max-w-xl leading-relaxed">
            Abra um chamado e converse diretamente com o time. Acompanhe o histórico de atendimentos por aqui.
          </p>
        </div>
      </section>

      {/* Primary action — left aligned, above the listing block */}
      <div className="flex justify-start animate-fade-in-up animation-delay-100">
        <Button onClick={() => setNewOpen(true)} size="lg">
          <Plus className="w-4 h-4 mr-1.5" /> Novo chamado
        </Button>
      </div>

      {/* Tabs + search */}
      <div className="relative bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] animate-fade-in-up animation-delay-200 overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-2 py-2 flex-wrap">
          <Tabs tab={tab} setTab={setTab} counts={counts} />
          <div className="relative flex-1 min-w-[200px] max-w-sm mr-2">
            <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por #id, título ou descrição..."
              className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-xs"
            />
          </div>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex flex-col items-center gap-3 py-16">
          <div className="w-10 h-10 rounded-full border-2 border-primary-500/30 border-t-primary-400 animate-spin" />
          <p className="text-sm text-gray-400">Carregando seus chamados...</p>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          tab={tab}
          hasSearch={!!search.trim()}
          onCreate={() => setNewOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up animation-delay-300">
          {filtered.map((t) => (
            <TicketCard key={t.id} ticket={t} href={`/support/${t.id}`} />
          ))}
        </div>
      )}

      <NewTicketModal isOpen={newOpen} onClose={() => setNewOpen(false)} onSubmit={handleCreate} />
    </div>
  );
}

function Tabs({
  tab,
  setTab,
  counts,
}: {
  tab: Tab;
  setTab: (t: Tab) => void;
  counts: { open: number; closed: number };
}) {
  const items: { key: Tab; label: string; count: number }[] = [
    { key: "open", label: "Abertos", count: counts.open },
    { key: "closed", label: "Finalizados", count: counts.closed },
  ];
  return (
    <div className="relative flex items-center p-1">
      {items.map((it) => {
        const active = tab === it.key;
        return (
          <button
            key={it.key}
            onClick={() => setTab(it.key)}
            className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              active
                ? "bg-primary-500/10 text-primary-300"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <span className="relative z-10 inline-flex items-center gap-2">
              {it.label}
              <span
                className={`px-1.5 py-0.5 text-[10px] rounded-md tabular-nums ${
                  active
                    ? "bg-primary-500/20 text-primary-200"
                    : "bg-white/5 text-gray-500"
                }`}
              >
                {it.count}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function EmptyState({
  tab,
  hasSearch,
  onCreate,
}: {
  tab: Tab;
  hasSearch: boolean;
  onCreate: () => void;
}) {
  if (hasSearch) {
    return (
      <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] py-16 flex flex-col items-center gap-3 text-center animate-fade-in-up animation-delay-300">
        <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
          <Search className="w-6 h-6 text-gray-500" />
        </div>
        <div>
          <p className="text-white font-semibold">Nenhum chamado encontrado</p>
          <p className="text-sm text-gray-400 mt-1">Tente outro termo de busca.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="relative overflow-hidden bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] py-16 flex flex-col items-center gap-4 text-center animate-fade-in-up animation-delay-300">
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-violet flex items-center justify-center shadow-lg shadow-primary-600/20">
        <LifeBuoy className="w-8 h-8 text-white" />
      </div>
      <div className="relative">
        <p className="text-white font-semibold text-lg">
          {tab === "open" ? "Nenhum chamado em aberto" : "Nenhum chamado finalizado"}
        </p>
        <p className="text-sm text-gray-400 mt-1 max-w-md">
          {tab === "open"
            ? "Abra um chamado quando precisar de ajuda — o time responde por aqui."
            : "Chamados encerrados ficarão registrados nesta aba."}
        </p>
      </div>
      {tab === "open" && (
        <Button onClick={onCreate} className="relative mt-2">
          <Plus className="w-4 h-4 mr-1.5" /> Abrir primeiro chamado
        </Button>
      )}
    </div>
  );
}
