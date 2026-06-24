"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/app/components/BottomNav";
import { useAuth } from "@/app/context/AuthContext";
import { useTheme } from "@/app/context/ThemeContext";

export default function SettingsPage() {
  const router = useRouter();
  const { user, signOut, updateProfile } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user?.user_metadata?.name) {
      setName(user.user_metadata.name);
    }
  }, [user]);

  const handleSaveName = async () => {
    setSaving(true);
    await updateProfile(name);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <>
      <header className="px-5 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="w-10 h-10 glass-card flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-100">Settings</h1>
        </div>
      </header>

      <main className="px-5 pb-28">
        <div className="glass-card p-5 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "var(--main-gradient)" }}>
              <span className="text-xl font-bold text-white">{name.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <p className="text-base font-semibold text-gray-100">{name}</p>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 text-sm text-gray-100 py-2 bg-white/10 rounded-xl px-4 outline-none border border-white/10 focus:border-lime transition"
              placeholder="Nama"
            />
            <button
              onClick={handleSaveName}
              disabled={saving}
              className="px-4 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-50 transition"
              style={{ background: "var(--main-gradient)" }}
            >
              {saving ? "..." : saved ? "✓" : "Save"}
            </button>
          </div>
        </div>

        <div className="glass-card overflow-hidden mb-6">
          <div className="p-4 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                {darkMode ? (
                  <svg className="w-5 h-5 text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-100">Dark Mode</p>
                <p className="text-xs text-gray-400">{darkMode ? "Aktif" : "Nonaktif"}</p>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`w-12 h-7 rounded-full transition-colors duration-200 ${darkMode ? "" : "bg-gray-600"}`}
              style={darkMode ? { background: "var(--main-gradient)" } : {}}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${darkMode ? "translate-x-6" : "translate-x-1"}`}></div>
            </button>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full p-4 flex items-center gap-3 hover:bg-red-500/10 transition"
          >
            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-expense" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m-7 14V8m0 0L3 12m0 0l4 4" />
              </svg>
            </div>
            <span className="text-sm font-medium text-expense">Logout</span>
          </button>
        </div>

        <div className="text-center py-4">
          <p className="text-xs text-gray-500">Naomi Budget Tracker v1.0</p>
        </div>
      </main>

      <BottomNav />
    </>
  );
}
