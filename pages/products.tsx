"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { Card } from "@/components/Card";
import {
  Package,
  Search,
  Layers,
  AlertTriangle,
  TrendingUp,
  Edit,
  Trash2,
  Eye,
  Plus,
  X,
  AlertCircle,
} from "lucide-react";
import ProductViewModal from "@/components/ProductViewModal";
import ProductFormModal from "@/components/ProductFormModal";

/* ==================== MOCK DATA ==================== */
const INITIAL_PRODUCTS = [
  { id: 1, name: "Wireless Earbuds", category: "Electronics", price: "₦12,500", stock: 45, status: "Active", sku: "ELEC-001", description: "High-quality wireless earbuds with noise cancellation and long battery life.", createdAt: "2025-08-15", updatedAt: "2026-05-28" },
  { id: 2, name: "Smart Watch", category: "Electronics", price: "₦35,000", stock: 18, status: "Active", sku: "ELEC-002", description: "Feature-packed smartwatch with health monitoring and GPS.", createdAt: "2025-10-22", updatedAt: "2026-05-25" },
  { id: 3, name: "Bluetooth Speaker", category: "Electronics", price: "₦8,200", stock: 32, status: "Active", sku: "ELEC-003", description: "Portable Bluetooth speaker with deep bass.", createdAt: "2025-12-01", updatedAt: "2026-05-15" },
  { id: 4, name: "Kitchen Blender", category: "Home & Living", price: "₦18,200", stock: 7, status: "Low Stock", sku: "HOME-001", description: "Powerful blender for smoothies, soups, and more.", createdAt: "2026-01-10", updatedAt: "2026-05-20" },
  { id: 5, name: "Office Chair", category: "Home & Living", price: "₦42,800", stock: 0, status: "Out of Stock", sku: "HOME-002", description: "Ergonomic office chair with lumbar support.", createdAt: "2026-02-18", updatedAt: "2026-05-10" },
  { id: 6, name: "Desk Lamp", category: "Home & Living", price: "₦6,500", stock: 25, status: "Active", sku: "HOME-003", description: "LED desk lamp with adjustable brightness.", createdAt: "2026-03-05", updatedAt: "2026-05-12" },
  { id: 7, name: "Men's Running Shoes", category: "Fashion", price: "₦22,000", stock: 15, status: "Active", sku: "FASH-001", description: "Lightweight running shoes for everyday training.", createdAt: "2026-01-20", updatedAt: "2026-04-28" },
  { id: 8, name: "Women's Handbag", category: "Fashion", price: "₦15,800", stock: 9, status: "Low Stock", sku: "FASH-002", description: "Stylish leather handbag for any occasion.", createdAt: "2026-02-10", updatedAt: "2026-05-01" },
  { id: 9, name: "Denim Jacket", category: "Fashion", price: "₦28,500", stock: 12, status: "Active", sku: "FASH-003", description: "Classic denim jacket, timeless style.", createdAt: "2026-03-15", updatedAt: "2026-05-05" },
  { id: 10, name: "Face Moisturizer", category: "Beauty", price: "₦4,200", stock: 60, status: "Active", sku: "BEAUT-001", description: "Hydrating face moisturizer for all skin types.", createdAt: "2025-11-20", updatedAt: "2026-05-18" },
  { id: 11, name: "Lipstick Set", category: "Beauty", price: "₦3,800", stock: 48, status: "Active", sku: "BEAUT-002", description: "Set of 6 vibrant lipstick shades.", createdAt: "2026-01-05", updatedAt: "2026-05-10" },
  { id: 12, name: "Hair Dryer", category: "Beauty", price: "₦9,900", stock: 3, status: "Low Stock", sku: "BEAUT-003", description: "Professional hair dryer with ionic technology.", createdAt: "2026-03-20", updatedAt: "2026-05-08" },
  { id: 13, name: "Yoga Mat", category: "Sports", price: "₦5,500", stock: 30, status: "Active", sku: "SPORT-001", description: "Non-slip yoga mat, 6mm thick.", createdAt: "2026-04-01", updatedAt: "2026-05-22" },
  { id: 14, name: "Resistance Bands", category: "Sports", price: "₦2,800", stock: 0, status: "Out of Stock", sku: "SPORT-002", description: "Set of 5 resistance bands for workouts.", createdAt: "2026-04-15", updatedAt: "2026-05-19" },
  { id: 15, name: "Dumbbell Set", category: "Sports", price: "₦19,500", stock: 11, status: "Active", sku: "SPORT-003", description: "Adjustable dumbbell set, 2-20kg.", createdAt: "2026-05-01", updatedAt: "2026-05-20" },
];

const CATEGORIES = ["All", "Electronics", "Home & Living", "Fashion", "Beauty", "Sports"];

