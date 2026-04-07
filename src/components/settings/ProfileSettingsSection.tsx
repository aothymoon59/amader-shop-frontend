import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

const ProfileSettingsSection = ({ title }: { title?: string }) => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
    });
  }, [user]);

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast({
        title: "Missing profile details",
        description: "Name and email are required.",
        variant: "destructive",
      });
      return;
    }

    updateProfile(formData);
    toast({
      title: "Profile updated",
      description: "Your profile settings have been saved.",
    });
  };

  return (
    <div className="rounded-xl border bg-card p-6 space-y-4">
      <h2 className="font-semibold">{title || "Profile Settings"}</h2>
      <div>
        <Label>Full Name</Label>
        <Input
          value={formData.name}
          onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
          className="mt-1.5"
        />
      </div>
      <div>
        <Label>Email</Label>
        <Input
          type="email"
          value={formData.email}
          onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
          className="mt-1.5"
        />
      </div>
      <div>
        <Label>Phone</Label>
        <Input
          value={formData.phone}
          onChange={(event) => setFormData((current) => ({ ...current, phone: event.target.value }))}
          placeholder="+8801XXXXXXXXX"
          className="mt-1.5"
        />
      </div>
      <div>
        <Label>Address</Label>
        <Input
          value={formData.address}
          onChange={(event) => setFormData((current) => ({ ...current, address: event.target.value }))}
          placeholder="Dhaka, Bangladesh"
          className="mt-1.5"
        />
      </div>
      <Button variant="hero" onClick={handleSubmit}>Save Profile</Button>
    </div>
  );
};

export default ProfileSettingsSection;
