import {
  Facebook,
  Instagram,
  Linkedin,
  MessageCircle,
  Music2,
  Twitter,
  Youtube,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useGetPublicSiteConfigQuery } from "@/redux/features/generalApi/publicSiteConfigApi";
import BrandLogo from "@/components/shared/BrandLogo";

const Footer = () => {
  const { data } = useGetPublicSiteConfigQuery();
  const siteOverview = data?.data.siteOverview;
  const social = data?.data.socialMediaConfig;
  const siteName = siteOverview?.name || "SmallShop";
  const description =
    siteOverview?.description ||
    "Your multi-vendor marketplace for quality products from trusted sellers.";
  const copyrights =
    siteOverview?.copyrights ||
    `Copyright ${new Date().getFullYear()} ${siteName}. All rights reserved.`;
  const socialLinks = [
    { label: "Facebook", href: social?.facebookUrl, icon: Facebook },
    { label: "Instagram", href: social?.instagramUrl, icon: Instagram },
    { label: "X", href: social?.xUrl, icon: Twitter },
    { label: "YouTube", href: social?.youtubeUrl, icon: Youtube },
    { label: "LinkedIn", href: social?.linkedinUrl, icon: Linkedin },
    { label: "TikTok", href: social?.tiktokUrl, icon: Music2 },
    { label: "WhatsApp", href: social?.whatsappUrl, icon: MessageCircle },
  ].filter((item) => item.href);

  return (
    <footer className="border-t bg-card py-12">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BrandLogo size="sm" nameClassName="text-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
          {socialLinks.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border text-muted-foreground transition hover:border-primary hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          ) : null}
        </div>
        <div>
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <Link to="/products" className="block hover:text-primary">
              Products
            </Link>
            <Link to="/about" className="block hover:text-primary">
              About Us
            </Link>
            <Link to="/contact" className="block hover:text-primary">
              Contact
            </Link>
            <Link to="/terms" className="block hover:text-primary">
              Terms
            </Link>
            <Link to="/privacy" className="block hover:text-primary">
              Privacy
            </Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3">For Vendors</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <Link to="/provider/apply" className="block hover:text-primary">
              Become a Seller
            </Link>
            <Link to="/login" className="block hover:text-primary">
              Vendor Login
            </Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Support</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>support@gromart.com</p>
            <p>1-800-GROMART</p>
          </div>
        </div>
      </div>
      <div className="container mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
        {copyrights}
      </div>
    </footer>
  );
};

export default Footer;
