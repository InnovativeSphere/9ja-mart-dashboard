"use client";

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

      {/* Welcome message (static for mock) */}
      <div className="text-white/90 text-sm">
        Welcome, <span className="font-medium text-[#29b6d8]">Admin</span>
      </div>
    </header>
  );
}