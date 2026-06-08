"use client";

import { useEffect, useState } from "react";
import { Gift, Copy, Check, Share2, Users } from "lucide-react";
import toast from "react-hot-toast";
import { fetchReferralInfo, type ReferralInfo } from "@/services/referral";

/**
 * Card de indicação exibido no /profile. Busca/garante o código no servidor e
 * oferece copiar/compartilhar o link, além da contagem de indicações.
 */
export default function ReferralCard() {
  const [info, setInfo] = useState<ReferralInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchReferralInfo()
      .then((data) => {
        if (!cancelled) setInfo(data);
      })
      .catch(() => {
        if (!cancelled) toast.error("Não foi possível carregar seu link de indicação.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCopy = async () => {
    if (!info) return;
    try {
      await navigator.clipboard.writeText(info.link);
      setCopied(true);
      toast.success("Link copiado!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Não foi possível copiar o link.");
    }
  };

  const handleShare = async () => {
    if (!info) return;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Karreify",
          text: "Crie sua conta no Karreify pelo meu link de indicação:",
          url: info.link,
        });
      } catch {
        // usuário cancelou o compartilhamento — silencioso
      }
    } else {
      void handleCopy();
    }
  };

  return (
    <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] hover:border-primary-500/30 transition-all duration-300 animate-fade-in-up animation-delay-200">
      <div className="px-6 py-4 border-b border-white/[0.06]">
        <h2 className="font-semibold text-white font-heading flex items-center gap-2">
          <Gift className="w-5 h-5 text-primary-400" />
          Indique e ganhe
        </h2>
      </div>
      <div className="p-6 space-y-5">
        <p className="text-sm text-gray-400 leading-relaxed">
          Compartilhe seu link exclusivo. A cada novo cadastro pelo seu link você ganha{" "}
          <strong className="text-white">
            {info?.creditsPerReferral ?? 5} créditos
          </strong>{" "}
          — e ainda recebe comissão em dinheiro quando seu indicado compra um pacote.
        </p>

        {loading ? (
          <div className="h-12 rounded-xl bg-white/[0.04] animate-pulse" />
        ) : info ? (
          <>
            <div className="flex items-stretch gap-2">
              <div className="flex-1 min-w-0 flex items-center px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                <span className="text-sm text-gray-300 truncate font-mono">{info.link}</span>
              </div>
              <button
                onClick={handleCopy}
                className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 rounded-xl bg-primary-500/15 border border-primary-500/30 text-primary-300 hover:bg-primary-500/25 transition-colors text-sm font-medium"
                title="Copiar link"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span className="hidden sm:inline">{copied ? "Copiado" : "Copiar"}</span>
              </button>
              <button
                onClick={handleShare}
                className="flex-shrink-0 inline-flex items-center justify-center w-11 rounded-xl bg-white/[0.04] border border-white/[0.08] text-gray-300 hover:bg-white/[0.08] transition-colors"
                title="Compartilhar"
                aria-label="Compartilhar link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Indicações confirmadas</p>
                <p className="font-semibold text-white">{info.referralCount}</p>
              </div>
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-500">Não foi possível carregar seu link agora.</p>
        )}
      </div>
    </div>
  );
}
