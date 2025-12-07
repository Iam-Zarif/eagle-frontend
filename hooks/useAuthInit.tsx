"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "@/store/slices/authSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useRouter } from "next/navigation";

export function useAuthInit() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!user) {
      dispatch(fetchProfile())
        .unwrap()
        .catch(() => {
          router.push("/auth/login");
        });
    }
  }, [dispatch, user, router]);

  return { user, loading };
}
