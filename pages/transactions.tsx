"use client";
import { useState, useMemo } from "react";
import { Card } from "@/components/Card";
import {
  ArrowUpDown,
  Search,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Download,
} from "lucide-react";
import TransactionViewModal from "@/components/TransactionViewModal";

/* ==================== MOCK DATA ==================== */
const ALL_TRANSACTIONS = [
  { id: "#TXN-001", customer: "Oluwaseun A.", amount: "₦12,500", date: "2026-05-28", method: "Card", status: "Successful", order: "#ORD-001" },
  { id: "#TXN-002", customer: "Grace O.", amount: "₦18,200", date: "2026-05-27", method: "Bank Transfer", status: "Pending", order: "#ORD-002" },
  { id: "#TXN-003", customer: "Michael E.", amount: "₦35,000", date: "2026-05-26", method: "Card", status: "Successful", order: "#ORD-003" },
  { id: "#TXN-004", customer: "Chinaza K.", amount: "₦42,800", date: "2026-05-25", method: "USSD", status: "Failed", order: "#ORD-004" },
  { id: "#TXN-005", customer: "Fatima J.", amount: "₦3,500", date: "2026-05-24", method: "Card", status: "Successful", order: "#ORD-005" },
  { id: "#TXN-006", customer: "Ibrahim O.", amount: "₦5,500", date: "2026-05-23", method: "Bank Transfer", status: "Successful", order: "#ORD-006" },
  { id: "#TXN-007", customer: "Ngozi E.", amount: "₦22,000", date: "2026-05-22", method: "Card", status: "Refunded", order: "#ORD-007" },
  { id: "#TXN-008", customer: "Bola T.", amount: "₦9,900", date: "2026-05-21", method: "USSD", status: "Successful", order: "#ORD-008" },
  { id: "#TXN-009", customer: "Emeka U.", amount: "₦8,200", date: "2026-05-20", method: "Card", status: "Successful", order: "#ORD-009" },
  { id: "#TXN-010", customer: "Aisha M.", amount: "₦4,200", date: "2026-05-19", method: "Bank Transfer", status: "Pending", order: "#ORD-010" },
  { id: "#TXN-011", customer: "Kemi L.", amount: "₦15,000", date: "2026-05-18", method: "Card", status: "Failed", order: "#ORD-011" },
  { id: "#TXN-012", customer: "Dayo A.", amount: "₦28,400", date: "2026-05-17", method: "USSD", status: "Successful", order: "#ORD-012" },
];

const STATUSES = ["All", "Successful", "Pending", "Failed", "Refunded"];

/* ==================== COMPONENT ==================== */
export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewTransaction, setViewTransaction] = useState<any>(null);

  const filteredTransactions = useMemo(() => {
    let result = ALL_TRANSACTIONS;
    if (statusFilter !== "All") {
      result = result.filter((t) => t.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.customer.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q) ||
          t.order.toLowerCase().includes(q)
      );
    }
    return result;
  }, [search, statusFilter]);

  const stats = useMemo(() => {
    const total = ALL_TRANSACTIONS.length;
    const successful = ALL_TRANSACTIONS.filter((t) => t.status === "Successful").length;
    const pending = ALL_TRANSACTIONS.filter((t) => t.status === "Pending").length;
    const failed = ALL_TRANSACTIONS.filter((t) => t.status === "Failed").length;
    const refunded = ALL_TRANSACTIONS.filter((t) => t.status === "Refunded").length;
    const totalRevenue = ALL_TRANSACTIONS
      .filter((t) => t.status === "Successful")
      .reduce((sum, t) => sum + Number(t.amount.replace("₦", "").replace(",", "")), 0);
    return { total, successful, pending, failed, refunded, totalRevenue };
  }, []);

  // ---------- CSV Export ----------
  const exportCSV = () => {
    const headers = ["Transaction ID", "Customer", "Amount", "Date", "Method", "Status", "Order"];
    const rows = ALL_TRANSACTIONS.map((t) => [t.id, t.customer, t.amount, t.date, t.method, t.status, t.order]);
    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `9jamart-transactions-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="transactions-wrapper">
      <div className="px-2 sm:px-4 py-6 space-y-8 animate-fadeIn">
        {/* ========== HEADER ========== */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Transactions</h1>
            <p className="text-sm opacity-60 mt-1">
              View and manage all payment transactions — {ALL_TRANSACTIONS.length} total.
            </p>
          </div>
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#29b6d8] to-[#3ec8e6] text-white font-medium text-sm hover:scale-[1.02] transition"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>

        {/* ========== STATS CARDS ========== */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "Total Transactions", value: stats.total, icon: ArrowUpDown, color: "text-[#29b6d8]" },
            { label: "Successful", value: stats.successful, icon: CheckCircle, color: "text-green-400" },
            { label: "Pending", value: stats.pending, icon: Clock, color: "text-yellow-400" },
            { label: "Failed", value: stats.failed, icon: XCircle, color: "text-red-400" },
            { label: "Refunded", value: stats.refunded, icon: XCircle, color: "text-purple-400" },
            { label: "Revenue", value: `₦${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-[#f59e0b]" },
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
              placeholder="Search by transaction ID, customer or order ID..."
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

        {/* ========== TRANSACTIONS TABLE ========== */}
        <Card className="glass-card rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left opacity-60 text-xs uppercase tracking-wider">
                  <th className="py-3 px-4 font-medium">Transaction ID</th>
                  <th className="py-3 px-4 font-medium">Customer</th>
                  <th className="py-3 px-4 font-medium">Amount</th>
                  <th className="py-3 px-4 font-medium hidden sm:table-cell">Method</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium hidden md:table-cell">Order</th>
                  <th className="py-3 px-4 font-medium hidden md:table-cell">Date</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTransactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-white/5 transition">
                    <td className="py-3 px-4 font-medium whitespace-nowrap">{txn.id}</td>
                    <td className="py-3 px-4 opacity-90">{txn.customer}</td>
                    <td className="py-3 px-4 font-medium">{txn.amount}</td>
                    <td className="py-3 px-4 hidden sm:table-cell opacity-80">{txn.method}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        txn.status === "Successful" ? "bg-green-500/20 text-green-400" :
                        txn.status === "Pending" ? "bg-yellow-500/20 text-yellow-400" :
                        txn.status === "Failed" ? "bg-red-500/20 text-red-400" :
                        "bg-purple-500/20 text-purple-400"
                      }`}>{txn.status}</span>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell opacity-80">{txn.order}</td>
                    <td className="py-3 px-4 hidden md:table-cell opacity-60 text-xs">{txn.date}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setViewTransaction(txn)} className="p-1.5 rounded-md hover:bg-white/10 transition opacity-70 hover:opacity-100" title="View">
                          <Eye size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-10 text-center opacity-50">
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* ========== VIEW MODAL ========== */}
      <TransactionViewModal transaction={viewTransaction} onClose={() => setViewTransaction(null)} />

      {/* ==================== SCOPED STYLES ==================== */}
      <style jsx>{`
        .transactions-wrapper {
          background: linear-gradient(135deg, #0a2742 0%, #142f52 50%, #1e4b7c 100%);
          min-height: 100vh;
          color: #ffffff;
        }
        .transactions-wrapper * {
          color: inherit;
        }
        .transactions-wrapper .glass-card {
          background: rgba(255, 255, 255, 0.04) !important;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .transactions-wrapper .animate-fadeIn {
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