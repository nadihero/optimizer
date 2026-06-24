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
    await addGoal({ name, target_amount: Number(targetAmount.replace(/\./g, "")), current_amount: 0, icon: "🎯", color: "#725CFF", deadline });
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
          <div className="flex items-center gap-3"><button onClick={() => router.back()} className="w-10 h-10 glass-card flex items-center justify-center"><svg className="w-5 h-5 text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button><h1 className="text-xl font-bold text-gray-100">Goals</h1></div>
          <button onClick={() => { setShowForm(!showForm); setEditingId(null); setName(""); setTargetAmount(""); setDeadline(""); }} className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ background: "var(--main-gradient)" }}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m-7-7h14" /></svg></button>
        </div>
      </header>
      <main className="px-5 pb-28">
        {showForm && (
          <form onSubmit={(e) => { e.preventDefault(); editingId ? handleEditGoal(editingId) : handleAddGoal(e); }} className="glass-card p-5 mb-6">
            <h3 className="text-base font-bold text-gray-100 mb-4">{editingId ? "Edit Goal" : "Tambah Goal"}</h3>
            <div className="mb-4"><label className="text-sm text-gray-400 mb-2 block">Nama Goal</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Emergency Fund" className="w-full text-sm text-gray-100 py-2 bg-white/10 rounded-xl px-4 outline-none border border-white/10 focus:border-lime transition" required /></div>
            <div className="mb-4"><label className="text-sm text-gray-400 mb-2 block">Target Jumlah</label><input type="text" value={targetAmount} onChange={(e) => setTargetAmount(formatInputAmount(e.target.value))} placeholder="0" className="w-full text-sm text-gray-100 py-2 bg-white/10 rounded-xl px-4 outline-none border border-white/10 focus:border-lime transition" inputMode="numeric" required /></div>
            <div className="mb-4"><label className="text-sm text-gray-400 mb-2 block">Deadline (opsional)</label><input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full text-sm text-gray-100 py-2 bg-white/10 rounded-xl px-4 outline-none border border-white/10 focus:border-lime transition" /></div>
            <div className="flex gap-2"><button type="button" onClick={resetForm} className="flex-1 py-3 bg-white/10 rounded-xl font-medium text-gray-400 hover:bg-white/20 transition">Batal</button><button type="submit" className="flex-1 py-3 rounded-xl font-medium text-white" style={{ background: "var(--main-gradient)" }}>{editingId ? "Update" : "Simpan"}</button></div>
          </form>
        )}
        <div className="space-y-3">
          {goals.length === 0 ? (<div className="text-center py-16 text-gray-400"><p className="text-sm">Belum ada goal</p><p className="text-xs mt-1">Tap + untuk menambahkan</p></div>) : (
            goals.map((goal) => {
              const percentage = Number(goal.target_amount) > 0 ? (Number(goal.current_amount) / Number(goal.target_amount)) * 100 : 0;
              const daysLeft = goal.deadline ? getDaysRemaining(goal.deadline) : null;
              const isCompleted = percentage >= 100;
              return (
                <div key={goal.id} className="glass-card p-5 group">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{goal.icon}</span>
                    <div className="flex-1"><p className="text-sm font-semibold text-gray-100">{goal.name}</p>{daysLeft !== null && <p className="text-xs text-gray-400">{daysLeft > 0 ? `${daysLeft} hari lagi` : "Deadline terlewat"}</p>}</div>
                    <div className="flex items-center gap-2">
                      {isCompleted && <span className="text-xs font-medium px-2 py-1 rounded-full bg-income/20 text-income">Selesai!</span>}
                      <div className="hidden group-hover:flex gap-1">
                        <button onClick={() => startEdit(goal)} className="p-1 hover:bg-white/10 rounded-full"><svg className="w-4 h-4 text-iosBlue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                        <button onClick={() => { if (confirm("Hapus goal ini?")) deleteGoal(goal.id); }} className="p-1 hover:bg-red-500/20 rounded-full"><svg className="w-4 h-4 text-expense" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                      </div>
                    </div>
                  </div>
                  <div className="h-2.5 bg-white/10 rounded-full overflow-hidden mb-2"><div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(percentage, 100)}%`, background: isCompleted ? "#22C55E" : "var(--main-gradient)" }}></div></div>
                  <div className="flex justify-between items-center">
                    <div><span className="text-sm font-semibold text-gray-100">{formatRupiah(Number(goal.current_amount))}</span><span className="text-xs text-gray-400"> / {formatRupiah(Number(goal.target_amount))}</span></div>
                    <button onClick={() => setShowAddFund(showAddFund === goal.id ? null : goal.id)} className="text-xs font-medium px-3 py-1.5 rounded-full text-white" style={{ background: "var(--main-gradient)" }}>+ Tambah</button>
                  </div>
                  {showAddFund === goal.id && (<div className="mt-3 pt-3 border-t border-white/10"><div className="flex gap-2"><input type="text" value={fundAmount} onChange={(e) => setFundAmount(formatInputAmount(e.target.value))} placeholder="Jumlah" className="flex-1 text-sm text-gray-100 py-2 bg-white/10 rounded-xl px-4 outline-none border border-white/10 focus:border-lime transition" inputMode="numeric" /><button onClick={() => handleAddFund(goal.id)} className="px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ background: "var(--main-gradient)" }}>OK</button></div></div>)}
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
