"use client";

import { useState } from "react";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { User, Mail, Shield, Coins, Calendar } from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, userData, refreshUserData } = useAuthContext();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await updateProfile(user, { displayName });
      await updateDoc(doc(db, "users", user.uid), { displayName });
      await refreshUserData();
      toast.success("Perfil atualizado!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar perfil.");
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white font-heading flex items-center gap-3">
          <User className="w-7 h-7 text-primary-400" />
          Meu Perfil
        </h1>
        <p className="text-gray-400 mt-1">Gerencie suas informacoes pessoais.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-white font-heading">Informacoes Pessoais</h2>
            </CardHeader>
            <CardBody className="space-y-4">
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
    </div>
  );
}
