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
import { doc, setDoc, getDoc, serverTimestamp, increment, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { cache, CK, TTL, invalidateAll } from "@/lib/cache";
import type { User } from "@/types";

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
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(doc(db, "users", user.uid), userData);

  // Track total users in stats
  const statsRef = doc(db, "stats", "global");
  try {
    await updateDoc(statsRef, { totalUsers: increment(1) });
  } catch {
    await setDoc(statsRef, { totalUsers: 1 }, { merge: true });
  }

  // Pre-populate cache
  cache.set(CK.userData(user.uid), { ...userData, createdAt: new Date(), updatedAt: new Date() }, TTL.userData);
  cache.set(CK.credits(user.uid), 0, TTL.credits);

  return user;
}

export async function loginUser(
  email: string,
  password: string
): Promise<FirebaseUser> {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
}

export async function loginWithGoogle(): Promise<FirebaseUser> {
  const { user } = await signInWithPopup(auth, googleProvider);

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
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(doc(db, "users", user.uid), userData);

    const statsRef2 = doc(db, "stats", "global");
    try {
      await updateDoc(statsRef2, { totalUsers: increment(1) });
    } catch {
      await setDoc(statsRef2, { totalUsers: 1 }, { merge: true });
    }

    cache.set(CK.userData(user.uid), { ...userData, createdAt: new Date(), updatedAt: new Date() }, TTL.userData);
    cache.set(CK.credits(user.uid), 0, TTL.credits);
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
