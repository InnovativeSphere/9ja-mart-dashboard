"use client";

import { useEffect, useState } from "react";
import { X, User as UserIcon, Mail, Key } from "lucide-react";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export default function EditProfileModal({ isOpen, onClose, user }: Props) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username || "",
        email: user.email,
        password: "",
      });
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSave = () => {
    // In a real app, you'd dispatch an action here.
    // For mock: just close the modal and optionally show a message.
    alert("Profile updated (mock).");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0a2742]/95 backdrop-blur-xl border border-white/10 rounded-2xl w-full max-w-sm p-5 flex flex-col animate-fadeIn shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-white">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-2">
            <UserIcon size={16} className="text-[#29b6d8]" />
            <input
              placeholder="First Name"
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              className="flex-1 bg-transparent outline-none text-white text-sm placeholder:text-white/40"
            />
          </div>

          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-2">
            <UserIcon size={16} className="text-[#29b6d8]" />
            <input
              placeholder="Last Name"
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              className="flex-1 bg-transparent outline-none text-white text-sm placeholder:text-white/40"
            />
          </div>

          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-2">
            <UserIcon size={16} className="text-[#29b6d8]" />
            <input
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="flex-1 bg-transparent outline-none text-white text-sm placeholder:text-white/40"
            />
          </div>

          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-2">
            <Mail size={16} className="text-[#29b6d8]" />
            <input
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="flex-1 bg-transparent outline-none text-white text-sm placeholder:text-white/40"
            />
          </div>

          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-2">
            <Key size={16} className="text-[#29b6d8]" />
            <input
              type="password"
              placeholder="New Password (optional)"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="flex-1 bg-transparent outline-none text-white text-sm placeholder:text-white/40"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-[#29b6d8] to-[#3ec8e6] text-white p-2.5 rounded-lg mt-4 hover:from-[#3ec8e6] hover:to-[#29b6d8] transition font-medium text-sm"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}