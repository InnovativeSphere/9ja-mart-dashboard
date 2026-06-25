"use client";
import { useState, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";

interface Props {
  isOpen: boolean;
  title: string;
  customerName: string;
  actionLabel: string;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export default function ConfirmSubscriptionModal({ isOpen, title, customerName, actionLabel, onClose, onConfirm }: Props) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="modal-close-btn"><X size={20} /></button>
        </div>
        <div className="text-sm text-white/70 mb-4">Customer: {customerName}</div>
        <div className="field-group mb-4">
          <label className="field-label"><AlertCircle size={15} /> Reason (optional)</label>
          <input type="text" value={reason} onChange={e => setReason(e.target.value)} placeholder="Enter reason..." className="field-input" />
        </div>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm transition">Cancel</button>
          <button onClick={() => onConfirm(reason)} className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm transition">{actionLabel}</button>
        </div>
      </div>
      <style jsx>{`
        .modal-overlay { position:fixed; inset:0; z-index:200; background:rgba(0,0,0,0.6); backdrop-filter:blur(6px); display:flex; align-items:center; justify-content:center; padding:1rem; }
        .modal-card { width:100%; max-width:450px; background:rgba(10,39,66,0.95); backdrop-filter:blur(20px); border:1px solid rgba(41,182,216,0.2); border-radius:24px; padding:1.6rem 1.8rem; animation:pop 0.25s ease; }
        @keyframes pop { from { transform:scale(0.95); opacity:0; } to { transform:scale(1); opacity:1; } }
        .modal-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:1.2rem; }
        .modal-close-btn { background:none; border:none; color:rgba(255,255,255,0.6); cursor:pointer; transition:color 0.2s; padding:4px; }
        .modal-close-btn:hover { color:#fff; }
        .field-group { display:flex; flex-direction:column; gap:4px; }
        .field-label { display:flex; align-items:center; gap:5px; font-size:0.8rem; font-weight:500; color:rgba(255,255,255,0.75); }
        .field-input { width:100%; padding:10px 12px; border-radius:10px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:#fff; font-size:0.85rem; outline:none; transition:border-color 0.2s; }
        .field-input:focus { border-color:#29b6d8; }
      `}</style>
    </div>
  );
}