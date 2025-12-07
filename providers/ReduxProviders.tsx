"use client";

import { ReactNode, useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { store, AppDispatch, RootState } from "@/store/store";
import { fetchProfile } from "@/store/slices/authSlice";

interface Props {
  children: ReactNode;
}

function InnerProfileProvider({ children }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useSelector((state: RootState) => state.auth);

  const [profileChecked, setProfileChecked] = useState(false);

  const isAuthPage = pathname.startsWith("/auth");

  useEffect(() => {
    const restoreUser = async () => {
      try {
        await dispatch(fetchProfile()).unwrap();
      } catch {
      } finally {
        setProfileChecked(true);
      }
    };
    restoreUser();
  }, [dispatch]);

  useEffect(() => {
    if (!profileChecked) return;

    if (!user && !isAuthPage) {
      router.replace("/auth/login");
    }

    if (user && isAuthPage) {
      router.replace("/");
    }
  }, [user, profileChecked, isAuthPage, router]);

  if (!profileChecked || loading) return null;

  return <>{children}</>;
}

export default function ReduxProfileProvider({ children }: Props) {
  return (
    <Provider store={store}>
      <InnerProfileProvider>{children}</InnerProfileProvider>
    </Provider>
  );
}
