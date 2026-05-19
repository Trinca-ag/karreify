import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminStorage } from "@/lib/firebase-admin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { requireUser, authErrorResponse } from "@/lib/auth-server";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { SAVED_ITEM_MAX_PER_TYPE, SAVED_ITEM_TTL_MS } from "@/types";
import type { NotificationPendingPayload, SavedItemType } from "@/types";

export const maxDuration = 60;

type PdfDocType = "resume-analysis" | "company-analysis" | "cover-letter";

function pdfApiPath(docType: PdfDocType): string {
  switch (docType) {
    case "resume-analysis":
      return "/api/generate-analysis-pdf";
    case "company-analysis":
      return "/api/generate-company-analysis-pdf";
    case "cover-letter":
      return "/api/generate-cover-letter-pdf";
  }
}

function pdfApiBody(docType: PdfDocType, sourceJson: unknown): Record<string, unknown> {
  switch (docType) {
    case "resume-analysis": {
      // The PDF route expects the AnalysisData object directly at `body.analysis`.
      // Older notifications stored the wrapper (the whole AI response), so we
      // unwrap if the inner `analysis` key is present.
      const inner =
        sourceJson && typeof sourceJson === "object" && "analysis" in sourceJson
          ? (sourceJson as { analysis: unknown }).analysis
          : sourceJson;
      return { analysis: inner };
    }
    case "company-analysis":
    case "cover-letter":
      return { data: sourceJson };
  }
}

interface LiveItem {
  id: string;
  title: string;
  storagePath?: string;
  createdAt: Date;
  expiresAt: Date;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let ctx;
  try {
    ctx = await requireUser(request);
  } catch (e) {
    return authErrorResponse(e);
  }

  const rl = rateLimit(ctx.uid, { scope: "notification-save", limit: 20, windowMs: 60_000 });
  if (!rl.allowed) return rateLimitResponse(rl);

