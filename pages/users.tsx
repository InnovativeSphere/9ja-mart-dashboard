"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { fetchUsers } from "../redux/slices/usersSlice";
import { fetchDashboard } from "../redux/slices/dashboardSlice";
import { Card } from "@/components/Card";
import {
  Users,
  Search,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";
import UserViewModal from "@/components/UserViewModal";

const TIERS = ["All", "Customer", "Vendor", "Business"];
const STATUSES = ["All", "Active", "Inactive", "Suspended"];

export default function UsersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector((state: RootState) => state.users);
  const dashboardData = useSelector((state: RootState) => state.dashboard.data);
  const dashboardLoading = useSelector((state: RootState) => state.dashboard.loading);

  // Local filter state
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);

  // Modal state
  const [viewUser, setViewUser] = useState<any>(null);

  // Fetch users on mount and whenever filters change
  const loadUsers = useCallback(() => {
    const params: any = { PageNumber: page, PageSize: 20 };
    if (search.trim()) params.SearchText = search.trim();
    if (tierFilter !== "All") params.Tier = tierFilter;
    if (statusFilter === "Active") params.IsActive = true;
    else if (statusFilter === "Inactive") params.IsActive = false;
    dispatch(fetchUsers(params));
  }, [dispatch, search, tierFilter, statusFilter, page]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Ensure dashboard stats are available
  useEffect(() => {
    if (!dashboardData && !dashboardLoading) {
      dispatch(fetchDashboard());
    }
  }, [dispatch, dashboardData, dashboardLoading]);

  // Stats derived from dashboard overview
  const stats = useMemo(() => {
    const m = dashboardData?.marketplaceUsers;
    return {
      total: m?.total ?? 0,
      active: m?.active ?? 0,
      inactive: m?.inactive ?? 0,
      free: m?.free ?? 0,
      vendor: m?.vendor ?? 0,
      business: m?.business ?? 0,
    };
  }, [dashboardData]);

  return (
    <div className="users-wrapper">
      <div className="px-2 sm:px-4 py-6 space-y-8 animate-fadeIn">
        {/* ========== HEADER ========== */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Users</h1>
            <p className="text-sm opacity-60 mt-1">
              Manage all platform users — {stats.total} total.
            </p>
          </div>
          {/* No Add User button */}
        </div>

        {/* ========== STATS CARDS (from dashboard) ========== */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "Total Users", value: stats.total, icon: Users, color: "text-[#29b6d8]" },
            { label: "Active", value: stats.active, icon: CheckCircle, color: "text-green-400" },
            { label: "Inactive", value: stats.inactive, icon: XCircle, color: "text-yellow-400" },
            { label: "Free", value: stats.free, icon: Users, color: "text-[#8b5cf6]" },
            { label: "Vendor", value: stats.vendor, icon: Users, color: "text-[#f59e0b]" },
            { label: "Business", value: stats.business, icon: Users, color: "text-[#10b981]" },
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
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:opacity-50 focus:outline-none focus:border-[#29b6d8] transition"
            />
          </div>
          <select
            value={tierFilter}
            onChange={(e) => { setTierFilter(e.target.value); setPage(1); }}
            className="px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#29b6d8] transition"
          >
            {TIERS.map((tier) => (
              <option key={tier} value={tier}>{tier}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#29b6d8] transition"
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* ========== USERS TABLE (real data) ========== */}
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
                {loading && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center opacity-60">Loading users...</td>
                  </tr>
                )}
                {error && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-red-400">{error}</td>
                  </tr>
                )}
                {!loading && !error && items.map((user) => (
                  <tr key={user.guid} className="hover:bg-white/5 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#29b6d8]/10 flex items-center justify-center text-[#29b6d8] font-bold text-xs">
                          {user.fullName.charAt(0)}
                        </div>
                        <span className="font-medium truncate max-w-[120px]">{user.fullName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell opacity-80">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.subscriptionPlan === "Business" ? "bg-purple-500/20 text-purple-400" :
                        user.subscriptionPlan === "Vendor" ? "bg-[#29b6d8]/20 text-[#29b6d8]" :
                        "bg-white/10 text-white/70"
                      }`}>
                        {user.subscriptionPlan}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.isActive
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}>
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell opacity-60 text-xs">
                      {new Date(user.dateCreated).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setViewUser(user)} className="p-1.5 rounded-md hover:bg-white/10 transition opacity-70 hover:opacity-100" title="View">
                          <Eye size={15} />
                        </button>
                        {/* No Edit or Delete */}
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && !error && items.length === 0 && (
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

      {/* ========== VIEW MODAL ========== */}
      <UserViewModal user={viewUser} onClose={() => setViewUser(null)} />

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