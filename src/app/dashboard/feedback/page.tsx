"use client";

import { useState } from "react";
import { MessageSquareHeart, Star, Send, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import Card, { CardBody } from "@/components/ui/Card";
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-3">
          <MessageSquareHeart className="w-7 h-7 text-pink-400" />
          Nos ajude a melhorar
        </h1>
        <p className="text-gray-400 mt-1">
          Sua opinião é essencial para evoluirmos o NextCV. Conta pra gente o que você acha.
        </p>
      </div>

      {sent ? (
        <Card>
          <CardBody className="py-16 flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
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
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardBody className="space-y-6">
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
              <Button
                onClick={handleSubmit}
                loading={submitting}
                disabled={rating < 1}
              >
                <Send className="w-4 h-4 mr-2" /> Enviar feedback
              </Button>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