  try {
    const body = (await request.json().catch(() => ({}))) as {
      replaceItemId?: string;
    };

    const notifRef = adminDb
      .collection("users")
      .doc(ctx.uid)
      .collection("notifications")
      .doc(params.id);
    const notifSnap = await notifRef.get();
    if (!notifSnap.exists) {
      return NextResponse.json({ error: "Notificação não encontrada" }, { status: 404 });
    }

    const notif = notifSnap.data() as Record<string, unknown>;

    if (notif.type !== "document-generated") {
      return NextResponse.json({ error: "Esta notificação não pode ser salva" }, { status: 400 });
    }
    if (notif.savedItemId) {
      return NextResponse.json({ error: "Documento já foi salvo" }, { status: 409 });
    }

    const expiresAtRaw = notif.expiresAt as { toDate?: () => Date } | Date | undefined;
    const expiresAt =
      expiresAtRaw && typeof (expiresAtRaw as { toDate?: () => Date }).toDate === "function"
        ? (expiresAtRaw as { toDate: () => Date }).toDate()
        : new Date(expiresAtRaw as Date);
    if (!expiresAt || expiresAt.getTime() <= Date.now()) {
      return NextResponse.json({ error: "Documento expirado" }, { status: 410 });
    }

    const pending = notif.pendingPayload as NotificationPendingPayload | null;
    if (!pending) {
      return NextResponse.json({ error: "Sem dados para salvar" }, { status: 410 });
    }

    const docType = notif.documentType as SavedItemType;

    // Count current live items of this type (ignore expired)
    const savedCol = adminDb.collection("users").doc(ctx.uid).collection("savedItems");
    const sameTypeSnap = await savedCol.where("type", "==", docType).get();
    const now = Date.now();
    const liveItems: LiveItem[] = [];
    for (const d of sameTypeSnap.docs) {
      const data = d.data();
      const exp = data.expiresAt?.toDate?.() ?? new Date(data.expiresAt);
      if (exp.getTime() <= now) continue;
      liveItems.push({
        id: d.id,
        title: (data.title as string) ?? "",
        storagePath: data.storagePath as string | undefined,
        createdAt: data.createdAt?.toDate?.() ?? new Date(data.createdAt),
        expiresAt: exp,
      });
    }

    if (liveItems.length >= SAVED_ITEM_MAX_PER_TYPE) {
      if (!body.replaceItemId) {
        const oldest = liveItems.reduce((o, c) => (c.createdAt < o.createdAt ? c : o));
        return NextResponse.json(
          {
            error: "max-reached",
            oldest: {
              id: oldest.id,
              type: docType,
              title: oldest.title,
              createdAt: oldest.createdAt.toISOString(),
            },
          },
          { status: 409 }
        );
      }

      const toReplace = liveItems.find((i) => i.id === body.replaceItemId);
      if (!toReplace) {
        return NextResponse.json(
          { error: "Item para substituir não encontrado" },
          { status: 400 }
        );
      }

      if (toReplace.storagePath) {
        try {
          await adminStorage.bucket().file(toReplace.storagePath).delete();
        } catch {
          /* file may have been removed already */
        }
      }
      await savedCol.doc(toReplace.id).delete();
    }

    const itemExpiresAt = new Date(Date.now() + SAVED_ITEM_TTL_MS);
    let savedItemId: string;

    if (pending.kind === "resume") {
      const docRef = await savedCol.add({
        type: "resume",
        title: pending.title,
        subtitle: pending.subtitle ?? null,
        resumeData: pending.resumeData,
        template: pending.template,
        candidateLevel: pending.candidateLevel ?? null,
        adjustments: pending.adjustments ?? null,
        createdAt: FieldValue.serverTimestamp(),
        expiresAt: Timestamp.fromDate(itemExpiresAt),
      });
      savedItemId = docRef.id;
    } else {
      // PDF — regenerate via the corresponding /api/generate-*-pdf route.
      // Internal fetch is fine because PDF gen routes don't require auth
      // (they're stateless renderers driven by the body JSON).
      const origin = new URL(request.url).origin;
      const pdfBody = pdfApiBody(pending.docType, pending.sourceJson);

      let pdfRes: Response;
      try {
        pdfRes = await fetch(`${origin}${pdfApiPath(pending.docType)}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(pdfBody),
        });
      } catch (e) {
        console.error("[notification-save] PDF fetch failed:", e);
        return NextResponse.json(
          { error: "Erro ao contatar o gerador de PDF" },
          { status: 500 }
        );
      }

      if (!pdfRes.ok) {
        const errText = await pdfRes.text().catch(() => "");
        console.error(
          `[notification-save] PDF gen ${pending.docType} returned ${pdfRes.status}:`,
          errText.slice(0, 500)
        );
        return NextResponse.json(
          { error: `Erro ao gerar PDF (${pdfRes.status})` },
          { status: 500 }
        );
      }

      let pdfBuffer: Buffer;
      try {
        pdfBuffer = Buffer.from(await pdfRes.arrayBuffer());
      } catch (e) {
        console.error("[notification-save] PDF buffer parse failed:", e);
        return NextResponse.json({ error: "PDF retornado em formato inválido" }, { status: 500 });
      }

      const fileKey = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.pdf`;
      const storagePath = `users/${ctx.uid}/files/${fileKey}`;

      try {
        const file = adminStorage.bucket().file(storagePath);
        await file.save(pdfBuffer, {
          contentType: "application/pdf",
          metadata: {
            contentDisposition: `attachment; filename="${pending.fileName}"`,
          },
        });

        const [downloadUrl] = await file.getSignedUrl({
          action: "read",
          expires: itemExpiresAt,
        });

        const docRef = await savedCol.add({
          type: pending.docType,
          title: pending.title,
          subtitle: pending.subtitle ?? null,
          fileName: pending.fileName,
          storagePath,
          downloadUrl,
          createdAt: FieldValue.serverTimestamp(),
          expiresAt: Timestamp.fromDate(itemExpiresAt),
        });
        savedItemId = docRef.id;
      } catch (e) {
        console.error("[notification-save] Storage/Firestore write failed:", e);
        return NextResponse.json(
          { error: "Erro ao gravar o arquivo no servidor" },
          { status: 500 }
        );
      }
    }

    await notifRef.update({
      savedItemId,
      pendingPayload: null,
    });

    return NextResponse.json({ success: true, savedItemId });
  } catch (error) {
    console.error("notification save error:", error);
    return NextResponse.json({ error: "Erro ao salvar" }, { status: 500 });
  }
}
