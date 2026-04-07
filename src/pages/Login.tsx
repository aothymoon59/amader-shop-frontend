/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LoaderCircle, Store } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";

import {
  type LoginRequestRole,
  useLoginMutation,
} from "@/redux/features/auth/authApi";
import { useAppDispatch } from "@/redux/hooks";
import {
  normalizeUserRole,
  roleMap,
  setUser,
} from "@/redux/features/auth/authSlice";

const getRedirectPath = (role: string) => {
  switch (normalizeUserRole(role)) {
    case roleMap.PROVIDER:
      return "/provider/dashboard";
    case roleMap.CUSTOMER:
      return "/";
    case roleMap.ADMIN:
      return "/admin/dashboard";
    case roleMap.SUPER_ADMIN:
      return "/super-admin/dashboard";
    default:
      return "/";
  }
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const [showPass, setShowPass] = useState(false);
  const [selectedRole, setSelectedRole] =
    useState<LoginRequestRole>("CUSTOMER");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [login, { isLoading }] = useLoginMutation();

  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname || "/";

  const handleLogin = async () => {
    try {
      const userInfo = {
        email: formData.email,
        password: formData.password,
        role: selectedRole,
      };

      const res = await login(userInfo).unwrap();
      const userRole = normalizeUserRole(res?.data?.user?.role);

      if (userRole !== roleMap.CUSTOMER && userRole !== roleMap.PROVIDER) {
        toast({
          title: "Access denied",
          description: "Only customers and providers can log in here",
          variant: "destructive",
        });
        return;
      }

      if (res?.success === true) {
        dispatch(
          setUser({
            user: res.data.user,
            token: res.data.accessToken,
          }),
        );

        toast({
          title: "Login successful",
          description: res.message || "You are now signed in.",
        });

        navigate(from !== "/" ? from : getRedirectPath(userRole), {
          replace: true,
        });
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description:
          error?.data?.errorMessage ||
          error?.data?.message ||
          "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin();
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-1 gradient-hero items-center justify-center p-12">
        <div className="max-w-md text-center">
          <Link to="/" className="flex items-center gap-2 mb-6 justify-center">
            <Store className="h-16 w-16 mx-auto mb-6 text-primary" />
          </Link>
          <h2
            className="text-3xl font-bold mb-4"
            style={{ color: "hsl(0,0%,100%)" }}
          >
            Welcome Back
          </h2>
          <p style={{ color: "hsl(220,14%,70%)" }}>
            Please enter your credentials to sign in as a customer or provider.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
              <Store className="h-7 w-7 text-primary" />
              <span className="text-xl font-bold">SmallShop</span>
            </Link>

            <h1 className="text-2xl font-bold">Sign In</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Enter your email and password to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Tabs
                value={selectedRole}
                onValueChange={(value) =>
                  setSelectedRole(value as LoginRequestRole)
                }
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="CUSTOMER">Customer</TabsTrigger>
                  <TabsTrigger value="PROVIDER">Provider</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((current) => ({
                    ...current,
                    email: e.target.value,
                  }))
                }
                placeholder="you@example.com"
                className="mt-1.5"
                required
              />
            </div>

            <div>
              <Label>Password</Label>
              <div className="relative mt-1.5">
                <Input
                  type={showPass ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((current) => ({
                      ...current,
                      password: e.target.value,
                    }))
                  }
                  placeholder="******"
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPass ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              variant="hero"
              className="w-full"
              size="lg"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-6">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="text-primary font-medium hover:underline"
            >
              Sign Up
            </Link>
          </p>

          <p className="text-xs text-center text-muted-foreground mt-3">
            <Link to="/admin/login" className="hover:underline">
              Admin and Super Admin Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
