"use client";

import { useEffect, useState } from "react";
import { useAdminAuth } from "@/components/providers/AdminAuthProvider";
import { adminFetch, type AdminProfile } from "@/services/admin";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Shield, Plus, Trash2, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

function roleBadge(role: string) {
  if (role === "superadmin") return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  return "bg-white/[0.06] text-gray-400 border-white/10";
}

const emptyForm = { name: "", username: "", email: "", password: "", confirmPassword: "" };

export default function AdminsPage() {
  const { adminData } = useAdminAuth();
  const [admins, setAdmins] = useState<AdminProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<AdminProfile | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState(emptyForm);
  const [createLoading, setCreateLoading] = useState(false);

  async function fetchAdmins() {
    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/admins-list");
      const data = await res.json();
      if (data.success) setAdmins(data.admins);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchAdmins(); }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await adminFetch("/api/admin/delete-admin", {
        method: "DELETE",
        body: JSON.stringify({ uid: deleteTarget.uid }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Erro ao remover administrador."); return; }
      toast.success(`${deleteTarget.name} removido dos administradores.`);
      setAdmins(prev => prev.filter(a => a.uid !== deleteTarget.uid));
      setDeleteTarget(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  const closeCreate = () => {
    if (createLoading) return;
    setCreateOpen(false);
    setCreateForm(emptyForm);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, username, email, password, confirmPassword } = createForm;
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

    setCreateLoading(true);
    try {
      const res = await adminFetch("/api/admin/create", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          username: username.toLowerCase().trim(),
          email: email.toLowerCase().trim(),
          password,
        }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Erro ao criar administrador."); return; }
      toast.success("Administrador criado com sucesso!");
      setCreateOpen(false);
      setCreateForm(emptyForm);
      fetchAdmins();
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-3">
            <Shield className="w-7 h-7 text-violet-400" />
            Administradores
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            {admins.length} administrador{admins.length !== 1 ? "es" : ""} cadastrado{admins.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 text-primary-400 rounded-xl hover:bg-primary-500/20 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> Novo Admin
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="w-10 h-10 rounded-full border-2 border-primary-500/30 border-t-primary-400 animate-spin" />
        </div>
      ) : (
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
          {admins.length === 0 ? (
            <p className="text-center py-16 text-gray-500">Nenhum administrador encontrado.</p>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {admins.map(admin => {
                const isSelf = admin.uid === adminData?.uid;
                return (
                  <div key={admin.uid} className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors">
                    {/* Avatar */}
                    <div className="w-10 h-10 bg-primary-500/10 border border-primary-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary-400">
                        {admin.name[0]?.toUpperCase()}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-white">{admin.name}</p>
                        {isSelf && (
                          <span className="px-1.5 py-0.5 bg-primary-500/10 text-primary-400 text-[11px] rounded border border-primary-500/20">
                            Você
                          </span>
                        )}
                        <span className={`px-1.5 py-0.5 text-[11px] rounded border capitalize ${roleBadge(admin.role)}`}>
                          {admin.role}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        @{admin.username} · {admin.email}
                      </p>
                    </div>

                    {/* Date */}
                    <p className="text-xs text-gray-600 flex-shrink-0 hidden sm:block">
                      {new Date(admin.createdAt as string).toLocaleDateString("pt-BR")}
                    </p>

                    {/* Delete */}
                    <button
                      onClick={() => setDeleteTarget(admin)}
                      disabled={isSelf}
                      className="flex-shrink-0 p-2 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title={isSelf ? "Não é possível remover a si mesmo" : "Remover administrador"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Create Admin Modal */}
      <Modal isOpen={createOpen} onClose={closeCreate} title="Novo administrador" size="sm">
        <form onSubmit={handleCreate} action="javascript:void(0)" className="space-y-4">
          <Input
            label="Nome completo"
            type="text"
            value={createForm.name}
            onChange={e => setCreateForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Seu nome"
            required
          />
          <Input
            label="Username"
            type="text"
            value={createForm.username}
            onChange={e =>
              setCreateForm(f => ({
                ...f,
                username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""),
              }))
            }
            placeholder="ex: joao_silva"
            required
          />
          <Input
            label="E-mail"
            type="email"
            value={createForm.email}
            onChange={e => setCreateForm(f => ({ ...f, email: e.target.value }))}
            placeholder="email@exemplo.com"
            required
          />
          <Input
            label="Senha"
            type="password"
            value={createForm.password}
            onChange={e => setCreateForm(f => ({ ...f, password: e.target.value }))}
            placeholder="Mínimo 6 caracteres"
            required
          />
          <Input
            label="Confirmar senha"
            type="password"
            value={createForm.confirmPassword}
            onChange={e => setCreateForm(f => ({ ...f, confirmPassword: e.target.value }))}
            placeholder="Repita a senha"
            required
          />
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" type="button" onClick={closeCreate} disabled={createLoading}>
              Cancelar
            </Button>
            <Button type="submit" loading={createLoading}>
              Criar admin
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Remover Administrador" size="sm">
        {deleteTarget && (
          <div className="space-y-5">
            <div className="flex items-start gap-3 p-4 bg-red-500/5 border border-red-500/15 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-300">
                <span className="font-semibold text-white">{deleteTarget.name}</span> perderá o acesso ao painel administrativo e sua conta será excluída permanentemente.
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-colors text-sm font-medium disabled:opacity-50"
              >
                {deleteLoading ? "Removendo..." : "Remover admin"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
