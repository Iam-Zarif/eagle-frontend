"use client";

import { ReactNode, useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { store, AppDispatch, RootState } from "@/store/store";
import { fetchProfile } from "@/store/slices/authSlice";

interface Props {
  children: ReactNode;
}

function InnerProfileProvider({ children }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user, loading } = useSelector((state: RootState) => state.auth);

  const [profileChecked, setProfileChecked] = useState(false);

  useEffect(() => {
    const restoreUser = async () => {
      await dispatch(fetchProfile());
      setProfileChecked(true);
    };
    restoreUser();
  }, [dispatch]);

  useEffect(() => {
    if (profileChecked && !user) {
      router.replace("/auth/login"); 
    }
  }, [user, profileChecked, router]);

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
