"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, X, AlertTriangle } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import toast from "react-hot-toast";
import {
  TICKET_IMAGE_MAX_BYTES,
  TICKET_MAX_DESCRIPTION,
  TICKET_MAX_IMAGES,
  TICKET_MAX_TITLE,
} from "@/types";

interface NewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: { title: string; description: string; images: File[] }) => Promise<void>;
}

interface PendingImage {
  file: File;
  url: string;
}

export default function NewTicketModal({ isOpen, onClose, onSubmit }: NewTicketModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<PendingImage[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const reset = () => {
    setTitle("");
    setDescription("");
    images.forEach((img) => URL.revokeObjectURL(img.url));
    setImages([]);
  };

  const handleClose = () => {
    if (submitting) return;
    reset();
    onClose();
  };

  const handlePickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (picked.length === 0) return;
    const remaining = TICKET_MAX_IMAGES - images.length;
    if (remaining <= 0) {
      toast.error(`Máximo de ${TICKET_MAX_IMAGES} imagens.`);
      return;
    }
    const accepted: PendingImage[] = [];
    for (const file of picked.slice(0, remaining)) {
      if (!file.type.startsWith("image/")) {
        toast.error(`"${file.name}" não é uma imagem.`);
        continue;
      }
      if (file.size > TICKET_IMAGE_MAX_BYTES) {
        toast.error(`"${file.name}" excede 5MB.`);
        continue;
      }
      accepted.push({ file, url: URL.createObjectURL(file) });
    }
    if (accepted.length > 0) setImages((cur) => [...cur, ...accepted]);
  };

  const removeImage = (idx: number) => {
    setImages((cur) => {
      const copy = [...cur];
      const [removed] = copy.splice(idx, 1);
      if (removed) URL.revokeObjectURL(removed.url);
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!title.trim() || !description.trim()) {
      toast.error("Preencha título e descrição.");
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        images: images.map((i) => i.file),
      });
      reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar chamado.");
    } finally {
      setSubmitting(false);
    }
  };

  const titleCount = title.length;
  const descCount = description.length;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Novo chamado" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            label="Título"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value.slice(0, TICKET_MAX_TITLE))}
            placeholder="Resuma o problema em poucas palavras"
            required
          />
          <div className="mt-1 text-right text-[11px] text-gray-500 tabular-nums">
            {titleCount}/{TICKET_MAX_TITLE}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Descrição do ocorrido
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, TICKET_MAX_DESCRIPTION))}
            rows={6}
            placeholder="Descreva com o máximo de detalhes possível. Quanto mais contexto, mais rápido resolvemos."
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all text-sm resize-y leading-relaxed"
            required
          />
          <div className="mt-1 text-right text-[11px] text-gray-500 tabular-nums">
            {descCount}/{TICKET_MAX_DESCRIPTION}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Anexos <span className="text-gray-500">({images.length}/{TICKET_MAX_IMAGES})</span>
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handlePickFiles}
            className="hidden"
          />

          {images.length === 0 ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex flex-col items-center justify-center gap-2 py-7 bg-white/[0.03] border border-dashed border-white/[0.12] hover:border-primary-500/40 hover:bg-primary-500/[0.04] rounded-xl transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-primary-500/10 border border-white/[0.08] group-hover:border-primary-500/20 flex items-center justify-center transition-all">
                <ImagePlus className="w-5 h-5 text-gray-400 group-hover:text-primary-400 transition-colors" />
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-300 font-medium">Anexar imagens</p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Até {TICKET_MAX_IMAGES} arquivos · máx 5MB cada
                </p>
              </div>
            </button>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {images.map((img, idx) => (
                <div
                  key={img.url}
                  className="relative aspect-square rounded-xl overflow-hidden border border-white/[0.08] group/img"
                >
                  <Image
                    src={img.url}
                    alt={`Anexo ${idx + 1}`}
                    fill
                    sizes="120px"
                    unoptimized
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-red-500/80 rounded-md text-white opacity-0 group-hover/img:opacity-100 transition-opacity"
                    aria-label="Remover"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {images.length < TICKET_MAX_IMAGES && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square flex flex-col items-center justify-center gap-1 bg-white/[0.03] border border-dashed border-white/[0.12] hover:border-primary-500/40 hover:bg-primary-500/[0.04] rounded-xl transition-all text-gray-400 hover:text-primary-300"
                >
                  <ImagePlus className="w-5 h-5" />
                  <span className="text-[11px]">Adicionar</span>
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex items-start gap-2 p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Quando o chamado for finalizado por um administrador, nenhuma das partes poderá mais enviar mensagens.
          </p>
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <Button variant="ghost" type="button" onClick={handleClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button type="submit" loading={submitting}>
            Abrir chamado
          </Button>
        </div>
      </form>
    </Modal>
  );
}
