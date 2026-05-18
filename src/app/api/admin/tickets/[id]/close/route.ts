import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/utils/admin-verify";
import { adminDb, adminStorage } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await verifyAdminRequest(request);
    const ticketId = params.id;
    if (!ticketId) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const ref = adminDb.collection("tickets").doc(ticketId);
    const snap = await ref.get();
    if (!snap.exists) {
      return NextResponse.json({ error: "Chamado não encontrado" }, { status: 404 });
    }
    const data = snap.data() ?? {};
    if (data.status === "closed") {
      return NextResponse.json({ error: "Chamado já está fechado" }, { status: 409 });
    }

    const userId = data.userId as string | undefined;
    const images = (data.images as string[] | undefined) ?? [];
    const hadImages = images.length > 0;

    // Best-effort: wipe all attachments under tickets/{userId}/{ticketId}/ in
    // Storage. We list by prefix (rather than parsing the download URLs) so
    // we also catch files that might have failed to make it into the array.
    let deletedImages = false;
    if (hadImages && userId) {
      try {
        const bucket = adminStorage.bucket();
        const prefix = `tickets/${userId}/${ticketId}/`;
        const [files] = await bucket.getFiles({ prefix });
        await Promise.all(
          files.map((f) =>
            f.delete({ ignoreNotFound: true }).catch((err) => {
              console.error(`[admin/tickets/close] failed to delete ${f.name}:`, err);
            })
          )
        );
        deletedImages = true;
      } catch (err) {
        console.error("[admin/tickets/close] storage cleanup failed:", err);
        // Continue closing the ticket even if storage cleanup fails — we
        // don't want a dangling open ticket because of attachment cleanup.
      }
    }

    const now = new Date();
    await ref.update({
      status: "closed",
      closedAt: now,
      closedBy: admin.uid,
      updatedAt: now,
      // Always clear images on close to avoid showing dead URLs in the UI.
      images: [],
      imagesDeleted: deletedImages,
    });

    return NextResponse.json({ success: true, imagesDeleted: deletedImages });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erro";
    if (msg === "Não autorizado" || msg === "Acesso negado") {
      return NextResponse.json({ error: msg }, { status: 403 });
    }
    console.error("[admin/tickets/close]", error);
    return NextResponse.json({ error: "Erro ao fechar chamado" }, { status: 500 });
  }
}
