"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { Card } from "@/components/Card";
import {
  ShoppingCart,
  Search,
  TrendingUp,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  Plus,
  AlertCircle,
} from "lucide-react";
import OrderViewModal from "@/components/OrderViewModal";
import OrderFormModal from "@/components/OrderFormModal";

/* ==================== MOCK DATA ==================== */
const INITIAL_ORDERS = [
  { id: "#ORD-001", customer: "Oluwaseun A.", product: "Wireless Earbuds", amount: "₦12,500", status: "Delivered", date: "2026-05-28", payment: "Paid" },
  { id: "#ORD-002", customer: "Grace O.", product: "Kitchen Blender", amount: "₦18,200", status: "Processing", date: "2026-05-27", payment: "Pending" },
  { id: "#ORD-003", customer: "Michael E.", product: "Smart Watch", amount: "₦35,000", status: "Shipped", date: "2026-05-26", payment: "Paid" },
  { id: "#ORD-004", customer: "Chinaza K.", product: "Office Chair", amount: "₦42,800", status: "Pending", date: "2026-05-25", payment: "Pending" },
  { id: "#ORD-005", customer: "Fatima J.", product: "Phone Case", amount: "₦3,500", status: "Delivered", date: "2026-05-24", payment: "Paid" },
  { id: "#ORD-006", customer: "Ibrahim O.", product: "Yoga Mat", amount: "₦5,500", status: "Processing", date: "2026-05-23", payment: "Paid" },
  { id: "#ORD-007", customer: "Ngozi E.", product: "Men's Running Shoes", amount: "₦22,000", status: "Cancelled", date: "2026-05-22", payment: "Refunded" },
  { id: "#ORD-008", customer: "Bola T.", product: "Hair Dryer", amount: "₦9,900", status: "Shipped", date: "2026-05-21", payment: "Paid" },
  { id: "#ORD-009", customer: "Emeka U.", product: "Bluetooth Speaker", amount: "₦8,200", status: "Delivered", date: "2026-05-20", payment: "Paid" },
  { id: "#ORD-010", customer: "Aisha M.", product: "Face Moisturizer", amount: "₦4,200", status: "Pending", date: "2026-05-19", payment: "Pending" },
];

const ORDER_STATUSES = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

