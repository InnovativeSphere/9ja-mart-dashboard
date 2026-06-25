"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { fetchDashboard } from "../redux/slices/dashboardSlice";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  Plus,
  FileText,
  Settings,
  Layers,
  UserCheck,
  CreditCard,
} from "lucide-react";
import StatsCard from "@/components/StatusCard";
import { Card } from "@/components/Card";

/* ---- chart mock data (kept as-is until analytics endpoint is available) ---- */
const monthlySales = [
  { name: "Jan", value: 3200000 },
  { name: "Feb", value: 2800000 },
  { name: "Mar", value: 4100000 },
  { name: "Apr", value: 3800000 },
  { name: "May", value: 4500000 },
  { name: "Jun", value: 5100000 },
  { name: "Jul", value: 4900000 },
  { name: "Aug", value: 4300000 },
  { name: "Sep", value: 5200000 },
  { name: "Oct", value: 5800000 },
  { name: "Nov", value: 6100000 },
  { name: "Dec", value: 7200000 },
];

const orderStatusData = [
  { name: "Pending", value: 45, color: "#facc15" },
  { name: "Processing", value: 30, color: "#3b82f6" },
  { name: "Shipped", value: 25, color: "#22c55e" },
  { name: "Delivered", value: 32, color: "#8b5cf6" },
];

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.dashboard,
  );
  const [selectedPeriod, setSelectedPeriod] = useState<"monthly" | "weekly">(
    "monthly",
  );

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  // Derive displayed values from real API data
  const productsTotal = data?.products?.total ?? 0;
  const ordersTotal = data?.orders?.total ?? 0;
  const usersTotal = data?.marketplaceUsers?.total ?? 0;
  const revenue = data?.orders?.grossMerchandiseValue ?? 0;
  const recentOrders = data?.recentOrders ?? [];
  const recentUsers = data?.recentMarketplaceUsers ?? [];
  const recentProducts = data?.recentProducts ?? [];
  const subscriptions = data?.subscriptions;

  return (
    <div className="dashboard-wrapper">
      <div className="px-2 sm:px-4 py-6 space-y-8 animate-fadeIn">
        {/* ========== HEADER ========== */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm opacity-60 mt-1">
              Welcome back, Admin — here's what's happening today.
            </p>
          </div>
          <div className="flex gap-2">
            {["monthly", "weekly"].map((period) => (
              <button
                key={period}
                onClick={() =>
                  setSelectedPeriod(period as "monthly" | "weekly")
                }
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedPeriod === period
                    ? "bg-white/20"
                    : "bg-white/5 opacity-60 hover:bg-white/10"
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* ========== MAIN STATS CARDS ========== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Products"
            value={productsTotal}
            className="bg-gradient-to-br from-[#29b6d8]/20 to-[#3ec8e6]/10 border border-[#29b6d8]/30 hover:scale-[1.02] transition"
            icon={<Package className="w-5 h-5 text-[#29b6d8]" />}
          />
          <StatsCard
            title="Total Orders"
            value={ordersTotal}
            className="bg-gradient-to-br from-[#8b5cf6]/20 to-[#a78bfa]/10 border border-[#8b5cf6]/30 hover:scale-[1.02] transition"
            icon={<ShoppingCart className="w-5 h-5 text-[#8b5cf6]" />}
          />
          <StatsCard
            title="Total Users"
            value={usersTotal}
            className="bg-gradient-to-br from-[#f59e0b]/20 to-[#fbbf24]/10 border border-[#f59e0b]/30 hover:scale-[1.02] transition"
            icon={<Users className="w-5 h-5 text-[#f59e0b]" />}
          />
          <StatsCard
            title="Total Revenue"
            value={`₦${(revenue / 1000000).toFixed(1)}M`}
            className="bg-gradient-to-br from-[#10b981]/20 to-[#34d399]/10 border border-[#10b981]/30 hover:scale-[1.02] transition"
            icon={<TrendingUp className="w-5 h-5 text-[#10b981]" />}
          />
        </div>

        {/* ========== SUBSCRIPTION STATS (real data) ========== */}
        {subscriptions && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatsCard
              title="Active Subs"
              value={subscriptions.active}
              className="bg-white/5 border border-white/10"
              icon={<UserCheck className="w-4 h-4 text-green-400" />}
            />
            <StatsCard
              title="Vendor"
              value={subscriptions.vendor}
              className="bg-white/5 border border-white/10"
              icon={<Layers className="w-4 h-4 text-blue-400" />}
            />
            <StatsCard
              title="Business"
              value={subscriptions.business}
              className="bg-white/5 border border-white/10"
              icon={<Layers className="w-4 h-4 text-purple-400" />}
            />
            <StatsCard
              title="Monthly / Yearly"
              value={`${subscriptions.monthly} / ${subscriptions.yearly}`}
              className="bg-white/5 border border-white/10"
              icon={<CreditCard className="w-4 h-4 text-orange-400" />}
            />
          </div>
        )}

        {/* ========== CHARTS (mock data) ========== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Overview */}
          <Card className="lg:col-span-2 glass-card p-6 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold">Revenue Overview</h2>
                <p className="text-sm opacity-60">Monthly sales performance</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">
                  ₦{(revenue / 1000000).toFixed(1)}M
                </span>
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlySales}
                  margin={{ top: 10, right: 10, left: -15, bottom: 10 }}
                >
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(10,39,66,0.9)",
                      border: "1px solid rgba(41,182,216,0.2)",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {monthlySales.map((_, index) => (
                      <Cell
                        key={index}
                        fill={
                          index >= monthlySales.length - 3
                            ? "#29b6d8"
                            : "rgba(41,182,216,0.3)"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Order Status */}
          <Card className="glass-card p-6 rounded-2xl border border-white/10">
            <h2 className="text-lg font-semibold mb-6">Order Status</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "rgba(10,39,66,0.9)",
                      border: "1px solid rgba(41,182,216,0.2)",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    formatter={(value: string) => (
                      <span className="text-sm opacity-80">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* ========== SECOND GRID (recent data) ========== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <Card className="lg:col-span-2 glass-card p-6 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Orders</h2>
              <Link
                href="/orders"
                className="text-sm text-[#29b6d8] hover:underline"
              >
                View all
              </Link>
            </div>
            {loading && (
              <p className="text-sm opacity-60 text-center py-4">
                Loading orders...
              </p>
            )}
            {error && (
              <p className="text-sm text-red-400 text-center py-4">{error}</p>
            )}
            {!loading && !error && recentOrders.length === 0 && (
              <p className="text-sm opacity-60 text-center py-4">
                No recent orders.
              </p>
            )}
            {!loading && !error && recentOrders.length > 0 && (
              <div className="space-y-2">
                {recentOrders.slice(0, 5).map((order: any, idx: number) => (
                  <div
                    key={order.id || idx}
                    className="grid grid-cols-6 items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition text-sm"
                  >
                    <span className="font-medium whitespace-nowrap">
                      {order.id}
                    </span>
                    <span className="opacity-90 truncate">
                      {order.customerName}
                    </span>
                    <span className="opacity-80 truncate">
                      {order.productName}
                    </span>
                    <span className="font-medium text-right">
                      ₦{order.amount?.toLocaleString()}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium text-center ${
                        order.status === "Delivered"
                          ? "bg-green-500/20 text-green-400"
                          : order.status === "Processing"
                            ? "bg-blue-500/20 text-blue-400"
                            : order.status === "Shipped"
                              ? "bg-purple-500/20 text-purple-400"
                              : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {order.status}
                    </span>
                    <span className="opacity-60 text-right text-xs">
                      {order.date}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Recent Users */}
          <Card className="glass-card p-6 rounded-2xl border border-white/10">
            <h2 className="text-lg font-semibold mb-4">Recent Users</h2>
            {loading && (
              <p className="text-sm opacity-60 text-center py-4">
                Loading users...
              </p>
            )}
            {error && (
              <p className="text-sm text-red-400 text-center py-4">{error}</p>
            )}
            {!loading && !error && recentUsers.length === 0 && (
              <p className="text-sm opacity-60 text-center py-4">
                No recent users.
              </p>
            )}
            {!loading && !error && recentUsers.length > 0 && (
              <div className="space-y-3">
                {recentUsers.map((user: any, idx: number) => (
                  <div
                    key={user.guid}
                    className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#29b6d8]/20 text-[#29b6d8] flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{user.fullName}</p>
                        <p className="text-xs opacity-60">{user.email}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* ========== RECENT PRODUCTS (real data) ========== */}
        <Card className="glass-card p-6 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Products</h2>
            <Link
              href="/products"
              className="text-sm text-[#29b6d8] hover:underline"
            >
              View all
            </Link>
          </div>
          {loading && (
            <p className="text-sm opacity-60 text-center py-4">
              Loading products...
            </p>
          )}
          {error && (
            <p className="text-sm text-red-400 text-center py-4">{error}</p>
          )}
          {!loading && !error && recentProducts.length === 0 && (
            <p className="text-sm opacity-60 text-center py-4">
              No recent products.
            </p>
          )}
          {!loading && !error && recentProducts.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recentProducts.slice(0, 4).map((product: any, idx: number) => (
                <div
                  key={product.id || idx}
                  className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition text-sm"
                >
                  {product.images?.[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-32 object-cover rounded-lg mb-2"
                    />
                  )}
                  <p className="font-medium truncate">{product.name}</p>
                  <p className="text-xs opacity-60">
                    ₦{product.price?.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <style jsx>{`
        .dashboard-wrapper {
          background: linear-gradient(
            135deg,
            #0a2742 0%,
            #142f52 50%,
            #1e4b7c 100%
          );
          min-height: 100vh;
          color: #ffffff;
        }
        .dashboard-wrapper * {
          color: inherit;
        }
        .dashboard-wrapper .glass-card {
          background: rgba(255, 255, 255, 0.04) !important;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .dashboard-wrapper .animate-fadeIn {
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
      `}</style>
    </div>
  );
}