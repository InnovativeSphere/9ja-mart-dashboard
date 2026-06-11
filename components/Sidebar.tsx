"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  LogOut,
  BarChart3,
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/products", icon: Package },
  { name: "Orders", href: "/orders", icon: ShoppingCart },
  { name: "Users", href: "/users", icon: Users },
  { name: "Transactions", href: "/transactions", icon: TrendingUp },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
];

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside
      className={`fixed top-0 left-0 h-screen flex flex-col transition-all duration-500 z-50
        ${collapsed ? "w-[72px]" : "w-64"}
        bg-[#0a2742]/95 backdrop-blur-xl border-r border-[#29b6d8]/20`}
    >
      {/* Header unchanged */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#29b6d8]/10">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#29b6d8] to-[#3ec8e6] flex items-center justify-center text-white font-extrabold text-lg flex-shrink-0">
              9
            </div>
            <span className="font-bold text-white text-lg whitespace-nowrap">
              9jaMart
            </span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors duration-300"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {collapsed ? (
              <path d="M9 18l6-6-6-6" />
            ) : (
              <path d="M15 18l-6-6 6-6" />
            )}
          </svg>
        </button>
      </div>

      {/* Navigation unchanged */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap
                ${isActive
                  ? "bg-gradient-to-r from-[#29b6d8]/25 to-[#3ec8e6]/10 text-[#29b6d8]"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
                }
              `}
            >
              <span className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                <item.icon size={20} />
              </span>
              <span className={`${collapsed ? "hidden" : "block"}`}>
                {item.name}
              </span>
              {isActive && !collapsed && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#29b6d8]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout – red, half width, icon only */}
    {/* Logout – red, wider, icon only */}
<div className="px-2 py-3 border-t border-[#29b6d8]/10 flex justify-center">
  <button
    onClick={() => router.push("/")}
    className="flex items-center justify-center w-28 h-10 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-300"
    aria-label="Logout"
    title="Logout"
  >
    <LogOut size={18} />
  </button>
</div>
    </aside>
  );
}