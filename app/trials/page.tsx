"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/app/components/BottomNav";
import { useApp } from "@/app/context/AppContext";
import { formatRupiah, getDaysRemaining, formatDateShort } from "@/app/lib/utils";

export default function TrialsPage() {
  const router = useRouter();
  const { trials, loading, addTrial } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [willConvert, setWillConvert] = useState(false);
  const [amount, setAmount] = useState("");

  const handleAddTrial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !endDate) return;

    await addTrial({
      name,
      start_date: startDate || new Date().toISOString().split("T")[0],
      end_date: endDate,
      will_convert: willConvert,
      amount: Number(amount.replace(/\./g, "")) || 0,
      icon: "⚡",
      color: "#F59E0B",
    });
    setShowForm(false);
    setName("");
    setStartDate("");
    setEndDate("");
    setWillConvert(false);
    setAmount("");
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
            <h1 className="text-xl font-bold text-dark">Trials</h1>
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
          <form onSubmit={handleAddTrial} className="bg-white rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] mb-6">
            <h3 className="text-base font-bold text-dark mb-4">Tambah Trial</h3>
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
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-sm text-grayText mb-2 block">Mulai</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full text-sm text-dark py-2 bg-grayLight rounded-xl px-4 outline-none focus:ring-2 focus:ring-lime transition"
                />
              </div>
              <div>
                <label className="text-sm text-grayText mb-2 block">Berakhir</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full text-sm text-dark py-2 bg-grayLight rounded-xl px-4 outline-none focus:ring-2 focus:ring-lime transition"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="text-sm text-grayText mb-2 block">Harga setelah trial (opsional)</label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(formatInputAmount(e.target.value))}
                placeholder="0"
                className="w-full text-sm text-dark py-2 bg-grayLight rounded-xl px-4 outline-none focus:ring-2 focus:ring-lime transition"
                inputMode="numeric"
              />
            </div>
            <div className="mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={willConvert}
                  onChange={(e) => setWillConvert(e.target.checked)}
                  className="w-4 h-4 rounded accent-lime"
                />
                <span className="text-sm text-dark">Akan berlangganan otomatis</span>
              </label>
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
          {trials.length === 0 ? (
            <div className="text-center py-16 text-grayText">
              <p className="text-sm">Belum ada trial</p>
              <p className="text-xs mt-1">Tap + untuk menambahkan</p>
            </div>
          ) : (
            trials.map((trial) => {
              const daysLeft = getDaysRemaining(trial.end_date);
              const isExpired = daysLeft < 0;
              const isExpiringSoon = daysLeft >= 0 && daysLeft <= 3;
              return (
                <div key={trial.id} className="bg-white rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{trial.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-dark">{trial.name}</p>
                      <p className="text-xs text-grayText">{formatDateShort(trial.start_date)} - {formatDateShort(trial.end_date)}</p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        isExpired ? "bg-red-100 text-expense" : isExpiringSoon ? "bg-orange-100 text-warning" : "bg-green-100 text-income"
                      }`}
                    >
                      {isExpired ? "Expired" : isExpiringSoon ? `${daysLeft} hari` : `${daysLeft} hari`}
                    </span>
                  </div>
                  {trial.amount > 0 && (
                    <div className="flex justify-between items-center pt-3 border-t border-grayMid">
                      <span className="text-xs text-grayText">Harga setelah trial</span>
                      <span className="text-sm font-semibold text-dark">{formatRupiah(trial.amount)}</span>
                    </div>
                  )}
                  {trial.will_convert && (
                    <div className="mt-2 flex items-center gap-1">
                      <svg className="w-4 h-4 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span className="text-xs text-warning">Akan berlangganan otomatis</span>
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
