import { BadgePercent, Clock3 } from "lucide-react";

const TopPromoBar = () => {
  return (
    <section className="border-b bg-primary/5">
      <div className="container py-3">
        <div className="flex flex-col gap-2 text-center text-sm font-medium text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div className="flex items-center justify-center gap-2">
            <BadgePercent className="h-4 w-4 text-primary" />
            <span>Free delivery on orders above $30</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Clock3 className="h-4 w-4 text-primary" />
            <span>Delivery in 30–60 minutes in selected areas</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopPromoBar;
