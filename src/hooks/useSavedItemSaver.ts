"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

export type SaverPayload =
  | { kind: "resume"; data: SaveResumePayload }
  | { kind: "pdf"; data: SavePdfPayload };

export type SaveStatus = "idle" | "saved" | "needs-manual" | "limit-reached";

interface ConfirmState {
  oldest: SavedItem | null;
  pending: SaverPayload;
  /** "manual" → user clicked "Salvar"; "auto" → opened proactively after auto-save hit the limit. */
  source: "manual" | "auto";
}

interface PreparedState {
  type: SavedItemType;
  payload: SaverPayload;
  status: SaveStatus;
}

/**
 * Save flow for generated documents.
 *
 * `prepare(...)` is called once after a successful generation. Behavior:
 *   - autoSave ON + room available → silent save, status becomes "saved"
 *   - autoSave ON + limit reached → no save, status becomes "limit-reached"
 *   - autoSave OFF                → no save, status becomes "needs-manual"
 *
 * `saveManually()` runs the manual click flow:
 *   - if limit reached, opens the replace-oldest confirm modal
 *   - otherwise saves immediately and opens the success modal
 */
export function useSavedItemSaver() {
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [successOpen, setSuccessOpen] = useState(false);
  const preparedRef = useRef<PreparedState | null>(null);
  const savingRef = useRef(false);

  const commit = useCallback(
    async (uid: string, payload: SaverPayload): Promise<boolean> => {
      try {
        if (payload.kind === "resume") {
          await createResumeItem(uid, payload.data);
        } else {
          await createPdfItem(uid, payload.data);
        }
        return true;
      } catch (err) {
        console.error("Save item error:", err);
        toast.error("Não foi possível salvar o arquivo.");
        return false;
      }
    },
    []
  );

  /** Resets the saver between generations (e.g. when user clicks "novo currículo"). */
  const reset = useCallback(() => {
    preparedRef.current = null;
    setStatus("idle");
    setConfirmState(null);
    setSuccessOpen(false);
    savingRef.current = false;
    setSaving(false);
  }, []);

  const prepare = useCallback(
    async (params: {
      uid: string;
      type: SavedItemType;
      payload: SaverPayload;
      autoSave: boolean;
    }): Promise<void> => {
      if (savingRef.current) return;
      savingRef.current = true;
      setSaving(true);
      try {
        const { needsReplace, oldest } = await checkSaveLimit(
          params.uid,
          params.type
        );

        if (params.autoSave && !needsReplace) {
          const ok = await commit(params.uid, params.payload);
          if (ok) {
            preparedRef.current = {
              type: params.type,
              payload: params.payload,
              status: "saved",
            };
            setStatus("saved");
            return;
          }
        }

        preparedRef.current = {
          type: params.type,
          payload: params.payload,
          status: needsReplace ? "limit-reached" : "needs-manual",
        };
        setStatus(needsReplace ? "limit-reached" : "needs-manual");

        // When auto-save is on but the category is full, prompt to replace the
        // oldest right away — the user doesn't need to click "Salvar" first.
        if (params.autoSave && needsReplace) {
          setConfirmState({ oldest, pending: params.payload, source: "auto" });
        }
      } finally {
        savingRef.current = false;
        setSaving(false);
      }
    },
    [commit]
  );

  /**
   * Re-check whether the saved payload should still be considered "saved" —
   * e.g. when the user edits the resume after auto-save. Marks it as
   * needs-manual so the next click re-saves the latest content.
   */
  const markDirty = useCallback(() => {
    if (!preparedRef.current) return;
    if (preparedRef.current.status === "saved") {
      preparedRef.current.status = "needs-manual";
      setStatus("needs-manual");
    }
  }, []);

  /** Updates the payload that will be used by the next manual save. */
  const updatePayload = useCallback((payload: SaverPayload) => {
    if (!preparedRef.current) return;
    preparedRef.current.payload = payload;
  }, []);

  const saveManually = useCallback(
    async (uid: string): Promise<void> => {
      const prepared = preparedRef.current;
      if (!prepared || savingRef.current) return;

      // If the limit was hit during preparation, double-check current state
      // — another tab or the user deleting an item could free up space.
      savingRef.current = true;
      setSaving(true);
      try {
        const { needsReplace, oldest } = await checkSaveLimit(
          uid,
          prepared.type
        );

        if (needsReplace) {
          setConfirmState({
            oldest,
            pending: prepared.payload,
            source: "manual",
          });
          return;
        }

        const ok = await commit(uid, prepared.payload);
        if (ok) {
          preparedRef.current = { ...prepared, status: "saved" };
          setStatus("saved");
          setSuccessOpen(true);
        }
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
      const source = confirmState.source;
      savingRef.current = true;
      setSaving(true);
      try {
        if (confirmState.oldest) {
          await deleteSavedItem(uid, confirmState.oldest.id);
        }
        const ok = await commit(uid, confirmState.pending);
        if (ok && preparedRef.current) {
          preparedRef.current = {
            ...preparedRef.current,
            payload: confirmState.pending,
            status: "saved",
          };
          setStatus("saved");
          // The warning modal itself is the feedback in the auto-save flow,
          // so we only surface the success modal when the user explicitly
          // clicked "Salvar".
          if (source === "manual") setSuccessOpen(true);
        }
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

  const closeSuccess = useCallback(() => setSuccessOpen(false), []);

  // Cleanup on unmount: nothing to do, but keep the hook idempotent.
  useEffect(() => () => { savingRef.current = false; }, []);

  return {
    prepare,
    saveManually,
    confirmReplace,
    cancelReplace,
    markDirty,
    updatePayload,
    reset,
    closeSuccess,
    confirmState,
    saving,
    status,
    successOpen,
  };
}
