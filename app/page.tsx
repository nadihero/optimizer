"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Header from "@/app/components/Header";
import SummaryCard from "@/app/components/SummaryCard";
import TransactionCard from "@/app/components/TransactionCard";
import BottomNav from "@/app/components/BottomNav";
import { useApp } from "@/app/context/AppContext";
import { formatRupiah } from "@/app/lib/utils";

export default function Home() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { transactions, loading } = useApp();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime"></div>
      </div>
    );
  }

  if (!user) return null;

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + Number(t.amount), 0);
  const recentTransactions = transactions.slice(0, 5);

  return (
    <>
      <Header />
      <main className="px-5 pb-28">
        <div className="grid grid-cols-2 gap-3 mb-6 mt-5">
          <SummaryCard type="income" amount={formatRupiah(totalIncome)} />
          <SummaryCard type="expense" amount={formatRupiah(totalExpense)} />
        </div>
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-dark dark:text-gray-100">Transaksi Terbaru</h3>
            <a href="/daily" className="text-sm text-grayText hover:text-dark dark:hover:text-gray-100 transition">Show All</a>
          </div>
          <div className="space-y-2">
            {recentTransactions.length === 0 ? (
              <div className="text-center py-10 text-grayText dark:text-gray-400">
                <p className="text-sm">Belum ada transaksi</p>
                <a href="/add" className="text-limeDark text-sm font-medium mt-2 inline-block">+ Tambah Transaksi</a>
              </div>
            ) : (
              recentTransactions.map((tx) => (
                <TransactionCard key={tx.id} id={tx.id} name={tx.description || tx.category} date={tx.date} amount={formatRupiah(Number(tx.amount))} type={tx.type} iconColor={tx.icon_color} />
              ))
            )}
          </div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
