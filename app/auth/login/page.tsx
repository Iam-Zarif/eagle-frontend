"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast, Toaster } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { useLoginMutation } from "@/store/slices/apiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/slices/authSlice";
import { useForm } from "react-hook-form";
import { RootState } from "@/store/store";
import axios from "axios";

interface LoginFormInputs {
  username: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await login(data).unwrap();
      toast.success("Login successful");
      dispatch(setUser(response));
      router.push("/");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Login failed");
      } else {
        toast.error("Login failed");
      }
    }
  };

  return (
    <div className="flex items-center justify-center pt-20 lg:pt-0 lg:min-h-screen md:p-6">
      <Toaster />
      <Card className="w-full px-4 md:px-0 md:max-w-md bg-transparent md:bg-gray-900/90 text-gray-100 rounded-xl border-0 md:border md:border-gray-700/40 shadow-lg">
        <CardHeader className="mb-4">
          <CardTitle className="text-2xl text-center font-semibold">
            Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="flex flex-col gap-1">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                {...register("username", { required: "Username is required" })}
                className="bg-gray-800/70 text-gray-100 border border-gray-600 md:py-5 placeholder-gray-400 focus:border-indigo-500 mt-2 focus:ring-indigo-500 transition"
              />
              {errors.username && (
                <p className="text-red-400 text-sm">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1 relative">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password", { required: "Password is required" })}
                className="bg-gray-800/70 text-gray-100 border border-gray-600 lg:py-5 placeholder-gray-400 focus:border-indigo-500 mt-2 focus:ring-indigo-500 transition pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 cursor-pointer text-gray-400 hover:text-gray-200"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && (
                <p className="text-red-400 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-indigo-600/80 hover:bg-indigo-500/80 text-white cursor-pointer lg:py-5"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
