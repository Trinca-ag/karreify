"use client";

import { useEffect, useMemo, useState } from "react";
import { adminFetch, type AdminUserRow } from "@/services/admin";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { Users, Search, Trash2, AlertTriangle, Coins } from "lucide-react";
import toast from "react-hot-toast";

function userInitial(u: AdminUserRow) {
  return (u.displayName ?? u.email)[0]?.toUpperCase() ?? "?";
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [creditsTarget, setCreditsTarget] = useState<AdminUserRow | null>(null);
  const [creditsAmount, setCreditsAmount] = useState("");
  const [creditsLoading, setCreditsLoading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<AdminUserRow | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [roleSaving, setRoleSaving] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await adminFetch("/api/admin/users");
        const data = await res.json();
        if (!cancelled && data.success) setUsers(data.users);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return users;
    return users.filter(u =>
      (u.displayName ?? "").toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }, [search, users]);

  const handleAddCredits = async () => {
    if (!creditsTarget) return;
    const amount = parseInt(creditsAmount);
    if (isNaN(amount) || amount <= 0) { toast.error("Valor inválido."); return; }
    setCreditsLoading(true);
    try {
      const res = await adminFetch("/api/admin/add-credits", {
        method: "POST",
        body: JSON.stringify({ uid: creditsTarget.uid, amount }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Erro ao adicionar créditos."); return; }
      toast.success(`${amount} créditos adicionados para ${creditsTarget.displayName ?? creditsTarget.email}`);
      setUsers(prev =>
        prev.map(u => u.uid === creditsTarget.uid ? { ...u, credits: u.credits + amount } : u)
      );
      setCreditsTarget(null);
      setCreditsAmount("");
    } finally {
      setCreditsLoading(false);
    }
  };

  const handleRoleChange = async (u: AdminUserRow, newRole: "user" | "tester") => {
    if (u.role === newRole) return;
    setRoleSaving(u.uid);
    try {
      const res = await adminFetch("/api/admin/set-role", {
        method: "POST",
        body: JSON.stringify({ uid: u.uid, role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Erro ao atualizar role.");
        return;
      }
      const granted = typeof data.granted === "number" ? data.granted : 0;
      const revoked = typeof data.revoked === "number" ? data.revoked : 0;
      if (granted > 0) {
        toast.success(`${u.displayName ?? u.email} virou Tester (+${granted} moedas).`);
      } else if (revoked > 0) {
        toast.success(`${u.displayName ?? u.email} voltou a ser Usuário (-${revoked} moedas).`);
      } else {
        toast.success(`Role atualizada para ${newRole === "tester" ? "Tester" : "Usuário"}.`);
      }
      setUsers(prev =>
        prev.map(row =>
          row.uid === u.uid
            ? { ...row, role: newRole, credits: row.credits + granted - revoked }
            : row
        )
      );
    } finally {
      setRoleSaving(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await adminFetch("/api/admin/delete-user", {
        method: "DELETE",
        body: JSON.stringify({ uid: deleteTarget.uid }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Erro ao excluir conta."); return; }
      toast.success("Conta excluída com sucesso.");
      setUsers(prev => prev.filter(u => u.uid !== deleteTarget.uid));
      setDeleteTarget(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-3">
            <Users className="w-7 h-7 text-blue-400" />
            Usuários Cadastrados
          </h1>
          <p className="text-gray-400 mt-1 text-sm">{users.length} usuários no total</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nome ou e-mail..."
          className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/30 text-sm transition-all"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="w-10 h-10 rounded-full border-2 border-primary-500/30 border-t-primary-400 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl py-16 text-center">
          <Users className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">
            {users.length === 0 ? "Nenhum usuário cadastrado ainda." : "Nenhum usuário corresponde à busca."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(u => (
            <div
              key={u.uid}
              className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 sm:p-5 hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-11 sm:h-11 bg-white/5 border border-white/[0.08] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-gray-300">{userInitial(u)}</span>
                </div>

                <div className="flex-1 min-w-0 space-y-3">
                  {/* Identity + delete */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm sm:text-base font-medium text-white truncate">
                        {u.displayName ?? <span className="text-gray-500">—</span>}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{u.email}</p>
                    </div>
                    <button
                      onClick={() => setDeleteTarget(u)}
                      className="flex-shrink-0 p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Excluir conta"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Meta: credits chip + date */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold tabular-nums">
                      <Coins className="w-3 h-3" />
                      {u.credits}
                    </span>
                    <span className="text-[11px] text-gray-600">
                      {new Date(u.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>

                  {/* Actions: role select + credits button — stacked on mobile, inline on desktop */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <select
                      value={u.role}
                      disabled={roleSaving === u.uid}
                      onChange={e => handleRoleChange(u, e.target.value as "user" | "tester")}
                      className={`w-full sm:w-auto px-2.5 py-2 rounded-lg text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition-colors disabled:opacity-50 cursor-pointer ${
                        u.role === "tester"
                          ? "bg-violet-500/10 text-violet-300 border-violet-500/20"
                          : "bg-white/[0.04] text-gray-300 border-white/[0.08]"
                      }`}
                    >
                      <option value="user" style={{ backgroundColor: "#0a0a1a", color: "#fff" }}>Usuário</option>
                      <option value="tester" style={{ backgroundColor: "#0a0a1a", color: "#fff" }}>Tester</option>
                    </select>

                    <button
                      onClick={() => { setCreditsTarget(u); setCreditsAmount(""); }}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors text-xs font-medium border border-emerald-500/10"
                    >
                      <Coins className="w-3 h-3" /> Adicionar créditos
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Credits Modal */}
      <Modal isOpen={!!creditsTarget} onClose={() => setCreditsTarget(null)} title="Adicionar Créditos" size="sm">
        {creditsTarget && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 p-3 bg-white/[0.03] rounded-xl border border-white/[0.06]">
              <div className="w-9 h-9 bg-white/5 border border-white/[0.08] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-semibold text-gray-300">{userInitial(creditsTarget)}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">{creditsTarget.displayName ?? creditsTarget.email}</p>
                <p className="text-xs text-gray-500">Créditos atuais: <span className="text-emerald-400 font-semibold">{creditsTarget.credits}</span></p>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Quantidade a adicionar</label>
              <input
                type="number"
                min={1}
                max={10000}
                value={creditsAmount}
                onChange={e => setCreditsAmount(e.target.value)}
                placeholder="Ex: 50"
                className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 text-sm"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setCreditsTarget(null)}>Cancelar</Button>
              <Button onClick={handleAddCredits} loading={creditsLoading}>Adicionar</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Excluir Conta" size="sm">
        {deleteTarget && (
          <div className="space-y-5">
            <div className="flex items-start gap-3 p-4 bg-red-500/5 border border-red-500/15 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-300">
                Esta ação é <span className="text-red-400 font-medium">irreversível</span>. A conta de{" "}
                <span className="font-semibold text-white">{deleteTarget.displayName ?? deleteTarget.email}</span> será permanentemente excluída.
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-colors text-sm font-medium disabled:opacity-50"
              >
                {deleteLoading ? "Excluindo..." : "Excluir conta"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
