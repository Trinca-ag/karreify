"use client";

import { useEffect, useState } from "react";
import { adminFetch, type AdminUserRow } from "@/services/admin";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { Users, Search, Plus, Trash2, AlertTriangle, Coins } from "lucide-react";
import toast from "react-hot-toast";

function planBadge(plan: string) {
  if (plan === "advanced") return "bg-violet-500/10 text-violet-400 border-violet-500/20";
  if (plan === "intermediate") return "bg-blue-500/10 text-blue-400 border-blue-500/20";
  if (plan === "basic") return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  return "bg-white/5 text-gray-400 border-white/10";
}

function userInitial(u: AdminUserRow) {
  return (u.displayName ?? u.email)[0]?.toUpperCase() ?? "?";
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [filtered, setFiltered] = useState<AdminUserRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [creditsTarget, setCreditsTarget] = useState<AdminUserRow | null>(null);
  const [creditsAmount, setCreditsAmount] = useState("");
  const [creditsLoading, setCreditsLoading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<AdminUserRow | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/users");
      const data = await res.json();
      if (data.success) { setUsers(data.users); setFiltered(data.users); }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchUsers(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(users.filter(u =>
      (u.displayName ?? "").toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    ));
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
      setCreditsTarget(null);
      setCreditsAmount("");
      fetchUsers();
    } finally {
      setCreditsLoading(false);
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
      setDeleteTarget(null);
      fetchUsers();
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
      ) : (
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left px-6 py-3.5 text-xs text-gray-500 font-medium uppercase tracking-wider">Usuário</th>
                  <th className="text-left px-6 py-3.5 text-xs text-gray-500 font-medium uppercase tracking-wider hidden md:table-cell">Plano</th>
                  <th className="text-left px-6 py-3.5 text-xs text-gray-500 font-medium uppercase tracking-wider hidden sm:table-cell">Créditos</th>
                  <th className="text-left px-6 py-3.5 text-xs text-gray-500 font-medium uppercase tracking-wider hidden lg:table-cell">Criado em</th>
                  <th className="text-right px-6 py-3.5 text-xs text-gray-500 font-medium uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-16 text-gray-500">
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                ) : filtered.map(u => (
                  <tr key={u.uid} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white/5 border border-white/[0.08] rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-semibold text-gray-300">{userInitial(u)}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate">{u.displayName ?? <span className="text-gray-500">—</span>}</p>
                          <p className="text-xs text-gray-500 truncate">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className={`px-2 py-0.5 rounded-md text-xs border capitalize ${planBadge(u.plan)}`}>
                        {u.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="text-emerald-400 font-semibold tabular-nums">{u.credits}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs hidden lg:table-cell">
                      {new Date(u.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => { setCreditsTarget(u); setCreditsAmount(""); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors text-xs font-medium border border-emerald-500/10"
                        >
                          <Coins className="w-3 h-3" /> Créditos
                        </button>
                        <button
                          onClick={() => setDeleteTarget(u)}
                          className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Excluir conta"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
