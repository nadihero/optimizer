"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import BottomNav from "@/app/components/BottomNav";
import { useApp } from "@/app/context/AppContext";
import { formatRupiah, formatDateShort, getDaysRemaining } from "@/app/lib/utils";

export default function DebtPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { debts, loading, addDebt, updateDebt, deleteDebt, payDebt } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showPay, setShowPay] = useState<string | null>(null);
  const [payAmount, setPayAmount] = useState("");
  const [type, setType] = useState<"owed" | "owing">("owed");
  const [person, setPerson] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => { if (!authLoading && !user) router.push("/login"); }, [user, authLoading, router]);

  const totalOwed = debts.filter((d) => d.type === "owed").reduce((sum, d) => sum + (Number(d.amount) - Number(d.paid_amount)), 0);
  const totalOwing = debts.filter((d) => d.type === "owing").reduce((sum, d) => sum + (Number(d.amount) - Number(d.paid_amount)), 0);

  const handleAddDebt = async (e: React.FormEvent) => { e.preventDefault(); if (!person || !amount) return; await addDebt({ type, person, amount: Number(amount.replace(/\./g, "")), paid_amount: 0, due_date: dueDate, description }); resetForm(); };
  const handleEditDebt = async (id: string) => { if (!person || !amount) return; await updateDebt(id, { type, person, amount: Number(amount.replace(/\./g, "")), due_date: dueDate, description }); resetForm(); };
  const resetForm = () => { setShowForm(false); setEditingId(null); setPerson(""); setAmount(""); setDueDate(""); setDescription(""); };
  const startEdit = (debt: typeof debts[0]) => { setEditingId(debt.id); setShowForm(true); setType(debt.type); setPerson(debt.person); setAmount(String(debt.amount).replace(/\B(?=(\d{3})+(?!\d))/g, ".")); setDueDate(debt.due_date); setDescription(debt.description); };
  const handlePayDebt = async (debtId: string) => { if (!payAmount) return; await payDebt(debtId, Number(payAmount.replace(/\./g, ""))); setShowPay(null); setPayAmount(""); };
  const formatInputAmount = (value: string) => { const num = value.replace(/\D/g, ""); return num.replace(/\B(?=(\d{3})+(?!\d))/g, "."); };

  if (authLoading || loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime"></div></div>;
  if (!user) return null;

  return (
    <>
      <header className="px-5 pt-12 pb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3"><button onClick={() => router.back()} className="w-10 h-10 bg-grayLight dark:bg-darkCard rounded-full flex items-center justify-center"><svg className="w-5 h-5 text-dark dark:text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button><h1 className="text-xl font-bold text-dark dark:text-gray-100">Debt</h1></div>
          <button onClick={() => { setShowForm(!showForm); setEditingId(null); setPerson(""); setAmount(""); setDueDate(""); setDescription(""); }} className="w-10 h-10 bg-lime rounded-full flex items-center justify-center hover:bg-limeDark transition"><svg className="w-5 h-5 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m-7-7h14" /></svg></button>
        </div>
      </header>
      <main className="px-5 pb-28">
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-orange-50 dark:bg-orange-900/10 rounded-2xl p-4"><p className="text-xs text-grayText dark:text-gray-400 mb-1">Orang Berhutang</p><p className="text-lg font-bold text-iosOrange">{formatRupiah(totalOwed)}</p></div>
          <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl p-4"><p className="text-xs text-grayText dark:text-gray-400 mb-1">Saya Berhutang</p><p className="text-lg font-bold text-iosRed">{formatRupiah(totalOwing)}</p></div>
        </div>
        {showForm && (
          <form onSubmit={(e) => { e.preventDefault(); editingId ? handleEditDebt(editingId) : handleAddDebt(e); }} className="bg-white dark:bg-darkCard rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none dark:border dark:border-gray-700 mb-6">
            <h3 className="text-base font-bold text-dark dark:text-gray-100 mb-4">{editingId ? "Edit Hutang" : "Tambah Hutang"}</h3>
            <div className="flex bg-grayLight dark:bg-dark rounded-full p-1 mb-4">
              <button type="button" onClick={() => setType("owed")} className={`flex-1 py-2 rounded-full text-xs font-medium transition ${type === "owed" ? "bg-white dark:bg-dark shadow-sm text-iosOrange" : "text-grayText"}`}>Dia Berhutang</button>
              <button type="button" onClick={() => setType("owing")} className={`flex-1 py-2 rounded-full text-xs font-medium transition ${type === "owing" ? "bg-white dark:bg-dark shadow-sm text-iosRed" : "text-grayText"}`}>Saya Berhutang</button>
            </div>
            <div className="mb-4"><label className="text-sm text-grayText dark:text-gray-400 mb-2 block">Nama</label><input type="text" value={person} onChange={(e) => setPerson(e.target.value)} placeholder="Nama orang" className="w-full text-sm text-dark dark:text-gray-100 py-2 bg-grayLight dark:bg-dark rounded-xl px-4 outline-none focus:ring-2 focus:ring-lime transition" required /></div>
            <div className="mb-4"><label className="text-sm text-grayText dark:text-gray-400 mb-2 block">Jumlah</label><input type="text" value={amount} onChange={(e) => setAmount(formatInputAmount(e.target.value))} placeholder="0" className="w-full text-sm text-dark dark:text-gray-100 py-2 bg-grayLight dark:bg-dark rounded-xl px-4 outline-none focus:ring-2 focus:ring-lime transition" inputMode="numeric" required /></div>
            <div className="mb-4"><label className="text-sm text-grayText dark:text-gray-400 mb-2 block">Jatuh Tempo (opsional)</label><input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full text-sm text-dark dark:text-gray-100 py-2 bg-grayLight dark:bg-dark rounded-xl px-4 outline-none focus:ring-2 focus:ring-lime transition" /></div>
            <div className="mb-4"><label className="text-sm text-grayText dark:text-gray-400 mb-2 block">Keterangan (opsional)</label><input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Catatan" className="w-full text-sm text-dark dark:text-gray-100 py-2 bg-grayLight dark:bg-dark rounded-xl px-4 outline-none focus:ring-2 focus:ring-lime transition" /></div>
            <div className="flex gap-2"><button type="button" onClick={resetForm} className="flex-1 py-3 bg-grayLight dark:bg-dark rounded-xl font-medium text-grayText hover:bg-grayMid dark:hover:bg-gray-700 transition">Batal</button><button type="submit" className="flex-1 py-3 bg-lime rounded-xl font-medium text-dark hover:bg-limeDark transition">{editingId ? "Update" : "Simpan"}</button></div>
          </form>
        )}
        <div className="space-y-3">
          {debts.length === 0 ? (<div className="text-center py-16 text-grayText dark:text-gray-400"><p className="text-sm">Belum ada hutang</p><p className="text-xs mt-1">Tap + untuk menambahkan</p></div>) : (
            debts.map((debt) => {
              const remaining = Number(debt.amount) - Number(debt.paid_amount);
              const percentage = Number(debt.amount) > 0 ? (Number(debt.paid_amount) / Number(debt.amount)) * 100 : 0;
              const daysLeft = debt.due_date ? getDaysRemaining(debt.due_date) : null;
              const isPaid = remaining <= 0;
              return (
                <div key={debt.id} className="bg-white dark:bg-darkCard rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none dark:border dark:border-gray-700 group">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2"><p className="text-sm font-semibold text-dark dark:text-gray-100">{debt.person}</p><span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${debt.type === "owed" ? "bg-orange-100 dark:bg-orange-900/20 text-iosOrange" : "bg-red-100 dark:bg-red-900/20 text-iosRed"}`}>{debt.type === "owed" ? "Dia hutang" : "Saya hutang"}</span></div>
                      {debt.description && <p className="text-xs text-grayText dark:text-gray-400 mt-0.5">{debt.description}</p>}
                      {daysLeft !== null && !isPaid && <p className={`text-xs mt-1 ${daysLeft < 0 ? "text-expense" : daysLeft < 7 ? "text-warning" : "text-grayText dark:text-gray-400"}`}>{daysLeft < 0 ? "Terlambat" : daysLeft === 0 ? "Hari ini" : `${daysLeft} hari lagi`}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      {isPaid && <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/20 text-income">Lunas</span>}
                      <div className="hidden group-hover:flex gap-1">
                        <button onClick={() => startEdit(debt)} className="p-1 hover:bg-grayLight dark:hover:bg-gray-700 rounded-full"><svg className="w-4 h-4 text-iosBlue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                        <button onClick={() => { if (confirm("Hapus hutang ini?")) deleteDebt(debt.id); }} className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"><svg className="w-4 h-4 text-expense" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                      </div>
                    </div>
                  </div>
                  <div className="h-2 bg-grayLight dark:bg-dark rounded-full overflow-hidden mb-2"><div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(percentage, 100)}%`, backgroundColor: isPaid ? "#22C55E" : debt.type === "owed" ? "#FF9500" : "#FF3B30" }}></div></div>
                  <div className="flex justify-between items-center">
                    <div><span className="text-sm font-semibold text-dark dark:text-gray-100">{formatRupiah(Number(debt.paid_amount))}</span><span className="text-xs text-grayText dark:text-gray-400"> / {formatRupiah(Number(debt.amount))}</span></div>
                    {!isPaid && (<button onClick={() => setShowPay(showPay === debt.id ? null : debt.id)} className="text-xs font-medium px-3 py-1.5 bg-lime/20 text-limeDark rounded-full hover:bg-lime/40 transition">+ Bayar</button>)}
                  </div>
                  {showPay === debt.id && (<div className="mt-3 pt-3 border-t border-grayMid dark:border-gray-700"><div className="flex gap-2"><input type="text" value={payAmount} onChange={(e) => setPayAmount(formatInputAmount(e.target.value))} placeholder="Jumlah bayar" className="flex-1 text-sm text-dark dark:text-gray-100 py-2 bg-grayLight dark:bg-dark rounded-xl px-4 outline-none focus:ring-2 focus:ring-lime transition" inputMode="numeric" /><button onClick={() => handlePayDebt(debt.id)} className="px-4 py-2 bg-lime rounded-xl text-sm font-medium text-dark hover:bg-limeDark transition">OK</button></div></div>)}
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
