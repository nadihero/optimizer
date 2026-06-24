"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import BottomNav from "@/app/components/BottomNav";
import { useApp } from "@/app/context/AppContext";
import { useToast } from "@/app/components/Toast";

const categories = [
  { name: "Gaji", icon: "💰", color: "#22C55E" },
  { name: "Makanan", icon: "🍔", color: "#EF4444" },
  { name: "Transport", icon: "🚗", color: "#3B82F6" },
  { name: "Belanja", icon: "🛍️", color: "#AF52DE" },
  { name: "Hiburan", icon: "🎬", color: "#F59E0B" },
  { name: "Kesehatan", icon: "💊", color: "#007AFF" },
  { name: "Pendidikan", icon: "📚", color: "#FF9500" },
  { name: "Tagihan", icon: "📄", color: "#FF3B30" },
  { name: "Lainnya", icon: "📌", color: "#8A8A8A" },
];

export default function AddTransactionPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { addTransaction } = useApp();
  const { showToast } = useToast();
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [saving, setSaving] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount.replace(/\./g, "")) <= 0 || !category) return;
    setSaving(true);

    const selectedCat = categories.find((c) => c.name === category);
    const { error } = await addTransaction({
      type,
      amount: Number(amount.replace(/\./g, "")),
      category,
      description,
      date,
      icon_color: selectedCat?.color || "#8A8A8A",
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
  const isValid = parseAmount(amount) > 0 && category !== "";

  if (authLoading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime"></div></div>;
  if (!user) return null;

  return (
    <>
      <header className="px-5 pt-8 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="w-10 h-10 bg-gray-100 dark:bg-darkCard rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            <svg className="w-5 h-5 text-dark dark:text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-xl font-bold text-dark dark:text-gray-100">Tambah {type === "expense" ? "Pengeluaran" : "Pemasukan"}</h1>
        </div>
      </header>

      <main className="px-5 pb-32">
        {/* Segmented Tabs */}
        <div className="bg-gray-100 dark:bg-darkCard rounded-2xl p-1.5 mb-8">
          <div className="flex">
            <button
              onClick={() => { setType("expense"); setCategory(""); }}
              className={`flex-1 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${type === "expense" ? "bg-expense text-white shadow-md" : "text-gray-500 dark:text-gray-400 hover:text-dark dark:hover:text-gray-100"}`}
            >
              Pengeluaran
            </button>
            <button
              onClick={() => { setType("income"); setCategory(""); }}
              className={`flex-1 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${type === "income" ? "bg-income text-white shadow-md" : "text-gray-500 dark:text-gray-400 hover:text-dark dark:hover:text-gray-100"}`}
            >
              Pemasukan
            </button>
          </div>
        </div>

        {/* Amount Section */}
        <div className="bg-white dark:bg-darkCard rounded-3xl p-6 mb-6 shadow-sm dark:shadow-none dark:border dark:border-gray-700">
          <div className="text-center">
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-3">Jumlah</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl font-medium text-gray-400 dark:text-gray-500">Rp</span>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(formatInputAmount(e.target.value))}
                placeholder="0"
                className="w-full max-w-[280px] text-6xl font-bold text-center bg-transparent outline-none text-dark dark:text-gray-100 placeholder:text-gray-300 dark:placeholder:text-gray-600"
                inputMode="numeric"
                autoFocus
              />
            </div>
            <p className={`text-xs mt-2 ${amount === "" ? "text-gray-400 dark:text-gray-500" : "text-transparent"}`}>
              Tap untuk memasukkan jumlah
            </p>
          </div>
        </div>

        {/* Category Section */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 px-1">Kategori</h3>
          <div className="bg-white dark:bg-darkCard rounded-3xl p-4 shadow-sm dark:shadow-none dark:border dark:border-gray-700">
            <div className="grid grid-cols-3 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setCategory(cat.name)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-200 ${category === cat.name ? "bg-lime/20 border-2 border-lime scale-105" : "bg-gray-50 dark:bg-dark border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                >
                  <span className={`text-3xl transition-transform ${category === cat.name ? "scale-110" : ""}`}>{cat.icon}</span>
                  <span className={`text-xs font-medium ${category === cat.name ? "text-dark" : "text-gray-600 dark:text-gray-400"}`}>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Optional Fields */}
        <div className="space-y-3">
          {/* Date */}
          <div className="bg-white dark:bg-darkCard rounded-2xl p-4 shadow-sm dark:shadow-none dark:border dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 dark:bg-dark rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" strokeWidth={2} /><line x1="16" y1="2" x2="16" y2="6" strokeWidth={2} /><line x1="8" y1="2" x2="8" y2="6" strokeWidth={2} /><line x1="3" y1="10" x2="21" y2="10" strokeWidth={2} /></svg>
                </div>
                <span className="text-sm text-dark dark:text-gray-100">Tanggal</span>
              </div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="text-sm text-gray-500 dark:text-gray-400 bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Notes Toggle */}
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="w-full bg-white dark:bg-darkCard rounded-2xl p-4 shadow-sm dark:shadow-none dark:border dark:border-gray-700 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-dark rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </div>
              <span className="text-sm text-dark dark:text-gray-100">Catatan (opsional)</span>
            </div>
            <svg className={`w-5 h-5 text-gray-400 transition-transform ${showNotes ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>

          {showNotes && (
            <div className="bg-white dark:bg-darkCard rounded-2xl p-4 shadow-sm dark:shadow-none dark:border dark:border-gray-700">
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Contoh: Makan siang di warung Pack"
                className="w-full text-sm text-dark dark:text-gray-100 bg-transparent outline-none placeholder:text-gray-400"
              />
            </div>
          )}
        </div>
      </main>

      {/* Fixed Save Button */}
      <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-40">
        <button
          onClick={handleSubmit}
          disabled={!isValid || saving}
          className={`w-full py-4 rounded-2xl font-semibold text-base transition-all duration-200 shadow-lg ${isValid ? "bg-lime text-dark hover:bg-limeDark shadow-lime/40" : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 shadow-none"} disabled:cursor-not-allowed`}
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
