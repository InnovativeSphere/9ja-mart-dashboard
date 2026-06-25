"use client";
import { useEffect } from "react";
import { X } from "lucide-react";

interface Props {
  isOpen: boolean;
  history: any[];
  customerName: string;
  onClose: () => void;
}

const STATUS_STYLES: Record<string, string> = {
  Active: "bg-green-500/20 text-green-400",
  PastDue: "bg-red-500/20 text-red-400",
  Cancelled: "bg-yellow-500/20 text-yellow-400",
  Expired: "bg-orange-500/20 text-orange-400",
  PendingPayment: "bg-blue-500/20 text-blue-400",
  ChangeScheduled: "bg-purple-500/20 text-purple-400",
  None: "bg-white/10 text-white/70",
};

export default function SubscriptionHistoryModal({
  isOpen,
  history,
  customerName,
  onClose,
}: Props) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.startDate || b.createdAt || 0).getTime() - new Date(a.startDate || a.createdAt || 0).getTime()
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="text-xl font-bold">Subscription History</h2>
          <button onClick={onClose} className="modal-close-btn">
            <X size={20} />
          </button>
        </div>
        <div className="text-sm text-white/70 mb-3">
          Customer: <span className="font-semibold text-white/90">{customerName}</span>
        </div>
        <div className="history-table-wrapper">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/60 border-b border-white/10">
                <th className="py-1.5 px-2 text-left text-xs font-medium uppercase tracking-wider">Plan</th>
                <th className="py-1.5 px-2 text-left text-xs font-medium uppercase tracking-wider">Interval</th>
                <th className="py-1.5 px-2 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="py-1.5 px-2 text-left text-xs font-medium uppercase tracking-wider hidden sm:table-cell">Start</th>
                <th className="py-1.5 px-2 text-left text-xs font-medium uppercase tracking-wider hidden sm:table-cell">End</th>
              </tr>
            </thead>
            <tbody>
              {sortedHistory.map((item, idx) => {
                const status = item.status || item.subscriptionStatus || "None";
                const statusClass = STATUS_STYLES[status] || STATUS_STYLES.None;
                return (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-1.5 px-2 font-medium">{item.plan || item.subscriptionPlan || "—"}</td>
                    <td className="py-1.5 px-2 opacity-80">{item.billingInterval || "—"}</td>
                    <td className="py-1.5 px-2">
                      <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${statusClass}`}>
                        {status}
                      </span>
                    </td>
                    <td className="py-1.5 px-2 opacity-70 text-xs hidden sm:table-cell">
                      {item.startDate ? new Date(item.startDate).toLocaleDateString() : "—"}
                    </td>
                    <td className="py-1.5 px-2 opacity-70 text-xs hidden sm:table-cell">
                      {item.endDate ? new Date(item.endDate).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                );
              })}
              {sortedHistory.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center opacity-60 text-sm">
                    No history available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 200;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }
        .modal-card {
          width: 100%;
          max-width: 650px;
          background: rgba(10, 39, 66, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(41, 182, 216, 0.2);
          border-radius: 24px;
          padding: 1.4rem 1.6rem;
          animation: pop 0.25s ease;
          max-height: 85vh;
          overflow-y: auto;
        }
        @keyframes pop {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .modal-close-btn {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          transition: color 0.2s;
          padding: 4px;
        }
        .modal-close-btn:hover {
          color: #fff;
        }
        .history-table-wrapper {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          padding: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.05);
          max-height: 60vh;
          overflow-y: auto;
        }
        /* scrollbar styling */
        .history-table-wrapper::-webkit-scrollbar {
          width: 4px;
        }
        .history-table-wrapper::-webkit-scrollbar-track {
          background: transparent;
        }
        .history-table-wrapper::-webkit-scrollbar-thumb {
          background: rgba(41, 182, 216, 0.4);
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}