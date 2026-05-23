"use client";

import { useEffect, useMemo, useState } from "react";
import { LifeBuoy, Search } from "lucide-react";
import TicketCard from "@/components/support/TicketCard";
import { subscribeAllTickets } from "@/services/tickets";
import type { Ticket } from "@/types";

type Tab = "open" | "closed";

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("open");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    const unsub = subscribeAllTickets(
      (list) => {
        setTickets(list);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, []);

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
          t.userName.toLowerCase().includes(term) ||
          t.userEmail.toLowerCase().includes(term)
        );
      });
  }, [tickets, tab, search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-3">
            <LifeBuoy className="w-7 h-7 text-primary-400" />
            Suporte
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            {counts.open} em aberto · {counts.closed} finalizado{counts.closed !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Tabs + search */}
      <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-2 py-2 flex-wrap">
          <div className="flex items-center p-1">
            {(
              [
                { key: "open" as const, label: "Abertos", count: counts.open },
                { key: "closed" as const, label: "Finalizados", count: counts.closed },
              ]
            ).map((it) => {
              const active = tab === it.key;
              return (
                <button
                  key={it.key}
                  onClick={() => setTab(it.key)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-primary-500/10 text-primary-300"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
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
          <div className="relative flex-1 min-w-[200px] max-w-sm mr-2">
            <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por #id, título, nome, email..."
              className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-xs"
            />
          </div>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-10 h-10 rounded-full border-2 border-primary-500/30 border-t-primary-400 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl py-16 text-center">
          <p className="text-gray-400">Nenhum chamado encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((t) => (
            <TicketCard
              key={t.id}
              ticket={t}
              href={`/admin/support/${t.id}`}
              showRequester
            />
          ))}
        </div>
      )}
    </div>
  );
}
