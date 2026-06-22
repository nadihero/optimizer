"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/app/components/BottomNav";
import { useApp } from "@/app/context/AppContext";
import { getDaysRemaining, formatDateShort, formatRupiah } from "@/app/lib/utils";

interface Notification {
  id: string;
  type: "trial" | "subscription" | "debt" | "budget" | "goal";
  title: string;
  message: string;
  urgency: "high" | "medium" | "low";
  date: string;
}

export default function NotificationsPage() {
  const router = useRouter();
  const { trials, subscriptions, debts, budgets, goals } = useApp();

  const notifications: Notification[] = useMemo(() => {
    const notifs: Notification[] = [];

    trials.forEach((trial) => {
      const daysLeft = getDaysRemaining(trial.end_date);
      if (daysLeft <= 3 && daysLeft >= 0) {
        notifs.push({
          id: `trial-${trial.id}`,
          type: "trial",
          title: "Trial Hampir Habis",
          message: `${trial.name} berakhir dalam ${daysLeft} hari`,
          urgency: daysLeft <= 1 ? "high" : "medium",
          date: trial.end_date,
        });
      }
      if (trial.will_convert && daysLeft <= 3 && daysLeft >= 0) {
        notifs.push({
          id: `trial-convert-${trial.id}`,
          type: "trial",
          title: "Auto-Subscription",
          message: `${trial.name} akan berlangganan otomatis (${formatRupiah(trial.amount)})`,
          urgency: "high",
          date: trial.end_date,
        });
      }
    });

    subscriptions.forEach((sub) => {
      if (sub.next_billing) {
        const daysLeft = getDaysRemaining(sub.next_billing);
        if (daysLeft <= 3 && daysLeft >= 0) {
          notifs.push({
            id: `sub-${sub.id}`,
            type: "subscription",
            title: "Tagihan Segera",
            message: `${sub.name} - ${formatRupiah(sub.amount)} dalam ${daysLeft} hari`,
            urgency: daysLeft <= 1 ? "high" : "medium",
            date: sub.next_billing,
          });
        }
      }
    });

    debts.forEach((debt) => {
      const remaining = Number(debt.amount) - Number(debt.paid_amount);
      if (remaining <= 0) return;
      if (debt.due_date) {
        const daysLeft = getDaysRemaining(debt.due_date);
        if (daysLeft <= 7) {
          notifs.push({
            id: `debt-${debt.id}`,
            type: "debt",
            title: daysLeft < 0 ? "Hutang Jatuh Tempo" : "Hutang Segera Jatuh Tempo",
            message: `${debt.person} - ${formatRupiah(remaining)} ${daysLeft < 0 ? "sudah lewat" : `${daysLeft} hari lagi`}`,
            urgency: daysLeft < 0 ? "high" : daysLeft <= 3 ? "medium" : "low",
            date: debt.due_date,
          });
        }
      }
    });

    budgets.forEach((budget) => {
      const percentage = Number(budget.limit_amount) > 0 ? (Number(budget.spent_amount) / Number(budget.limit_amount)) * 100 : 0;
      if (percentage >= 90) {
        notifs.push({
          id: `budget-${budget.id}`,
          type: "budget",
          title: "Budget Hampir Habis",
          message: `${budget.category}: ${percentage.toFixed(0)}% terpakai`,
          urgency: percentage >= 100 ? "high" : "medium",
          date: new Date().toISOString(),
        });
      }
    });

    goals.forEach((goal) => {
      if (goal.deadline) {
        const daysLeft = getDaysRemaining(goal.deadline);
        const percentage = Number(goal.target_amount) > 0 ? (Number(goal.current_amount) / Number(goal.target_amount)) * 100 : 0;
        if (daysLeft <= 7 && percentage < 100) {
          notifs.push({
            id: `goal-${goal.id}`,
            type: "goal",
            title: "Goal Deadline Mendekat",
            message: `${goal.name}: ${percentage.toFixed(0)}% tercapai, ${daysLeft} hari lagi`,
            urgency: daysLeft <= 3 ? "high" : "medium",
            date: goal.deadline,
          });
        }
      }
    });

    return notifs.sort((a, b) => {
      const urgencyOrder = { high: 0, medium: 1, low: 2 };
      return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    });
  }, [trials, subscriptions, debts, budgets, goals]);

  const urgencyColors = {
    high: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
    medium: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800",
    low: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
  };

  const urgencyIcons = {
    high: "🔴",
    medium: "🟠",
    low: "🔵",
  };

  return (
    <>
      <header className="px-5 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="w-10 h-10 bg-grayLight dark:bg-darkCard rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-dark dark:text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-dark dark:text-gray-100">Notifikasi</h1>
        </div>
        {notifications.length > 0 && (
          <div className="mt-2">
            <span className="text-sm text-grayText dark:text-gray-400">{notifications.length} notifikasi</span>
          </div>
        )}
      </header>

      <main className="px-5 pb-28">
        {notifications.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-grayLight dark:bg-darkCard rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-grayText dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <p className="text-sm text-grayText dark:text-gray-400">Tidak ada notifikasi</p>
            <p className="text-xs text-grayText dark:text-gray-500 mt-1">Semua berjalan lancar!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div key={notif.id} className={`rounded-2xl p-4 border ${urgencyColors[notif.urgency]}`}>
                <div className="flex items-start gap-3">
                  <span className="text-lg">{urgencyIcons[notif.urgency]}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-dark dark:text-gray-100">{notif.title}</p>
                    <p className="text-xs text-grayText dark:text-gray-400 mt-0.5">{notif.message}</p>
                    <p className="text-[10px] text-grayText dark:text-gray-500 mt-2">{formatDateShort(notif.date)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </>
  );
}
