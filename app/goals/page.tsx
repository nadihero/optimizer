"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import BottomNav from "@/app/components/BottomNav";
import { useApp } from "@/app/context/AppContext";
import { formatRupiah, getDaysRemaining } from "@/app/lib/utils";

export default function GoalsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { goals, loading, addGoal, updateGoal, deleteGoal, addToGoal } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddFund, setShowAddFund] = useState<string | null>(null);
  const [fundAmount, setFundAmount] = useState("");
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount) return;
    await addGoal({ name, target_amount: Number(targetAmount.replace(/\./g, "")), current_amount: 0, icon: "🎯", color: "#3B82F6", deadline });
    resetForm();
  };

  const handleEditGoal = async (id: string) => {
    if (!name || !targetAmount) return;
    await updateGoal(id, { name, target_amount: Number(targetAmount.replace(/\./g, "")), deadline });
    resetForm();
  };

  const resetForm = () => { setShowForm(false); setEditingId(null); setName(""); setTargetAmount(""); setDeadline(""); };
  const startEdit = (goal: typeof goals[0]) => { setEditingId(goal.id); setShowForm(true); setName(goal.name); setTargetAmount(String(goal.target_amount).replace(/\B(?=(\d{3})+(?!\d))/g, ".")); setDeadline(goal.deadline); };

  const handleAddFund = async (goalId: string) => {
    if (!fundAmount) return;
    await addToGoal(goalId, Number(fundAmount.replace(/\./g, "")));
    setShowAddFund(null);
    setFundAmount("");
  };

  const formatInputAmount = (value: string) => { const num = value.replace(/\D/g, ""); return num.replace(/\B(?=(\d{3})+(?!\d))/g, "."); };

  if (authLoading || loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime"></div></div>;
  if (!user) return null;

  return (
    <>
      <header className="px-5 pt-12 pb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3"><button onClick={() => router.back()} className="w-10 h-10 bg-grayLight dark:bg-darkCard rounded-full flex items-center justify-center"><svg className="w-5 h-5 text-dark dark:text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button><h1 className="text-xl font-bold text-dark dark:text-gray-100">Goals</h1></div>
          <button onClick={() => { setShowForm(!showForm); setEditingId(null); setName(""); setTargetAmount(""); setDeadline(""); }} className="w-10 h-10 bg-lime rounded-full flex items-center justify-center hover:bg-limeDark transition"><svg className="w-5 h-5 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m-7-7h14" /></svg></button>
        </div>
      </header>
      <main className="px-5 pb-28">
        {showForm && (
          <form onSubmit={(e) => { e.preventDefault(); editingId ? handleEditGoal(editingId) : handleAddGoal(e); }} className="bg-white dark:bg-darkCard rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none dark:border dark:border-gray-700 mb-6">
            <h3 className="text-base font-bold text-dark dark:text-gray-100 mb-4">{editingId ? "Edit Goal" : "Tambah Goal"}</h3>
            <div className="mb-4"><label className="text-sm text-grayText dark:text-gray-400 mb-2 block">Nama Goal</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Emergency Fund" className="w-full text-sm text-dark dark:text-gray-100 py-2 bg-grayLight dark:bg-dark rounded-xl px-4 outline-none focus:ring-2 focus:ring-lime transition" required /></div>
            <div className="mb-4"><label className="text-sm text-grayText dark:text-gray-400 mb-2 block">Target Jumlah</label><input type="text" value={targetAmount} onChange={(e) => setTargetAmount(formatInputAmount(e.target.value))} placeholder="0" className="w-full text-sm text-dark dark:text-gray-100 py-2 bg-grayLight dark:bg-dark rounded-xl px-4 outline-none focus:ring-2 focus:ring-lime transition" inputMode="numeric" required /></div>
            <div className="mb-4"><label className="text-sm text-grayText dark:text-gray-400 mb-2 block">Deadline (opsional)</label><input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full text-sm text-dark dark:text-gray-100 py-2 bg-grayLight dark:bg-dark rounded-xl px-4 outline-none focus:ring-2 focus:ring-lime transition" /></div>
            <div className="flex gap-2"><button type="button" onClick={resetForm} className="flex-1 py-3 bg-grayLight dark:bg-dark rounded-xl font-medium text-grayText hover:bg-grayMid dark:hover:bg-gray-700 transition">Batal</button><button type="submit" className="flex-1 py-3 bg-lime rounded-xl font-medium text-dark hover:bg-limeDark transition">{editingId ? "Update" : "Simpan"}</button></div>
          </form>
        )}
        <div className="space-y-3">
          {goals.length === 0 ? (<div className="text-center py-16 text-grayText dark:text-gray-400"><p className="text-sm">Belum ada goal</p><p className="text-xs mt-1">Tap + untuk menambahkan</p></div>) : (
            goals.map((goal) => {
              const percentage = Number(goal.target_amount) > 0 ? (Number(goal.current_amount) / Number(goal.target_amount)) * 100 : 0;
              const daysLeft = goal.deadline ? getDaysRemaining(goal.deadline) : null;
              const isCompleted = percentage >= 100;
              return (
                <div key={goal.id} className="bg-white dark:bg-darkCard rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none dark:border dark:border-gray-700 group">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{goal.icon}</span>
                    <div className="flex-1"><p className="text-sm font-semibold text-dark dark:text-gray-100">{goal.name}</p>{daysLeft !== null && <p className="text-xs text-grayText dark:text-gray-400">{daysLeft > 0 ? `${daysLeft} hari lagi` : "Deadline terlewat"}</p>}</div>
                    <div className="flex items-center gap-2">
                      {isCompleted && <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/20 text-income">Selesai!</span>}
                      <div className="hidden group-hover:flex gap-1">
                        <button onClick={() => startEdit(goal)} className="p-1 hover:bg-grayLight dark:hover:bg-gray-700 rounded-full"><svg className="w-4 h-4 text-iosBlue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                        <button onClick={() => { if (confirm("Hapus goal ini?")) deleteGoal(goal.id); }} className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"><svg className="w-4 h-4 text-expense" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                      </div>
                    </div>
                  </div>
                  <div className="h-2.5 bg-grayLight dark:bg-dark rounded-full overflow-hidden mb-2"><div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(percentage, 100)}%`, backgroundColor: isCompleted ? "#22C55E" : goal.color }}></div></div>
                  <div className="flex justify-between items-center">
                    <div><span className="text-sm font-semibold text-dark dark:text-gray-100">{formatRupiah(Number(goal.current_amount))}</span><span className="text-xs text-grayText dark:text-gray-400"> / {formatRupiah(Number(goal.target_amount))}</span></div>
                    <button onClick={() => setShowAddFund(showAddFund === goal.id ? null : goal.id)} className="text-xs font-medium px-3 py-1.5 bg-lime/20 text-limeDark rounded-full hover:bg-lime/40 transition">+ Tambah</button>
                  </div>
                  {showAddFund === goal.id && (<div className="mt-3 pt-3 border-t border-grayMid dark:border-gray-700"><div className="flex gap-2"><input type="text" value={fundAmount} onChange={(e) => setFundAmount(formatInputAmount(e.target.value))} placeholder="Jumlah" className="flex-1 text-sm text-dark dark:text-gray-100 py-2 bg-grayLight dark:bg-dark rounded-xl px-4 outline-none focus:ring-2 focus:ring-lime transition" inputMode="numeric" /><button onClick={() => handleAddFund(goal.id)} className="px-4 py-2 bg-lime rounded-xl text-sm font-medium text-dark hover:bg-limeDark transition">OK</button></div></div>)}
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
