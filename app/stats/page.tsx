"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import BottomNav from "@/app/components/BottomNav";
import { useApp } from "@/app/context/AppContext";
import { formatRupiah } from "@/app/lib/utils";

export default function StatsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { transactions, loading } = useApp();
  const [period, setPeriod] = useState<"week" | "month">("month");

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    return transactions.filter((t) => {
      const txDate = new Date(t.date);
      if (period === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return txDate >= weekAgo;
      }
      return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
    });
  }, [transactions, period]);

  const totalIncome = filteredTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpense = filteredTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + Number(t.amount), 0);
  const balance = totalIncome - totalExpense;

  const categoryStats = useMemo(() => {
    const expenses = filteredTransactions.filter((t) => t.type === "expense");
    const categoryMap: Record<string, number> = {};
    expenses.forEach((t) => {
      const cat = t.category || "Lainnya";
      categoryMap[cat] = (categoryMap[cat] || 0) + Number(t.amount);
    });
    return Object.entries(categoryMap).map(([name, amount]) => ({ name, amount })).sort((a, b) => b.amount - a.amount);
  }, [filteredTransactions]);

  const maxCategoryAmount = categoryStats.length > 0 ? categoryStats[0].amount : 1;
  const categoryColors = ["#EF4444", "#3B82F6", "#F59E0B", "#22C55E", "#AF52DE", "#FF9500", "#007AFF", "#FF3B30"];

  if (authLoading || loading) {
    return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime"></div></div>;
  }

  if (!user) return null;

  return (
    <>
      <header className="px-5 pt-12 pb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-dark dark:text-gray-100">Statistik</h1>
          <div className="flex bg-grayLight dark:bg-darkCard rounded-full p-1">
            <button onClick={() => setPeriod("week")} className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${period === "week" ? "bg-white dark:bg-dark shadow-sm text-dark dark:text-gray-100" : "text-grayText"}`}>Minggu</button>
            <button onClick={() => setPeriod("month")} className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${period === "month" ? "bg-white dark:bg-dark shadow-sm text-dark dark:text-gray-100" : "text-grayText"}`}>Bulan</button>
          </div>
        </div>
      </header>
      <main className="px-5 pb-28">
        <div className="bg-white dark:bg-darkCard rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none dark:border dark:border-gray-700 mb-6">
          <p className="text-sm text-grayText dark:text-gray-400 mb-1">Saldo</p>
          <p className="text-2xl font-bold text-dark dark:text-gray-100 mb-4">{formatRupiah(balance)}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 rounded-full bg-income"></div><span className="text-xs text-grayText dark:text-gray-400">Pemasukan</span></div>
              <p className="text-sm font-semibold text-income">{formatRupiah(totalIncome)}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 rounded-full bg-expense"></div><span className="text-xs text-grayText dark:text-gray-400">Pengeluaran</span></div>
              <p className="text-sm font-semibold text-expense">{formatRupiah(totalExpense)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-darkCard rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none dark:border dark:border-gray-700">
          <h3 className="text-base font-bold text-dark dark:text-gray-100 mb-4">Pengeluaran per Kategori</h3>
          {categoryStats.length === 0 ? (
            <p className="text-sm text-grayText dark:text-gray-400 text-center py-4">Belum ada data pengeluaran</p>
          ) : (
            <div className="space-y-3">
              {categoryStats.map((cat, idx) => {
                const percentage = totalExpense > 0 ? (cat.amount / totalExpense) * 100 : 0;
                const barWidth = (cat.amount / maxCategoryAmount) * 100;
                return (
                  <div key={cat.name}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: categoryColors[idx % categoryColors.length] }}></div><span className="text-sm text-dark dark:text-gray-100">{cat.name}</span></div>
                      <div className="text-right"><span className="text-sm font-medium text-dark dark:text-gray-100">{formatRupiah(cat.amount)}</span><span className="text-xs text-grayText dark:text-gray-400 ml-2">{percentage.toFixed(0)}%</span></div>
                    </div>
                    <div className="h-2 bg-grayLight dark:bg-dark rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-500" style={{ width: `${barWidth}%`, backgroundColor: categoryColors[idx % categoryColors.length] }}></div></div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="bg-white dark:bg-darkCard rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none dark:border dark:border-gray-700 mt-6">
          <h3 className="text-base font-bold text-dark dark:text-gray-100 mb-4">Ringkasan</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center"><span className="text-sm text-grayText dark:text-gray-400">Total Transaksi</span><span className="text-sm font-medium text-dark dark:text-gray-100">{filteredTransactions.length}</span></div>
            <div className="flex justify-between items-center"><span className="text-sm text-grayText dark:text-gray-400">Rata-rata per Transaksi</span><span className="text-sm font-medium text-dark dark:text-gray-100">{formatRupiah(filteredTransactions.length > 0 ? totalExpense / filteredTransactions.filter((t) => t.type === "expense").length : 0)}</span></div>
            <div className="flex justify-between items-center"><span className="text-sm text-grayText dark:text-gray-400">Transaksi Terbesar</span><span className="text-sm font-medium text-dark dark:text-gray-100">{formatRupiah(filteredTransactions.length > 0 ? Math.max(...filteredTransactions.map((t) => Number(t.amount))) : 0)}</span></div>
          </div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
