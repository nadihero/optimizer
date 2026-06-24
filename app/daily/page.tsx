"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import BottomNav from "@/app/components/BottomNav";
import TransactionCard from "@/app/components/TransactionCard";
import { useApp } from "@/app/context/AppContext";
import { formatRupiah, formatDateShort } from "@/app/lib/utils";

export default function DailyPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { transactions, loading } = useApp();
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];
    if (filter !== "all") filtered = filtered.filter((t) => t.type === filter);
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, filter]);

  const groupedTransactions = useMemo(() => {
    const groups: Record<string, typeof transactions> = {};
    filteredTransactions.forEach((tx) => {
      const dateKey = tx.date;
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(tx);
    });
    return groups;
  }, [filteredTransactions]);

  if (authLoading || loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime"></div></div>;
  if (!user) return null;

  return (
    <>
      <header className="px-5 pt-12 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => router.back()} className="w-10 h-10 glass-card flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-xl font-bold text-gray-100">Semua Transaksi</h1>
        </div>
        <div className="glass-card p-1 flex">
          <button onClick={() => setFilter("all")} className={`flex-1 py-2 rounded-full text-xs font-medium transition ${filter === "all" ? "text-white" : "text-gray-400"}`} style={filter === "all" ? { background: "var(--main-gradient)" } : {}}>Semua</button>
          <button onClick={() => setFilter("income")} className={`flex-1 py-2 rounded-full text-xs font-medium transition ${filter === "income" ? "text-white" : "text-gray-400"}`} style={filter === "income" ? { background: "var(--main-gradient)" } : {}}>Masuk</button>
          <button onClick={() => setFilter("expense")} className={`flex-1 py-2 rounded-full text-xs font-medium transition ${filter === "expense" ? "text-white" : "text-gray-400"}`} style={filter === "expense" ? { background: "var(--main-gradient)" } : {}}>Keluar</button>
        </div>
      </header>
      <main className="px-5 pb-28">
        {Object.keys(groupedTransactions).length === 0 ? (
          <div className="text-center py-16 text-gray-400"><p className="text-sm">Tidak ada transaksi</p></div>
        ) : (
          Object.entries(groupedTransactions).map(([date, txs]) => {
            const dayIncome = txs.filter((t) => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0);
            const dayExpense = txs.filter((t) => t.type === "expense").reduce((sum, t) => sum + Number(t.amount), 0);
            return (
              <div key={date} className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-semibold text-gray-100">{formatDateShort(date)}</h3>
                  <div className="flex gap-3">
                    {dayIncome > 0 && <span className="text-xs text-income">+{formatRupiah(dayIncome)}</span>}
                    {dayExpense > 0 && <span className="text-xs text-expense">-{formatRupiah(dayExpense)}</span>}
                  </div>
                </div>
                <div className="space-y-3">
                  {txs.map((tx) => (
                    <TransactionCard key={tx.id} id={tx.id} name={tx.description || tx.category} date={tx.date} amount={formatRupiah(Number(tx.amount))} type={tx.type} iconColor={tx.icon_color} />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </main>
      <BottomNav />
    </>
  );
}
