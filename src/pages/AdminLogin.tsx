import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";

const AdminLogin = () => (
  <div className="min-h-screen flex items-center justify-center bg-sidebar p-8">
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <div className="mx-auto h-14 w-14 rounded-xl gradient-primary flex items-center justify-center mb-4">
          <Shield className="h-7 w-7 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold" style={{ color: 'hsl(0,0%,100%)' }}>Admin Portal</h1>
        <p className="text-sm mt-1" style={{ color: 'hsl(220,14%,50%)' }}>Restricted access</p>
      </div>
      <div className="rounded-xl border border-sidebar-border bg-sidebar-accent p-6 space-y-4">
        <div><Label style={{ color: 'hsl(220,14%,70%)' }}>Email</Label><Input type="email" placeholder="admin@smallshop.com" className="mt-1.5 bg-sidebar border-sidebar-border" style={{ color: 'hsl(0,0%,100%)' }} /></div>
        <div><Label style={{ color: 'hsl(220,14%,70%)' }}>Password</Label><Input type="password" placeholder="••••••••" className="mt-1.5 bg-sidebar border-sidebar-border" style={{ color: 'hsl(0,0%,100%)' }} /></div>
        <Button variant="hero" className="w-full" size="lg">Access Dashboard</Button>
      </div>
      <p className="text-center text-xs mt-6" style={{ color: 'hsl(220,14%,40%)' }}>
        <Link to="/login" className="hover:underline">Back to regular login</Link>
      </p>
    </div>
  </div>
);

export default AdminLogin;
