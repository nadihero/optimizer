"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import BottomNav from "@/app/components/BottomNav";
import { useApp } from "@/app/context/AppContext";
import { formatRupiah, getDaysRemaining, formatDateShort } from "@/app/lib/utils";

export default function TrialsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { trials, loading, addTrial, updateTrial, deleteTrial } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [willConvert, setWillConvert] = useState(false);
  const [amount, setAmount] = useState("");

  useEffect(() => { if (!authLoading && !user) router.push("/login"); }, [user, authLoading, router]);

  const handleAddTrial = async (e: React.FormEvent) => { e.preventDefault(); if (!name || !endDate) return; await addTrial({ name, start_date: startDate || new Date().toISOString().split("T")[0], end_date: endDate, will_convert: willConvert, amount: Number(amount.replace(/\./g, "")) || 0, icon: "⚡", color: "#F59E0B" }); resetForm(); };
  const handleEditTrial = async (id: string) => { if (!name || !endDate) return; await updateTrial(id, { name, start_date: startDate || new Date().toISOString().split("T")[0], end_date: endDate, will_convert: willConvert, amount: Number(amount.replace(/\./g, "")) || 0 }); resetForm(); };
  const resetForm = () => { setShowForm(false); setEditingId(null); setName(""); setStartDate(""); setEndDate(""); setWillConvert(false); setAmount(""); };
  const startEdit = (trial: typeof trials[0]) => { setEditingId(trial.id); setShowForm(true); setName(trial.name); setStartDate(trial.start_date); setEndDate(trial.end_date); setWillConvert(trial.will_convert); setAmount(String(trial.amount).replace(/\B(?=(\d{3})+(?!\d))/g, ".")); };
  const formatInputAmount = (value: string) => { const num = value.replace(/\D/g, ""); return num.replace(/\B(?=(\d{3})+(?!\d))/g, "."); };

  if (authLoading || loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime"></div></div>;
  if (!user) return null;

  return (
    <>
      <header className="px-5 pt-12 pb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3"><button onClick={() => router.back()} className="w-10 h-10 bg-grayLight dark:bg-darkCard rounded-full flex items-center justify-center"><svg className="w-5 h-5 text-dark dark:text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button><h1 className="text-xl font-bold text-dark dark:text-gray-100">Trials</h1></div>
          <button onClick={() => { setShowForm(!showForm); setEditingId(null); setName(""); setStartDate(""); setEndDate(""); setWillConvert(false); setAmount(""); }} className="w-10 h-10 bg-lime rounded-full flex items-center justify-center hover:bg-limeDark transition"><svg className="w-5 h-5 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m-7-7h14" /></svg></button>
        </div>
      </header>
      <main className="px-5 pb-28">
        {showForm && (
          <form onSubmit={(e) => { e.preventDefault(); editingId ? handleEditTrial(editingId) : handleAddTrial(e); }} className="bg-white dark:bg-darkCard rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none dark:border dark:border-gray-700 mb-6">
            <h3 className="text-base font-bold text-dark dark:text-gray-100 mb-4">{editingId ? "Edit Trial" : "Tambah Trial"}</h3>
            <div className="mb-4"><label className="text-sm text-grayText dark:text-gray-400 mb-2 block">Nama Layanan</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Netflix" className="w-full text-sm text-dark dark:text-gray-100 py-2 bg-grayLight dark:bg-dark rounded-xl px-4 outline-none focus:ring-2 focus:ring-lime transition" required /></div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div><label className="text-sm text-grayText dark:text-gray-400 mb-2 block">Mulai</label><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full text-sm text-dark dark:text-gray-100 py-2 bg-grayLight dark:bg-dark rounded-xl px-4 outline-none focus:ring-2 focus:ring-lime transition" /></div>
              <div><label className="text-sm text-grayText dark:text-gray-400 mb-2 block">Berakhir</label><input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full text-sm text-dark dark:text-gray-100 py-2 bg-grayLight dark:bg-dark rounded-xl px-4 outline-none focus:ring-2 focus:ring-lime transition" required /></div>
            </div>
            <div className="mb-4"><label className="text-sm text-grayText dark:text-gray-400 mb-2 block">Harga setelah trial (opsional)</label><input type="text" value={amount} onChange={(e) => setAmount(formatInputAmount(e.target.value))} placeholder="0" className="w-full text-sm text-dark dark:text-gray-100 py-2 bg-grayLight dark:bg-dark rounded-xl px-4 outline-none focus:ring-2 focus:ring-lime transition" inputMode="numeric" /></div>
            <div className="mb-4"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={willConvert} onChange={(e) => setWillConvert(e.target.checked)} className="w-4 h-4 rounded accent-lime" /><span className="text-sm text-dark dark:text-gray-100">Akan berlangganan otomatis</span></label></div>
            <div className="flex gap-2"><button type="button" onClick={resetForm} className="flex-1 py-3 bg-grayLight dark:bg-dark rounded-xl font-medium text-grayText hover:bg-grayMid dark:hover:bg-gray-700 transition">Batal</button><button type="submit" className="flex-1 py-3 bg-lime rounded-xl font-medium text-dark hover:bg-limeDark transition">{editingId ? "Update" : "Simpan"}</button></div>
          </form>
        )}
        <div className="space-y-3">
          {trials.length === 0 ? (<div className="text-center py-16 text-grayText dark:text-gray-400"><p className="text-sm">Belum ada trial</p><p className="text-xs mt-1">Tap + untuk menambahkan</p></div>) : (
            trials.map((trial) => {
              const daysLeft = getDaysRemaining(trial.end_date);
              const isExpired = daysLeft < 0;
              const isExpiringSoon = daysLeft >= 0 && daysLeft <= 3;
              return (
                <div key={trial.id} className="bg-white dark:bg-darkCard rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none dark:border dark:border-gray-700 group">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{trial.icon}</span>
                    <div className="flex-1"><p className="text-sm font-semibold text-dark dark:text-gray-100">{trial.name}</p><p className="text-xs text-grayText dark:text-gray-400">{formatDateShort(trial.start_date)} - {formatDateShort(trial.end_date)}</p></div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${isExpired ? "bg-red-100 dark:bg-red-900/20 text-expense" : isExpiringSoon ? "bg-orange-100 dark:bg-orange-900/20 text-warning" : "bg-green-100 dark:bg-green-900/20 text-income"}`}>{isExpired ? "Expired" : `${daysLeft} hari`}</span>
                      <div className="hidden group-hover:flex gap-1">
                        <button onClick={() => startEdit(trial)} className="p-1 hover:bg-grayLight dark:hover:bg-gray-700 rounded-full"><svg className="w-4 h-4 text-iosBlue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                        <button onClick={() => { if (confirm("Hapus trial ini?")) deleteTrial(trial.id); }} className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"><svg className="w-4 h-4 text-expense" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                      </div>
                    </div>
                  </div>
                  {trial.amount > 0 && (<div className="flex justify-between items-center pt-3 border-t border-grayMid dark:border-gray-700"><span className="text-xs text-grayText dark:text-gray-400">Harga setelah trial</span><span className="text-sm font-semibold text-dark dark:text-gray-100">{formatRupiah(trial.amount)}</span></div>)}
                  {trial.will_convert && (<div className="mt-2 flex items-center gap-1"><svg className="w-4 h-4 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg><span className="text-xs text-warning">Akan berlangganan otomatis</span></div>)}
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
