import { Store } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t bg-card py-12">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Store className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">SmallShop</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Your multi-vendor marketplace for quality products from trusted
            sellers.
          </p>
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
            <p>support@smallshop.com</p>
            <p>1-800-SMALL-SHOP</p>
          </div>
        </div>
      </div>
      <div className="container mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
        Copyright 2026 SmallShop. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
