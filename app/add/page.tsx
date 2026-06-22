"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/app/components/BottomNav";
import { useApp } from "@/app/context/AppContext";

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
  const { addTransaction } = useApp();
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;

    setSaving(true);
    const selectedCat = categories.find((c) => c.name === category);
    await addTransaction({
      type,
      amount: Number(amount.replace(/\./g, "")),
      category,
      description,
      date,
      icon_color: selectedCat?.color || "#8A8A8A",
    });
    setSaving(false);
    router.push("/");
  };

  const formatInputAmount = (value: string) => {
    const num = value.replace(/\D/g, "");
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <>
      <header className="px-5 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="w-10 h-10 bg-grayLight rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-dark">Tambah Transaksi</h1>
        </div>
      </header>

      <main className="px-5 pb-28">
        <form onSubmit={handleSubmit}>
          <div className="flex bg-grayLight rounded-full p-1 mb-6">
            <button
              type="button"
              onClick={() => setType("expense")}
              className={`flex-1 py-2.5 rounded-full text-sm font-medium transition ${type === "expense" ? "bg-white shadow-sm text-expense" : "text-grayText"}`}
            >
              Pengeluaran
            </button>
            <button
              type="button"
              onClick={() => setType("income")}
              className={`flex-1 py-2.5 rounded-full text-sm font-medium transition ${type === "income" ? "bg-white shadow-sm text-income" : "text-grayText"}`}
            >
              Pemasukan
            </button>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] mb-6">
            <label className="text-sm text-grayText mb-2 block">Jumlah</label>
            <div className="relative">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 text-lg text-grayText font-medium">Rp</span>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(formatInputAmount(e.target.value))}
                placeholder="0"
                className="w-full text-3xl font-bold text-dark pl-12 pr-4 py-3 bg-transparent outline-none"
                inputMode="numeric"
                required
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] mb-6">
            <label className="text-sm text-grayText mb-3 block">Kategori</label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setCategory(cat.name)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition ${category === cat.name ? "border-lime bg-lime/10" : "border-transparent hover:bg-grayLight"}`}
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span className="text-xs text-dark">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] mb-6">
            <label className="text-sm text-grayText mb-2 block">Keterangan</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Makan siang"
              className="w-full text-sm text-dark py-2 bg-transparent outline-none border-b border-grayMid focus:border-limeDark transition"
            />
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] mb-6">
            <label className="text-sm text-grayText mb-2 block">Tanggal</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full text-sm text-dark py-2 bg-transparent outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={saving || !amount || !category}
            className="w-full py-4 bg-lime rounded-2xl font-semibold text-dark text-base disabled:opacity-50 disabled:cursor-not-allowed hover:bg-limeDark transition shadow-lg shadow-lime/40"
          >
            {saving ? "Menyimpan..." : "Simpan Transaksi"}
          </button>
        </form>
      </main>

      <BottomNav />
    </>
  );
}