/* ==================== COMPONENT ==================== */
export default function OrdersPage() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [viewOrder, setViewOrder] = useState<any>(null);
  const [editOrder, setEditOrder] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  // ---------- FILTERED LIST ----------
  const filteredOrders = useMemo(() => {
    let result = orders;
    if (statusFilter !== "All") {
      result = result.filter((o) => o.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.customer.toLowerCase().includes(q) ||
          o.product.toLowerCase().includes(q) ||
          o.id.toLowerCase().includes(q)
      );
    }
    return result;
  }, [orders, search, statusFilter]);

  // ---------- STATS ----------
  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === "Pending").length;
    const shipped = orders.filter((o) => o.status === "Shipped").length;
    const delivered = orders.filter((o) => o.status === "Delivered").length;
    const cancelled = orders.filter((o) => o.status === "Cancelled").length;
    const revenue = orders
      .filter((o) => o.payment === "Paid")
      .reduce((sum, o) => sum + Number(o.amount.replace("₦", "").replace(",", "")), 0);
    return { total, pending, shipped, delivered, cancelled, revenue };
  }, [orders]);

  // ---------- CRUD HANDLERS ----------
  const handleSave = (order: any) => {
    if (order.id && orders.find((o) => o.id === order.id)) {
      // Edit existing
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, ...order } : o))
      );
    } else {
      // Create new
      const newOrder = {
        ...order,
        id: `#ORD-${Date.now().toString().slice(-6)}`,
      };
      setOrders((prev) => [newOrder, ...prev]);
    }
    setEditOrder(null);
    setShowCreate(false);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      setOrders((prev) => prev.filter((o) => o.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  return (
    <div className="orders-wrapper">
      <div className="px-2 sm:px-4 py-6 space-y-8 animate-fadeIn">
        {/* ========== HEADER ========== */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Orders</h1>
            <p className="text-sm opacity-60 mt-1">
              Track and manage customer orders — {orders.length} total orders.
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#29b6d8] to-[#3ec8e6] text-white font-medium text-sm hover:scale-[1.02] transition"
          >
            <Plus size={16} />
            Add Order
          </button>
        </div>

        {/* ========== STATS CARDS ========== */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "Total Orders", value: stats.total, icon: ShoppingCart, color: "text-[#29b6d8]" },
            { label: "Pending", value: stats.pending, icon: Clock, color: "text-yellow-400" },
            { label: "Shipped", value: stats.shipped, icon: Truck, color: "text-blue-400" },
            { label: "Delivered", value: stats.delivered, icon: CheckCircle, color: "text-green-400" },
            { label: "Cancelled", value: stats.cancelled, icon: XCircle, color: "text-red-400" },
            { label: "Revenue", value: `₦${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "text-[#f59e0b]" },
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
              placeholder="Search orders by customer, product or ID..."
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
            {ORDER_STATUSES.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* ========== ORDERS TABLE ========== */}
        <Card className="glass-card rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left opacity-60 text-xs uppercase tracking-wider">
                  <th className="py-3 px-4 font-medium">Order ID</th>
                  <th className="py-3 px-4 font-medium">Customer</th>
                  <th className="py-3 px-4 font-medium hidden sm:table-cell">Product</th>
                  <th className="py-3 px-4 font-medium">Amount</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium hidden md:table-cell">Payment</th>
                  <th className="py-3 px-4 font-medium hidden md:table-cell">Date</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition">
                    <td className="py-3 px-4 font-medium whitespace-nowrap">{order.id}</td>
                    <td className="py-3 px-4 opacity-90">{order.customer}</td>
                    <td className="py-3 px-4 hidden sm:table-cell opacity-80">{order.product}</td>
                    <td className="py-3 px-4 font-medium">{order.amount}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        order.status === "Delivered" ? "bg-green-500/20 text-green-400" :
                        order.status === "Processing" ? "bg-blue-500/20 text-blue-400" :
                        order.status === "Shipped" ? "bg-purple-500/20 text-purple-400" :
                        order.status === "Cancelled" ? "bg-red-500/20 text-red-400" :
                        "bg-yellow-500/20 text-yellow-400"
                      }`}>{order.status}</span>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className={`text-xs font-medium ${
                        order.payment === "Paid" ? "text-green-400" :
                        order.payment === "Refunded" ? "text-red-400" :
                        "text-yellow-400"
                      }`}>{order.payment}</span>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell opacity-60 text-xs">{order.date}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setViewOrder(order)} className="p-1.5 rounded-md hover:bg-white/10 transition opacity-70 hover:opacity-100" title="View">
                          <Eye size={15} />
                        </button>
                        <button onClick={() => setEditOrder(order)} className="p-1.5 rounded-md hover:bg-white/10 transition opacity-70 hover:opacity-100" title="Edit">
                          <Edit size={15} />
                        </button>
                        <button onClick={() => setDeleteTarget(order)} className="p-1.5 rounded-md hover:bg-red-500/20 transition opacity-70 hover:opacity-100 text-red-400" title="Delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-10 text-center opacity-50">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* ========== MODALS ========== */}
      <OrderViewModal order={viewOrder} onClose={() => setViewOrder(null)} />

      {(editOrder || showCreate) && (
        <OrderFormModal
          order={editOrder}
          onClose={() => { setEditOrder(null); setShowCreate(false); }}
          onSave={handleSave}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-200 bg-black/60 backdrop-blur-sm flex items-center justify-center" onClick={() => setDeleteTarget(null)}>
          <div className="bg-[#0a2742] border border-white/10 rounded-2xl p-6 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <h3 className="text-lg font-bold">Delete Order</h3>
            </div>
            <p className="text-sm text-white/70 mb-6">
              Are you sure you want to delete <strong>{deleteTarget.id}</strong>? This action cannot be undone.
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
        .orders-wrapper {
          background: linear-gradient(135deg, #0a2742 0%, #142f52 50%, #1e4b7c 100%);
          min-height: 100vh;
          color: #ffffff;
        }
        .orders-wrapper * {
          color: inherit;
        }
        .orders-wrapper .glass-card {
          background: rgba(255, 255, 255, 0.04) !important;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .orders-wrapper .animate-fadeIn {
          animation: fadeIn 0.6s ease forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        select option {
          background: #0a2742;
          color: #fff;
        }
      `}</style>
    </div>
  );
}