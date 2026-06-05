"use client";
import { useState, useMemo } from "react";
import { Card } from "@/components/Card";
import {
  Store,
  Search,
  Star,
  TrendingUp,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Package,
  Plus,
  AlertCircle,
} from "lucide-react";
import SellerViewModal from "@/components/SellerViewModal";
import SellerFormModal from "@/components/SellerFormModal";

/* ==================== MOCK DATA ==================== */
const INITIAL_SELLERS = [
  { id: 1, name: "Tech Hub NG", store: "TechHub Electronics", email: "info@techhub.ng", products: 48, sales: "₦2.1M", rating: 4.8, status: "Active", joined: "2025-09-15" },
  { id: 2, name: "Fashion Avenue", store: "FashionAve", email: "hello@fashionave.ng", products: 32, sales: "₦1.8M", rating: 4.5, status: "Active", joined: "2025-11-02" },
  { id: 3, name: "Home Essentials", store: "HomeEssentials NG", email: "support@homeessential.ng", products: 21, sales: "₦1.5M", rating: 4.2, status: "Active", joined: "2026-01-10" },
  { id: 4, name: "Gadget World", store: "GadgetWorld", email: "sales@gadgetworld.ng", products: 15, sales: "₦1.2M", rating: 3.9, status: "Suspended", joined: "2025-07-22" },
  { id: 5, name: "Beauty Luxe", store: "BeautyLuxe NG", email: "beauty@luxe.ng", products: 8, sales: "₦450K", rating: 4.0, status: "Active", joined: "2026-03-05" },
  { id: 6, name: "Sports Pro", store: "SportsPro", email: "info@sportspro.ng", products: 0, sales: "₦0", rating: 0, status: "Inactive", joined: "2026-04-18" },
];

const STATUSES = ["All", "Active", "Inactive", "Suspended"];

