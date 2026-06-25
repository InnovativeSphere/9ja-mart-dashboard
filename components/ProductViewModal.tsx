"use client";
import { useEffect } from "react";
import { X, Package, Tag, DollarSign, Layers, Calendar, ImageIcon } from "lucide-react";

// Aligned with productsService.ts
interface ProductItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string;
  isAvailable: boolean;
  images: string[];
  createdAt?: string;
  updatedAt?: string;
  sku?: string;
}

interface Props {
  product: ProductItem | null;
  onClose: () => void;
}

export default function ProductViewModal({ product, onClose }: Props) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  if (!product) return null;

  const safe = (value: any, fallback = "—") =>
    value === null || value === undefined || value === "" ? fallback : value;

  const firstImage = product.images?.[0] || null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="text-xl font-bold">{safe(product.name)}</h2>
          <button onClick={onClose} className="modal-close-btn"><X size={20} /></button>
        </div>

        {/* Optional product image */}
        {firstImage && (
          <div className="mb-3">
            <img
              src={firstImage}
              alt={product.name}
              className="w-full h-40 object-cover rounded-xl border border-white/10"
            />
          </div>
        )}

        <div className="modal-grid">
          <Detail icon={Package} label="Product Name" value={safe(product.name)} />
          <Detail icon={Tag} label="Category" value={safe(product.category)} />
          <Detail
            icon={DollarSign}
            label="Price"
            value={`₦${product.price?.toLocaleString() ?? 0}`}
          />
          <Detail icon={Layers} label="Stock" value={`${product.stock ?? 0} units`} />
          <Detail icon={Calendar} label="Created" value={safe(product.createdAt)} />
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/50">Status</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                product.isAvailable
                  ? "bg-green-500/20 text-green-400"
                  : "bg-yellow-500/20 text-yellow-400"
              }`}
            >
              {product.isAvailable ? "Available" : "Unavailable"}
            </span>
          </div>
        </div>

        {product.description && (
          <div className="modal-desc mt-3">
            <p className="text-xs text-white/60 mb-1">Description</p>
            <p className="text-sm text-white/80">{product.description}</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(0,0,0,0.6); backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          padding: 1.5rem 1rem;
        }
        .modal-card {
          width: 100%; max-width: 460px;
          background: rgba(10,39,66,0.95); backdrop-filter: blur(20px);
          border: 1px solid rgba(41,182,216,0.2); border-radius: 20px;
          padding: 1.2rem 1.4rem; animation: pop 0.25s ease;
          margin: 0 1rem;
        }
        @keyframes pop { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .modal-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 0.8rem;
        }
        .modal-close-btn {
          background: none; border: none; color: rgba(255,255,255,0.6);
          cursor: pointer; transition: color 0.2s; padding: 4px;
        }
        .modal-close-btn:hover { color: #fff; }
        .modal-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem 1.2rem;
        }
        .modal-desc {
          margin-top: 0.8rem;
        }
      `}</style>
    </div>
  );
}

function Detail({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="detail-row">
      <Icon size={16} className="detail-icon" />
      <div>
        <p className="text-xs text-white/50">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
      <style jsx>{`
        .detail-row { display: flex; align-items: center; gap: 8px; }
        .detail-icon { color: #29b6d8; flex-shrink: 0; }
      `}</style>
    </div>
  );
}