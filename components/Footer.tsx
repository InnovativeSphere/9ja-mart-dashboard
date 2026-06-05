"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  Settings,
  Store,
  BarChart3,
  ArrowUpDown,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Products", href: "/products", icon: Package },
    { name: "Orders", href: "/orders", icon: ShoppingCart },
    { name: "Sellers", href: "/sellers", icon: Store },
    { name: "Buyers", href: "/buyers", icon: Users },
    { name: "Transactions", href: "/transactions", icon: ArrowUpDown },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <footer className="footer-wrapper">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#29b6d8] to-[#3ec8e6] flex items-center justify-center text-white font-extrabold text-lg">
                9
              </div>
              <h4 className="text-xl font-bold text-white">9jaMart</h4>
            </div>
            <p className="text-sm text-white/80 leading-7">
              The admin dashboard for Nigeria’s fastest‑growing digital marketplace. Manage products, orders, sellers, and more — all in one place.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-white/80 hover:text-[#29b6d8] transition-colors duration-300"
                  >
                    <link.icon size={16} className="text-[#29b6d8]/70 group-hover:text-[#29b6d8]" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>Email: hello@9jamart.ng</li>
              <li>Phone: +234 800 000 0000</li>
              <li>Lagos, Nigeria</li>
            </ul>
            <div className="flex mt-4 gap-3">
              {[
                { href: "https://facebook.com", icon: Facebook },
                { href: "https://twitter.com", icon: Twitter },
                { href: "https://instagram.com", icon: Instagram },
                { href: "https://linkedin.com", icon: Linkedin },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-[#29b6d8]/10 border border-[#29b6d8]/20 text-[#29b6d8] hover:bg-[#29b6d8]/30 hover:border-[#29b6d8]/50 hover:text-white transition-all duration-300"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#29b6d8]/20 text-center text-sm text-white/60">
          &copy; {currentYear} 9jaMart. All rights reserved.
        </div>
      </div>

      <style jsx>{`
        .footer-wrapper {
          background: rgba(10, 39, 66, 0.9);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-top: 2px solid;
          border-image: linear-gradient(90deg, #29b6d8, #3ec8e6, #29b6d8) 1;
        }
      `}</style>
    </footer>
  );
};

export default Footer;