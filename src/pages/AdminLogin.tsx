/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { normalizeUserRole, roleMap } from "@/redux/features/auth/authSlice";

const getRedirectPath = (role: string) => {
  switch (normalizeUserRole(role)) {
    case roleMap.SUPER_ADMIN:
      return "/super-admin/dashboard";
    case roleMap.ADMIN:
      return "/admin/dashboard";
    default:
      return "/";
  }
};

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "admin@example.com",
    password: "123456",
  });

  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await login({ email, password }).unwrap();

      const userRole = normalizeUserRole(response?.data?.user?.role);

      // 🚫 BLOCK customer + provider
      if (userRole !== roleMap.ADMIN && userRole !== roleMap.SUPER_ADMIN) {
        toast({
          title: "Access denied",
          description: "Only Admin and Super Admin can login here.",
          variant: "destructive",
        });

        navigate("/login", { replace: true });
        return;
      }

      const redirectFromState = (
        location.state as { from?: { pathname?: string } } | null
      )?.from?.pathname;

      toast({
        title: "Login successful",
        description: response.message || "Admin access granted.",
      });
      console.log("Login response:", response);

      if (response?.success === true) {
        console.log(
          "Redirecting to:",
          redirectFromState || getRedirectPath(userRole),
        );
        navigate(redirectFromState || getRedirectPath(userRole), {
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await handleLogin(formData.email, formData.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sidebar p-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="mx-auto h-14 w-14 rounded-xl gradient-primary flex items-center justify-center mb-4">
            <Shield className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1
            className="text-2xl font-bold"
            style={{ color: "hsl(0,0%,100%)" }}
          >
            Admin Portal
          </h1>
          <p className="text-sm mt-1" style={{ color: "hsl(220,14%,50%)" }}>
            Sign in with your admin credentials
          </p>
        </div>

        <form
          className="rounded-xl border border-sidebar-border bg-sidebar-accent p-6 space-y-4"
          onSubmit={handleSubmit}
        >
          <div>
            <Label
              htmlFor="admin-login-email"
              style={{ color: "hsl(220,14%,70%)" }}
            >
              Email
            </Label>
            <Input
              id="admin-login-email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((current) => ({
                  ...current,
                  email: e.target.value,
                }))
              }
              placeholder="admin@example.com"
              className="mt-1.5 bg-sidebar border-sidebar-border"
              style={{ color: "hsl(0,0%,100%)" }}
              required
            />
          </div>

          <div>
            <Label
              htmlFor="admin-login-password"
              style={{ color: "hsl(220,14%,70%)" }}
            >
              Password
            </Label>
            <Input
              id="admin-login-password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData((current) => ({
                  ...current,
                  password: e.target.value,
                }))
              }
              placeholder="Enter your password"
              className="mt-1.5 bg-sidebar border-sidebar-border"
              style={{ color: "hsl(0,0%,100%)" }}
              required
            />
          </div>

          <Button
            variant="hero"
            className="w-full"
            size="lg"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Access Dashboard"}
          </Button>
        </form>

        <div className="rounded-xl border border-sidebar-border bg-sidebar-accent p-4 space-y-1 mt-4">
          <div className="font-medium" style={{ color: "hsl(0,0%,100%)" }}>
            Test credentials
          </div>
          <div className="text-xs" style={{ color: "hsl(220,14%,60%)" }}>
            Email: admin@example.com
          </div>
          <div className="text-xs" style={{ color: "hsl(220,14%,60%)" }}>
            Password: 123456
          </div>
        </div>

        <p
          className="text-center text-xs mt-6"
          style={{ color: "hsl(220,14%,40%)" }}
        >
          <Link to="/login" className="hover:underline">
            Back to customer and provider login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
