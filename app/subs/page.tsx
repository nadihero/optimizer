"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import BottomNav from "@/app/components/BottomNav";
import { useApp } from "@/app/context/AppContext";
import { formatRupiah, formatDateShort, getDaysRemaining } from "@/app/lib/utils";

export default function SubsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { subscriptions, loading, addSubscription, updateSubscription, deleteSubscription } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [billingCycle, setBillingCycle] = useState<"weekly" | "monthly" | "yearly">("monthly");
  const [nextBilling, setNextBilling] = useState("");

  useEffect(() => { if (!authLoading && !user) router.push("/login"); }, [user, authLoading, router]);

  const totalMonthly = subscriptions.reduce((sum, s) => { const amt = Number(s.amount); if (s.billing_cycle === "weekly") return sum + amt * 4; if (s.billing_cycle === "yearly") return sum + amt / 12; return sum + amt; }, 0);

  const handleAddSubscription = async (e: React.FormEvent) => { e.preventDefault(); if (!name || !amount) return; await addSubscription({ name, amount: Number(amount.replace(/\./g, "")), billing_cycle: billingCycle, next_billing: nextBilling, icon: "📱", color: "#725CFF" }); resetForm(); };
  const handleEditSubscription = async (id: string) => { if (!name || !amount) return; await updateSubscription(id, { name, amount: Number(amount.replace(/\./g, "")), billing_cycle: billingCycle, next_billing: nextBilling }); resetForm(); };
  const resetForm = () => { setShowForm(false); setEditingId(null); setName(""); setAmount(""); setNextBilling(""); };
  const startEdit = (sub: typeof subscriptions[0]) => { setEditingId(sub.id); setShowForm(true); setName(sub.name); setAmount(String(sub.amount).replace(/\B(?=(\d{3})+(?!\d))/g, ".")); setBillingCycle(sub.billing_cycle); setNextBilling(sub.next_billing); };
  const formatInputAmount = (value: string) => { const num = value.replace(/\D/g, ""); return num.replace(/\B(?=(\d{3})+(?!\d))/g, "."); };
  const billingLabels = { weekly: "Mingguan", monthly: "Bulanan", yearly: "Tahunan" };

  if (authLoading || loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime"></div></div>;
  if (!user) return null;

  return (
    <>
      <header className="px-5 pt-12 pb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3"><button onClick={() => router.back()} className="w-10 h-10 glass-card flex items-center justify-center"><svg className="w-5 h-5 text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button><h1 className="text-xl font-bold text-gray-100">Subscriptions</h1></div>
          <button onClick={() => { setShowForm(!showForm); setEditingId(null); setName(""); setAmount(""); setNextBilling(""); }} className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ background: "var(--main-gradient)" }}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m-7-7h14" /></svg></button>
        </div>
      </header>
      <main className="px-5 pb-28">
        <div className="glass-card p-5 mb-6">
          <p className="text-sm text-gray-400 mb-1">Total per Bulan (estimasi)</p>
          <p className="text-2xl font-bold text-gray-100">{formatRupiah(totalMonthly)}</p>
        </div>
        {showForm && (
          <form onSubmit={(e) => { e.preventDefault(); editingId ? handleEditSubscription(editingId) : handleAddSubscription(e); }} className="glass-card p-5 mb-6">
            <h3 className="text-base font-bold text-gray-100 mb-4">{editingId ? "Edit Subscription" : "Tambah Subscription"}</h3>
            <div className="mb-4"><label className="text-sm text-gray-400 mb-2 block">Nama Layanan</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Netflix" className="w-full text-sm text-gray-100 py-2 bg-white/10 rounded-xl px-4 outline-none border border-white/10 focus:border-lime transition" required /></div>
            <div className="mb-4"><label className="text-sm text-gray-400 mb-2 block">Harga</label><input type="text" value={amount} onChange={(e) => setAmount(formatInputAmount(e.target.value))} placeholder="0" className="w-full text-sm text-gray-100 py-2 bg-white/10 rounded-xl px-4 outline-none border border-white/10 focus:border-lime transition" inputMode="numeric" required /></div>
            <div className="mb-4"><label className="text-sm text-gray-400 mb-2 block">Siklus Tagihan</label><div className="flex gap-2">{(["weekly", "monthly", "yearly"] as const).map((cycle) => (<button key={cycle} type="button" onClick={() => setBillingCycle(cycle)} className={`flex-1 py-2 rounded-xl text-xs font-medium transition ${billingCycle === cycle ? "text-white" : "text-gray-400 bg-white/10"}`} style={billingCycle === cycle ? { background: "var(--main-gradient)" } : {}}>{billingLabels[cycle]}</button>))}</div></div>
            <div className="mb-4"><label className="text-sm text-gray-400 mb-2 block">Tagihan Berikutnya (opsional)</label><input type="date" value={nextBilling} onChange={(e) => setNextBilling(e.target.value)} className="w-full text-sm text-gray-100 py-2 bg-white/10 rounded-xl px-4 outline-none border border-white/10 focus:border-lime transition" /></div>
            <div className="flex gap-2"><button type="button" onClick={resetForm} className="flex-1 py-3 bg-white/10 rounded-xl font-medium text-gray-400 hover:bg-white/20 transition">Batal</button><button type="submit" className="flex-1 py-3 rounded-xl font-medium text-white" style={{ background: "var(--main-gradient)" }}>{editingId ? "Update" : "Simpan"}</button></div>
          </form>
        )}
        <div className="space-y-3">
          {subscriptions.length === 0 ? (<div className="text-center py-16 text-gray-400"><p className="text-sm">Belum ada subscription</p><p className="text-xs mt-1">Tap + untuk menambahkan</p></div>) : (
            subscriptions.map((sub) => {
              const daysLeft = sub.next_billing ? getDaysRemaining(sub.next_billing) : null;
              return (
                <div key={sub.id} className="glass-card p-5 group">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{sub.icon}</span>
                    <div className="flex-1"><p className="text-sm font-semibold text-gray-100">{sub.name}</p><p className="text-xs text-gray-400">{billingLabels[sub.billing_cycle]}</p></div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-gray-100">{formatRupiah(sub.amount)}</span>
                      <div className="hidden group-hover:flex gap-1">
                        <button onClick={() => startEdit(sub)} className="p-1 hover:bg-white/10 rounded-full"><svg className="w-4 h-4 text-iosBlue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                        <button onClick={() => { if (confirm("Hapus subscription ini?")) deleteSubscription(sub.id); }} className="p-1 hover:bg-red-500/20 rounded-full"><svg className="w-4 h-4 text-expense" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                      </div>
                    </div>
                  </div>
                  {daysLeft !== null && (<div className="flex items-center gap-2 pt-3 border-t border-white/10"><svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg><span className="text-xs text-gray-400">{daysLeft < 0 ? "Sudah lewat" : daysLeft === 0 ? "Hari ini" : `${daysLeft} hari lagi`}</span><span className="text-xs text-gray-400 ml-auto">{formatDateShort(sub.next_billing)}</span></div>)}
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
