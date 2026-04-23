import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
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

  await addDoc(collection(db, "feedbacks"), {
    uid: params.uid,
    userName: params.userName ?? null,
    userEmail: params.userEmail,
    rating,
    comment,
    createdAt: serverTimestamp(),
  });
}
