"use client";

import { useState, useEffect, useCallback } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { onAuthChange, getUserData, logoutUser } from "@/services/firebase-auth";
import type { User } from "@/types";

export function useAuth() {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      setFirebaseUser(user);
      if (user) {
        const data = await getUserData(user.uid);
        setUserData(data);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshUserData = useCallback(async () => {
    if (firebaseUser) {
      const data = await getUserData(firebaseUser.uid);
      setUserData(data);
    }
  }, [firebaseUser]);

  const logout = useCallback(async () => {
    await logoutUser();
    setFirebaseUser(null);
    setUserData(null);
  }, []);

  return {
    user: firebaseUser,
    userData,
    loading,
    isAuthenticated: !!firebaseUser,
    logout,
    refreshUserData,
  };
}
