"use client";
import { useState, useMemo } from "react";
import { Card } from "@/components/Card";
import {
  Users,
  Search,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  ShoppingBag,
  DollarSign,
  Plus,
  AlertCircle,
} from "lucide-react";
import BuyerViewModal from "@/components/BuyerViewModal";
import BuyerFormModal from "@/components/BuyerFormModal";

/* ==================== MOCK DATA ==================== */
const INITIAL_BUYERS = [
  { id: 1, name: "Oluwaseun A.", email: "seun@email.com", orders: 12, spent: "₦156,800", lastOrder: "2026-05-28", status: "Active", location: "Lagos" },
  { id: 2, name: "Grace O.", email: "grace@email.com", orders: 8, spent: "₦98,400", lastOrder: "2026-05-27", status: "Active", location: "Abuja" },
  { id: 3, name: "Michael E.", email: "michael@email.com", orders: 5, spent: "₦72,000", lastOrder: "2026-05-26", status: "Active", location: "Port Harcourt" },
  { id: 4, name: "Chinaza K.", email: "chinaza@email.com", orders: 3, spent: "₦42,800", lastOrder: "2026-05-25", status: "Active", location: "Enugu" },
  { id: 5, name: "Fatima J.", email: "fatima@email.com", orders: 15, spent: "₦215,500", lastOrder: "2026-05-24", status: "Active", location: "Kano" },
  { id: 6, name: "Ibrahim O.", email: "ibrahim@email.com", orders: 0, spent: "₦0", lastOrder: "—", status: "Inactive", location: "Ibadan" },
];

const STATUSES = ["All", "Active", "Inactive"];

/* ==================== COMPONENT ==================== */
export default function BuyersPage() {
  const [buyers, setBuyers] = useState(INITIAL_BUYERS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [viewBuyer, setViewBuyer] = useState<any>(null);
  const [editBuyer, setEditBuyer] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const filteredBuyers = useMemo(() => {
    let result = buyers;
    if (statusFilter !== "All") {
      result = result.filter((b) => b.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.email.toLowerCase().includes(q) ||
          b.location.toLowerCase().includes(q)
      );
    }
    return result;
  }, [buyers, search, statusFilter]);

  const stats = useMemo(() => {
    const total = buyers.length;
    const active = buyers.filter((b) => b.status === "Active").length;
    const inactive = buyers.filter((b) => b.status === "Inactive").length;
    const totalOrders = buyers.reduce((sum, b) => sum + b.orders, 0);
    const totalSpent = buyers.reduce((sum, b) => sum + Number(b.spent.replace("₦", "").replace(",", "")), 0);
    return { total, active, inactive, totalOrders, totalSpent };
  }, [buyers]);

  const handleSave = (buyer: any) => {
    if (buyer.id && buyers.find((b) => b.id === buyer.id)) {
      setBuyers((prev) =>
        prev.map((b) => (b.id === buyer.id ? { ...b, ...buyer } : b))
      );
    } else {
      const newBuyer = {
        ...buyer,
        id: Date.now(),
        orders: 0,
        spent: "₦0",
        lastOrder: "—",
      };
      setBuyers((prev) => [newBuyer, ...prev]);
    }
    setEditBuyer(null);
    setShowCreate(false);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      setBuyers((prev) => prev.filter((b) => b.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  return (
    <div className="buyers-wrapper">
      <div className="px-2 sm:px-4 py-6 space-y-8 animate-fadeIn">
        {/* ========== HEADER ========== */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Buyers</h1>
            <p className="text-sm opacity-60 mt-1">
              View registered buyers — {buyers.length} buyers on the platform.
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#29b6d8] to-[#3ec8e6] text-white font-medium text-sm hover:scale-[1.02] transition"
          >
            <Plus size={16} />
            Add Buyer
          </button>
        </div>

        {/* ========== STATS CARDS ========== */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { label: "Total Buyers", value: stats.total, icon: Users, color: "text-[#29b6d8]" },
            { label: "Active", value: stats.active, icon: CheckCircle, color: "text-green-400" },
            { label: "Inactive", value: stats.inactive, icon: XCircle, color: "text-yellow-400" },
            { label: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, color: "text-[#8b5cf6]" },
            { label: "Total Spent", value: `₦${stats.totalSpent.toLocaleString()}`, icon: DollarSign, color: "text-[#f59e0b]" },
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
              placeholder="Search buyers by name, email or location..."
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

        {/* ========== BUYERS TABLE ========== */}
        <Card className="glass-card rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left opacity-60 text-xs uppercase tracking-wider">
                  <th className="py-3 px-4 font-medium">Buyer</th>
                  <th className="py-3 px-4 font-medium hidden sm:table-cell">Email</th>
                  <th className="py-3 px-4 font-medium">Orders</th>
                  <th className="py-3 px-4 font-medium">Spent</th>
                  <th className="py-3 px-4 font-medium hidden md:table-cell">Last Order</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredBuyers.map((buyer) => (
                  <tr key={buyer.id} className="hover:bg-white/5 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#29b6d8]/10 flex items-center justify-center text-[#29b6d8] font-bold text-xs">
                          {buyer.name.charAt(0)}
                        </div>
                        <span className="font-medium truncate max-w-[120px]">{buyer.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell opacity-80">{buyer.email}</td>
                    <td className="py-3 px-4 font-medium">{buyer.orders}</td>
                    <td className="py-3 px-4 font-medium">{buyer.spent}</td>
                    <td className="py-3 px-4 hidden md:table-cell opacity-60 text-xs">{buyer.lastOrder}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        buyer.status === "Active" ? "bg-green-500/20 text-green-400" :
                        "bg-yellow-500/20 text-yellow-400"
                      }`}>{buyer.status}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setViewBuyer(buyer)} className="p-1.5 rounded-md hover:bg-white/10 transition opacity-70 hover:opacity-100" title="View">
                          <Eye size={15} />
                        </button>
                        <button onClick={() => setEditBuyer(buyer)} className="p-1.5 rounded-md hover:bg-white/10 transition opacity-70 hover:opacity-100" title="Edit">
                          <Edit size={15} />
                        </button>
                        <button onClick={() => setDeleteTarget(buyer)} className="p-1.5 rounded-md hover:bg-red-500/20 transition opacity-70 hover:opacity-100 text-red-400" title="Delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredBuyers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-10 text-center opacity-50">
                      No buyers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* ========== MODALS ========== */}
      <BuyerViewModal buyer={viewBuyer} onClose={() => setViewBuyer(null)} />

      {(editBuyer || showCreate) && (
        <BuyerFormModal
          buyer={editBuyer}
          onClose={() => { setEditBuyer(null); setShowCreate(false); }}
          onSave={handleSave}
        />
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-200 bg-black/60 backdrop-blur-sm flex items-center justify-center" onClick={() => setDeleteTarget(null)}>
          <div className="bg-[#0a2742] border border-white/10 rounded-2xl p-6 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <h3 className="text-lg font-bold">Delete Buyer</h3>
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
        .buyers-wrapper {
          background: linear-gradient(135deg, #0a2742 0%, #142f52 50%, #1e4b7c 100%);
          min-height: 100vh;
          color: #ffffff;
        }
        .buyers-wrapper * { color: inherit; }
        .buyers-wrapper .glass-card {
          background: rgba(255, 255, 255, 0.04) !important;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .buyers-wrapper .animate-fadeIn { animation: fadeIn 0.6s ease forwards; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        select option { background: #0a2742; color: #fff; }
      `}</style>
    </div>
  );
}