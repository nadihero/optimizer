"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import BottomNav from "@/app/components/BottomNav";
import { useApp } from "@/app/context/AppContext";
import { useToast } from "@/app/components/Toast";
import { formatRupiah } from "@/app/lib/utils";

export default function BudgetPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { budgets, loading, addBudget, updateBudget, deleteBudget } = useApp();
  const { showToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [limitAmount, setLimitAmount] = useState("");
  const [period, setPeriod] = useState<"weekly" | "monthly">("monthly");
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (!authLoading && !user) router.push("/login"); }, [user, authLoading, router]);

  const totalBudget = budgets.reduce((sum, b) => sum + Number(b.limit_amount), 0);
  const totalSpent = budgets.reduce((sum, b) => sum + Number(b.spent_amount), 0);

  const handleAddBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !limitAmount) return;
    setSaving(true);
    const { error } = await addBudget({ category, limit_amount: Number(limitAmount.replace(/\./g, "")), spent_amount: 0, period, icon: "📊", color: "#D4F53C" });
    setSaving(false);
    if (error) { showToast(error, "error"); return; }
    showToast("Budget berhasil ditambahkan", "success");
    resetForm();
  };

  const handleEditBudget = async (id: string) => {
    if (!category || !limitAmount) return;
    setSaving(true);
    const { error } = await updateBudget(id, { category, limit_amount: Number(limitAmount.replace(/\./g, "")), period });
    setSaving(false);
    if (error) { showToast(error, "error"); return; }
    showToast("Budget berhasil diupdate", "success");
    resetForm();
  };

  const handleDeleteBudget = async (id: string) => {
    if (!confirm("Hapus budget ini?")) return;
    const { error } = await deleteBudget(id);
    if (error) { showToast(error, "error"); return; }
    showToast("Budget berhasil dihapus", "success");
  };

  const resetForm = () => { setShowForm(false); setEditingId(null); setCategory(""); setLimitAmount(""); };
  const startEdit = (budget: typeof budgets[0]) => { setEditingId(budget.id); setShowForm(true); setCategory(budget.category); setLimitAmount(String(budget.limit_amount).replace(/\B(?=(\d{3})+(?!\d))/g, ".")); setPeriod(budget.period); };
  const formatInputAmount = (value: string) => { const num = value.replace(/\D/g, ""); return num.replace(/\B(?=(\d{3})+(?!\d))/g, "."); };

  if (authLoading || loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime"></div></div>;
  if (!user) return null;

  return (
    <>
      <header className="px-5 pt-12 pb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-dark dark:text-gray-100">Budget</h1>
          <button onClick={() => { setShowForm(!showForm); setEditingId(null); setCategory(""); setLimitAmount(""); }} className="w-10 h-10 bg-lime rounded-full flex items-center justify-center hover:bg-limeDark transition">
            <svg className="w-5 h-5 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m-7-7h14" /></svg>
          </button>
        </div>
      </header>
      <main className="px-5 pb-28">
        <div className="bg-white dark:bg-darkCard rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none dark:border dark:border-gray-700 mb-6">
          <p className="text-sm text-grayText dark:text-gray-400 mb-1">Total Budget</p>
          <p className="text-2xl font-bold text-dark dark:text-gray-100">{formatRupiah(totalBudget)}</p>
          <div className="mt-3 h-2 bg-grayLight dark:bg-dark rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-lime transition-all duration-500" style={{ width: `${totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0}%` }}></div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-grayText dark:text-gray-400">Terpakai: {formatRupiah(totalSpent)}</span>
            <span className="text-xs text-grayText dark:text-gray-400">{totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(0) : 0}%</span>
          </div>
        </div>

        {showForm && (
          <form onSubmit={(e) => { e.preventDefault(); editingId ? handleEditBudget(editingId) : handleAddBudget(e); }} className="bg-white dark:bg-darkCard rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none dark:border dark:border-gray-700 mb-6">
            <h3 className="text-base font-bold text-dark dark:text-gray-100 mb-4">{editingId ? "Edit Budget" : "Tambah Budget"}</h3>
            <div className="mb-4"><label className="text-sm text-grayText dark:text-gray-400 mb-2 block">Kategori</label><input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Contoh: Makanan" className="w-full text-sm text-dark dark:text-gray-100 py-2 bg-grayLight dark:bg-dark rounded-xl px-4 outline-none focus:ring-2 focus:ring-lime transition" required /></div>
            <div className="mb-4"><label className="text-sm text-grayText dark:text-gray-400 mb-2 block">Limit</label><input type="text" value={limitAmount} onChange={(e) => setLimitAmount(formatInputAmount(e.target.value))} placeholder="0" className="w-full text-sm text-dark dark:text-gray-100 py-2 bg-grayLight dark:bg-dark rounded-xl px-4 outline-none focus:ring-2 focus:ring-lime transition" inputMode="numeric" required /></div>
            <div className="flex gap-2 mb-4">
              <button type="button" onClick={() => setPeriod("weekly")} className={`flex-1 py-2 rounded-xl text-xs font-medium transition ${period === "weekly" ? "bg-lime text-dark" : "bg-grayLight dark:bg-dark text-grayText"}`}>Mingguan</button>
              <button type="button" onClick={() => setPeriod("monthly")} className={`flex-1 py-2 rounded-xl text-xs font-medium transition ${period === "monthly" ? "bg-lime text-dark" : "bg-grayLight dark:bg-dark text-grayText"}`}>Bulanan</button>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={resetForm} className="flex-1 py-3 bg-grayLight dark:bg-dark rounded-xl font-medium text-grayText hover:bg-grayMid dark:hover:bg-gray-700 transition">Batal</button>
              <button type="submit" disabled={saving} className="flex-1 py-3 bg-lime rounded-xl font-medium text-dark hover:bg-limeDark transition disabled:opacity-50">{saving ? "..." : (editingId ? "Update" : "Simpan")}</button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {budgets.length === 0 ? (
            <div className="text-center py-10 text-grayText dark:text-gray-400">
              <p className="text-sm">Belum ada budget</p>
              <p className="text-xs mt-1">Tap + untuk menambahkan</p>
            </div>
          ) : (
            budgets.map((budget) => {
              const percentage = Number(budget.limit_amount) > 0 ? (Number(budget.spent_amount) / Number(budget.limit_amount)) * 100 : 0;
              const isOver = percentage > 100;
              return (
                <div key={budget.id} className="bg-white dark:bg-darkCard rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none dark:border dark:border-gray-700 group">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{budget.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-dark dark:text-gray-100">{budget.category}</p>
                        <p className="text-xs text-grayText dark:text-gray-400">{budget.period === "weekly" ? "Mingguan" : "Bulanan"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${isOver ? "bg-red-100 dark:bg-red-900/20 text-expense" : "bg-green-100 dark:bg-green-900/20 text-income"}`}>{isOver ? "Over" : `${(100 - percentage).toFixed(0)}% left`}</span>
                      <div className="flex gap-1">
                        <button onClick={() => startEdit(budget)} className="p-1.5 hover:bg-grayLight dark:hover:bg-gray-700 rounded-full transition"><svg className="w-4 h-4 text-iosBlue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                        <button onClick={() => handleDeleteBudget(budget.id)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition"><svg className="w-4 h-4 text-expense" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                      </div>
                    </div>
                  </div>
                  <div className="h-2 bg-grayLight dark:bg-dark rounded-full overflow-hidden mb-2">
                    <div className={`h-full rounded-full transition-all duration-500 ${isOver ? "bg-expense" : percentage > 75 ? "bg-warning" : "bg-lime"}`} style={{ width: `${Math.min(percentage, 100)}%` }}></div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-grayText dark:text-gray-400">{formatRupiah(Number(budget.spent_amount))}</span>
                    <span className="text-xs text-grayText dark:text-gray-400">{formatRupiah(Number(budget.limit_amount))}</span>
                  </div>
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
