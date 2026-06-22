"use client";

import Link from "next/link";
import Header from "./components/Header";
import SummaryCard from "./components/SummaryCard";
import TransactionCard from "./components/TransactionCard";
import BottomNav from "./components/BottomNav";
import { useApp } from "./context/AppContext";
import { formatRupiah } from "./lib/utils";

export default function Home() {
  const { transactions, loading } = useApp();

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const recentTransactions = transactions.slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark"></div>
      </div>
    );
  }

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
            <h3 className="text-lg font-bold text-dark">Transaksi Terbaru</h3>
            <Link href="/daily" className="text-sm text-grayText hover:text-dark transition">
              Show All
            </Link>
          </div>

          <div className="space-y-2">
            {recentTransactions.length === 0 ? (
              <div className="text-center py-10 text-grayText">
                <p className="text-sm">Belum ada transaksi</p>
                <Link href="/add" className="text-limeDark text-sm font-medium mt-2 inline-block">
                  + Tambah Transaksi
                </Link>
              </div>
            ) : (
              recentTransactions.map((tx) => (
                <TransactionCard
                  key={tx.id}
                  id={tx.id}
                  name={tx.description || tx.category}
                  date={tx.date}
                  amount={formatRupiah(Number(tx.amount))}
                  type={tx.type}
                  iconColor={tx.icon_color}
                />
              ))
            )}
          </div>
        </div>
      </main>

      <BottomNav />
    </>
  );
}
