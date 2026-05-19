import { authedFetch } from "@/lib/api-client";
import { FEEDBACK_MAX_COMMENT } from "@/types";

export async function submitFeedback(params: {
  uid: string;
  userName: string | null;
  userEmail: string;
  rating: number;
  comment: string;
}): Promise<void> {
  const rating = Math.round(params.rating);
  if (rating < 1 || rating > 5) throw new Error("Avaliação inválida.");
  const comment = params.comment.trim();
  if (comment.length > FEEDBACK_MAX_COMMENT) throw new Error("Comentário muito longo.");

  const res = await authedFetch("/api/feedback", {
    method: "POST",
    body: JSON.stringify({
      rating,
      comment,
      userName: params.userName,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || "Erro ao enviar feedback.");
  }
}
