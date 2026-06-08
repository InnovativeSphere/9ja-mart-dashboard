"use client";
import Link from "next/link";
import { Settings } from "lucide-react";

interface TopbarProps {
  sidebarCollapsed: boolean;
}

export default function Topbar({ sidebarCollapsed }: TopbarProps) {
  return (
    <header
      className={`
        fixed top-0 right-0 h-16
        bg-[#0a2742]/90 backdrop-blur-xl
        border-b border-white/10
        flex items-center justify-between px-6 z-40
        transition-all duration-500 ease-in-out
        ${sidebarCollapsed ? "left-[72px]" : "left-64"}
      `}
    >
      {/* Page title or brand name */}
      <div className="text-white/80 font-semibold text-sm tracking-wide">
        9jaMart Admin
      </div>

      {/* Welcome message + Settings icon */}
      <div className="flex items-center gap-4 text-white/90 text-sm">
        <span>
          Welcome, <span className="font-medium text-[#29b6d8]">Admin</span>
        </span>
        <Link
          href="/settings"
          className="p-1.5 rounded-md text-white/50 hover:text-[#29b6d8] hover:bg-white/5 transition-all duration-200"
          aria-label="Settings"
          title="Settings"
        >
          <Settings size={18} />
        </Link>
      </div>
    </header>
  );
}