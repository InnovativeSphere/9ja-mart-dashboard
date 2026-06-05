"use client";
import { useState } from "react";
import { Card } from "@/components/Card";
import {
  User,
  Lock,
  Bell,
  AlertTriangle,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";

/* ==================== COMPONENT ==================== */
export default function SettingsPage() {
  const [name, setName] = useState("Admin User");
  const [email, setEmail] = useState("admin@9jamart.ng");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderAlerts, setOrderAlerts] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const handleSave = (section: string) => {
    alert(`${section} settings saved (mock).`);
  };

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      alert("Account deleted (mock).");
    }
  };

  return (
    <div className="settings-wrapper">
      <div className="px-2 sm:px-4 py-6 space-y-8 animate-fadeIn">
        {/* ========== HEADER ========== */}
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm opacity-60 mt-1">
            Manage your profile, security, and preferences.
          </p>
        </div>

        {/* ========== PROFILE ========== */}
        <Card className="glass-card p-6 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5 text-[#29b6d8]" />
            <h2 className="text-lg font-semibold">Profile</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 opacity-80">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#29b6d8] transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 opacity-80">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#29b6d8] transition"
              />
            </div>
          </div>
          <button
            onClick={() => handleSave("Profile")}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#29b6d8] to-[#3ec8e6] text-white font-medium text-sm hover:scale-105 transition"
          >
            <Save size={16} />
            Save Changes
          </button>
        </Card>

        {/* ========== SECURITY ========== */}
        <Card className="glass-card p-6 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-5 h-5 text-[#29b6d8]" />
            <h2 className="text-lg font-semibold">Change Password</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 opacity-80">Current Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#29b6d8] transition pr-10"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 opacity-80">New Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#29b6d8] transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 opacity-80">Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#29b6d8] transition"
              />
            </div>
          </div>
          <button
            onClick={() => handleSave("Password")}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#29b6d8] to-[#3ec8e6] text-white font-medium text-sm hover:scale-105 transition"
          >
            <Save size={16} />
            Update Password
          </button>
        </Card>

        {/* ========== NOTIFICATIONS ========== */}
        <Card className="glass-card p-6 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-[#29b6d8]" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: "Email notifications", value: emailNotifications, setter: setEmailNotifications },
              { label: "Order alerts", value: orderAlerts, setter: setOrderAlerts },
              { label: "Marketing emails", value: marketingEmails, setter: setMarketingEmails },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-sm opacity-80">{item.label}</span>
                <button
                  onClick={() => item.setter(!item.value)}
                  className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
                    item.value ? "bg-[#29b6d8]" : "bg-white/10"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                      item.value ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* ========== DANGER ZONE ========== */}
        <Card className="glass-card p-6 rounded-2xl border border-red-500/20">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <h2 className="text-lg font-semibold text-red-400">Danger Zone</h2>
          </div>
          <p className="text-sm opacity-60 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition text-sm font-medium"
          >
            <AlertTriangle size={16} />
            Delete Account
          </button>
        </Card>
      </div>

      {/* ==================== SCOPED STYLES ==================== */}
      <style jsx>{`
        .settings-wrapper {
          background: linear-gradient(135deg, #0a2742 0%, #142f52 50%, #1e4b7c 100%);
          min-height: 100vh;
          color: #ffffff;
        }
        .settings-wrapper * {
          color: inherit;
        }
        .settings-wrapper .glass-card {
          background: rgba(255, 255, 255, 0.04) !important;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .settings-wrapper .animate-fadeIn {
          animation: fadeIn 0.6s ease forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}