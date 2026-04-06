import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Store } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { demoAccounts, useAuth } from "@/context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const demoUsers = demoAccounts.filter((account) =>
    account.role === "customer" || account.role === "provider",
  );

  const handleLogin = (email: string, password: string) => {
    const result = login(email, password);

    if (!result.success) {
      toast({
        title: "Login failed",
        description: result.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Demo login successful",
      description: "You are now signed in.",
    });

    const redirectFromState = (location.state as { from?: string } | null)?.from;
    navigate(redirectFromState || result.redirectTo || "/", { replace: true });
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-1 gradient-hero items-center justify-center p-12">
        <div className="max-w-md text-center">
          <Store className="h-16 w-16 mx-auto mb-6 text-primary" />
          <h2 className="text-3xl font-bold mb-4" style={{ color: "hsl(0,0%,100%)" }}>Welcome Back</h2>
          <p style={{ color: "hsl(220,14%,70%)" }}>Use a demo account to sign in as a customer or provider.</p>
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
            <p className="text-sm text-muted-foreground mt-1">Use any demo account below to continue</p>
          </div>
          <div className="space-y-4">
            <div><Label>Email</Label><Input type="email" value={formData.email} onChange={(e) => setFormData((current) => ({ ...current, email: e.target.value }))} placeholder="you@example.com" className="mt-1.5" /></div>
            <div><Label>Password</Label><Input type="password" value={formData.password} onChange={(e) => setFormData((current) => ({ ...current, password: e.target.value }))} placeholder="demo123" className="mt-1.5" /></div>
            <Button variant="hero" className="w-full" size="lg" onClick={() => handleLogin(formData.email, formData.password)}>Sign In</Button>
          </div>
          <div className="mt-6 rounded-xl border bg-card p-4">
            <p className="text-sm font-medium mb-3">Demo accounts</p>
            <div className="space-y-3">
              {demoUsers.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  className="w-full rounded-lg border p-3 text-left hover:border-primary transition-colors"
                  onClick={() => handleLogin(account.email, account.password)}
                >
                  <div className="font-medium">{account.name}</div>
                  <div className="text-xs text-muted-foreground">{account.email}</div>
                  <div className="text-xs text-muted-foreground">Password: {account.password}</div>
                </button>
              ))}
            </div>
          </div>
          <p className="text-sm text-center text-muted-foreground mt-6">
            Don&apos;t have an account? <Link to="/register" className="text-primary font-medium hover:underline">Sign Up</Link>
          </p>
          <p className="text-xs text-center text-muted-foreground mt-3">
            <Link to="/admin/login" className="hover:underline">Admin and Super Admin Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
