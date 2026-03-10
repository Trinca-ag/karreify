"use client";

import Card, { CardBody } from "@/components/ui/Card";
import { Users, Search, Filter, Mail, Lock } from "lucide-react";

export default function RecruitersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white font-heading flex items-center gap-3">
          <Users className="w-7 h-7 text-primary-400" />
          Area para Recrutadores
        </h1>
        <p className="text-gray-400 mt-1">Encontre os melhores candidatos para suas vagas.</p>
      </div>

      {/* Coming soon */}
      <Card className="border-dashed border-2 border-white/[0.06]">
        <CardBody className="py-16 text-center">
          <div className="w-20 h-20 bg-primary-500/10 border border-primary-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary-500/10">
            <Lock className="w-10 h-10 text-primary-400" />
          </div>
          <h2 className="text-2xl font-bold text-white font-heading mb-3">Em breve!</h2>
          <p className="text-gray-400 max-w-md mx-auto mb-8">
            A area para recrutadores esta em desenvolvimento. Em breve voce podera buscar
            candidatos qualificados, filtrar por habilidades e entrar em contato diretamente.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
            <div className="text-center bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 hover:bg-white/[0.04] transition-all duration-300">
              <div className="w-12 h-12 bg-primary-500/10 border border-primary-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6 text-primary-400" />
              </div>
              <h3 className="font-semibold text-white text-sm">Busca Inteligente</h3>
              <p className="text-xs text-gray-500 mt-1">Encontre candidatos por habilidades e experiencia</p>
            </div>
            <div className="text-center bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 hover:bg-white/[0.04] transition-all duration-300">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Filter className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="font-semibold text-white text-sm">Filtros Avancados</h3>
              <p className="text-xs text-gray-500 mt-1">Filtre por area, nivel e localizacao</p>
            </div>
            <div className="text-center bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 hover:bg-white/[0.04] transition-all duration-300">
              <div className="w-12 h-12 bg-violet-500/10 border border-violet-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="font-semibold text-white text-sm">Contato Direto</h3>
              <p className="text-xs text-gray-500 mt-1">Entre em contato com candidatos diretamente</p>
            </div>
          </div>

          <button
            disabled
            className="px-4 py-2 bg-white/5 text-gray-500 cursor-not-allowed rounded-xl border border-white/10 text-sm font-medium"
          >
            Notificar quando disponivel
          </button>
        </CardBody>
      </Card>
    </div>
  );
}
