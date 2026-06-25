"use client";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { fetchUsers } from "../redux/slices/usersSlice";
import {
  grant,
  cancel,
  expire,
  changePlan,
  resume,                           // 🆕 resume thunk
  fetchSubscriptionHistory,
} from "../redux/slices/subscriptionsSlice";
import { Card } from "@/components/Card";
import {
  Users,
  Search,
  Plus,
  XCircle,
  Clock,
  RefreshCw,
  History,
  Play,                             // 🆕 resume icon
} from "lucide-react";
import GrantSubscriptionModal from "@/components/GrantSubscriptionModal";
import ConfirmSubscriptionModal from "@/components/ConfirmSubscriptionModal";
import ChangePlanModal from "@/components/ChangePlanModal";
import SubscriptionHistoryModal from "@/components/SubscriptionHistoryModal";

const SUBSCRIPTION_STATUSES = ["All", "Active", "PastDue", "Cancelled", "Expired"];

export default function SubscriptionsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector((state: RootState) => state.users);
  const { actionLoading, actionError } = useSelector((state: RootState) => state.subscriptions);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);

  const [grantTarget, setGrantTarget] = useState<any>(null);
  const [cancelTarget, setCancelTarget] = useState<any>(null);
  const [expireTarget, setExpireTarget] = useState<any>(null);
  const [changeTarget, setChangeTarget] = useState<any>(null);
  const [historyTarget, setHistoryTarget] = useState<any>(null);

  const loadUsers = useCallback(() => {
    const params: any = { PageNumber: page, PageSize: 20 };
    if (search.trim()) params.SearchText = search.trim();
    dispatch(fetchUsers(params));
  }, [dispatch, search, page]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filteredUsers = statusFilter === "All"
    ? items
    : items.filter((u) => u.subscriptionStatus === statusFilter);

  // ---------- Action handlers (async, keep modal open on error) ----------

  const handleGrant = async (payload: any) => {
    try {
      await dispatch(grant(payload)).unwrap();
      setGrantTarget(null);
    } catch {
      // modal stays open – error shown via actionError toast
    }
  };

  const handleCancel = async (reason: string) => {
    if (!cancelTarget) return;
    try {
      await dispatch(cancel({ customerGuid: cancelTarget.guid, reason })).unwrap();
      setCancelTarget(null);
    } catch {
      // modal stays open
    }
  };

  const handleExpire = async (reason: string) => {
    if (!expireTarget) return;
    try {
      await dispatch(expire({ customerGuid: expireTarget.guid, reason })).unwrap();
      setExpireTarget(null);
    } catch {
      // modal stays open
    }
  };

  const handleChangePlan = async (payload: { customerGuid: string; plan: string; billingInterval: string }) => {
    try {
      await dispatch(changePlan(payload)).unwrap();
      setChangeTarget(null);
    } catch {
      // modal stays open
    }
  };

  const handleViewHistory = (user: any) => {
    dispatch(fetchSubscriptionHistory(user.guid));
    setHistoryTarget(user);
  };

  return (
    <div className="subscriptions-wrapper">
      <div className="px-2 sm:px-4 py-6 space-y-8 animate-fadeIn">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Subscriptions</h1>
            <p className="text-sm opacity-60 mt-1">
              Manage customer subscriptions — {items.length} users loaded.
            </p>
          </div>
        </div>

        {/* FILTERS & SEARCH */}
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#29b6d8] transition"
          >
            {SUBSCRIPTION_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* USERS TABLE */}
        <Card className="glass-card rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left opacity-60 text-xs uppercase tracking-wider">
                  <th className="py-3 px-4 font-medium">User</th>
                  <th className="py-3 px-4 font-medium hidden sm:table-cell">Email</th>
                  <th className="py-3 px-4 font-medium">Plan</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading && (
                  <tr><td colSpan={5} className="py-10 text-center opacity-60">Loading users...</td></tr>
                )}
                {error && (
                  <tr><td colSpan={5} className="py-10 text-center text-red-400">{error}</td></tr>
                )}
                {!loading && !error && filteredUsers.map((user) => (
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
                        {user.subscriptionPlan || "None"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.subscriptionStatus === "Active" ? "bg-green-500/20 text-green-400" :
                        user.subscriptionStatus === "PastDue" ? "bg-red-500/20 text-red-400" :
                        user.subscriptionStatus === "Cancelled" || user.subscriptionStatus === "Expired" ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-white/10 text-white/70"
                      }`}>
                        {user.subscriptionStatus || "—"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        {/* Grant button – show when no active subscription */}
                        {!user.subscriptionStatus || user.subscriptionStatus === "None" || user.subscriptionStatus === null ? (
                          <button
                            onClick={() => setGrantTarget(user)}
                            className="p-1.5 rounded-md hover:bg-green-500/20 transition opacity-70 hover:opacity-100 text-green-400"
                            title="Grant Subscription"
                          >
                            <Plus size={15} />
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => setCancelTarget(user)}
                              className="p-1.5 rounded-md hover:bg-red-500/20 transition opacity-70 hover:opacity-100 text-red-400"
                              title="Cancel"
                            >
                              <XCircle size={15} />
                            </button>
                            <button
                              onClick={() => setExpireTarget(user)}
                              className="p-1.5 rounded-md hover:bg-yellow-500/20 transition opacity-70 hover:opacity-100 text-yellow-400"
                              title="Expire"
                            >
                              <Clock size={15} />
                            </button>
                            <button
                              onClick={() => setChangeTarget(user)}
                              className="p-1.5 rounded-md hover:bg-blue-500/20 transition opacity-70 hover:opacity-100 text-blue-400"
                              title="Change Plan"
                            >
                              <RefreshCw size={15} />
                            </button>
                            {/* 🆕 Resume button for cancelled subscriptions */}
                            {user.subscriptionStatus === "Cancelled" && (
                              <button
                                onClick={() => dispatch(resume(user.guid))}
                                className="p-1.5 rounded-md hover:bg-green-500/20 transition opacity-70 hover:opacity-100 text-green-400"
                                title="Resume Renewal"
                              >
                                <Play size={15} />
                              </button>
                            )}
                          </>
                        )}
                        <button
                          onClick={() => handleViewHistory(user)}
                          className="p-1.5 rounded-md hover:bg-white/10 transition opacity-70 hover:opacity-100"
                          title="View History"
                        >
                          <History size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && !error && filteredUsers.length === 0 && (
                  <tr><td colSpan={5} className="py-10 text-center opacity-50">No users found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* ========== MODALS ========== */}
      <GrantSubscriptionModal
        isOpen={grantTarget !== null}
        customerGuid={grantTarget?.guid || ""}
        customerName={grantTarget?.fullName || ""}
        onClose={() => setGrantTarget(null)}
        onGrant={handleGrant}
      />

      <ConfirmSubscriptionModal
        isOpen={cancelTarget !== null}
        title="Cancel Subscription"
        customerName={cancelTarget?.fullName || ""}
        actionLabel="Cancel Subscription"
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancel}
      />

      <ConfirmSubscriptionModal
        isOpen={expireTarget !== null}
        title="Expire Subscription"
        customerName={expireTarget?.fullName || ""}
        actionLabel="Expire Subscription"
        onClose={() => setExpireTarget(null)}
        onConfirm={handleExpire}
      />

      <ChangePlanModal
        isOpen={changeTarget !== null}
        customerGuid={changeTarget?.guid || ""}
        customerName={changeTarget?.fullName || ""}
        currentPlan={changeTarget?.subscriptionPlan || ""}
        currentBilling={changeTarget?.billingInterval || "Monthly"}
        currentStatus={changeTarget?.subscriptionStatus || ""}
        onClose={() => setChangeTarget(null)}
        onChange={handleChangePlan}
      />

      <SubscriptionHistoryModal
        isOpen={historyTarget !== null}
        history={useSelector((state: RootState) => state.subscriptions.history)}
        customerName={historyTarget?.fullName || ""}
        onClose={() => setHistoryTarget(null)}
      />

      {actionError && (
        <div className="fixed bottom-4 right-4 bg-red-500/90 text-white px-4 py-2 rounded-lg text-sm z-50">
          {actionError}
        </div>
      )}

      <style jsx>{`
        .subscriptions-wrapper {
          background: linear-gradient(135deg, #0a2742 0%, #142f52 50%, #1e4b7c 100%);
          min-height: 100vh; color: #ffffff;
        }
        .subscriptions-wrapper * { color: inherit; }
        .subscriptions-wrapper .glass-card {
          background: rgba(255, 255, 255, 0.04) !important;
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
        }
        .subscriptions-wrapper .animate-fadeIn { animation: fadeIn 0.6s ease forwards; }
        @keyframes fadeIn { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform: translateY(0); } }
        select option { background: #0a2742; color: #fff; }
      `}</style>
    </div>
  );
}