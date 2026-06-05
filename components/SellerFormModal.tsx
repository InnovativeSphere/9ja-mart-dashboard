"use client";
import { useState, useEffect } from "react";
import { X, Save, User, Store, Mail, BarChart3 } from "lucide-react";

interface Seller {
  id?: number;
  name: string;
  store: string;
  email: string;
  status: string;
}

interface Props {
  seller?: Seller | null;
  onClose: () => void;
  onSave: (s: Seller) => void;
}

const STATUSES = ["Active", "Inactive", "Suspended"];

export default function SellerFormModal({ seller, onClose, onSave }: Props) {
  const [name, setName] = useState("");
  const [store, setStore] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(STATUSES[0]);

  const isEdit = !!seller;

  useEffect(() => {
    if (seller) {
      setName(seller.name);
      setStore(seller.store);
      setEmail(seller.email);
      setStatus(seller.status);
    }
  }, [seller]);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ id: seller?.id, name, store, email, status });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="text-xl font-bold">{isEdit ? "Edit Seller" : "New Seller"}</h2>
          <button onClick={onClose} className="modal-close-btn"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="form-body">
          <div className="form-row">
            <div className="field-group">
              <label className="field-label"><User size={15} /> Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Full name"
                className="field-input"
              />
            </div>
            <div className="field-group">
              <label className="field-label"><Store size={15} /> Store</label>
              <input
                type="text"
                value={store}
                onChange={(e) => setStore(e.target.value)}
                required
                placeholder="Store name"
                className="field-input"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="field-group">
              <label className="field-label"><Mail size={15} /> Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email address"
                className="field-input"
              />
            </div>
            <div className="field-group">
              <label className="field-label"><BarChart3 size={15} /> Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="field-input"
                style={{ color: '#fff', background: 'transparent' }}
              >
                {STATUSES.map((st) => (
                  <option key={st} value={st} style={{ background: '#0a2742', color: '#fff' }}>{st}</option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="submit-btn">
            <Save size={16} /> {isEdit ? "Update Seller" : "Create Seller"}
          </button>
        </form>
      </div>

      <style jsx>{`
        .modal-overlay { position:fixed; inset:0; z-index:200; background:rgba(0,0,0,0.6); backdrop-filter:blur(6px); display:flex; align-items:center; justify-content:center; padding:1rem; }
        .modal-card { width:100%; max-width:640px; background:rgba(10,39,66,0.95); backdrop-filter:blur(20px); border:1px solid rgba(41,182,216,0.2); border-radius:24px; padding:1.6rem 1.8rem; animation:pop 0.25s ease; }
        @keyframes pop { from { transform:scale(0.95); opacity:0; } to { transform:scale(1); opacity:1; } }
        .modal-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:1.2rem; }
        .modal-close-btn { background:none; border:none; color:rgba(255,255,255,0.6); cursor:pointer; transition:color 0.2s; padding:4px; }
        .modal-close-btn:hover { color:#fff; }
        .form-body { display:flex; flex-direction:column; gap:0.9rem; }
        .form-row { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
        .field-group { display:flex; flex-direction:column; gap:4px; }
        .field-label { display:flex; align-items:center; gap:5px; font-size:0.8rem; font-weight:500; color:rgba(255,255,255,0.75); }
        .field-input { width:100%; padding:10px 12px; border-radius:10px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:#fff; font-size:0.85rem; outline:none; transition:border-color 0.2s; resize:vertical; }
        .field-input:focus { border-color:#29b6d8; }
        .field-input::placeholder { color:rgba(255,255,255,0.4); }
        select.field-input { appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 12px center; padding-right:32px; }
        .submit-btn { display:flex; align-items:center; justify-content:center; gap:8px; width:100%; padding:11px; border-radius:12px; background:linear-gradient(135deg,#29b6d8,#3ec8e6); color:#fff; font-weight:600; font-size:0.9rem; border:none; cursor:pointer; transition:all 0.3s; margin-top:0.2rem; }
        .submit-btn:hover { background:#fff; color:#142f52; transform:translateY(-1px); box-shadow:0 6px 20px rgba(41,182,216,0.35); }
      `}</style>
    </div>
  );
}