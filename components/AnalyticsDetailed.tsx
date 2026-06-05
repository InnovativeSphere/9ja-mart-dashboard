"use client";
import { useMemo, useState } from "react";
import { Card } from "@/components/Card";
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
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Store,
  ArrowUpRight,
  Download,
  Package,
  Layers,
} from "lucide-react";

/* ==================== MOCK DATA ==================== */
const monthlyRevenue = [
  { name: "Jan", revenue: 3200000, orders: 22 },
  { name: "Feb", revenue: 2800000, orders: 19 },
  { name: "Mar", revenue: 4100000, orders: 28 },
  { name: "Apr", revenue: 3800000, orders: 25 },
  { name: "May", revenue: 4500000, orders: 30 },
  { name: "Jun", revenue: 5100000, orders: 34 },
  { name: "Jul", revenue: 4900000, orders: 32 },
  { name: "Aug", revenue: 4300000, orders: 29 },
  { name: "Sep", revenue: 5200000, orders: 35 },
  { name: "Oct", revenue: 5800000, orders: 38 },
  { name: "Nov", revenue: 6100000, orders: 42 },
  { name: "Dec", revenue: 7200000, orders: 48 },
];

const categorySales = [
  { name: "Electronics", value: 32, color: "#29b6d8" },
  { name: "Fashion", value: 25, color: "#8b5cf6" },
  { name: "Home & Living", value: 18, color: "#f59e0b" },
  { name: "Beauty", value: 15, color: "#10b981" },
  { name: "Sports", value: 10, color: "#ef4444" },
];

const topProducts = [
  { name: "Wireless Earbuds", sales: 145, revenue: "₦1.8M" },
  { name: "Smart Watch", sales: 120, revenue: "₦4.2M" },
  { name: "Kitchen Blender", sales: 98, revenue: "₦1.6M" },
  { name: "Men's Running Shoes", sales: 85, revenue: "₦1.9M" },
  { name: "Face Moisturizer", sales: 200, revenue: "₦840K" },
];

