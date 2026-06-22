"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/app/components/BottomNav";
import { useApp } from "@/app/context/AppContext";
import { formatRupiah, formatDateShort, getDaysRemaining } from "@/app/lib/utils";

export default function SubsPage() {
  const router = useRouter();
  const { subscriptions, loading, addSubscription } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [billingCycle, setBillingCycle] = useState<"weekly" | "monthly" | "yearly">("monthly");
  const [nextBilling, setNextBilling] = useState("");

  const totalMonthly = subscriptions.reduce((sum, s) => {
    const amt = Number(s.amount);
    if (s.billing_cycle === "weekly") return sum + amt * 4;
    if (s.billing_cycle === "yearly") return sum + amt / 12;
    return sum + amt;
  }, 0);

  const handleAddSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) return;

    await addSubscription({
      name,
      amount: Number(amount.replace(/\./g, "")),
      billing_cycle: billingCycle,
      next_billing: nextBilling,
      icon: "📱",
      color: "#AF52DE",
    });
    setShowForm(false);
    setName("");
    setAmount("");
    setNextBilling("");
  };

  const formatInputAmount = (value: string) => {
    const num = value.replace(/\D/g, "");
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const billingLabels = { weekly: "Mingguan", monthly: "Bulanan", yearly: "Tahunan" };

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
            <h1 className="text-xl font-bold text-dark">Subscriptions</h1>
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
        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] mb-6">
          <p className="text-sm text-grayText mb-1">Total per Bulan (estimasi)</p>
          <p className="text-2xl font-bold text-dark">{formatRupiah(totalMonthly)}</p>
        </div>

        {showForm && (
          <form onSubmit={handleAddSubscription} className="bg-white rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] mb-6">
            <h3 className="text-base font-bold text-dark mb-4">Tambah Subscription</h3>
            <div className="mb-4">
              <label className="text-sm text-grayText mb-2 block">Nama Layanan</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Netflix"
                className="w-full text-sm text-dark py-2 bg-grayLight rounded-xl px-4 outline-none focus:ring-2 focus:ring-lime transition"
                required
              />
            </div>
            <div className="mb-4">
              <label className="text-sm text-grayText mb-2 block">Harga</label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(formatInputAmount(e.target.value))}
                placeholder="0"
                className="w-full text-sm text-dark py-2 bg-grayLight rounded-xl px-4 outline-none focus:ring-2 focus:ring-lime transition"
                inputMode="numeric"
                required
              />
            </div>
            <div className="mb-4">
              <label className="text-sm text-grayText mb-2 block">Siklus Tagihan</label>
              <div className="flex gap-2">
                {(["weekly", "monthly", "yearly"] as const).map((cycle) => (
                  <button
                    key={cycle}
                    type="button"
                    onClick={() => setBillingCycle(cycle)}
                    className={`flex-1 py-2 rounded-xl text-xs font-medium transition ${billingCycle === cycle ? "bg-lime text-dark" : "bg-grayLight text-grayText"}`}
                  >
                    {billingLabels[cycle]}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="text-sm text-grayText mb-2 block">Tagihan Berikutnya (opsional)</label>
              <input
                type="date"
                value={nextBilling}
                onChange={(e) => setNextBilling(e.target.value)}
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
          {subscriptions.length === 0 ? (
            <div className="text-center py-16 text-grayText">
              <p className="text-sm">Belum ada subscription</p>
              <p className="text-xs mt-1">Tap + untuk menambahkan</p>
            </div>
          ) : (
            subscriptions.map((sub) => {
              const daysLeft = sub.next_billing ? getDaysRemaining(sub.next_billing) : null;
              return (
                <div key={sub.id} className="bg-white rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{sub.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-dark">{sub.name}</p>
                      <p className="text-xs text-grayText">{billingLabels[sub.billing_cycle]}</p>
                    </div>
                    <span className="text-base font-bold text-dark">{formatRupiah(sub.amount)}</span>
                  </div>
                  {daysLeft !== null && (
                    <div className="flex items-center gap-2 pt-3 border-t border-grayMid">
                      <svg className="w-4 h-4 text-grayText" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs text-grayText">
                        {daysLeft < 0 ? "Sudah lewat" : daysLeft === 0 ? "Hari ini" : `${daysLeft} hari lagi`}
                      </span>
                      <span className="text-xs text-grayText ml-auto">{formatDateShort(sub.next_billing)}</span>
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
