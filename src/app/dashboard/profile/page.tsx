"use client";

import { useState, useEffect } from "react";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { invalidateUser } from "@/lib/cache";
import { getUserDevices, removeDevice } from "@/services/device-manager";
import { getDeviceId } from "@/utils/device-fingerprint";
import Image from "next/image";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import {
  User,
  Mail,
  Shield,
  Coins,
  Calendar,
  Monitor,
  Smartphone,
  Trash2,
  Globe,
  CheckCircle,
  Camera,
  Check,
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
  const { user, userData, refreshUserData } = useAuthContext();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [loading, setLoading] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [devicesLoading, setDevicesLoading] = useState(true);
  const [deviceToRemove, setDeviceToRemove] = useState<Device | null>(null);
  const [removing, setRemoving] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [savingAvatar, setSavingAvatar] = useState(false);

  const currentDeviceId = typeof window !== "undefined" ? getDeviceId() : "";
  const currentPhoto = userData?.photoURL || user?.photoURL || null;

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
      console.error(error);
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
      console.error(error);
      toast.error("Erro ao atualizar perfil.");
    } finally {
      setLoading(false);
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
      console.error(error);
      toast.error("Erro ao atualizar avatar.");
    } finally {
      setSavingAvatar(false);
    }
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
      console.error(error);
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
      <div>
        <h1 className="text-2xl font-bold text-white font-heading flex items-center gap-3">
          <User className="w-7 h-7 text-primary-400" />
          Meu Perfil
        </h1>
        <p className="text-gray-400 mt-1">Gerencie suas informacoes pessoais e dispositivos.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="lg:col-span-2 space-y-6">
          {/* Avatar + Name */}
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-white font-heading">Informacoes Pessoais</h2>
            </CardHeader>
            <CardBody className="space-y-6">
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
                  <p className="text-gray-500 text-sm">{user?.email}</p>
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
                <Input
                  label="Email"
                  value={user?.email || ""}
                  disabled
                  helperText="O email nao pode ser alterado."
                />
                <div className="pt-2">
                  <Button onClick={handleUpdateProfile} loading={loading}>
                    Salvar alteracoes
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Account info */}
        <div className="space-y-4">
          <Card>
            <CardBody className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-500/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Plano</p>
                  <p className="font-semibold text-white capitalize">{userData?.plan || "Free"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                  <Coins className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Creditos</p>
                  <p className="font-semibold text-white">{userData?.credits ?? 0}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold text-gray-300 text-sm">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
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
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Devices section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white font-heading flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary-400" />
              Dispositivos conectados
            </h2>
            <span className="text-xs text-gray-500">
              {devices.length} dispositivo{devices.length !== 1 ? "s" : ""}
            </span>
          </div>
        </CardHeader>
        <CardBody>
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
        </CardBody>
      </Card>

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
