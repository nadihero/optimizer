"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/app/components/BottomNav";
import { useApp } from "@/app/context/AppContext";
import { formatRupiah } from "@/app/lib/utils";

export default function BudgetPage() {
  const router = useRouter();
  const { budgets, loading, addBudget } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState("");
  const [limitAmount, setLimitAmount] = useState("");
  const [period, setPeriod] = useState<"weekly" | "monthly">("monthly");

  const totalBudget = budgets.reduce((sum, b) => sum + Number(b.limit_amount), 0);
  const totalSpent = budgets.reduce((sum, b) => sum + Number(b.spent_amount), 0);

  const handleAddBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !limitAmount) return;

    await addBudget({
      category,
      limit_amount: Number(limitAmount.replace(/\./g, "")),
      spent_amount: 0,
      period,
      icon: "📊",
      color: "#D4F53C",
    });
    setShowForm(false);
    setCategory("");
    setLimitAmount("");
  };

  const formatInputAmount = (value: string) => {
    const num = value.replace(/\D/g, "");
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark"></div>
      </div>
    );
  }

  return (
    <>
      <header className="px-5 pt-12 pb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-dark">Budget</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-10 h-10 bg-lime rounded-full flex items-center justify-center hover:bg-limeDark transition"
          >
            <svg className="w-5 h-5 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m-7-7h14" />
            </svg>
          </button>
        </div>
      </header>

      <main className="px-5 pb-28">
        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] mb-6">
          <p className="text-sm text-grayText mb-1">Total Budget</p>
          <p className="text-2xl font-bold text-dark">{formatRupiah(totalBudget)}</p>
          <div className="mt-3 h-2 bg-grayLight rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-lime transition-all duration-500"
              style={{ width: `${totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-grayText">Terpakai: {formatRupiah(totalSpent)}</span>
            <span className="text-xs text-grayText">{totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(0) : 0}%</span>
          </div>
        </div>

        {showForm && (
          <form onSubmit={handleAddBudget} className="bg-white rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] mb-6">
            <h3 className="text-base font-bold text-dark mb-4">Tambah Budget</h3>
            <div className="mb-4">
              <label className="text-sm text-grayText mb-2 block">Kategori</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Contoh: Makanan"
                className="w-full text-sm text-dark py-2 bg-grayLight rounded-xl px-4 outline-none focus:ring-2 focus:ring-lime transition"
                required
              />
            </div>
            <div className="mb-4">
              <label className="text-sm text-grayText mb-2 block">Limit</label>
              <input
                type="text"
                value={limitAmount}
                onChange={(e) => setLimitAmount(formatInputAmount(e.target.value))}
                placeholder="0"
                className="w-full text-sm text-dark py-2 bg-grayLight rounded-xl px-4 outline-none focus:ring-2 focus:ring-lime transition"
                inputMode="numeric"
                required
              />
            </div>
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => setPeriod("weekly")}
                className={`flex-1 py-2 rounded-xl text-xs font-medium transition ${period === "weekly" ? "bg-lime text-dark" : "bg-grayLight text-grayText"}`}
              >
                Mingguan
              </button>
              <button
                type="button"
                onClick={() => setPeriod("monthly")}
                className={`flex-1 py-2 rounded-xl text-xs font-medium transition ${period === "monthly" ? "bg-lime text-dark" : "bg-grayLight text-grayText"}`}
              >
                Bulanan
              </button>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 py-3 bg-grayLight rounded-xl font-medium text-grayText hover:bg-grayMid transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-lime rounded-xl font-medium text-dark hover:bg-limeDark transition"
              >
                Simpan
              </button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {budgets.length === 0 ? (
            <div className="text-center py-10 text-grayText">
              <p className="text-sm">Belum ada budget</p>
              <p className="text-xs mt-1">Tap + untuk menambahkan</p>
            </div>
          ) : (
            budgets.map((budget) => {
              const percentage = Number(budget.limit_amount) > 0 ? (Number(budget.spent_amount) / Number(budget.limit_amount)) * 100 : 0;
              const isOver = percentage > 100;
              const remaining = Number(budget.limit_amount) - Number(budget.spent_amount);
              return (
                <div key={budget.id} className="bg-white rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{budget.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-dark">{budget.category}</p>
                        <p className="text-xs text-grayText">{budget.period === "weekly" ? "Mingguan" : "Bulanan"}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${isOver ? "bg-red-100 text-expense" : "bg-green-100 text-income"}`}>
                      {isOver ? "Over" : `${(100 - percentage).toFixed(0)}% left`}
                    </span>
                  </div>
                  <div className="h-2 bg-grayLight rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${isOver ? "bg-expense" : percentage > 75 ? "bg-warning" : "bg-lime"}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-grayText">{formatRupiah(Number(budget.spent_amount))}</span>
                    <span className="text-xs text-grayText">{formatRupiah(Number(budget.limit_amount))}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      <BottomNav />
    </>
  );
}
