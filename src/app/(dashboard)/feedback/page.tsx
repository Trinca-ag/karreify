"use client";

import { useState } from "react";
import { Star, Send, CheckCircle2, Heart } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { submitFeedback } from "@/services/feedback";
import { FEEDBACK_MAX_COMMENT } from "@/types";

const RATING_LABELS: Record<number, string> = {
  1: "Muito ruim",
  2: "Ruim",
  3: "Regular",
  4: "Bom",
  5: "Excelente",
};

export default function FeedbackPage() {
  const { user, userData } = useAuthContext();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const charsLeft = FEEDBACK_MAX_COMMENT - comment.length;
  const active = hover || rating;

  const handleSubmit = async () => {
    if (!user) return;
    if (rating < 1) {
      toast.error("Escolha uma nota de 1 a 5 estrelas.");
      return;
    }
    setSubmitting(true);
    try {
      await submitFeedback({
        uid: user.uid,
        userName: userData?.displayName ?? user.displayName ?? null,
        userEmail: userData?.email ?? user.email ?? "",
        rating,
        comment,
      });
      setSent(true);
      toast.success("Obrigado pelo seu feedback!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao enviar feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setRating(0);
    setComment("");
    setSent(false);
  };

  return (
    <div className="relative space-y-8 pb-8">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-3xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl">
        <div className="absolute -top-24 -left-16 w-80 h-80 bg-primary-500/20 rounded-full blur-[120px] animate-pulse-glow pointer-events-none" />
        <div
          className="absolute -bottom-32 -right-10 w-96 h-96 bg-accent-violet/20 rounded-full blur-[140px] animate-pulse-glow pointer-events-none"
          style={{ animationDelay: "1.5s" }}
        />
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
        <div className="relative p-8 md:p-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-xs font-medium text-primary-300 mb-4">
            <Heart className="w-3 h-3" />
            Sua opinião importa
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white font-heading leading-[1.1] tracking-tight">
            Nos ajude a{" "}
            <span className="gradient-text">melhorar</span> o Karreify
          </h1>
          <p className="text-gray-400 mt-4 text-base md:text-lg max-w-xl leading-relaxed">
            Sua opinião é essencial para evoluirmos o Karreify. Conta pra gente o que você acha.
          </p>
        </div>
      </section>

      {sent ? (
        <div className="animate-fade-in-up animation-delay-200">
          <div className="relative group bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="py-16 px-8 flex flex-col items-center gap-4 text-center relative">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-black/20">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-lg">Feedback enviado!</p>
                <p className="text-gray-500 text-sm mt-1 max-w-md">
                  Obrigado por dedicar seu tempo. Lemos cada mensagem e usamos para guiar o que vem a seguir.
                </p>
              </div>
              <Button variant="outline" onClick={reset}>
                Enviar outro feedback
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-fade-in-up animation-delay-200">
          <div className="relative bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] overflow-hidden">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative p-6 md:p-8 space-y-6">
              {/* Stars */}
              <div className="space-y-3">
                <label className="block text-sm text-gray-300 font-medium">
                  Como você avalia sua experiência?
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((n) => {
                    const filled = n <= active;
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setRating(n)}
                        onMouseEnter={() => setHover(n)}
                        onMouseLeave={() => setHover(0)}
                        className="p-1 rounded-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                        aria-label={`${n} estrela${n > 1 ? "s" : ""}`}
                      >
                        <Star
                          className={`w-9 h-9 transition-colors ${
                            filled
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-600 hover:text-gray-500"
                          }`}
                        />
                      </button>
                    );
                  })}
                  <span className="ml-3 text-sm text-gray-400 min-w-[6rem]">
                    {active ? RATING_LABELS[active] : ""}
                  </span>
                </div>
              </div>

              {/* Comment */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm text-gray-300 font-medium">
                    Conte mais sobre sua experiência
                  </label>
                  <span
                    className={`text-xs tabular-nums ${
                      charsLeft < 0 ? "text-red-400" : "text-gray-500"
                    }`}
                  >
                    {comment.length}/{FEEDBACK_MAX_COMMENT}
                  </span>
                </div>
                <textarea
                  value={comment}
                  onChange={(e) =>
                    setComment(e.target.value.slice(0, FEEDBACK_MAX_COMMENT))
                  }
                  maxLength={FEEDBACK_MAX_COMMENT}
                  rows={8}
                  placeholder="O que está funcionando bem? O que poderia melhorar? Ideias de novas funcionalidades são muito bem-vindas."
                  className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/30 text-sm transition-all resize-y"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={rating < 1 || submitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-semibold hover:from-primary-500 hover:to-primary-400 transition-all glow-blue disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {submitting ? (
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Enviar feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
