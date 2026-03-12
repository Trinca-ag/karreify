import {
  doc,
  setDoc,
  getDocs,
  query,
  where,
  collection,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function createVerificationCode(
  userId: string,
  email: string,
  deviceId: string
): Promise<string> {
  const code = generateVerificationCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  const docId = `${userId}_${Date.now()}`;
  await setDoc(doc(db, "verificationCodes", docId), {
    userId,
    email,
    code,
    deviceId,
    expiresAt: Timestamp.fromDate(expiresAt),
    used: false,
    createdAt: serverTimestamp(),
  });

  return code;
}

export async function verifyCode(
  userId: string,
  inputCode: string
): Promise<{ valid: boolean; deviceId?: string }> {
  const q = query(
    collection(db, "verificationCodes"),
    where("userId", "==", userId),
    where("code", "==", inputCode),
    where("used", "==", false)
  );

  const snapshot = await getDocs(q);

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const expiresAt = data.expiresAt?.toDate
      ? data.expiresAt.toDate()
      : new Date(data.expiresAt);

    if (expiresAt > new Date()) {
      await setDoc(
        doc(db, "verificationCodes", docSnap.id),
        { used: true },
        { merge: true }
      );
      return { valid: true, deviceId: data.deviceId };
    }
  }

  return { valid: false };
}

// ── Password Reset ─────────────────────────────────────

export async function createPasswordResetCode(email: string): Promise<string> {
  const code = generateVerificationCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  const docId = `reset_${Date.now()}`;
  await setDoc(doc(db, "verificationCodes", docId), {
    email: email.toLowerCase(),
    code,
    type: "password-reset",
    expiresAt: Timestamp.fromDate(expiresAt),
    used: false,
    createdAt: serverTimestamp(),
  });

  return code;
}

export async function verifyPasswordResetCode(
  email: string,
  inputCode: string
): Promise<boolean> {
  const q = query(
    collection(db, "verificationCodes"),
    where("email", "==", email.toLowerCase()),
    where("code", "==", inputCode),
    where("type", "==", "password-reset"),
    where("used", "==", false)
  );

  const snapshot = await getDocs(q);

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const expiresAt = data.expiresAt?.toDate
      ? data.expiresAt.toDate()
      : new Date(data.expiresAt);

    if (expiresAt > new Date()) {
      await setDoc(
        doc(db, "verificationCodes", docSnap.id),
        { used: true },
        { merge: true }
      );
      return true;
    }
  }

  return false;
}
