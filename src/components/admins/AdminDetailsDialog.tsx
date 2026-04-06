import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type AdminDetails = {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: string;
  address: string;
  notes: string;
};

const AdminDetailsDialog = ({
  open,
  onOpenChange,
  admin,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  admin: AdminDetails | null;
}) => {
  if (!admin) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{admin.fullName}</DialogTitle>
          <DialogDescription>
            Review admin access details and profile information.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-lg border p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Email</div>
            <div className="font-medium break-all">{admin.email}</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Phone</div>
            <div className="font-medium">{admin.phone}</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Role</div>
            <div className="font-medium">{admin.role}</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Status</div>
            <div className="font-medium">{admin.status}</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Department</div>
            <div className="font-medium">{admin.department}</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Address</div>
            <div className="font-medium">{admin.address}</div>
          </div>
          <div className="rounded-lg border p-4 sm:col-span-2">
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Notes</div>
            <div className="font-medium">{admin.notes || "No notes added yet."}</div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminDetailsDialog;
