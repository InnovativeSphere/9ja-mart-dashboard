"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import {
  fetchProducts,
  fetchProductDetail,
  deleteProduct,
  clearSelectedProduct,
} from "../redux/slices/productsSlice";
import { Card } from "@/components/Card";
import {
  Package,
  Search,
  Layers,
  AlertTriangle,
  TrendingUp,
  Eye,
  Trash2,
  AlertCircle,
} from "lucide-react";
import ProductViewModal from "@/components/ProductViewModal";

/* ---------- Client‑side filter options ---------- */
const CATEGORIES = [
  "All",
  "Electronics",
  "Home & Living",
  "Fashion",
  "Beauty",
  "Sports",
];

// Status options derived from stock
const STATUSES = ["All", "Active", "Low Stock", "Out of Stock"];

export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error, selectedProduct, deleteLoading, deleteError } =
    useSelector((state: RootState) => state.products);

  // Local filter state
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);

  // Modal state
  const [viewProduct, setViewProduct] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  // Fetch products on mount
  const loadProducts = useCallback(() => {
    const params: any = { PageNumber: page, PageSize: 50 };
    dispatch(fetchProducts(params));
  }, [dispatch, page]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleView = async (product: any) => {
    setViewProduct(product); // show immediately from list data
    try {
      await dispatch(fetchProductDetail(product.id)).unwrap();
    } catch {
      // if detail fails, the list data is already shown
    }
  };

  // Delete handler
  const handleDelete = () => {
    if (deleteTarget) {
      dispatch(deleteProduct(deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  // Helper to derive status from stock
  const getDerivedStatus = (stock: number) => {
    if (stock > 10) return "Active";
    if (stock > 0) return "Low Stock";
    return "Out of Stock";
  };

  // Client‑side filtering
  const filteredProducts = useMemo(() => {
    let result = items;

    // Category filter
    if (categoryFilter !== "All") {
      result = result.filter((p) => p.category === categoryFilter);
    }

    // Status filter (derived from stock)
    if (statusFilter !== "All") {
      result = result.filter((p) => getDerivedStatus(p.stock) === statusFilter);
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [items, search, categoryFilter, statusFilter]);

  // Stats derived from real data
  const stats = useMemo(() => {
    const total = items.length;
    const active = items.filter((p) => p.stock > 10).length;
    const lowStock = items.filter((p) => p.stock > 0 && p.stock <= 10).length;
    const outOfStock = items.filter((p) => p.stock === 0).length;
    const categories = new Set(items.map((p) => p.category)).size;
    return { total, active, lowStock, outOfStock, categories };
  }, [items]);

  return (
    <div className="products-wrapper">
      <div className="px-2 sm:px-4 py-6 space-y-8 animate-fadeIn">
        {/* ========== HEADER ========== */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Products</h1>
            <p className="text-sm opacity-60 mt-1">
              View and manage products — {items.length} total.
            </p>
          </div>
          {/* No Add Product button */}
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
            {STATUSES.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
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
                  <th className="py-3 px-4 font-medium hidden md:table-cell">Status</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center opacity-60">Loading products...</td>
                  </tr>
                )}
                {error && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-red-400">{error}</td>
                  </tr>
                )}
                {!loading &&
                  !error &&
                  filteredProducts.map((product) => {
                    const derivedStatus = getDerivedStatus(product.stock);
                    const statusColor =
                      derivedStatus === "Active"
                        ? "bg-green-500/20 text-green-400"
                        : derivedStatus === "Low Stock"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400";

                    return (
                      <tr key={product.id} className="hover:bg-white/5 transition">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {product.images?.[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-8 h-8 rounded-lg object-cover bg-white/10"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-[#29b6d8]/10 flex items-center justify-center text-[#29b6d8] font-bold text-xs">
                                {product.name?.charAt(0) || "P"}
                              </div>
                            )}
                            <span className="font-medium truncate max-w-[150px]">
                              {product.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 hidden sm:table-cell opacity-80">
                          {product.category || "—"}
                        </td>
                        <td className="py-3 px-4 font-medium">
                          ₦{product.price?.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`font-medium ${
                              product.stock === 0
                                ? "text-red-400"
                                : product.stock <= 10
                                ? "text-yellow-400"
                                : "text-green-400"
                            }`}
                          >
                            {product.stock}
                          </span>
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                            {derivedStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleView(product)}
                              className="p-1.5 rounded-md hover:bg-white/10 transition opacity-70 hover:opacity-100"
                              title="View"
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(product)}
                              className="p-1.5 rounded-md hover:bg-red-500/20 transition opacity-70 hover:opacity-100 text-red-400"
                              title="Delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                {!loading && !error && filteredProducts.length === 0 && (
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
      <ProductViewModal
        product={selectedProduct || viewProduct}
        onClose={() => {
          setViewProduct(null);
          dispatch(clearSelectedProduct());
        }}
      />

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-200 bg-black/60 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="bg-[#0a2742] border border-white/10 rounded-2xl p-6 max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <h3 className="text-lg font-bold">Delete Product</h3>
            </div>
            <p className="text-sm text-white/70 mb-6">
              Are you sure you want to delete{" "}
              <strong>{deleteTarget.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete error toast */}
      {deleteError && (
        <div className="fixed bottom-4 right-4 bg-red-500/90 text-white px-4 py-2 rounded-lg text-sm z-50">
          {deleteError}
        </div>
      )}

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