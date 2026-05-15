"use client";

import { AlertTriangle } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import type { SavedItem } from "@/types";
import { SAVED_ITEM_LABELS } from "@/types";

interface SaveLimitModalProps {
  isOpen: boolean;
  oldest: SavedItem | null;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function formatDateTime(d: Date): string {
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SaveLimitModal({
  isOpen,
  oldest,
  loading,
  onConfirm,
  onCancel,
}: SaveLimitModalProps) {
  const typeLabel = oldest ? SAVED_ITEM_LABELS[oldest.type] : "";

  return (
    <Modal
      isOpen={isOpen}
      onClose={loading ? () => {} : onCancel}
      title="Limite atingido"
      size="sm"
    >
      <div className="space-y-5">
        <div className="flex items-start gap-3 p-4 bg-amber-500/5 border border-amber-500/15 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-300 space-y-2">
            <p>
              Você já atingiu o limite de documentos salvos nesta categoria
              {typeLabel && (
                <>
                  {" "}(<span className="text-white">{typeLabel}</span>)
                </>
              )}
              .
            </p>
            <p>
              Ao continuar, o arquivo mais antigo será substituído por este
              novo documento.
            </p>
            {oldest && (
              <p className="text-xs text-gray-400 pt-1 border-t border-white/[0.06]">
                Será removido:{" "}
                <span className="text-white">{oldest.title}</span>
                {oldest.createdAt && (
                  <span className="text-gray-500">
                    {" "}(criado em {formatDateTime(oldest.createdAt)})
                  </span>
                )}
                .
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={onConfirm} loading={loading}>
            Confirmar salvamento
          </Button>
        </div>
      </div>
    </Modal>
  );
}
