"use client";
import { useEffect } from "react";
import { X, Package, Tag, Layers, BarChart3, Calendar, DollarSign } from "lucide-react";

interface Product {
  id: number; name: string; category: string; price: string;
  stock: number; status: string; sku: string; description: string;
  createdAt: string; updatedAt: string;
}

interface Props { product: Product | null; onClose: () => void; }

export default function ProductViewModal({ product, onClose }: Props) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  if (!product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="text-xl font-bold">{product.name}</h2>
          <button onClick={onClose} className="modal-close-btn"><X size={20} /></button>
        </div>
        <div className="modal-grid">
          <Detail icon={Package} label="Product Name" value={product.name} />
          <Detail icon={Tag} label="Category" value={product.category} />
          <Detail icon={DollarSign} label="Price" value={product.price} />
          <Detail icon={Layers} label="Stock" value={`${product.stock} units`} />
          <Detail icon={BarChart3} label="Status" value={product.status} />
          <Detail icon={Calendar} label="Created" value={product.createdAt} />
        </div>
        {product.description && (
          <div className="modal-desc">
            <p className="text-xs text-white/50 mb-1">Description</p>
            <p className="text-sm text-white/80">{product.description}</p>
          </div>
        )}
      </div>
      <style jsx>{`
        .modal-overlay { position:fixed; inset:0; z-index:200; background:rgba(0,0,0,0.6); backdrop-filter:blur(6px); display:flex; align-items:center; justify-content:center; padding:1rem; }
        .modal-card { width:100%; max-width:520px; background:rgba(10,39,66,0.95); backdrop-filter:blur(20px); border:1px solid rgba(41,182,216,0.2); border-radius:24px; padding:1.8rem; animation:pop 0.25s ease; }
        @keyframes pop { from { transform:scale(0.95); opacity:0; } to { transform:scale(1); opacity:1; } }
        .modal-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; }
        .modal-close-btn { background:none; border:none; color:rgba(255,255,255,0.6); cursor:pointer; transition:color 0.2s; }
        .modal-close-btn:hover { color:#fff; }
        .modal-grid { display:grid; grid-template-columns:1fr 1fr; gap:1rem 1.5rem; }
        .modal-desc { margin-top:1.2rem; }
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
        .detail-row { display:flex; align-items:center; gap:10px; }
        .detail-icon { color:#29b6d8; flex-shrink:0; }
      `}</style>
    </div>
  );
}