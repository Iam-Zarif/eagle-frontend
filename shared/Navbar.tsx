"use client";

import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { apiSlice } from "@/store/slices/apiSlice";
import { logout } from "@/store/slices/authSlice";
import { resetProducts } from "@/store/slices/productSlice";
import { Api } from "@/api/Api";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  if (pathname.startsWith("/auth")) return null;

  const handleLogout = async () => {
    try {
      const res = await fetch(`${Api}/profile/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Logout failed");
      dispatch(apiSlice.util.resetApiState());
      dispatch(logout());
      dispatch(resetProducts());

      router.replace("/auth/login");
    } catch (err) {
      console.error("Logout error:", err);
      alert("Something went wrong during logout");
    }
  };

  return (
    <nav className="w-full bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50 px-6 lg:px-10 py-4 flex justify-between items-center">
      <div className="max-w-6xl lg:px-8 mx-auto flex items-center justify-between w-full">
        <div className="flex items-center space-x-4">
          <h1
            onClick={() => router.push("/")}
            className="text-2xl cursor-pointer font-bold text-indigo-500"
          >
            Eagle3D
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="text-gray-200 hover:text-indigo-500 hover:bg-transparent cursor-pointer px-3 py-2"
          >
            Products
          </Button>
          <Button
            variant="ghost"
            onClick={() => router.push("/analytics")}
            className="text-gray-200 hover:text-indigo-500 hover:bg-transparent cursor-pointer px-3 py-2"
          >
            Analytics
          </Button>
        </div>
        <div>
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="px-4 py-2 cursor-pointer"
          >
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
