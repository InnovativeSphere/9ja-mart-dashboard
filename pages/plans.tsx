"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "@/components/Card";
import { Layers, Eye, Edit, Plus } from "lucide-react";
import PlanViewModal from "@/components/PlanViewModal";
import PlanFormModal from "@/components/PlanFormModal";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchPlans, addPlan, editPlan } from "../redux/slices/plansSlice";

export default function PlansPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector((state: RootState) => state.plans);

  const [viewPlan, setViewPlan] = useState<any>(null);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch]);

  const handleSave = (plan: any) => {
    if (plan.originalPlan !== undefined) {
      dispatch(
        editPlan({
          plan: plan.originalPlan,
          billingInterval: plan.originalBillingInterval,
          updates: {
            displayName: plan.displayName,
            price: plan.price,
            currency: plan.currency,
            isAvailable: plan.isAvailable,
            sortOrder: plan.sortOrder,
            entitlements: plan.entitlements,
            featureSummary: plan.featureSummary,
          },
        })
      );
    } else {
      dispatch(addPlan(plan));
    }
    setEditingPlan(null);
    setShowCreate(false);
  };

  return (
    <div className="plans-wrapper">
      <div className="px-2 sm:px-4 py-6 space-y-8 animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Plans</h1>
            <p className="text-sm opacity-60 mt-1">
              Manage subscription plans — {items.length} plans.
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-linear-to-r from-[#29b6d8] to-[#3ec8e6] text-white font-medium text-sm hover:scale-[1.02] transition"
          >
            <Plus size={16} />
            Add Plan
          </button>
        </div>

        <Card className="glass-card rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left opacity-60 text-xs uppercase tracking-wider">
                  <th className="py-3 px-4 font-medium">Display Name</th>
                  <th className="py-3 px-4 font-medium">Plan</th>
                  <th className="py-3 px-4 font-medium">Billing</th>
                  <th className="py-3 px-4 font-medium">Price</th>
                  <th className="py-3 px-4 font-medium">Available</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center opacity-60">
                      Loading plans...
                    </td>
                  </tr>
                )}
                {error && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-red-400">
                      {error}
                    </td>
                  </tr>
                )}
                {!loading &&
                  !error &&
                  items.map((plan) => (
                    <tr key={plan.id} className="hover:bg-white/5 transition">
                      <td className="py-3 px-4 font-medium">{plan.displayName}</td>
                      {/* ✅ Display the string directly – no number mapping */}
                      <td className="py-3 px-4 opacity-80 capitalize">
                        {plan.plan}
                      </td>
                      <td className="py-3 px-4 opacity-80 capitalize">
                        {plan.billingInterval}
                      </td>
                      <td className="py-3 px-4 font-medium">
                        {plan.currency} {plan.price.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            plan.isAvailable
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {plan.isAvailable ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setViewPlan(plan)}
                            className="p-1.5 rounded-md hover:bg-white/10 transition opacity-70 hover:opacity-100"
                            title="View"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => setEditingPlan(plan)}
                            className="p-1.5 rounded-md hover:bg-white/10 transition opacity-70 hover:opacity-100"
                            title="Edit"
                          >
                            <Edit size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                {!loading && !error && items.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center opacity-50">
                      No plans found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <PlanViewModal plan={viewPlan} onClose={() => setViewPlan(null)} />
      {(editingPlan || showCreate) && (
        <PlanFormModal
          plan={editingPlan}
          onClose={() => {
            setEditingPlan(null);
            setShowCreate(false);
          }}
          onSave={handleSave}
        />
      )}

      <style jsx>{`
        .plans-wrapper {
          background: linear-gradient(135deg, #0a2742 0%, #142f52 50%, #1e4b7c 100%);
          min-height: 100vh;
          color: #ffffff;
        }
        .plans-wrapper * {
          color: inherit;
        }
        .plans-wrapper .glass-card {
          background: rgba(255, 255, 255, 0.04) !important;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .plans-wrapper .animate-fadeIn {
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