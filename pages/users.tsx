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
  Plus,
  AlertCircle,
} from "lucide-react";
import UserFormModal from "@/components/UserFormModal";
import UserViewModal from "@/components/UserViewModal";


/* ==================== MOCK DATA (merged sellers & buyers) ==================== */
const INITIAL_USERS = [
  { id: 1, name: "Tech Hub NG", email: "info@techhub.ng", tier: "Vendor", status: "Active", joined: "2025-09-15" },
  { id: 2, name: "Fashion Avenue", email: "hello@fashionave.ng", tier: "Vendor", status: "Active", joined: "2025-11-02" },
  { id: 3, name: "Home Essentials", email: "support@homeessential.ng", tier: "Vendor", status: "Active", joined: "2026-01-10" },
  { id: 4, name: "Gadget World", email: "sales@gadgetworld.ng", tier: "Vendor", status: "Suspended", joined: "2025-07-22" },
  { id: 5, name: "Oluwaseun A.", email: "seun@email.com", tier: "Customer", status: "Active", joined: "2025-06-10" },
  { id: 6, name: "Grace O.", email: "grace@email.com", tier: "Customer", status: "Active", joined: "2025-08-14" },
  { id: 7, name: "Michael E.", email: "michael@email.com", tier: "Customer", status: "Active", joined: "2025-12-01" },
  { id: 8, name: "Chinaza K.", email: "chinaza@email.com", tier: "Customer", status: "Active", joined: "2026-02-10" },
  { id: 9, name: "Fatima J.", email: "fatima@email.com", tier: "Customer", status: "Active", joined: "2026-03-05" },
  { id: 10, name: "Ibrahim O.", email: "ibrahim@email.com", tier: "Customer", status: "Inactive", joined: "2026-04-18" },
  { id: 11, name: "Beauty Luxe", email: "beauty@luxe.ng", tier: "Business", status: "Active", joined: "2026-01-20" },
  { id: 12, name: "Sports Pro", email: "info@sportspro.ng", tier: "Business", status: "Inactive", joined: "2026-04-18" },
];

const TIERS = ["All", "Customer", "Vendor", "Business"];
const STATUSES = ["All", "Active", "Inactive", "Suspended"];

