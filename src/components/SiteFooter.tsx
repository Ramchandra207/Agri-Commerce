import { Link } from "@tanstack/react-router";
import { Leaf, Mail, Phone, MapPin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-secondary text-secondary-foreground">
      <div className="container mx-auto grid gap-10 px-4 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </span>
            <span className="font-display text-xl font-bold">AgriCommerce</span>
          </div>
          <p className="mt-4 text-sm text-secondary-foreground/75">
            India's trusted agri partner for premium seeds, fertilizers, tools and organic inputs.
          </p>
        </div>

        <div>
          <h4 className="font-display text-base font-semibold">Shop</h4>
          <ul className="mt-4 space-y-2 text-sm text-secondary-foreground/75">
            <li><Link to="/products" className="hover:text-primary-foreground">All Products</Link></li>
            <li><Link to="/enquiry" className="hover:text-primary-foreground">Bulk Enquiry</Link></li>
            <li><Link to="/cart" className="hover:text-primary-foreground">Cart</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-base font-semibold">Company</h4>
          <ul className="mt-4 space-y-2 text-sm text-secondary-foreground/75">
            <li><Link to="/about" className="hover:text-primary-foreground">About</Link></li>
            <li><Link to="/contact" className="hover:text-primary-foreground">Contact</Link></li>
            <li><Link to="/faq" className="hover:text-primary-foreground">FAQ</Link></li>
            <li><Link to="/privacy" className="hover:text-primary-foreground">Privacy</Link></li>
            <li><Link to="/terms" className="hover:text-primary-foreground">Terms</Link></li>
            <li><Link to="/shipping" className="hover:text-primary-foreground">Shipping</Link></li>
            <li><Link to="/returns" className="hover:text-primary-foreground">Returns</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-base font-semibold">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm text-secondary-foreground/75">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@agricommerce.in</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +91 98765 43210</li>
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4" /> Plot 12, Agri Park, Pune, MH 411001</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-5 text-xs text-secondary-foreground/60">
          © {new Date().getFullYear()} AgriCommerce. All rights reserved.
        </div>
      </div>
    </footer>
  );
}