import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store } from "lucide-react";

const Login = () => (
  <div className="min-h-screen flex">
    <div className="hidden lg:flex flex-1 gradient-hero items-center justify-center p-12">
      <div className="max-w-md text-center">
        <Store className="h-16 w-16 mx-auto mb-6 text-primary" />
        <h2 className="text-3xl font-bold mb-4" style={{ color: 'hsl(0,0%,100%)' }}>Welcome Back</h2>
        <p style={{ color: 'hsl(220,14%,70%)' }}>Sign in to access your dashboard and manage your store.</p>
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
          <p className="text-sm text-muted-foreground mt-1">Enter your credentials to continue</p>
        </div>
        <div className="space-y-4">
          <div><Label>Email</Label><Input type="email" placeholder="you@example.com" className="mt-1.5" /></div>
          <div><Label>Password</Label><Input type="password" placeholder="••••••••" className="mt-1.5" /></div>
          <Button variant="hero" className="w-full" size="lg">Sign In</Button>
        </div>
        <p className="text-sm text-center text-muted-foreground mt-6">
          Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Sign Up</Link>
        </p>
        <p className="text-xs text-center text-muted-foreground mt-3">
          <Link to="/admin/login" className="hover:underline">Admin Login</Link>
        </p>
      </div>
    </div>
  </div>
);

export default Login;