/* ==================== COMPONENT ==================== */
export default function SellersPage() {
  const [sellers, setSellers] = useState(INITIAL_SELLERS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [viewSeller, setViewSeller] = useState<any>(null);
  const [editSeller, setEditSeller] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const filteredSellers = useMemo(() => {
    let result = sellers;
    if (statusFilter !== "All") {
      result = result.filter((s) => s.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.store.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q)
      );
    }
    return result;
  }, [sellers, search, statusFilter]);

  const stats = useMemo(() => {
    const total = sellers.length;
    const active = sellers.filter((s) => s.status === "Active").length;
    const suspended = sellers.filter((s) => s.status === "Suspended").length;
    const inactive = sellers.filter((s) => s.status === "Inactive").length;
    const totalProducts = sellers.reduce((sum, s) => sum + s.products, 0);
    return { total, active, suspended, inactive, totalProducts };
  }, [sellers]);

  const handleSave = (seller: any) => {
    if (seller.id && sellers.find((s) => s.id === seller.id)) {
      setSellers((prev) =>
        prev.map((s) => (s.id === seller.id ? { ...s, ...seller } : s))
      );
    } else {
      const newSeller = {
        ...seller,
        id: Date.now(),
        products: 0,
        sales: "₦0",
        rating: 0,
        joined: new Date().toISOString().split("T")[0],
      };
      setSellers((prev) => [newSeller, ...prev]);
    }
    setEditSeller(null);
    setShowCreate(false);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      setSellers((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  return (
    <div className="sellers-wrapper">
      <div className="px-2 sm:px-4 py-6 space-y-8 animate-fadeIn">
        {/* ========== HEADER ========== */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Sellers</h1>
            <p className="text-sm opacity-60 mt-1">
              Manage registered sellers — {sellers.length} sellers on the platform.
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#29b6d8] to-[#3ec8e6] text-white font-medium text-sm hover:scale-[1.02] transition"
          >
            <Plus size={16} />
            Add Seller
          </button>
        </div>

        {/* ========== STATS CARDS ========== */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { label: "Total Sellers", value: stats.total, icon: Store, color: "text-[#29b6d8]" },
            { label: "Active", value: stats.active, icon: CheckCircle, color: "text-green-400" },
            { label: "Suspended", value: stats.suspended, icon: XCircle, color: "text-red-400" },
            { label: "Inactive", value: stats.inactive, icon: XCircle, color: "text-yellow-400" },
            { label: "Total Products", value: stats.totalProducts, icon: Package, color: "text-[#8b5cf6]" },
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
              placeholder="Search sellers by name, store or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:opacity-50 focus:outline-none focus:border-[#29b6d8] transition"
            />
          </div>
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

        {/* ========== SELLERS TABLE ========== */}
        <Card className="glass-card rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left opacity-60 text-xs uppercase tracking-wider">
                  <th className="py-3 px-4 font-medium">Seller</th>
                  <th className="py-3 px-4 font-medium hidden sm:table-cell">Store</th>
                  <th className="py-3 px-4 font-medium hidden md:table-cell">Products</th>
                  <th className="py-3 px-4 font-medium">Sales</th>
                  <th className="py-3 px-4 font-medium hidden md:table-cell">Rating</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredSellers.map((seller) => (
                  <tr key={seller.id} className="hover:bg-white/5 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#29b6d8]/10 flex items-center justify-center text-[#29b6d8] font-bold text-xs">
                          {seller.name.charAt(0)}
                        </div>
                        <span className="font-medium truncate max-w-[120px]">{seller.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell opacity-80">{seller.store}</td>
                    <td className="py-3 px-4 hidden md:table-cell opacity-80">{seller.products}</td>
                    <td className="py-3 px-4 font-medium">{seller.sales}</td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-[#f59e0b] fill-current" />
                        <span className="font-medium">{seller.rating > 0 ? seller.rating.toFixed(1) : "N/A"}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        seller.status === "Active" ? "bg-green-500/20 text-green-400" :
                        seller.status === "Suspended" ? "bg-red-500/20 text-red-400" :
                        "bg-yellow-500/20 text-yellow-400"
                      }`}>{seller.status}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setViewSeller(seller)} className="p-1.5 rounded-md hover:bg-white/10 transition opacity-70 hover:opacity-100" title="View">
                          <Eye size={15} />
                        </button>
                        <button onClick={() => setEditSeller(seller)} className="p-1.5 rounded-md hover:bg-white/10 transition opacity-70 hover:opacity-100" title="Edit">
                          <Edit size={15} />
                        </button>
                        <button onClick={() => setDeleteTarget(seller)} className="p-1.5 rounded-md hover:bg-red-500/20 transition opacity-70 hover:opacity-100 text-red-400" title="Delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredSellers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-10 text-center opacity-50">
                      No sellers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* ========== MODALS ========== */}
      <SellerViewModal seller={viewSeller} onClose={() => setViewSeller(null)} />

      {(editSeller || showCreate) && (
        <SellerFormModal
          seller={editSeller}
          onClose={() => { setEditSeller(null); setShowCreate(false); }}
          onSave={handleSave}
        />
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-200 bg-black/60 backdrop-blur-sm flex items-center justify-center" onClick={() => setDeleteTarget(null)}>
          <div className="bg-[#0a2742] border border-white/10 rounded-2xl p-6 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <h3 className="text-lg font-bold">Delete Seller</h3>
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

      <style jsx>{`
        .sellers-wrapper {
          background: linear-gradient(135deg, #0a2742 0%, #142f52 50%, #1e4b7c 100%);
          min-height: 100vh;
          color: #ffffff;
        }
        .sellers-wrapper * { color: inherit; }
        .sellers-wrapper .glass-card {
          background: rgba(255, 255, 255, 0.04) !important;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .sellers-wrapper .animate-fadeIn { animation: fadeIn 0.6s ease forwards; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        select option { background: #0a2742; color: #fff; }
      `}</style>
    </div>
  );
}