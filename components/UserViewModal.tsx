"use client";
import { useEffect } from "react";
import {
  X, User, Mail, Layers, CheckCircle, Calendar,
  AtSign, Phone, Package, ShoppingCart
} from "lucide-react";

// Aligned with MarketplaceUser from API
interface UserData {
  guid: string;
  fullName: string;
  username?: string;
  email: string;
  phone?: string;
  isActive: boolean;
  dateCreated: string;
  subscriptionPlan: string;
  subscriptionStatus: string;
  productCount?: number;
  orderCount?: number;
}

interface Props {
  user: UserData | null;
  onClose: () => void;
}

export default function UserViewModal({ user, onClose }: Props) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  if (!user) return null;

  // Helper to safely render a value or "—"
  const safe = (value: any, fallback = "—") => {
    if (value === null || value === undefined || value === "") return fallback;
    return value;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="text-xl font-bold">{safe(user.fullName)}</h2>
          <button onClick={onClose} className="modal-close-btn"><X size={20} /></button>
        </div>
        <div className="modal-grid">
          <Detail icon={User} label="Full Name" value={safe(user.fullName)} />
          <Detail icon={AtSign} label="Username" value={safe(user.username)} />
          <Detail icon={Mail} label="Email" value={safe(user.email)} />
          <Detail icon={Phone} label="Phone" value={safe(user.phone)} />
          <Detail icon={Layers} label="Tier" value={safe(user.subscriptionPlan)} />
          <Detail icon={CheckCircle} label="Status" value={user.isActive ? "Active" : "Inactive"} />
          <Detail icon={Calendar} label="Joined" value={new Date(user.dateCreated).toLocaleDateString()} />
          <Detail icon={Package} label="Products" value={user.productCount != null ? user.productCount.toString() : "—"} />
          <Detail icon={ShoppingCart} label="Orders" value={user.orderCount != null ? user.orderCount.toString() : "—"} />
        </div>
      </div>
      <style jsx>{`
        .modal-overlay {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(0,0,0,0.6); backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center; padding: 1rem;
        }
        .modal-card {
          width: 100%; max-width: 560px;
          background: rgba(10,39,66,0.95); backdrop-filter: blur(20px);
          border: 1px solid rgba(41,182,216,0.2); border-radius: 24px;
          padding: 1.6rem 1.8rem; animation: pop 0.25s ease;
        }
        @keyframes pop { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .modal-header {
          display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.2rem;
        }
        .modal-close-btn {
          background: none; border: none; color: rgba(255,255,255,0.6);
          cursor: pointer; transition: color 0.2s; padding: 4px;
        }
        .modal-close-btn:hover { color: #fff; }
        .modal-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 1rem 1.5rem;
        }
      `}</style>
    </div>
  );
}

function Detail({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="detail-row">
      <Icon size={18} className="detail-icon" />
      <div>
        <p className="text-xs text-white/50">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
      <style jsx>{`
        .detail-row { display: flex; align-items: center; gap: 10px; }
        .detail-icon { color: #29b6d8; flex-shrink: 0; }
      `}</style>
    </div>
  );
}