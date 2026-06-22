"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/app/components/BottomNav";
import { useApp } from "@/app/context/AppContext";
import { formatRupiah, getDaysRemaining } from "@/app/lib/utils";

export default function GoalsPage() {
  const router = useRouter();
  const { goals, loading, addGoal, addToGoal } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [showAddFund, setShowAddFund] = useState<string | null>(null);
  const [fundAmount, setFundAmount] = useState("");
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount) return;

    await addGoal({
      name,
      target_amount: Number(targetAmount.replace(/\./g, "")),
      current_amount: 0,
      icon: "🎯",
      color: "#3B82F6",
      deadline,
    });
    setShowForm(false);
    setName("");
    setTargetAmount("");
    setDeadline("");
  };

  const handleAddFund = async (goalId: string) => {
    if (!fundAmount) return;
    await addToGoal(goalId, Number(fundAmount.replace(/\./g, "")));
    setShowAddFund(null);
    setFundAmount("");
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
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="w-10 h-10 bg-grayLight rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-dark">Goals</h1>
          </div>
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
        {showForm && (
          <form onSubmit={handleAddGoal} className="bg-white rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] mb-6">
            <h3 className="text-base font-bold text-dark mb-4">Tambah Goal</h3>
            <div className="mb-4">
              <label className="text-sm text-grayText mb-2 block">Nama Goal</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Emergency Fund"
                className="w-full text-sm text-dark py-2 bg-grayLight rounded-xl px-4 outline-none focus:ring-2 focus:ring-lime transition"
                required
              />
            </div>
            <div className="mb-4">
              <label className="text-sm text-grayText mb-2 block">Target Jumlah</label>
              <input
                type="text"
                value={targetAmount}
                onChange={(e) => setTargetAmount(formatInputAmount(e.target.value))}
                placeholder="0"
                className="w-full text-sm text-dark py-2 bg-grayLight rounded-xl px-4 outline-none focus:ring-2 focus:ring-lime transition"
                inputMode="numeric"
                required
              />
            </div>
            <div className="mb-4">
              <label className="text-sm text-grayText mb-2 block">Deadline (opsional)</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full text-sm text-dark py-2 bg-grayLight rounded-xl px-4 outline-none focus:ring-2 focus:ring-lime transition"
              />
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
          {goals.length === 0 ? (
            <div className="text-center py-16 text-grayText">
              <p className="text-sm">Belum ada goal</p>
              <p className="text-xs mt-1">Tap + untuk menambahkan</p>
            </div>
          ) : (
            goals.map((goal) => {
              const percentage = Number(goal.target_amount) > 0 ? (Number(goal.current_amount) / Number(goal.target_amount)) * 100 : 0;
              const daysLeft = goal.deadline ? getDaysRemaining(goal.deadline) : null;
              const isCompleted = percentage >= 100;
              return (
                <div key={goal.id} className="bg-white rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{goal.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-dark">{goal.name}</p>
                      {daysLeft !== null && (
                        <p className="text-xs text-grayText">{daysLeft > 0 ? `${daysLeft} hari lagi` : "Deadline terlewat"}</p>
                      )}
                    </div>
                    {isCompleted && (
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-income">Selesai!</span>
                    )}
                  </div>
                  <div className="h-2.5 bg-grayLight rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(percentage, 100)}%`, backgroundColor: isCompleted ? "#22C55E" : goal.color }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm font-semibold text-dark">{formatRupiah(Number(goal.current_amount))}</span>
                      <span className="text-xs text-grayText"> / {formatRupiah(Number(goal.target_amount))}</span>
                    </div>
                    <button
                      onClick={() => setShowAddFund(showAddFund === goal.id ? null : goal.id)}
                      className="text-xs font-medium px-3 py-1.5 bg-lime/20 text-limeDark rounded-full hover:bg-lime/40 transition"
                    >
                      + Tambah
                    </button>
                  </div>
                  {showAddFund === goal.id && (
                    <div className="mt-3 pt-3 border-t border-grayMid">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={fundAmount}
                          onChange={(e) => setFundAmount(formatInputAmount(e.target.value))}
                          placeholder="Jumlah"
                          className="flex-1 text-sm text-dark py-2 bg-grayLight rounded-xl px-4 outline-none focus:ring-2 focus:ring-lime transition"
                          inputMode="numeric"
                        />
                        <button
                          onClick={() => handleAddFund(goal.id)}
                          className="px-4 py-2 bg-lime rounded-xl text-sm font-medium text-dark hover:bg-limeDark transition"
                        >
                          OK
                        </button>
                      </div>
                    </div>
                  )}
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
