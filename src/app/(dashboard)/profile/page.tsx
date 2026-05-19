"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/components/providers/AuthProvider";
import {
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { invalidateUser } from "@/lib/cache";
import { getUserDevices, removeDevice } from "@/services/device-manager";
import { deleteOwnAccount, hasPasswordProvider } from "@/services/account";
import { getDeviceId } from "@/utils/device-fingerprint";
import { authedFetch } from "@/lib/api-client";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import {
  User,
  Mail,
  Coins,
  Calendar,
  Monitor,
  Smartphone,
  Trash2,
  Globe,
  CheckCircle,
  Camera,
  Check,
  AlertTriangle,
  Save,
  KeyRound,
  Lock,
} from "lucide-react";
import toast from "react-hot-toast";
import type { Device } from "@/types";

const AVATARS = [
  "/avatars/avatar-1.png",
  "/avatars/avatar-2.png",
  "/avatars/avatar-3.png",
  "/avatars/avatar-4.png",
  "/avatars/avatar-5.png",
  "/avatars/avatar-6.png",
];

function getDeviceIcon(os: string) {
  if (os === "Android" || os === "iOS") return Smartphone;
  return Monitor;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, userData, refreshUserData } = useAuthContext();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [loading, setLoading] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [devicesLoading, setDevicesLoading] = useState(true);
  const [deviceToRemove, setDeviceToRemove] = useState<Device | null>(null);
  const [removing, setRemoving] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [savingAvatar, setSavingAvatar] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [autoSaveDocuments, setAutoSaveDocuments] = useState(
    userData?.autoSaveDocuments ?? false
  );
  const [savingAutoSave, setSavingAutoSave] = useState(false);

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailStep, setEmailStep] = useState<"email" | "code">("email");
  const [newEmail, setNewEmail] = useState("");
  const [emailDigits, setEmailDigits] = useState(["", "", "", "", "", ""]);
  const [sendingEmailCode, setSendingEmailCode] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [emailCooldown, setEmailCooldown] = useState(0);
  const emailInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const currentDeviceId = typeof window !== "undefined" ? getDeviceId() : "";
  const currentPhoto = userData?.photoURL || user?.photoURL || null;
  const usesPasswordProvider = hasPasswordProvider();

  useEffect(() => {
    setAutoSaveDocuments(userData?.autoSaveDocuments ?? false);
  }, [userData?.autoSaveDocuments]);

  useEffect(() => {
    if (emailCooldown <= 0) return;
    const timer = setTimeout(() => setEmailCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [emailCooldown]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setDevicesLoading(true);
    getUserDevices(user.uid)
      .then((list) => {
        if (cancelled) return;
        list.sort((a, b) => {
          if (a.id === currentDeviceId) return -1;
          if (b.id === currentDeviceId) return 1;
          return b.lastActiveAt.getTime() - a.lastActiveAt.getTime();
        });
        setDevices(list);
      })
      .catch(console.error)
      .finally(() => { if (!cancelled) setDevicesLoading(false); });
    return () => { cancelled = true; };
  }, [user, currentDeviceId]);

  const loadDevices = async () => {
    if (!user) return;
    setDevicesLoading(true);
    try {
      const list = await getUserDevices(user.uid);
      list.sort((a, b) => {
        if (a.id === currentDeviceId) return -1;
        if (b.id === currentDeviceId) return 1;
        return b.lastActiveAt.getTime() - a.lastActiveAt.getTime();
      });
      setDevices(list);
    } catch (error) {
      console.error("[profile] loadDevices failed:", error);
    } finally {
      setDevicesLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await updateProfile(user, { displayName });
      await updateDoc(doc(db, "users", user.uid), { displayName });
      invalidateUser(user.uid);
      await refreshUserData();
      toast.success("Perfil atualizado!");
    } catch (error) {
      console.error("[profile] updateProfile failed:", error);
      toast.error("Erro ao atualizar perfil.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAutoSave = async (next: boolean) => {
    if (!user || savingAutoSave) return;
    setAutoSaveDocuments(next);
    setSavingAutoSave(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        autoSaveDocuments: next,
      });
      invalidateUser(user.uid);
      await refreshUserData();
      toast.success(
        next
          ? "Salvamento automático ativado."
          : "Salvamento automático desativado."
      );
    } catch (error) {
      console.error("[profile] toggleAutoSave failed:", error);
      toast.error("Erro ao atualizar preferência.");
      setAutoSaveDocuments(!next);
    } finally {
      setSavingAutoSave(false);
    }
  };

  const resetEmailModal = () => {
    setEmailStep("email");
    setNewEmail("");
    setEmailDigits(["", "", "", "", "", ""]);
    setEmailCooldown(0);
  };

  const closeEmailModal = () => {
    if (sendingEmailCode || verifyingEmail) return;
    setShowEmailModal(false);
    resetEmailModal();
  };

  const handleSendEmailCode = async () => {
    if (!user || sendingEmailCode) return;
    const target = newEmail.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(target)) {
      toast.error("Digite um email válido.");
      return;
    }
    const currentEmail = (userData?.email || user.email || "").toLowerCase();
    if (target === currentEmail) {
      toast.error("O novo email é igual ao atual.");
      return;
    }

    setSendingEmailCode(true);
    try {
      const res = await authedFetch("/api/change-email/send-code", {
        method: "POST",
        body: JSON.stringify({ newEmail: target }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Erro ao enviar código.");
        return;
      }
      if (data.fallback) {
        toast("Email não configurado. Tente novamente em instantes.", { icon: "⚠️", duration: 8000 });
      } else {
        toast.success("Código enviado para " + target);
      }
      setEmailStep("code");
      setEmailCooldown(60);
    } catch {
      toast.error("Erro ao enviar código.");
    } finally {
      setSendingEmailCode(false);
    }
  };

  const handleEmailDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...emailDigits];
    next[index] = value.slice(-1);
    setEmailDigits(next);
    if (value && index < 5) emailInputRefs.current[index + 1]?.focus();
  };

  const handleEmailDigitKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !emailDigits[index] && index > 0) {
      emailInputRefs.current[index - 1]?.focus();
    }
  };

  const handleEmailDigitPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setEmailDigits(pasted.split(""));
      emailInputRefs.current[5]?.focus();
    }
  };

  const handleVerifyEmailCode = async () => {
    if (!user || verifyingEmail) return;
    const code = emailDigits.join("");
    if (code.length !== 6) {
      toast.error("Digite o código completo.");
      return;
    }
    const target = newEmail.trim().toLowerCase();
    setVerifyingEmail(true);
    try {
      const res = await authedFetch("/api/change-email/verify", {
        method: "POST",
        body: JSON.stringify({ newEmail: target, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Código inválido ou expirado.");
        setEmailDigits(["", "", "", "", "", ""]);
        emailInputRefs.current[0]?.focus();
        return;
      }
      // O backend já atualizou o email no Auth e no Firestore. Não chamamos
      // reload(user) porque o ID token em memória ainda traz o email antigo
      // como claim, e o reload pode disparar onAuthStateChanged(null) e
      // derrubar a sessão. O onSnapshot do useAuth pega o novo email no
      // Firestore automaticamente — usamos userData.email na UI.
      invalidateUser(user.uid);
      try {
        await refreshUserData();
      } catch {
        // onSnapshot vai sincronizar; ignore
      }
      toast.success("Email atualizado!");
      setShowEmailModal(false);
      resetEmailModal();
    } catch {
      toast.error("Erro ao alterar email.");
    } finally {
      setVerifyingEmail(false);
    }
  };

  const closePasswordModal = () => {
    if (updatingPassword) return;
    setShowPasswordModal(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleUpdatePassword = async () => {
    if (!user || updatingPassword) return;
    if (!user.email) {
      toast.error("Conta sem email associado.");
      return;
    }
    if (!currentPassword) {
      toast.error("Informe sua senha atual.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }
    if (newPassword === currentPassword) {
      toast.error("A nova senha deve ser diferente da atual.");
      return;
    }

    setUpdatingPassword(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      void authedFetch("/api/notifications/password-changed", { method: "POST" }).catch(() => {});
      toast.success("Senha alterada com sucesso!");
      closePasswordModal();
    } catch (error) {
      const code = (error as { code?: string }).code;
      if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
        toast.error("Senha atual incorreta.");
      } else if (code === "auth/too-many-requests") {
        toast.error("Muitas tentativas. Tente novamente mais tarde.");
      } else if (code === "auth/weak-password") {
        toast.error("Senha muito fraca.");
      } else {
        console.error("[profile] changePassword failed:", error);
        toast.error("Erro ao alterar senha.");
      }
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleSelectAvatar = async (avatarUrl: string) => {
    if (!user) return;
    setSavingAvatar(true);
    try {
      await updateProfile(user, { photoURL: avatarUrl });
      await updateDoc(doc(db, "users", user.uid), { photoURL: avatarUrl });
      invalidateUser(user.uid);
      await refreshUserData();
      toast.success("Avatar atualizado!");
      setShowAvatarPicker(false);
    } catch (error) {
      console.error("[profile] updateAvatar failed:", error);
      toast.error("Erro ao atualizar avatar.");
    } finally {
      setSavingAvatar(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    const usesPassword = hasPasswordProvider();
    if (usesPassword && !deletePassword.trim()) {
      toast.error("Informe sua senha para continuar.");
      return;
    }
    setDeleting(true);
    try {
      await deleteOwnAccount(usesPassword ? deletePassword : undefined);
      toast.success("Conta excluída.");
      router.replace("/");
    } catch (error) {
      const code = (error as { code?: string }).code;
      if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
        toast.error("Senha incorreta.");
      } else if (code === "auth/too-many-requests") {
        toast.error("Muitas tentativas. Tente novamente mais tarde.");
      } else if (code === "auth/popup-closed-by-user") {
        toast.error("Autenticação cancelada.");
      } else {
        console.error("[profile] deleteAccount failed:", error);
        toast.error("Erro ao excluir a conta. Tente novamente.");
      }
    } finally {
      setDeleting(false);
    }
  };

  const closeDeleteModal = () => {
    if (deleting) return;
    setShowDeleteModal(false);
    setDeletePassword("");
  };

  const handleRemoveDevice = async () => {
    if (!user || !deviceToRemove) return;
    setRemoving(true);
    try {
      await removeDevice(user.uid, deviceToRemove.id);
      toast.success("Dispositivo removido.");
      setDeviceToRemove(null);
      await loadDevices();
    } catch (error) {
      console.error("[profile] removeDevice failed:", error);
      toast.error("Erro ao remover dispositivo.");
    } finally {
      setRemoving(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-3xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl">
        <div className="absolute -top-24 -left-16 w-80 h-80 bg-primary-500/20 rounded-full blur-[120px] animate-pulse-glow pointer-events-none" />
        <div className="absolute -bottom-32 -right-10 w-96 h-96 bg-accent-violet/20 rounded-full blur-[140px] animate-pulse-glow pointer-events-none" style={{ animationDelay: "1.5s" }} />
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
        <div className="relative p-8 md:p-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-xs font-medium text-primary-300 mb-4">
            <User className="w-3 h-3" />
            Perfil
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white font-heading leading-[1.1] tracking-tight">
            Gerencie sua{" "}
            <span className="gradient-text">conta</span>
          </h1>
          <p className="text-gray-400 mt-4 text-base md:text-lg max-w-xl leading-relaxed">
            Atualize suas informações pessoais, avatar e gerencie seus dispositivos conectados.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up animation-delay-200">
        {/* Profile card */}
        <div className="lg:col-span-2 space-y-6">
          {/* Avatar + Name */}
          <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] hover:border-primary-500/30 transition-all duration-300">
            <div className="px-6 py-4 border-b border-white/[0.06]">
              <h2 className="font-semibold text-white font-heading">Informações Pessoais</h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-5">
                <button
                  onClick={() => setShowAvatarPicker(true)}
                  className="relative group flex-shrink-0"
                >
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/10 group-hover:border-primary-500/50 transition-colors">
                    {currentPhoto ? (
                      <Image
                        src={currentPhoto}
                        alt="Avatar"
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-600 to-accent-violet flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">
                          {(userData?.displayName || user?.displayName || "U").charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                </button>
                <div>
                  <p className="text-white font-medium">{userData?.displayName || user?.displayName || "Usuário"}</p>
                  <p className="text-gray-500 text-sm">{userData?.email || user?.email}</p>
                  <button
                    onClick={() => setShowAvatarPicker(true)}
                    className="text-xs text-primary-400 hover:text-primary-300 mt-1 transition-colors"
                  >
                    Alterar avatar
                  </button>
                </div>
              </div>

              <div className="border-t border-white/[0.06] pt-4 space-y-4">
                <Input
                  label="Nome"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Seu nome"
                />
                <div>
                  <Input
                    label="Email"
                    value={userData?.email || user?.email || ""}
                    disabled
                    helperText={
                      usesPasswordProvider
                        ? "Para mudar o email, clique em \"Alterar email\"."
                        : "Para mudar o email, altere o email da sua conta Google vinculada."
                    }
                  />
                  {usesPasswordProvider && (
                    <button
                      type="button"
                      onClick={() => {
                        resetEmailModal();
                        setShowEmailModal(true);
                      }}
                      className="mt-2 inline-flex items-center gap-1.5 text-xs text-primary-400 hover:text-primary-300 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Alterar email
                    </button>
                  )}
                </div>
                {usesPasswordProvider && (
                  <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 bg-primary-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Lock className="w-4 h-4 text-primary-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white">Senha</p>
                        <p className="text-xs text-gray-500">Altere sua senha de acesso.</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCurrentPassword("");
                        setNewPassword("");
                        setConfirmPassword("");
                        setShowPasswordModal(true);
                      }}
                    >
                      Alterar senha
                    </Button>
                  </div>
                )}
                <div className="pt-2">
                  <Button onClick={handleUpdateProfile} loading={loading} className="glow-blue">
                    Salvar alterações
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account info */}
        <div className="space-y-4">
          <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] hover:border-primary-500/30 transition-all duration-300 p-6 space-y-4">
            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center group-hover:bg-yellow-500/20 transition-colors">
                <Coins className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Moedas</p>
                <p className="font-semibold text-white">{userData?.credits ?? 0}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                <Mail className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold text-gray-300 text-sm">{userData?.email || user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <Calendar className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Membro desde</p>
                <p className="font-semibold text-gray-300 text-sm">
                  {user?.metadata?.creationTime
                    ? new Date(user.metadata.creationTime).toLocaleDateString("pt-BR")
                    : "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] hover:border-primary-500/30 transition-all duration-300 animate-fade-in-up animation-delay-300">
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <h2 className="font-semibold text-white font-heading flex items-center gap-2">
            <Save className="w-5 h-5 text-primary-400" />
            Preferências
          </h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">
                Salvar documentos automaticamente
              </p>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Quando ativado, os documentos gerados são salvos automaticamente em
                &quot;Meus Arquivos&quot; (respeitando o limite de cada categoria).
                Quando desativado, você precisa clicar em &quot;Salvar&quot; para
                guardar o documento.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={autoSaveDocuments}
              onClick={() => handleToggleAutoSave(!autoSaveDocuments)}
              disabled={savingAutoSave}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                autoSaveDocuments
                  ? "bg-primary-500/80 border-primary-400/50"
                  : "bg-white/10 border-white/10"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow ${
                  autoSaveDocuments ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Devices section */}
      <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] hover:border-primary-500/30 transition-all duration-300 animate-fade-in-up animation-delay-350">
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white font-heading flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary-400" />
              Dispositivos conectados
            </h2>
            <span className="text-xs text-gray-500">
              {devices.length} dispositivo{devices.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
        <div className="p-6">
          {devicesLoading ? (
            <div className="py-8 text-center text-gray-500 text-sm">Carregando dispositivos...</div>
          ) : devices.length === 0 ? (
            <div className="py-8 text-center text-gray-500 text-sm">Nenhum dispositivo registrado.</div>
          ) : (
            <div className="space-y-3">
              {devices.map((device) => {
                const isCurrent = device.id === currentDeviceId;
                const DeviceIcon = getDeviceIcon(device.os);

                return (
                  <div
                    key={device.id}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                      isCurrent
                        ? "bg-primary-500/5 border-primary-500/20"
                        : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isCurrent ? "bg-primary-500/10" : "bg-white/[0.05]"
                        }`}
                      >
                        <DeviceIcon
                          className={`w-5 h-5 ${
                            isCurrent ? "text-primary-400" : "text-gray-400"
                          }`}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">
                            {device.deviceName}
                          </span>
                          {isCurrent && (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-primary-500/10 border border-primary-500/20 rounded-full text-xs text-primary-400">
                              <CheckCircle className="w-3 h-3" />
                              Este dispositivo
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs text-gray-500">
                            Verificado: {formatDate(device.lastVerifiedAt)}
                          </span>
                          <span className="text-xs text-gray-600">|</span>
                          <span className="text-xs text-gray-500">
                            Ativo: {formatDate(device.lastActiveAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {!isCurrent && (
                      <button
                        onClick={() => setDeviceToRemove(device)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors"
                        title="Remover dispositivo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <p className="text-xs text-gray-600 mt-4">
            Dispositivos verificados permanecem confiáveis por 15 dias. Remover um dispositivo exigirá nova verificação no próximo login.
          </p>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] hover:border-red-500/20 transition-all duration-300 animate-fade-in-up animation-delay-400">
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <h2 className="font-semibold text-white font-heading flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Zona de perigo
          </h2>
        </div>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl border border-red-500/20 bg-red-500/5">
            <div>
              <p className="text-sm font-medium text-white">Excluir conta</p>
              <p className="text-xs text-gray-400 mt-1">
                Remove permanentemente sua conta, currículos, dispositivos e histórico.
              </p>
            </div>
            <Button
              variant="primary"
              className="!bg-red-600 hover:!bg-red-700"
              onClick={() => setShowDeleteModal(true)}
            >
              Excluir a conta
            </Button>
          </div>
        </div>
      </div>

      {/* Change email modal */}
      <Modal
        isOpen={showEmailModal}
        onClose={closeEmailModal}
        title={emailStep === "email" ? "Alterar email" : "Verificação"}
        size="sm"
      >
        {emailStep === "email" ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-primary-500/5 border border-primary-500/15">
              <Mail className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-300">
                Informe o novo email. Enviaremos um código de 6 dígitos para confirmar
                que você tem acesso a ele.
              </p>
            </div>
            <Input
              label="Email atual"
              value={userData?.email || user?.email || ""}
              disabled
            />
            <Input
              label="Novo email"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="novo@email.com"
              autoComplete="email"
              disabled={sendingEmailCode}
            />
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={closeEmailModal}
                disabled={sendingEmailCode}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleSendEmailCode}
                loading={sendingEmailCode}
              >
                Enviar código
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="text-center">
              <div className="w-14 h-14 bg-primary-500/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Mail className="w-7 h-7 text-primary-400" />
              </div>
              <p className="text-sm text-gray-400">Digite o código enviado para</p>
              <p className="text-white font-medium text-sm mt-1 break-all">{newEmail}</p>
            </div>

            <div className="flex justify-center gap-2" onPaste={handleEmailDigitPaste}>
              {emailDigits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { emailInputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleEmailDigitChange(i, e.target.value)}
                  onKeyDown={(e) => handleEmailDigitKeyDown(i, e)}
                  disabled={verifyingEmail}
                  className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold bg-white/[0.05] border border-white/[0.1] rounded-xl text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all disabled:opacity-50"
                />
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setEmailStep("email")}
                disabled={verifyingEmail}
              >
                Voltar
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleVerifyEmailCode}
                loading={verifyingEmail}
                disabled={emailDigits.join("").length !== 6}
              >
                Confirmar
              </Button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={handleSendEmailCode}
                disabled={emailCooldown > 0 || sendingEmailCode || verifyingEmail}
                className="text-sm text-gray-400 hover:text-primary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {emailCooldown > 0
                  ? `Reenviar código em ${emailCooldown}s`
                  : "Reenviar código"}
              </button>
            </div>

            <p className="text-xs text-gray-600 text-center">
              O código expira em 10 minutos. Verifique também a pasta de spam.
            </p>
          </div>
        )}
      </Modal>

      {/* Change password modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={closePasswordModal}
        title="Alterar senha"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-primary-500/5 border border-primary-500/15">
            <KeyRound className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-300">
              Informe sua senha atual e defina uma nova senha de pelo menos 6 caracteres.
            </p>
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); handleUpdatePassword(); }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !updatingPassword) {
                e.preventDefault();
                handleUpdatePassword();
              }
            }}
            className="space-y-4"
          >
            <Input
              label="Senha atual"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Sua senha atual"
              autoComplete="current-password"
              disabled={updatingPassword}
              required
            />
            <Input
              label="Nova senha"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
              disabled={updatingPassword}
              required
            />
            <Input
              label="Confirmar nova senha"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repita a nova senha"
              autoComplete="new-password"
              disabled={updatingPassword}
              required
            />

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={closePasswordModal}
                disabled={updatingPassword}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="primary"
                className="flex-1"
                onClick={handleUpdatePassword}
                loading={updatingPassword}
                disabled={!currentPassword || !newPassword || !confirmPassword}
              >
                Alterar senha
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Avatar Picker Modal */}
      <Modal
        isOpen={showAvatarPicker}
        onClose={() => !savingAvatar && setShowAvatarPicker(false)}
        title="Escolher avatar"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-400">Selecione um avatar para seu perfil.</p>
          <div className="grid grid-cols-3 gap-4">
            {AVATARS.map((avatar) => {
              const isSelected = currentPhoto === avatar;
              return (
                <button
                  key={avatar}
                  onClick={() => handleSelectAvatar(avatar)}
                  disabled={savingAvatar}
                  className={`relative group rounded-2xl overflow-hidden border-2 transition-all duration-200 aspect-square ${
                    isSelected
                      ? "border-primary-500 ring-2 ring-primary-500/30"
                      : "border-white/10 hover:border-primary-500/50"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Image
                    src={avatar}
                    alt="Avatar"
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-primary-500/20 flex items-center justify-center">
                      <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}
                  {!isSelected && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="text-white text-xs font-medium px-3 py-1 bg-black/50 rounded-full backdrop-blur-sm">
                        Selecionar
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          {savingAvatar && (
            <p className="text-center text-sm text-primary-400">Salvando...</p>
          )}
        </div>
      </Modal>

      {/* Delete account modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        title="Excluir conta"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-200">
              Tem certeza que deseja excluir sua conta? Esta ação é irreversível e todos os seus dados serão removidos do banco de dados.
            </p>
          </div>

          {(userData?.credits ?? 0) > 0 && (
            <div className="flex items-start gap-3 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
              <Coins className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-100">
                Você possui <strong>{userData?.credits} crédito{userData?.credits === 1 ? "" : "s"}</strong>. Os créditos <strong>não serão recuperáveis</strong> caso você crie uma nova conta com o mesmo e-mail.
              </p>
            </div>
          )}

          {hasPasswordProvider() ? (
            <Input
              type="password"
              label="Confirme sua senha"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="Sua senha atual"
              disabled={deleting}
              autoComplete="current-password"
            />
          ) : (
            <p className="text-sm text-gray-400">
              Você será solicitado a confirmar com sua conta Google antes da exclusão.
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={closeDeleteModal}
              disabled={deleting}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              className="flex-1 !bg-red-600 hover:!bg-red-700"
              onClick={handleDeleteAccount}
              loading={deleting}
            >
              Sim, excluir
            </Button>
          </div>
        </div>
      </Modal>

      {/* Remove device modal */}
      <Modal
        isOpen={!!deviceToRemove}
        onClose={() => !removing && setDeviceToRemove(null)}
        title="Remover dispositivo"
        size="sm"
      >
        {deviceToRemove && (
          <div className="space-y-4">
            <p className="text-sm text-gray-300">
              Deseja remover <strong className="text-white">{deviceToRemove.deviceName}</strong>?
              O próximo login neste dispositivo exigirá um novo código de verificação.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setDeviceToRemove(null)}
                disabled={removing}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                className="flex-1 !bg-red-600 hover:!bg-red-700"
                onClick={handleRemoveDevice}
                loading={removing}
              >
                Remover
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
