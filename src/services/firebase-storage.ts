import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "@/lib/firebase";

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: "Formato não suportado. Use PDF, DOC ou DOCX." };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "Arquivo muito grande. Máximo: 10MB." };
  }
  return { valid: true };
}

export async function uploadFile(
  userId: string,
  file: File,
  folder: string = "resumes"
): Promise<{ url: string; path: string }> {
  const validation = validateFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const filePath = `${folder}/${userId}/${timestamp}_${safeName}`;
  const storageRef = ref(storage, filePath);

  await uploadBytes(storageRef, file, {
    contentType: file.type,
  });

  const url = await getDownloadURL(storageRef);
  return { url, path: filePath };
}

export async function deleteFile(filePath: string): Promise<void> {
  const storageRef = ref(storage, filePath);
  await deleteObject(storageRef);
}
