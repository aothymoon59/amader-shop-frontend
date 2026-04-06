import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ProviderDetails = {
  name: string;
  owner: string;
  email: string;
  phone: string;
  category: string;
  address: string;
  status: string;
  products?: number;
};

const ProviderDetailsDialog = ({
  open,
  onOpenChange,
  provider,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider: ProviderDetails | null;
}) => {
  if (!provider) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{provider.name}</DialogTitle>
          <DialogDescription>
            Review the provider profile and onboarding information.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-lg border p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Owner</div>
            <div className="font-medium">{provider.owner}</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Status</div>
            <div className="font-medium capitalize">{provider.status}</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Email</div>
            <div className="font-medium break-all">{provider.email}</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Phone</div>
            <div className="font-medium">{provider.phone}</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Category</div>
            <div className="font-medium">{provider.category}</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Products</div>
            <div className="font-medium">{provider.products ?? 0}</div>
          </div>
          <div className="rounded-lg border p-4 sm:col-span-2">
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Address</div>
            <div className="font-medium">{provider.address}</div>
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

export default ProviderDetailsDialog;
