"use client";

import { useState, useEffect, useCallback } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { onAuthChange, getUserData, logoutUser } from "@/services/firebase-auth";
import { isDeviceTrusted, updateDeviceActivity } from "@/services/device-manager";
import { getDeviceId } from "@/utils/device-fingerprint";
import { invalidateUser, invalidateAll } from "@/lib/cache";
import type { User } from "@/types";

export function useAuth() {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [deviceVerified, setDeviceVerified] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      setFirebaseUser(user);
      if (user) {
        const data = await getUserData(user.uid);
        setUserData(data);

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
      } else {
        setUserData(null);
        setDeviceVerified(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
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
    setFirebaseUser(null);
    setUserData(null);
    setDeviceVerified(false);
  }, []);

  return {
    user: firebaseUser,
    userData,
    loading,
    isAuthenticated: !!firebaseUser,
    deviceVerified,
    logout,
    refreshUserData,
    markDeviceVerified,
  };
}
