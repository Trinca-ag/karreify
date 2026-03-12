import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cache, CK, TTL, invalidateDevices } from "@/lib/cache";
import type { Device } from "@/types";

const TRUST_DURATION_DAYS = 15;

export async function isDeviceTrusted(
  userId: string,
  deviceId: string
): Promise<boolean> {
  const cached = cache.get<boolean>(CK.deviceTrust(userId, deviceId));
  if (cached !== null) return cached;

  const deviceDoc = await getDoc(
    doc(db, "users", userId, "devices", deviceId)
  );
  if (!deviceDoc.exists()) {
    cache.set(CK.deviceTrust(userId, deviceId), false, TTL.deviceTrust);
    return false;
  }

  const data = deviceDoc.data();
  const lastVerified = data.lastVerifiedAt?.toDate
    ? data.lastVerifiedAt.toDate()
    : new Date(data.lastVerifiedAt);
  const daysSince =
    (Date.now() - lastVerified.getTime()) / (1000 * 60 * 60 * 24);

  const trusted = daysSince < TRUST_DURATION_DAYS;
  cache.set(CK.deviceTrust(userId, deviceId), trusted, TTL.deviceTrust);
  return trusted;
}

export async function registerDevice(
  userId: string,
  deviceId: string,
  info: { browser: string; os: string; deviceName: string }
): Promise<void> {
  const existing = await getDoc(
    doc(db, "users", userId, "devices", deviceId)
  );

  await setDoc(doc(db, "users", userId, "devices", deviceId), {
    id: deviceId,
    userId,
    deviceName: info.deviceName,
    browser: info.browser,
    os: info.os,
    lastVerifiedAt: serverTimestamp(),
    lastActiveAt: serverTimestamp(),
    ...(existing.exists() ? {} : { createdAt: serverTimestamp() }),
  });

  // Mark as trusted in cache
  cache.set(CK.deviceTrust(userId, deviceId), true, TTL.deviceTrust);
  cache.invalidate(CK.deviceList(userId));
}

export async function updateDeviceActivity(
  userId: string,
  deviceId: string
): Promise<void> {
  await setDoc(
    doc(db, "users", userId, "devices", deviceId),
    { lastActiveAt: serverTimestamp() },
    { merge: true }
  );
}

export async function getUserDevices(userId: string): Promise<Device[]> {
  const cached = cache.get<Device[]>(CK.deviceList(userId));
  if (cached) return cached;

  const snapshot = await getDocs(
    collection(db, "users", userId, "devices")
  );
  const devices = snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      userId: data.userId,
      deviceName: data.deviceName,
      browser: data.browser,
      os: data.os,
      lastVerifiedAt: data.lastVerifiedAt?.toDate?.() || new Date(),
      lastActiveAt: data.lastActiveAt?.toDate?.() || new Date(),
      createdAt: data.createdAt?.toDate?.() || new Date(),
    } as Device;
  });

  cache.set(CK.deviceList(userId), devices, TTL.deviceList);
  return devices;
}

export async function removeDevice(
  userId: string,
  deviceId: string
): Promise<void> {
  await deleteDoc(doc(db, "users", userId, "devices", deviceId));
  invalidateDevices(userId);
}
