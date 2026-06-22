"use client";

import { useApp } from "@/app/context/AppContext";
import { formatRupiah, formatDate } from "@/app/lib/utils";

interface SummaryCardProps {
  type: "income" | "expense";
  amount: string;
}

export default function SummaryCard({ type, amount }: SummaryCardProps) {
  const isIncome = type === "income";

  return (
    <div className={`rounded-2xl p-4 ${isIncome ? "bg-lime" : "bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]"}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isIncome ? "bg-dark/10" : "bg-red-100"}`}>
          {isIncome ? (
            <svg className="w-4 h-4 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
            </svg>
          )}
        </div>
        <span className={`text-xs font-medium ${isIncome ? "text-dark/70" : "text-gray-500"}`}>
          {isIncome ? "Pemasukan" : "Pengeluaran"}
        </span>
      </div>
      <p className="text-lg font-bold text-dark">{amount}</p>
    </div>
  );
}
