"use client";

import { CheckCircle2, FolderOpen } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

interface SaveSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SaveSuccessModal({
  isOpen,
  onClose,
}: SaveSuccessModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center space-y-5 py-2">
        <div className="relative mx-auto w-20 h-20">
          <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl animate-pulse-glow" />
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white font-heading">
            Documento salvo com sucesso
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed max-w-xs mx-auto">
            Seu arquivo foi salvo em{" "}
            <span className="inline-flex items-center gap-1 text-emerald-300 font-medium">
              <FolderOpen className="w-3.5 h-3.5" /> Meus Arquivos
            </span>{" "}
            e já está disponível para acesso futuro.
          </p>
        </div>

        <div className="pt-2">
          <Button onClick={onClose} className="w-full">
            Fechar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
