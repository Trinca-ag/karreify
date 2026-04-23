"use client";

import { useCallback, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  checkSaveLimit,
  createPdfItem,
  createResumeItem,
  deleteSavedItem,
  type SavePdfPayload,
  type SaveResumePayload,
} from "@/services/saved-items";
import type { SavedItem, SavedItemType } from "@/types";

type Payload =
  | { kind: "resume"; data: SaveResumePayload }
  | { kind: "pdf"; data: SavePdfPayload };

interface ConfirmState {
  oldest: SavedItem | null;
  pending: Payload;
}

/**
 * Encapsulates the "save with 5-item limit" flow shared by all four features.
 *
 * Call `saveWithPrompt({ uid, type, payload })` after a successful generation.
 * If the user is below the limit, it saves silently and returns.
 * If they're at the limit, it stores the pending payload and exposes modal
 * state (`confirmState`) plus confirm/cancel handlers.
 */
export function useSavedItemSaver() {
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);

  const commit = useCallback(
    async (uid: string, payload: Payload): Promise<string | null> => {
      try {
        if (payload.kind === "resume") {
          return await createResumeItem(uid, payload.data);
        }
        return await createPdfItem(uid, payload.data);
      } catch (err) {
        console.error("Save item error:", err);
        toast.error("Não foi possível salvar o arquivo.");
        return null;
      }
    },
    []
  );

  const saveWithPrompt = useCallback(
    async (params: {
      uid: string;
      type: SavedItemType;
      payload: Payload;
    }): Promise<void> => {
      if (savingRef.current) return;
      savingRef.current = true;
      setSaving(true);
      try {
        const { needsReplace, oldest } = await checkSaveLimit(
          params.uid,
          params.type
        );
        if (!needsReplace) {
          await commit(params.uid, params.payload);
          return;
        }
        setConfirmState({ oldest, pending: params.payload });
      } finally {
        savingRef.current = false;
        setSaving(false);
      }
    },
    [commit]
  );

  const confirmReplace = useCallback(
    async (uid: string) => {
      if (!confirmState || savingRef.current) return;
      savingRef.current = true;
      setSaving(true);
      try {
        if (confirmState.oldest) {
          await deleteSavedItem(uid, confirmState.oldest.id);
        }
        await commit(uid, confirmState.pending);
        toast.success("Documento salvo. Você tem 10 horas para baixá-lo.");
      } finally {
        savingRef.current = false;
        setSaving(false);
        setConfirmState(null);
      }
    },
    [confirmState, commit]
  );

  const cancelReplace = useCallback(() => {
    if (savingRef.current) return;
    setConfirmState(null);
  }, []);

  return {
    saveWithPrompt,
    confirmReplace,
    cancelReplace,
    confirmState,
    saving,
  };
}
