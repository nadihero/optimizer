"use client";

import { formatRupiah } from "@/app/lib/utils";

interface SummaryCardProps {
  type: "income" | "expense";
  amount: string;
}

export default function SummaryCard({ type, amount }: SummaryCardProps) {
  const isIncome = type === "income";

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isIncome ? "bg-income/20" : "bg-expense/20"}`}>
          {isIncome ? (
            <svg className="w-4 h-4 text-income" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-expense" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
            </svg>
          )}
        </div>
        <span className="text-xs font-medium text-grayText dark:text-gray-400">
          {isIncome ? "Pemasukan" : "Pengeluaran"}
        </span>
      </div>
      <p className="text-lg font-bold text-gray-100">{amount}</p>
    </div>
  );
}
