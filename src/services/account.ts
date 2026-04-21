import {
  EmailAuthProvider,
  GoogleAuthProvider,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  deleteUser,
} from "firebase/auth";
import {
  doc,
  deleteDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { ref, listAll, deleteObject } from "firebase/storage";
import { auth, db, storage } from "@/lib/firebase";
import { invalidateAll } from "@/lib/cache";

async function deleteSubcollection(userId: string, name: string): Promise<void> {
  const snap = await getDocs(collection(db, "users", userId, name));
  await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
}

async function deleteStorageFolder(path: string): Promise<void> {
  try {
    const folderRef = ref(storage, path);
    const result = await listAll(folderRef);
    await Promise.all(result.items.map((item) => deleteObject(item).catch(() => undefined)));
    await Promise.all(result.prefixes.map((prefix) => deleteStorageFolder(prefix.fullPath)));
  } catch {
    // Folder may not exist or be empty; ignore.
  }
}

export function hasPasswordProvider(): boolean {
  const user = auth.currentUser;
  if (!user) return false;
  return user.providerData.some((p) => p.providerId === "password");
}

export async function deleteOwnAccount(password?: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado.");

  const usesPassword = user.providerData.some((p) => p.providerId === "password");

  if (usesPassword) {
    if (!password) throw new Error("Senha obrigatória.");
    if (!user.email) throw new Error("Conta sem e-mail associado.");
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
  } else {
    const googleProvider = new GoogleAuthProvider();
    await reauthenticateWithPopup(user, googleProvider);
  }

  const uid = user.uid;

  await deleteSubcollection(uid, "devices");
  await deleteSubcollection(uid, "transactions");
  await deleteStorageFolder(`resumes/${uid}`);
  await deleteDoc(doc(db, "users", uid));

  invalidateAll();

  await deleteUser(user);
}