/* ==================== COMPONENT ==================== */
export default function AnalyticsDetailed() {
  const [period, setPeriod] = useState<"yearly" | "monthly">("yearly");

  const totalRevenue = useMemo(() => monthlyRevenue.reduce((s, m) => s + m.revenue, 0), []);
  const totalOrders = useMemo(() => monthlyRevenue.reduce((s, m) => s + m.orders, 0), []);
  const avgOrderValue = useMemo(() => Math.round(totalRevenue / totalOrders), [totalRevenue, totalOrders]);

  // ---------- CSV Export ----------
  const exportCSV = () => {
    // Create CSV header
    const headers = ["Month", "Revenue (₦)", "Orders"];
    // Create rows from monthlyRevenue
    const rows = monthlyRevenue.map((m) => [m.name, m.revenue.toString(), m.orders.toString()]);
    // Combine header + rows
    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    // Create Blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `9jamart-analytics-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="analytics-detailed animate-fadeIn">
      {/* ========== HEADER + EXPORT ========== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Detailed Analytics</h1>
          <p className="text-sm opacity-60 mt-1">Deep dive into your platform performance.</p>
        </div>
        <div className="flex gap-2">
          {["yearly", "monthly"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p as "yearly" | "monthly")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                period === p ? "bg-white/20 text-white" : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#29b6d8] to-[#3ec8e6] text-white font-medium text-sm hover:scale-[1.02] transition"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* ========== STATS CARDS ========== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {[
          { label: "Total Revenue", value: `₦${(totalRevenue / 1000000).toFixed(1)}M`, icon: DollarSign, color: "text-[#29b6d8]", change: "+18%", positive: true },
          { label: "Total Orders", value: totalOrders, icon: ShoppingCart, color: "text-[#8b5cf6]", change: "+12%", positive: true },
          { label: "Avg. Order Value", value: `₦${avgOrderValue.toLocaleString()}`, icon: TrendingUp, color: "text-[#f59e0b]", change: "+5%", positive: true },
          { label: "Active Sellers", value: 56, icon: Store, color: "text-green-400", change: "+8%", positive: true },
          { label: "Active Buyers", value: 1124, icon: Users, color: "text-[#10b981]", change: "+22%", positive: true },
          { label: "Products", value: 248, icon: Package, color: "text-[#8b5cf6]", change: "+15%", positive: true },
        ].map((stat) => (
          <div key={stat.label} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-lg">
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
            <div>
              <p className="text-xs opacity-60">{stat.label}</p>
              <p className="text-lg font-bold">{stat.value}</p>
              <div className={`flex items-center text-xs ${stat.positive ? "text-green-400" : "text-red-400"}`}>
                {stat.positive ? <ArrowUpRight size={12} /> : <ArrowUpRight size={12} />}
                <span className="ml-1">{stat.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ========== CHARTS ROW 1 ========== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Line Chart */}
        <Card className="glass-card p-6 rounded-2xl border border-white/10">
          <h2 className="text-lg font-semibold mb-4">Revenue Trend</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "rgba(10,39,66,0.9)", border: "1px solid rgba(41,182,216,0.2)", borderRadius: "12px", color: "#fff" }} />
                <Line type="monotone" dataKey="revenue" stroke="#29b6d8" strokeWidth={2} dot={{ fill: "#29b6d8" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category Pie Chart */}
        <Card className="glass-card p-6 rounded-2xl border border-white/10">
          <h2 className="text-lg font-semibold mb-4">Sales by Category</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categorySales} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4}>
                  {categorySales.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "rgba(10,39,66,0.9)", border: "1px solid rgba(41,182,216,0.2)", borderRadius: "12px", color: "#fff" }} />
                <Legend verticalAlign="bottom" iconType="circle" formatter={(value: string) => <span className="text-sm text-white/80">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* ========== CHARTS ROW 2 ========== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Bar Chart */}
        <Card className="glass-card p-6 rounded-2xl border border-white/10">
          <h2 className="text-lg font-semibold mb-4">Monthly Revenue</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue}>
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "rgba(10,39,66,0.9)", border: "1px solid rgba(41,182,216,0.2)", borderRadius: "12px", color: "#fff" }} />
                <Bar dataKey="revenue" radius={[8, 8, 0, 0]}>
                  {monthlyRevenue.map((_, i) => (
                    <Cell key={i} fill={i >= monthlyRevenue.length - 3 ? "#29b6d8" : "rgba(41,182,216,0.3)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Orders Line Chart */}
        <Card className="glass-card p-6 rounded-2xl border border-white/10">
          <h2 className="text-lg font-semibold mb-4">Orders Trend</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "rgba(10,39,66,0.9)", border: "1px solid rgba(41,182,216,0.2)", borderRadius: "12px", color: "#fff" }} />
                <Line type="monotone" dataKey="orders" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: "#8b5cf6" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* ========== TOP PRODUCTS TABLE ========== */}
      <Card className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-lg font-semibold">Top Performing Products</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left opacity-60 text-xs uppercase tracking-wider">
                <th className="py-3 px-6 font-medium">#</th>
                <th className="py-3 px-6 font-medium">Product</th>
                <th className="py-3 px-6 font-medium">Units Sold</th>
                <th className="py-3 px-6 font-medium">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {topProducts.map((product, idx) => (
                <tr key={product.name} className="hover:bg-white/5 transition">
                  <td className="py-3 px-6">
                    <span className="w-6 h-6 rounded-full bg-[#29b6d8]/20 text-[#29b6d8] flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                  </td>
                  <td className="py-3 px-6 font-medium">{product.name}</td>
                  <td className="py-3 px-6 opacity-80">{product.sales}</td>
                  <td className="py-3 px-6 font-medium">{product.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ==================== SCOPED STYLES ==================== */}
      <style jsx>{`
        .analytics-detailed {
          padding: 1.5rem 1rem;
        }
        @media (min-width: 640px) {
          .analytics-detailed {
            padding: 1.5rem 2rem;
          }
        }
      `}</style>
    </div>
  );
}