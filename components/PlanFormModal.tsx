"use client";
import { useState, useEffect } from "react";
import { X, Save, Layers, DollarSign, Calendar, CheckCircle, ListChecks } from "lucide-react";

interface PlanPayload {
  id?: number;
  plan: string;
  billingInterval: string;
  displayName: string;
  price: number;
  currency: string;
  isAvailable: boolean;
  sortOrder: number;
  entitlements: string[];
  featureSummary: string[];
  originalPlan?: string;
  originalBillingInterval?: string;
}

interface Props {
  plan?: PlanPayload | null;
  onClose: () => void;
  onSave: (p: PlanPayload) => void;
}

const PLAN_OPTIONS = [
  { value: "Vendor", label: "Vendor" },
  { value: "Business", label: "Business" },
];
const BILLING_OPTIONS = [
  { value: "Monthly", label: "Monthly" },
  { value: "Yearly", label: "Yearly" },
];
const CURRENCIES = ["NGN", "USD"];

export default function PlanFormModal({ plan, onClose, onSave }: Props) {
  const [originalPlanStr, setOriginalPlanStr] = useState<string>("Vendor");
  const [originalBillingStr, setOriginalBillingStr] = useState<string>("Monthly");
  const [planType, setPlanType] = useState<string>("Vendor");
  const [billingInterval, setBillingInterval] = useState<string>("Monthly");
  const [displayName, setDisplayName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [currency, setCurrency] = useState("NGN");
  const [isAvailable, setIsAvailable] = useState(true);
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [entitlements, setEntitlements] = useState("");
  const [featureSummary, setFeatureSummary] = useState("");

  const isEdit = !!plan;

  useEffect(() => {
    if (plan) {
      setOriginalPlanStr(plan.plan);
      setOriginalBillingStr(plan.billingInterval);
      setPlanType(plan.plan);
      setBillingInterval(plan.billingInterval);
      setDisplayName(plan.displayName || "");
      setPrice(plan.price);
      setCurrency(plan.currency || "NGN");
      setIsAvailable(plan.isAvailable);
      setSortOrder(plan.sortOrder || 0);
      setEntitlements(plan.entitlements?.join(", ") || "");
      setFeatureSummary(plan.featureSummary?.join(", ") || "");
    }
  }, [plan]);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      plan: planType,
      billingInterval,
      displayName,
      price: Number(price),
      currency,
      isAvailable,
      sortOrder: Number(sortOrder),
      entitlements: entitlements.split(",").map(s => s.trim()).filter(Boolean),
      featureSummary: featureSummary.split(",").map(s => s.trim()).filter(Boolean),
      ...(isEdit
        ? { originalPlan: originalPlanStr, originalBillingInterval: originalBillingStr }
        : {}),
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="text-xl font-bold">{isEdit ? "Edit Plan" : "New Plan"}</h2>
          <button onClick={onClose} className="modal-close-btn"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="form-body">
          <div className="form-row">
            <div className="field-group">
              <label className="field-label"><Layers size={15} /> Plan</label>
              <select value={planType} onChange={(e) => setPlanType(e.target.value)} className="field-input" style={{ color: '#fff', background: 'transparent' }}>
                {PLAN_OPTIONS.map((p) => (
                  <option key={p.value} value={p.value} style={{ background: '#0a2742', color: '#fff' }}>{p.label}</option>
                ))}
              </select>
            </div>
            <div className="field-group">
              <label className="field-label"><Calendar size={15} /> Billing</label>
              <select value={billingInterval} onChange={(e) => setBillingInterval(e.target.value)} className="field-input" style={{ color: '#fff', background: 'transparent' }}>
                {BILLING_OPTIONS.map((b) => (
                  <option key={b.value} value={b.value} style={{ background: '#0a2742', color: '#fff' }}>{b.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="field-group">
              <label className="field-label"><Layers size={15} /> Display Name</label>
              <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required placeholder="e.g. Vendor Monthly" className="field-input" />
            </div>
            <div className="field-group">
              <label className="field-label"><DollarSign size={15} /> Price</label>
              <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} required placeholder="0" className="field-input" />
            </div>
          </div>
          <div className="form-row">
            <div className="field-group">
              <label className="field-label"><DollarSign size={15} /> Currency</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="field-input" style={{ color: '#fff', background: 'transparent' }}>
                {CURRENCIES.map((c) => (
                  <option key={c} value={c} style={{ background: '#0a2742', color: '#fff' }}>{c}</option>
                ))}
              </select>
            </div>
            <div className="field-group">
              <label className="field-label"><Layers size={15} /> Sort Order</label>
              <input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} required placeholder="0" className="field-input" />
            </div>
          </div>
          <div className="field-group">
            <label className="field-label"><ListChecks size={15} /> Entitlements (comma separated)</label>
            <input type="text" value={entitlements} onChange={(e) => setEntitlements(e.target.value)} placeholder="ent1, ent2" className="field-input" />
          </div>
          <div className="field-group">
            <label className="field-label"><ListChecks size={15} /> Feature Summary (comma separated)</label>
            <input type="text" value={featureSummary} onChange={(e) => setFeatureSummary(e.target.value)} placeholder="Feature 1, Feature 2" className="field-input" />
          </div>
          <div className="flex items-center gap-3">
            <label className="field-label"><CheckCircle size={15} /> Available</label>
            <button type="button" onClick={() => setIsAvailable(!isAvailable)} className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${isAvailable ? "bg-[#29b6d8]" : "bg-white/10"}`}>
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${isAvailable ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>
          <button type="submit" className="submit-btn">
            <Save size={16} /> {isEdit ? "Update Plan" : "Create Plan"}
          </button>
        </form>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(0,0,0,0.6); backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          padding: 1.5rem 1rem; /* added horizontal padding */
        }
        .modal-card {
          width: 100%; max-width: 460px; /* reduced from 550px */
          background: rgba(10,39,66,0.95); backdrop-filter: blur(20px);
          border: 1px solid rgba(41,182,216,0.2); border-radius: 20px; /* slightly smaller radius */
          padding: 1.2rem 1.4rem; /* reduced padding */
          animation: pop 0.25s ease;
          margin: 0 1rem; /* horizontal margin on smaller screens */
        }
        @keyframes pop { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .modal-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 0.8rem; /* reduced */
        }
        .modal-close-btn {
          background: none; border: none; color: rgba(255,255,255,0.6);
          cursor: pointer; transition: color 0.2s; padding: 4px;
        }
        .modal-close-btn:hover { color: #fff; }
        .form-body { display: flex; flex-direction: column; gap: 0.7rem; /* tighter */ }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.7rem; /* tighter */ }
        .field-group { display: flex; flex-direction: column; gap: 3px; /* reduced */ }
        .field-label {
          display: flex; align-items: center; gap: 4px;
          font-size: 0.75rem; font-weight: 500; color: rgba(255,255,255,0.75);
        }
        .field-input {
          width: 100%; padding: 8px 10px; /* reduced */
          border-radius: 8px; /* less round */
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff; font-size: 0.8rem; outline: none;
          transition: border-color 0.2s; resize: vertical;
        }
        .field-input:focus { border-color: #29b6d8; }
        .field-input::placeholder { color: rgba(255,255,255,0.4); }
        select.field-input {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px;
        }
        .submit-btn {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          width: 100%; padding: 9px; /* reduced */
          border-radius: 10px;
          background: linear-gradient(135deg, #29b6d8, #3ec8e6);
          color: #fff; font-weight: 600; font-size: 0.85rem;
          border: none; cursor: pointer; transition: all 0.3s; margin-top: 0.1rem;
        }
        .submit-btn:hover {
          background: #fff; color: #142f52;
          transform: translateY(-1px); box-shadow: 0 6px 20px rgba(41,182,216,0.35);
        }
        /* Responsive adjustment for very small screens */
        @media (max-width: 480px) {
          .modal-card {
            margin: 0 0.5rem;
            padding: 1rem 1.1rem;
          }
        }
      `}</style>
    </div>
  );
}