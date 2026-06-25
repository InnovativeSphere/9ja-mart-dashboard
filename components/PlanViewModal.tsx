"use client";
import { useEffect } from "react";
import { X, Layers, DollarSign, Calendar, CheckCircle, ListChecks } from "lucide-react";

// Match the real API plan shape (same as PlanFormModal)
interface PlanPayload {
  id?: number;
  plan: string;                      // "Vendor" | "Business"
  billingInterval: string;           // "Monthly" | "Yearly"
  displayName: string;
  price: number;
  currency: string;
  isAvailable: boolean;
  sortOrder: number;
  entitlements: string[];
  featureSummary: string[];
}

interface Props {
  plan: PlanPayload | null;
  onClose: () => void;
}

export default function PlanViewModal({ plan, onClose }: Props) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  if (!plan) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="text-xl font-bold">{plan.displayName || plan.plan}</h2>
          <button onClick={onClose} className="modal-close-btn"><X size={20} /></button>
        </div>
        <div className="modal-grid">
          <Detail icon={Layers} label="Plan" value={plan.plan} />
          <Detail icon={Calendar} label="Billing" value={plan.billingInterval} />
          <Detail icon={DollarSign} label="Price" value={`${plan.currency} ${plan.price?.toLocaleString()}`} />
          <Detail icon={CheckCircle} label="Available" value={plan.isAvailable ? "Yes" : "No"} />
          <Detail icon={Layers} label="Sort Order" value={String(plan.sortOrder ?? 0)} />
        </div>

        {/* Entitlements */}
        {plan.entitlements && plan.entitlements.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-white/60 mb-2 flex items-center gap-2"><ListChecks size={16} /> Entitlements</p>
            <ul className="space-y-1">
              {plan.entitlements.map((item, idx) => (
                <li key={idx} className="text-sm text-white/80 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#29b6d8]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Feature Summary */}
        {plan.featureSummary && plan.featureSummary.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-white/60 mb-2 flex items-center gap-2"><ListChecks size={16} /> Feature Summary</p>
            <ul className="space-y-1">
              {plan.featureSummary.map((item, idx) => (
                <li key={idx} className="text-sm text-white/80 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#29b6d8]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <style jsx>{`
        .modal-overlay {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(0,0,0,0.6); backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center; padding: 1rem;
        }
        .modal-card {
          width: 100%; max-width: 550px;
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