/* ==================== COMPONENT ==================== */
export default function UsersPage() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [viewUser, setViewUser] = useState<any>(null);
  const [editUser, setEditUser] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const filteredUsers = useMemo(() => {
    let result = users;
    if (tierFilter !== "All") {
      result = result.filter((u) => u.tier === tierFilter);
    }
    if (statusFilter !== "All") {
      result = result.filter((u) => u.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      );
    }
    return result;
  }, [users, search, tierFilter, statusFilter]);

  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.status === "Active").length;
    const inactive = users.filter((u) => u.status === "Inactive").length;
    const suspended = users.filter((u) => u.status === "Suspended").length;
    const customers = users.filter((u) => u.tier === "Customer").length;
    const vendors = users.filter((u) => u.tier === "Vendor").length;
    const businesses = users.filter((u) => u.tier === "Business").length;
    return { total, active, inactive, suspended, customers, vendors, businesses };
  }, [users]);

  const handleSave = (user: any) => {
    if (user.id && users.find((u) => u.id === user.id)) {
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, ...user } : u))
      );
    } else {
      const newUser = {
        ...user,
        id: Date.now(),
        joined: new Date().toISOString().split("T")[0],
      };
      setUsers((prev) => [newUser, ...prev]);
    }
    setEditUser(null);
    setShowCreate(false);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  return (
    <div className="users-wrapper">
      <div className="px-2 sm:px-4 py-6 space-y-8 animate-fadeIn">
        {/* ========== HEADER ========== */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Users</h1>
            <p className="text-sm opacity-60 mt-1">
              Manage all platform users — {users.length} total.
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#29b6d8] to-[#3ec8e6] text-white font-medium text-sm hover:scale-[1.02] transition"
          >
            <Plus size={16} />
            Add User
          </button>
        </div>

        {/* ========== STATS CARDS ========== */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "Total Users", value: stats.total, icon: Users, color: "text-[#29b6d8]" },
            { label: "Active", value: stats.active, icon: CheckCircle, color: "text-green-400" },
            { label: "Inactive", value: stats.inactive, icon: XCircle, color: "text-yellow-400" },
            { label: "Suspended", value: stats.suspended, icon: XCircle, color: "text-red-400" },
            { label: "Customers", value: stats.customers, icon: Users, color: "text-[#8b5cf6]" },
            { label: "Vendors", value: stats.vendors, icon: Users, color: "text-[#f59e0b]" },
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
              placeholder="Search users by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:opacity-50 focus:outline-none focus:border-[#29b6d8] transition"
            />
          </div>
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#29b6d8] transition"
          >
            {TIERS.map((tier) => (
              <option key={tier} value={tier}>{tier}</option>
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

        {/* ========== USERS TABLE ========== */}
        <Card className="glass-card rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left opacity-60 text-xs uppercase tracking-wider">
                  <th className="py-3 px-4 font-medium">User</th>
                  <th className="py-3 px-4 font-medium hidden sm:table-cell">Email</th>
                  <th className="py-3 px-4 font-medium">Tier</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium hidden md:table-cell">Joined</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#29b6d8]/10 flex items-center justify-center text-[#29b6d8] font-bold text-xs">
                          {user.name.charAt(0)}
                        </div>
                        <span className="font-medium truncate max-w-[120px]">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell opacity-80">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.tier === "Business" ? "bg-purple-500/20 text-purple-400" :
                        user.tier === "Vendor" ? "bg-[#29b6d8]/20 text-[#29b6d8]" :
                        "bg-white/10 text-white/70"
                      }`}>
                        {user.tier}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.status === "Active" ? "bg-green-500/20 text-green-400" :
                        user.status === "Suspended" ? "bg-red-500/20 text-red-400" :
                        "bg-yellow-500/20 text-yellow-400"
                      }`}>{user.status}</span>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell opacity-60 text-xs">{user.joined}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setViewUser(user)} className="p-1.5 rounded-md hover:bg-white/10 transition opacity-70 hover:opacity-100" title="View">
                          <Eye size={15} />
                        </button>
                        <button onClick={() => setEditUser(user)} className="p-1.5 rounded-md hover:bg-white/10 transition opacity-70 hover:opacity-100" title="Edit">
                          <Edit size={15} />
                        </button>
                        <button onClick={() => setDeleteTarget(user)} className="p-1.5 rounded-md hover:bg-red-500/20 transition opacity-70 hover:opacity-100 text-red-400" title="Delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center opacity-50">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* ========== MODALS ========== */}
      <UserViewModal user={viewUser} onClose={() => setViewUser(null)} />

      {(editUser || showCreate) && (
        <UserFormModal
          user={editUser}
          onClose={() => { setEditUser(null); setShowCreate(false); }}
          onSave={handleSave}
        />
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-200 bg-black/60 backdrop-blur-sm flex items-center justify-center" onClick={() => setDeleteTarget(null)}>
          <div className="bg-[#0a2742] border border-white/10 rounded-2xl p-6 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <h3 className="text-lg font-bold">Delete User</h3>
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
        .users-wrapper {
          background: linear-gradient(135deg, #0a2742 0%, #142f52 50%, #1e4b7c 100%);
          min-height: 100vh;
          color: #ffffff;
        }
        .users-wrapper * { color: inherit; }
        .users-wrapper .glass-card {
          background: rgba(255, 255, 255, 0.04) !important;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .users-wrapper .animate-fadeIn { animation: fadeIn 0.6s ease forwards; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        select option { background: #0a2742; color: #fff; }
      `}</style>
    </div>
  );
}