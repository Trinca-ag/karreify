"use client";

import { useState, useEffect, useCallback } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { onAuthChange, getUserData, logoutUser } from "@/services/firebase-auth";
import { isDeviceTrusted, updateDeviceActivity } from "@/services/device-manager";
import { getDeviceId } from "@/utils/device-fingerprint";
import { cache, CK, TTL, invalidateUser, invalidateAll } from "@/lib/cache";
import { JOBS_CACHE_STORAGE_KEY } from "@/components/providers/JobsCacheProvider";
import type { User } from "@/types";

export function useAuth() {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [deviceVerified, setDeviceVerified] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let unsubSnapshot: (() => void) | null = null;

    const unsubAuth = onAuthChange(async (user) => {
      if (unsubSnapshot) {
        unsubSnapshot();
        unsubSnapshot = null;
      }

      if (!user) {
        setFirebaseUser(null);
        setUserData(null);
        setDeviceVerified(false);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      // Keep loading true while we resolve user data + device trust so
      // downstream guards don't briefly see `authenticated && !deviceVerified`
      // and bounce through /auth/verify.
      setLoading(true);
      setFirebaseUser(user);

      // Detect admin sessions (same Firebase Auth pool, different Firestore
      // collection). Admins are not user-side users — we don't subscribe to
      // users/{uid} nor run device-trust for them; the dashboard layout will
      // bounce them to /admin.
      let adminFlag = false;
      try {
        const adminDoc = await getDoc(doc(db, "admins", user.uid));
        adminFlag = adminDoc.exists();
      } catch {
        adminFlag = false;
      }
      setIsAdmin(adminFlag);

      if (adminFlag) {
        setUserData(null);
        setDeviceVerified(false);
        setLoading(false);
        return;
      }

      let firstEmission = true;
      const ready = new Promise<void>((resolve) => {
        unsubSnapshot = onSnapshot(doc(db, "users", user.uid), (snap) => {
          const data = snap.exists() ? (snap.data() as User) : null;
          setUserData(data);
          if (data) {
            cache.set(CK.userData(user.uid), data, TTL.userData);
            cache.set(CK.credits(user.uid), data.credits ?? 0, TTL.credits);
          }
          if (firstEmission) {
            firstEmission = false;
            resolve();
          }
        });
      });
      await ready;

      if (typeof window !== "undefined") {
        const sessionFlag = sessionStorage.getItem("nextcv_verified");
        if (sessionFlag === "true") {
          setDeviceVerified(true);
        } else {
          const deviceId = getDeviceId();
          if (deviceId) {
            const trusted = await isDeviceTrusted(user.uid, deviceId);
            setDeviceVerified(trusted);
            if (trusted) {
              sessionStorage.setItem("nextcv_verified", "true");
              await updateDeviceActivity(user.uid, deviceId);
            }
          }
        }
      }
      setLoading(false);
    });

    return () => {
      if (unsubSnapshot) unsubSnapshot();
      unsubAuth();
    };
  }, []);

  const refreshUserData = useCallback(async () => {
    if (firebaseUser) {
      // Force fresh fetch by invalidating cache first
      invalidateUser(firebaseUser.uid);
      const data = await getUserData(firebaseUser.uid);
      setUserData(data);
    }
  }, [firebaseUser]);

  const markDeviceVerified = useCallback(() => {
    sessionStorage.setItem("nextcv_verified", "true");
    setDeviceVerified(true);
  }, []);

  const logout = useCallback(async () => {
    invalidateAll();
    await logoutUser();
    sessionStorage.removeItem("nextcv_verified");
    sessionStorage.removeItem(JOBS_CACHE_STORAGE_KEY);
    setFirebaseUser(null);
    setUserData(null);
    setDeviceVerified(false);
    setIsAdmin(false);
  }, []);

  return {
    user: firebaseUser,
    userData,
    loading,
    // An admin Firebase session is NOT a user-side authenticated session.
    // Keeps admin/user fully separate on the user side: navbar, /auth/login
    // (no auto-redirect), dashboard gate (treats admins as not logged in and
    // redirects via isAdmin instead).
    isAuthenticated: !!firebaseUser && !isAdmin,
    deviceVerified,
    isAdmin,
    logout,
    refreshUserData,
    markDeviceVerified,
  };
}