/* ==================== COMPONENT ==================== */
export default function ProductsPage() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [viewProduct, setViewProduct] = useState<any>(null);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  // ---------- FILTERED LIST ----------
  const filteredProducts = useMemo(() => {
    let result = products;
    if (categoryFilter !== "All") {
      result = result.filter((p) => p.category === categoryFilter);
    }
    if (statusFilter !== "All") {
      result = result.filter((p) => p.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    return result;
  }, [products, search, categoryFilter, statusFilter]);

  // ---------- STATS ----------
  const stats = useMemo(() => {
    const total = products.length;
    const active = products.filter((p) => p.status === "Active").length;
    const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 10).length;
    const outOfStock = products.filter((p) => p.stock === 0).length;
    const categories = new Set(products.map((p) => p.category)).size;
    return { total, active, lowStock, outOfStock, categories };
  }, [products]);

  // ---------- CRUD HANDLERS ----------
  const handleSave = (product: any) => {
    if (product.id) {
      // Edit existing
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, ...product, updatedAt: new Date().toISOString().split("T")[0] } : p))
      );
    } else {
      // Create new
      const newProduct = {
        ...product,
        id: Date.now(),
        sku: "SKU-" + Date.now().toString().slice(-6),
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
        status: product.stock === 0 ? "Out of Stock" : product.stock <= 10 ? "Low Stock" : "Active",
      };
      setProducts((prev) => [newProduct, ...prev]);
    }
    setEditProduct(null);
    setShowCreate(false);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  return (
    <div className="products-wrapper">
      <div className="px-2 sm:px-4 py-6 space-y-8 animate-fadeIn">
        {/* ========== HEADER ========== */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Products</h1>
            <p className="text-sm opacity-60 mt-1">
              Manage your inventory — {products.length} products across {stats.categories} categories.
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#29b6d8] to-[#3ec8e6] text-white font-medium text-sm hover:scale-[1.02] transition"
          >
            <Plus size={16} />
            Add Product
          </button>
        </div>

        {/* ========== STATS CARDS ========== */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { label: "Total Products", value: stats.total, icon: Package, color: "text-[#29b6d8]" },
            { label: "Active", value: stats.active, icon: TrendingUp, color: "text-green-400" },
            { label: "Low Stock", value: stats.lowStock, icon: AlertTriangle, color: "text-yellow-400" },
            { label: "Out of Stock", value: stats.outOfStock, icon: AlertTriangle, color: "text-red-400" },
            { label: "Categories", value: stats.categories, icon: Layers, color: "text-[#8b5cf6]" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-lg"
            >
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <div>
                <p className="text-xs opacity-60">{stat.label}</p>
                <p className="text-lg font-bold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ========== FILTERS & SEARCH ========== */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:opacity-50 focus:outline-none focus:border-[#29b6d8] transition"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#29b6d8] transition"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#29b6d8] transition"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>

        {/* ========== PRODUCTS TABLE ========== */}
        <Card className="glass-card rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left opacity-60 text-xs uppercase tracking-wider">
                  <th className="py-3 px-4 font-medium">Product</th>
                  <th className="py-3 px-4 font-medium hidden sm:table-cell">Category</th>
                  <th className="py-3 px-4 font-medium">Price</th>
                  <th className="py-3 px-4 font-medium">Stock</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-white/5 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#29b6d8]/10 flex items-center justify-center text-[#29b6d8] font-bold text-xs">
                          {product.name.charAt(0)}
                        </div>
                        <span className="font-medium truncate max-w-[150px]">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell opacity-80">{product.category}</td>
                    <td className="py-3 px-4 font-medium">{product.price}</td>
                    <td className="py-3 px-4">
                      <span className={`font-medium ${
                        product.stock === 0 ? "text-red-400" :
                        product.stock <= 10 ? "text-yellow-400" : "text-green-400"
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        product.status === "Active" ? "bg-green-500/20 text-green-400" :
                        product.status === "Low Stock" ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-red-500/20 text-red-400"
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setViewProduct(product)} className="p-1.5 rounded-md hover:bg-white/10 transition opacity-70 hover:opacity-100" title="View">
                          <Eye size={15} />
                        </button>
                        <button onClick={() => setEditProduct(product)} className="p-1.5 rounded-md hover:bg-white/10 transition opacity-70 hover:opacity-100" title="Edit">
                          <Edit size={15} />
                        </button>
                        <button onClick={() => setDeleteTarget(product)} className="p-1.5 rounded-md hover:bg-red-500/20 transition opacity-70 hover:opacity-100 text-red-400" title="Delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center opacity-50">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* ========== MODALS ========== */}
      <ProductViewModal product={viewProduct} onClose={() => setViewProduct(null)} />

      {(editProduct || showCreate) && (
        <ProductFormModal
          product={editProduct}
          onClose={() => { setEditProduct(null); setShowCreate(false); }}
          onSave={handleSave}
        />
      )}

      {deleteTarget && (
  <div className="fixed inset-0 z-150 bg-black/60 backdrop-blur-sm flex items-center justify-center" onClick={() => setDeleteTarget(null)}>
    <div className="bg-[#0a2742] border border-white/10 rounded-2xl p-6 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center gap-3 mb-4">
        <AlertCircle className="w-6 h-6 text-red-400" />
        <h3 className="text-lg font-bold">Delete Product</h3>
      </div>
      <p className="text-sm text-white/70 mb-6">
        Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This action cannot be undone.
      </p>
      <div className="flex justify-end gap-3">
        <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm transition">Cancel</button>
        <button onClick={handleDelete} className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm transition">Delete</button>
      </div>
    </div>
  </div>
)}

      {/* ==================== SCOPED STYLES ==================== */}
      <style jsx>{`
        .products-wrapper {
          background: linear-gradient(135deg, #0a2742 0%, #142f52 50%, #1e4b7c 100%);
          min-height: 100vh;
          color: #ffffff;
        }
        .products-wrapper * {
          color: inherit;
        }
        .products-wrapper .glass-card {
          background: rgba(255, 255, 255, 0.04) !important;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .products-wrapper .animate-fadeIn {
          animation: fadeIn 0.6s ease forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        select option {
          background: #0a2742;
          color: #fff;
        }
      `}</style>
    </div>
  );
}