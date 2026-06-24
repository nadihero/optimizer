"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import BottomNav from "@/app/components/BottomNav";
import { useApp } from "@/app/context/AppContext";
import { useToast } from "@/app/components/Toast";

export default function AddTransactionPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { addTransaction } = useApp();
  const { showToast } = useToast();
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount.replace(/\./g, "")) <= 0) return;
    setSaving(true);

    const { error } = await addTransaction({
      type,
      amount: Number(amount.replace(/\./g, "")),
      category: type === "expense" ? "Pengeluaran" : "Pemasukan",
      description,
      date,
      icon_color: type === "expense" ? "#EF4444" : "#22C55E",
    });

    setSaving(false);

    if (error) {
      showToast(error, "error");
      return;
    }

    showToast("Transaksi berhasil disimpan!", "success");
    setTimeout(() => router.push("/"), 500);
  };

  const formatInputAmount = (value: string) => {
    const num = value.replace(/\D/g, "");
    if (num === "") return "";
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const parseAmount = (value: string) => Number(value.replace(/\./g, ""));
  const isValid = parseAmount(amount) > 0;

  if (authLoading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime"></div></div>;
  if (!user) return null;

  return (
    <>
      <header className="px-5 pt-8 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="w-10 h-10 glass-card flex items-center justify-center hover:bg-white/10 transition">
            <svg className="w-5 h-5 text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-xl font-bold text-gray-100">Tambah Transaksi</h1>
        </div>
      </header>

      <main className="px-5 pb-32">
        <div className="glass-card p-1.5 mb-8">
          <div className="flex">
            <button
              onClick={() => setType("expense")}
              className={`flex-1 py-4 rounded-xl text-base font-semibold transition-all duration-200 ${type === "expense" ? "bg-expense text-white shadow-lg" : "text-gray-400 hover:text-gray-100"}`}
            >
              Pengeluaran
            </button>
            <button
              onClick={() => setType("income")}
              className={`flex-1 py-4 rounded-xl text-base font-semibold transition-all duration-200 ${type === "income" ? "bg-income text-white shadow-lg" : "text-gray-400 hover:text-gray-100"}`}
            >
              Pemasukan
            </button>
          </div>
        </div>

        <div className="glass-card p-8 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl font-medium text-gray-500">Rp</span>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(formatInputAmount(e.target.value))}
                placeholder="0"
                className="w-full max-w-xs text-2xl font-bold bg-transparent outline-none text-gray-100 placeholder:text-gray-500"
                inputMode="numeric"
                autoFocus
              />
            </div>
          </div>
        </div>

        <div className="glass-card p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 ${type === "expense" ? "bg-expense/20" : "bg-income/20"} rounded-xl flex items-center justify-center`}>
                <svg className={`w-6 h-6 ${type === "expense" ? "text-expense" : "text-income"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {type === "expense" ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  )}
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-100">{type === "expense" ? "Pengeluaran" : "Pemasukan"}</p>
                <p className="text-xs text-gray-400">Pilih tipe transaksi</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" strokeWidth={2} /><line x1="16" y1="2" x2="16" y2="6" strokeWidth={2} /><line x1="8" y1="2" x2="8" y2="6" strokeWidth={2} /><line x1="3" y1="10" x2="21" y2="10" strokeWidth={2} /></svg>
              </div>
              <span className="text-sm text-gray-100">Tanggal</span>
            </div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="text-sm font-medium text-gray-400 bg-transparent outline-none"
            />
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-400 mb-2">Catatan (opsional)</p>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Contoh: Makan siang, Gaji bulanan..."
                rows={2}
                className="w-full text-sm text-gray-100 bg-transparent outline-none resize-none placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-40">
        <button
          onClick={handleSubmit}
          disabled={!isValid || saving}
          className={`w-full py-4 rounded-2xl font-semibold text-base transition-all duration-200 ${isValid ? "text-white shadow-lg" : "bg-white/10 text-gray-500"}`}
          style={isValid ? { background: "var(--main-gradient)" } : {}}
        >
          {saving ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              Menyimpan...
            </span>
          ) : "Simpan Transaksi"}
        </button>
      </div>

      <BottomNav />
    </>
  );
}
