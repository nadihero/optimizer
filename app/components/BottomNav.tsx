"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lineicons } from "@lineiconshq/react-lineicons";
import { ArrowAllDirectionBulk, BarChart4Bulk, BarChartDollarBulk, Bulb2Bulk, Home2Bulk, Wallet1Bulk } from "@lineiconshq/free-icons";

export default function BottomNav() {
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const linkClass = (path: string) =>
    `flex flex-col items-center gap-1 p-2 transition ${isActive(path) ? "text-lime" : "text-gray-400 hover:text-gray-200"}`;

  return (
    <>
      <nav className="fixed bottom-4 left-4 right-4 glass-card z-50 max-w-md mx-auto rounded-3xl">
        <div className="flex justify-around items-center py-2 px-2">
          <Link href="/" className={linkClass("/")}>
            <div className="w-6 h-6">
              <Lineicons
                icon={Home2Bulk}
                size={24}
                strokeWidth={1.5}
              />
            </div>
            <span className="text-[10px] font-medium">Home</span>
          </Link>

          <Link href="/stats" className={linkClass("/stats")}>
            <div className="w-6 h-6">
              <Lineicons
                icon={BarChartDollarBulk}
                size={24}
                strokeWidth={1.5}
              />
            </div>
            <span className="text-[10px] font-medium">Stats</span>
          </Link>

          <Link href="/budget" className={linkClass("/budget")}>
            <div className="w-6 h-6">
              <Lineicons
                icon={Wallet1Bulk}
                size={24}
                strokeWidth={1.5}
              />
            </div>
            <span className="text-[10px] font-medium">Budget</span>
          </Link>

          <div className="relative">
            <button onClick={() => setMoreMenuOpen(!moreMenuOpen)} className={linkClass("/more")}>
              <div className="w-6 h-6">
                <Lineicons
                  icon={ArrowAllDirectionBulk}
                  size={24}
                  strokeWidth={1.5}
                />
              </div>
              <span className="text-[10px] font-medium">More</span>
            </button>

            {moreMenuOpen && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 glass-card p-2 min-w-[140px]">
                <Link href="/goals" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition">
                  <svg className="w-4 h-4 text-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <span className="text-sm text-gray-200">Goals</span>
                </Link>
                <Link href="/debt" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition">
                  <svg className="w-4 h-4 text-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth={2} />
                    <line x1="12" y1="8" x2="12" y2="12" strokeWidth={2} />
                    <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth={2} />
                  </svg>
                  <span className="text-sm text-gray-200">Debt</span>
                </Link>
                <Link href="/trials" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition">
                  <svg className="w-4 h-4 text-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-sm text-gray-200">Trials</span>
                </Link>
                <Link href="/subs" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition">
                  <svg className="w-4 h-4 text-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth={2} />
                    <line x1="16" y1="2" x2="16" y2="6" strokeWidth={2} />
                    <line x1="8" y1="2" x2="8" y2="6" strokeWidth={2} />
                    <line x1="3" y1="10" x2="21" y2="10" strokeWidth={2} />
                  </svg>
                  <span className="text-sm text-gray-200">Subs</span>
                </Link>
                <Link href="/daily" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition">
                  <svg className="w-4 h-4 text-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth={2} />
                    <line x1="16" y1="2" x2="16" y2="6" strokeWidth={2} />
                    <line x1="8" y1="2" x2="8" y2="6" strokeWidth={2} />
                    <line x1="3" y1="10" x2="21" y2="10" strokeWidth={2} />
                  </svg>
                  <span className="text-sm text-gray-200">Daily</span>
                </Link>
                <div className="border-t border-white/10 my-1"></div>
                <Link href="/settings" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition">
                  <svg className="w-4 h-4 text-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm text-gray-200">Settings</span>
                </Link>

              </div>
            )}
          </div>
        </div>
      </nav>
      {moreMenuOpen && <div className="fixed inset-0 z-40" onClick={() => setMoreMenuOpen(false)} />}
    </>
  );
}
