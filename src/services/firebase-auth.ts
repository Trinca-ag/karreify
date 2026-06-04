import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { cache, CK, TTL, invalidateAll } from "@/lib/cache";
import { authedFetch, authedFetchJson } from "@/lib/api-client";
import type { User } from "@/types";

async function triggerWelcome(): Promise<void> {
  try {
    await authedFetch("/api/notifications/welcome", { method: "POST" });
  } catch (e) {
    console.error("welcome trigger failed:", e);
  }
}

/**
 * Dispara o grant idempotente de créditos de boas-vindas. Server-authoritative
 * e flag-guarded (welcomeCreditsGranted), então é seguro chamar em todo login —
 * concede 15 créditos apenas na primeira vez (cobre novos cadastros e o backfill
 * das contas já existentes). Quando o crédito cai, o onSnapshot de users/{uid}
 * atualiza o saldo na UI automaticamente.
 */
export async function triggerWelcomeCredits(): Promise<{ settled: boolean }> {
  try {
    const data = await authedFetchJson<{ granted?: boolean; reason?: string }>(
      "/api/credits/welcome",
      { method: "POST" }
    );
    // `settled` = não há motivo para tentar de novo nesta sessão: ou concedeu
    // agora, ou já estava concedido. Só o caso "no-user-doc" (corrida com o
    // setDoc do cadastro, antes de o backend enxergar o doc) pede retry numa
    // emissão posterior do onSnapshot.
    return { settled: data?.reason !== "no-user-doc" };
  } catch (e) {
    console.error("welcome-credits trigger failed:", e);
    return { settled: false };
  }
}

const googleProvider = new GoogleAuthProvider();

const DEFAULT_AVATARS = [
  "/avatars/avatar-1.png",
  "/avatars/avatar-2.png",
  "/avatars/avatar-3.png",
  "/avatars/avatar-4.png",
  "/avatars/avatar-5.png",
  "/avatars/avatar-6.png",
];

function pickRandomAvatar(): string {
  return DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)];
}

export async function registerUser(
  email: string,
  password: string,
  displayName: string
): Promise<FirebaseUser> {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  const photoURL = pickRandomAvatar();
  await updateProfile(user, { displayName, photoURL });

  const userData = {
    uid: user.uid,
    email: user.email,
    displayName,
    photoURL,
    credits: 0,
    role: "user" as const,
    autoSaveDocuments: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(doc(db, "users", user.uid), userData);

  // Pre-populate cache
  cache.set(CK.userData(user.uid), { ...userData, createdAt: new Date(), updatedAt: new Date() }, TTL.userData);
  cache.set(CK.credits(user.uid), 0, TTL.credits);

  void triggerWelcome();

  return user;
}

async function isAdminUid(uid: string): Promise<boolean> {
  try {
    const adminDoc = await getDoc(doc(db, "admins", uid));
    return adminDoc.exists();
  } catch {
    return false;
  }
}

export async function loginUser(
  email: string,
  password: string
): Promise<FirebaseUser> {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  if (await isAdminUid(user.uid)) {
    await signOut(auth);
    throw new Error("admin-account-not-allowed");
  }
  return user;
}

export async function loginWithGoogle(): Promise<FirebaseUser> {
  const { user } = await signInWithPopup(auth, googleProvider);

  if (await isAdminUid(user.uid)) {
    await signOut(auth);
    throw new Error("admin-account-not-allowed");
  }

  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (!userDoc.exists()) {
    const photoURL = user.photoURL ?? pickRandomAvatar();
    if (!user.photoURL) {
      await updateProfile(user, { photoURL });
    }
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL,
      credits: 0,
      role: "user" as const,
      autoSaveDocuments: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(doc(db, "users", user.uid), userData);

    cache.set(CK.userData(user.uid), { ...userData, createdAt: new Date(), updatedAt: new Date() }, TTL.userData);
    cache.set(CK.credits(user.uid), 0, TTL.credits);

    void triggerWelcome();
  } else {
    // Cache existing user data
    const data = userDoc.data() as User;
    cache.set(CK.userData(user.uid), data, TTL.userData);
    cache.set(CK.credits(user.uid), data.credits, TTL.credits);
  }

  return user;
}

export async function logoutUser(): Promise<void> {
  invalidateAll();
  await signOut(auth);
}

export async function getUserData(uid: string): Promise<User | null> {
  const cached = cache.get<User>(CK.userData(uid));
  if (cached) return cached;

  const userDoc = await getDoc(doc(db, "users", uid));
  if (!userDoc.exists()) return null;

  const data = userDoc.data() as User;
  cache.set(CK.userData(uid), data, TTL.userData);
  cache.set(CK.credits(uid), data.credits, TTL.credits);
  return data;
}

export function onAuthChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}
