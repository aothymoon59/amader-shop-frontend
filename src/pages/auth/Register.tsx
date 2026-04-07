import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store } from "lucide-react";

const Register = () => (
  <div className="min-h-screen flex">
    <div className="hidden lg:flex flex-1 gradient-hero items-center justify-center p-12">
      <div className="max-w-md text-center">
        <Store className="h-16 w-16 mx-auto mb-6 text-primary" />
        <h2 className="text-3xl font-bold mb-4" style={{ color: 'hsl(0,0%,100%)' }}>Join SmallShop</h2>
        <p style={{ color: 'hsl(220,14%,70%)' }}>Create an account to start shopping or selling.</p>
      </div>
    </div>
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-1">Create Account</h1>
        <p className="text-sm text-muted-foreground mb-6">Fill in your details to get started</p>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><Label>First Name</Label><Input placeholder="John" className="mt-1.5" /></div>
            <div><Label>Last Name</Label><Input placeholder="Doe" className="mt-1.5" /></div>
          </div>
          <div><Label>Email</Label><Input type="email" placeholder="you@example.com" className="mt-1.5" /></div>
          <div><Label>Password</Label><Input type="password" placeholder="••••••••" className="mt-1.5" /></div>
          <Button variant="hero" className="w-full" size="lg">Create Account</Button>
        </div>
        <p className="text-sm text-center text-muted-foreground mt-6">
          Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  </div>
);

export default Register;
