"use client";
import { useState, useEffect } from "react";
import { X, Save, Layers, Calendar, AlertCircle } from "lucide-react";

interface Props {
  isOpen: boolean;
  customerGuid: string;
  customerName: string;
  currentPlan: string;        // e.g. "Vendor"
  currentBilling: string;     // e.g. "Monthly"
  currentStatus: string;
  onClose: () => void;
  onChange: (payload: {
    customerGuid: string;
    plan: string;              // string now
    billingInterval: string;   // string now
  }) => void;
}

const PLAN_OPTIONS = [
  { label: "Vendor", value: "Vendor" },
  { label: "Business", value: "Business" },
];

const INTERVAL_OPTIONS = [
  { label: "Monthly", value: "Monthly" },
  { label: "Yearly", value: "Yearly" },
];

export default function ChangePlanModal({
  isOpen,
  customerGuid,
  customerName,
  currentPlan,
  currentBilling,
  currentStatus,
  onClose,
  onChange,
}: Props) {
  const [plan, setPlan] = useState(currentPlan || PLAN_OPTIONS[0].value);
  const [billingInterval, setBillingInterval] = useState(
    currentBilling || INTERVAL_OPTIONS[0].value
  );

  // Sync form with props when opening
  useEffect(() => {
    setPlan(currentPlan || PLAN_OPTIONS[0].value);
    setBillingInterval(currentBilling || INTERVAL_OPTIONS[0].value);
  }, [currentPlan, currentBilling]);

  // Close on Escape
  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const canChange = currentStatus === "Active";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canChange) return;
    onChange({ customerGuid, plan, billingInterval });
    // Don't close here – let parent close after success
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="text-xl font-bold">Change Plan</h2>
          <button onClick={onClose} className="modal-close-btn">
            <X size={20} />
          </button>
        </div>
        <div className="text-sm text-white/70 mb-4">
          Customer: {customerName} | Current: {currentPlan} {currentBilling}
        </div>
        {!canChange && (
          <div className="flex items-center gap-2 text-sm text-yellow-400 bg-yellow-500/10 rounded-lg p-3 mb-4">
            <AlertCircle size={16} />
            Subscription must be Active to change plans.
          </div>
        )}
        <form onSubmit={handleSubmit} className="form-body">
          <div className="form-row">
            <div className="field-group">
              <label className="field-label">
                <Layers size={15} /> New Plan
              </label>
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                className="field-input"
                style={{ color: "#fff", background: "transparent" }}
              >
                {PLAN_OPTIONS.map((p) => (
                  <option key={p.value} value={p.value} style={{ background: "#0a2742", color: "#fff" }}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field-group">
              <label className="field-label">
                <Calendar size={15} /> Billing
              </label>
              <select
                value={billingInterval}
                onChange={(e) => setBillingInterval(e.target.value)}
                className="field-input"
                style={{ color: "#fff", background: "transparent" }}
              >
                {INTERVAL_OPTIONS.map((i) => (
                  <option key={i.value} value={i.value} style={{ background: "#0a2742", color: "#fff" }}>
                    {i.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={!canChange}
            className={`submit-btn ${!canChange ? "opacity-40 cursor-not-allowed" : ""}`}
          >
            <Save size={16} /> Change Plan
          </button>
        </form>
      </div>
      <style jsx>{`
        .modal-overlay { position:fixed; inset:0; z-index:200; background:rgba(0,0,0,0.6); backdrop-filter:blur(6px); display:flex; align-items:center; justify-content:center; padding:1rem; }
        .modal-card { width:100%; max-width:450px; background:rgba(10,39,66,0.95); backdrop-filter:blur(20px); border:1px solid rgba(41,182,216,0.2); border-radius:24px; padding:1.6rem 1.8rem; animation:pop 0.25s ease; }
        @keyframes pop { from { transform:scale(0.95); opacity:0; } to { transform:scale(1); opacity:1; } }
        .modal-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:1.2rem; }
        .modal-close-btn { background:none; border:none; color:rgba(255,255,255,0.6); cursor:pointer; transition:color 0.2s; padding:4px; }
        .modal-close-btn:hover { color:#fff; }
        .form-body { display:flex; flex-direction:column; gap:0.9rem; }
        .form-row { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
        .field-group { display:flex; flex-direction:column; gap:4px; }
        .field-label { display:flex; align-items:center; gap:5px; font-size:0.8rem; font-weight:500; color:rgba(255,255,255,0.75); }
        .field-input { width:100%; padding:10px 12px; border-radius:10px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:#fff; font-size:0.85rem; outline:none; transition:border-color 0.2s; }
        .field-input:focus { border-color:#29b6d8; }
        select.field-input { appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 12px center; padding-right:32px; }
        .submit-btn { display:flex; align-items:center; justify-content:center; gap:8px; width:100%; padding:11px; border-radius:12px; background:linear-gradient(135deg,#29b6d8,#3ec8e6); color:#fff; font-weight:600; font-size:0.9rem; border:none; cursor:pointer; transition:all 0.3s; margin-top:0.2rem; }
        .submit-btn:hover { background:#fff; color:#142f52; transform:translateY(-1px); box-shadow:0 6px 20px rgba(41,182,216,0.35); }
      `}</style>
    </div>
  );
}