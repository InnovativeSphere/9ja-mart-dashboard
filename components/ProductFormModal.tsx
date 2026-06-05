"use client";
import { useState, useEffect } from "react";
import { X, Save, Package, Tag, DollarSign, Layers, BarChart3, FileText } from "lucide-react";

interface Product {
  id?: number;
  name: string;
  category: string;
  price: string;
  stock: number;
  status: string;
  description: string;
}

interface Props {
  product?: Product | null;
  onClose: () => void;
  onSave: (p: Product) => void;
}

const CATEGORIES = ["Electronics", "Home & Living", "Fashion", "Beauty", "Sports"];
const STATUSES = ["Active", "Low Stock", "Out of Stock"];

export default function ProductFormModal({ product, onClose, onSave }: Props) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState(0);
  const [status, setStatus] = useState("Active");
  const [description, setDescription] = useState("");

  const isEdit = !!product;

  useEffect(() => {
    if (product) {
      setName(product.name);
      setCategory(product.category);
      setPrice(product.price.replace("₦", "").replace(",", ""));
      setStock(product.stock);
      setStatus(product.status);
      setDescription(product.description || "");
    }
  }, [product]);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: product?.id,
      name,
      category,
      price: `₦${Number(price).toLocaleString()}`,
      stock: Number(stock),
      status,
      description,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="text-xl font-bold">{isEdit ? "Edit Product" : "Add Product"}</h2>
          <button onClick={onClose} className="modal-close-btn"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="form-body">
          {/* ---- Row 1 ---- */}
          <div className="form-row">
            <div className="field-group">
              <label className="field-label"><Package size={15} /> Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Product name"
                className="field-input"
              />
            </div>
            <div className="field-group">
              <label className="field-label"><Tag size={15} /> Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="field-input"
                style={{ color: '#fff', background: 'transparent' }}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} style={{ background: '#0a2742', color: '#fff' }}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ---- Row 2 ---- */}
          <div className="form-row">
            <div className="field-group">
              <label className="field-label"><DollarSign size={15} /> Price (₦)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                placeholder="0"
                className="field-input"
              />
            </div>
            <div className="field-group">
              <label className="field-label"><Layers size={15} /> Stock</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                required
                placeholder="0"
                className="field-input"
              />
            </div>
          </div>

          {/* ---- Row 3 ---- */}
          <div className="form-row">
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
            <div className="field-group">
              <label className="field-label"><FileText size={15} /> Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Short description..."
                className="field-input"
              />
            </div>
          </div>

          <button type="submit" className="submit-btn">
            <Save size={16} /> {isEdit ? "Update Product" : "Create Product"}
          </button>
        </form>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 200;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }
        .modal-card {
          width: 100%;
          max-width: 640px;              /* wider */
          background: rgba(10, 39, 66, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(41, 182, 216, 0.2);
          border-radius: 24px;
          padding: 1.6rem 1.8rem;
          animation: pop 0.25s ease;
        }
        @keyframes pop {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.2rem;
        }
        .modal-close-btn {
          background: none;
          border: none;
          color: rgba(255,255,255,0.6);
          cursor: pointer;
          transition: color 0.2s;
          padding: 4px;
        }
        .modal-close-btn:hover { color: #fff; }

        .form-body {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .field-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .field-label {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.8rem;
          font-weight: 500;
          color: rgba(255,255,255,0.75);
        }
        .field-input {
          width: 100%;
          padding: 10px 12px;
          border-radius: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          font-size: 0.85rem;
          outline: none;
          transition: border-color 0.2s;
          resize: vertical;
        }
        .field-input:focus {
          border-color: #29b6d8;
        }
        .field-input::placeholder {
          color: rgba(255,255,255,0.4);
        }
        select.field-input {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 32px;
        }
        .submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 11px;
          border-radius: 12px;
          background: linear-gradient(135deg, #29b6d8, #3ec8e6);
          color: #fff;
          font-weight: 600;
          font-size: 0.9rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
          margin-top: 0.2rem;
        }
        .submit-btn:hover {
          background: #fff;
          color: #142f52;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(41,182,216,0.35);
        }
      `}</style>
    </div>
  );
}