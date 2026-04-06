import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { demoAccounts, useAuth } from "@/context/AuthContext";

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const adminAccounts = demoAccounts.filter((account) =>
    account.role === "admin" || account.role === "super-admin",
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
      description: "Admin access granted.",
    });

    const redirectFromState = (location.state as { from?: string } | null)?.from;
    navigate(redirectFromState || result.redirectTo || "/admin/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sidebar p-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="mx-auto h-14 w-14 rounded-xl gradient-primary flex items-center justify-center mb-4">
            <Shield className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: "hsl(0,0%,100%)" }}>Admin Portal</h1>
          <p className="text-sm mt-1" style={{ color: "hsl(220,14%,50%)" }}>Use a demo admin or super admin account</p>
        </div>
        <div className="rounded-xl border border-sidebar-border bg-sidebar-accent p-6 space-y-4">
          <div><Label style={{ color: "hsl(220,14%,70%)" }}>Email</Label><Input type="email" value={formData.email} onChange={(e) => setFormData((current) => ({ ...current, email: e.target.value }))} placeholder="admin@smallshop.com" className="mt-1.5 bg-sidebar border-sidebar-border" style={{ color: "hsl(0,0%,100%)" }} /></div>
          <div><Label style={{ color: "hsl(220,14%,70%)" }}>Password</Label><Input type="password" value={formData.password} onChange={(e) => setFormData((current) => ({ ...current, password: e.target.value }))} placeholder="demo123" className="mt-1.5 bg-sidebar border-sidebar-border" style={{ color: "hsl(0,0%,100%)" }} /></div>
          <Button variant="hero" className="w-full" size="lg" onClick={() => handleLogin(formData.email, formData.password)}>Access Dashboard</Button>
        </div>
        <div className="rounded-xl border border-sidebar-border bg-sidebar-accent p-4 space-y-3 mt-4">
          {adminAccounts.map((account) => (
            <button
              key={account.email}
              type="button"
              className="w-full rounded-lg border border-sidebar-border p-3 text-left hover:border-primary transition-colors"
              onClick={() => handleLogin(account.email, account.password)}
            >
              <div className="font-medium" style={{ color: "hsl(0,0%,100%)" }}>{account.name}</div>
              <div className="text-xs" style={{ color: "hsl(220,14%,60%)" }}>{account.email}</div>
              <div className="text-xs" style={{ color: "hsl(220,14%,60%)" }}>Password: {account.password}</div>
            </button>
          ))}
        </div>
        <p className="text-center text-xs mt-6" style={{ color: "hsl(220,14%,40%)" }}>
          <Link to="/login" className="hover:underline">Back to customer and provider login</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
