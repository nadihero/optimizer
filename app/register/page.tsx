"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Password tidak cocok");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    setLoading(true);

    const { error: authError } = await signUp(email, password, name);

    if (authError) {
      setError(authError);
      setLoading(false);
      return;
    }

    router.push("/");
  };

  return (
    <div className="min-h-screen bg-grayBg flex flex-col justify-center px-6">
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-lime rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-lime/40">
          <svg className="w-8 h-8 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-dark">Naomi</h1>
        <p className="text-sm text-grayText mt-1">Personal Budget Tracker</p>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
        <h2 className="text-xl font-bold text-dark mb-1">Buat Akun</h2>
        <p className="text-sm text-grayText mb-6">Daftar untuk mulai tracking</p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
            <p className="text-sm text-expense">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-grayText mb-2 block">Nama</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama lengkap"
              className="w-full text-sm text-dark py-3 bg-grayLight rounded-xl px-4 outline-none focus:ring-2 focus:ring-lime transition"
              required
              autoComplete="name"
            />
          </div>

          <div>
            <label className="text-sm text-grayText mb-2 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full text-sm text-dark py-3 bg-grayLight rounded-xl px-4 outline-none focus:ring-2 focus:ring-lime transition"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="text-sm text-grayText mb-2 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              className="w-full text-sm text-dark py-3 bg-grayLight rounded-xl px-4 outline-none focus:ring-2 focus:ring-lime transition"
              required
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="text-sm text-grayText mb-2 block">Konfirmasi Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi password"
              className="w-full text-sm text-dark py-3 bg-grayLight rounded-xl px-4 outline-none focus:ring-2 focus:ring-lime transition"
              required
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-lime rounded-xl font-semibold text-dark text-base disabled:opacity-50 hover:bg-limeDark transition shadow-lg shadow-lime/40 mt-2"
          >
            {loading ? "Memproses..." : "Daftar"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-grayText">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-limeDark font-medium hover:underline">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
