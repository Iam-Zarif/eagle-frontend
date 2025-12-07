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

  const isActive = (path: string) => pathname === path;

  const activeClass = "text-indigo-500 border-b-2 border-indigo-500";
  const inactiveClass =
    "text-gray-200 hover:text-indigo-500 hover:bg-transparent";

  return (
    <>
      <div className="fixed z-9999 top-0 left-0 w-full bg-gray-900/90 backdrop-blur-md border-b border-gray-700/50">
        <div className="max-w-6xl z-9999 mx-auto px-6 lg:px-10 py-4 flex justify-between items-center">
          <h1
            onClick={() => router.push("/")}
            className="text-2xl cursor-pointer font-bold text-indigo-500"
          >
            Eagle3D
          </h1>

          <div className="hidden lg:flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className={`px-3 py-2 cursor-pointer ${
                isActive("/") ? activeClass : inactiveClass
              }`}
            >
              Products
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push("/analytics")}
              className={`px-3 py-2 cursor-pointer ${
                isActive("/analytics") ? activeClass : inactiveClass
              }`}
            >
              Analytics
            </Button>
          </div>

          <Button
            variant="destructive"
            onClick={handleLogout}
            className="px-4 py-2 hidden lg:block cursor-pointer"
          >
            Logout
          </Button>

          <div className="lg:hidden">
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="px-4 py-2 cursor-pointer"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="fixed z-9999 bottom-0 left-0 w-full bg-gray-900/90 backdrop-blur-md border-t border-gray-700/50 lg:hidden flex justify-around py-2">
        <Button
          variant="ghost"
          onClick={() => router.push("/")}
          className={`flex-1 px-3 py-2 cursor-pointer ${
            isActive("/") ? activeClass : inactiveClass
          }`}
        >
          Products
        </Button>
        <Button
          variant="ghost"
          onClick={() => router.push("/analytics")}
          className={`flex-1 px-3 py-2 cursor-pointer ${
            isActive("/analytics") ? activeClass : inactiveClass
          }`}
        >
          Analytics
        </Button>
      </div>

      <div className="pt-[68px] lg:pt-[68px]"></div>
    </>
  );
};

export default Navbar;
