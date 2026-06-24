"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: authError } = await signIn(email, password);

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
          <Image src="/buddy.webp" alt="Logo" width={100} height={100} />
        </div>
        <h1 className="text-2xl font-bold text-dark">Naomi</h1>
        <p className="text-sm text-grayText mt-1">Personal Budget Tracker</p>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
        <h2 className="text-xl font-bold text-dark mb-1">Selamat Datang</h2>
        <p className="text-sm text-grayText mb-6">Masuk ke akun kamu</p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
            <p className="text-sm text-expense">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="Masukkan password"
              className="w-full text-sm text-dark py-3 bg-grayLight rounded-xl px-4 outline-none focus:ring-2 focus:ring-lime transition"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-lime rounded-xl font-semibold text-dark text-base disabled:opacity-50 hover:bg-limeDark transition shadow-lg shadow-lime/40 mt-2"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-grayText">
            Belum punya akun?{" "}
            <Link href="/register" className="text-limeDark font-medium hover:underline">
              Daftar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
