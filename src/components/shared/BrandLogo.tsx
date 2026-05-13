import { Store } from "lucide-react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { useGetPublicSiteConfigQuery } from "@/redux/features/generalApi/publicSiteConfigApi";

type BrandLogoVariant = "full" | "logo" | "name";
type BrandLogoSize = "xs" | "sm" | "md" | "lg" | "xl";

type BrandLogoProps = {
  variant?: BrandLogoVariant;
  size?: BrandLogoSize;
  to?: string;
  className?: string;
  logoClassName?: string;
  nameClassName?: string;
  iconClassName?: string;
  fallbackName?: string;
};

const sizeClasses: Record<
  BrandLogoSize,
  { logo: string; icon: string; name: string; gap: string }
> = {
  xs: {
    logo: "h-6 w-6",
    icon: "h-5 w-5",
    name: "text-sm",
    gap: "gap-1.5",
  },
  sm: {
    logo: "h-7 w-7",
    icon: "h-6 w-6",
    name: "text-base",
    gap: "gap-2",
  },
  md: {
    logo: "h-8 w-8",
    icon: "h-7 w-7",
    name: "text-xl",
    gap: "gap-2",
  },
  lg: {
    logo: "h-12 w-12",
    icon: "h-11 w-11",
    name: "text-2xl",
    gap: "gap-3",
  },
  xl: {
    logo: "h-16 w-16",
    icon: "h-16 w-16",
    name: "text-3xl",
    gap: "gap-4",
  },
};

const BrandLogoContent = ({
  variant = "full",
  size = "md",
  className,
  logoClassName,
  nameClassName,
  iconClassName,
  fallbackName = "SmallShop",
}: Omit<BrandLogoProps, "to">) => {
  const { data } = useGetPublicSiteConfigQuery();
  const siteOverview = data?.data.siteOverview;
  const siteName = siteOverview?.name || fallbackName;
  const classes = sizeClasses[size];
  const showLogo = variant === "full" || variant === "logo";
  const showName = variant === "full" || variant === "name";

  return (
    <span className={cn("inline-flex items-center", classes.gap, className)}>
      {showLogo ? (
        siteOverview?.logoUrl ? (
          <img
            src={siteOverview.logoUrl}
            alt={siteName}
            className={cn("shrink-0 rounded-md object-contain", classes.logo, logoClassName)}
          />
        ) : (
          <Store
            className={cn("shrink-0 text-primary", classes.icon, iconClassName)}
            aria-label={variant === "logo" ? siteName : undefined}
          />
        )
      ) : null}

      {showName ? (
        <span className={cn("font-bold leading-none", classes.name, nameClassName)}>
          {siteName}
        </span>
      ) : null}
    </span>
  );
};

const BrandLogo = ({ to, ...props }: BrandLogoProps) => {
  if (to) {
    return (
      <Link to={to} className="inline-flex">
        <BrandLogoContent {...props} />
      </Link>
    );
  }

  return <BrandLogoContent {...props} />;
};

export default BrandLogo;
