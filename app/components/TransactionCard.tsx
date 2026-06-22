"use client";

import { useState } from "react";
import { useApp } from "@/app/context/AppContext";

interface TransactionCardProps {
  id: string;
  name: string;
  date: string;
  amount: string;
  type: "income" | "expense";
  iconColor: string;
}

export default function TransactionCard({ id, name, date, amount, type, iconColor }: TransactionCardProps) {
  const { deleteTransaction, updateTransaction } = useApp();
  const [showActions, setShowActions] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editAmount, setEditAmount] = useState(amount.replace(/[^\d]/g, ""));
  const isIncome = type === "income";

  const handleDelete = () => {
    if (confirm("Hapus transaksi ini?")) {
      deleteTransaction(id);
    }
  };

  const handleSave = () => {
    updateTransaction(id, {
      description: editName,
      amount: Number(editAmount),
    });
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="p-4 bg-white dark:bg-darkCard rounded-xl border border-grayMid dark:border-gray-700">
        <div className="space-y-3">
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="w-full text-sm text-dark dark:text-gray-100 py-2 bg-grayLight dark:bg-dark rounded-lg px-3 outline-none"
            placeholder="Nama"
          />
          <input
            type="text"
            value={editAmount}
            onChange={(e) => setEditAmount(e.target.value.replace(/\D/g, ""))}
            className="w-full text-sm text-dark dark:text-gray-100 py-2 bg-grayLight dark:bg-dark rounded-lg px-3 outline-none"
            inputMode="numeric"
            placeholder="Jumlah"
          />
          <div className="flex gap-2">
            <button onClick={() => setEditing(false)} className="flex-1 py-2 bg-grayLight dark:bg-dark rounded-lg text-sm text-grayText">Batal</button>
            <button onClick={handleSave} className="flex-1 py-2 bg-lime rounded-lg text-sm font-medium text-dark">Simpan</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-between p-4 bg-white dark:bg-darkCard rounded-xl border border-transparent dark:border-gray-700 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] dark:hover:shadow-none active:scale-[0.98] active:bg-grayLight dark:active:bg-gray-800 cursor-pointer"
      onClick={() => setShowActions(!showActions)}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-grayLight dark:bg-dark rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color={iconColor} fill="none" stroke={iconColor} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            {isIncome ? (
              <path d="M15.544 11.5H15V17.5C15 18.4319 15 18.8978 14.8478 19.2654C14.6448 19.7554 14.2554 20.1448 13.7654 20.3478C13.3978 20.5 12.9319 20.5 12 20.5C11.0681 20.5 10.6022 20.5 10.2346 20.3478C9.74458 20.1448 9.35523 19.7554 9.15224 19.2654C9 18.8978 9 18.4319 9 17.5V11.5H8.45596C6.37322 11.5 5.33185 11.5 5.05779 10.8997C4.78372 10.2994 5.49744 9.58174 6.92487 8.14642L10.4689 4.58281C11.1868 3.86094 11.5458 3.5 12 3.5C12.4542 3.5 12.8132 3.86094 13.5311 4.58281L17.0751 8.14643C18.5026 9.58175 19.2163 10.2994 18.9422 10.8997C18.6681 11.5 17.6268 11.5 15.544 11.5Z" />
            ) : (
              <path d="M15.544 12.5H15V6.5C15 5.56812 15 5.10218 14.8478 4.73463C14.6448 4.24458 14.2554 3.85523 13.7654 3.65224C13.3978 3.5 12.9319 3.5 12 3.5C11.0681 3.5 10.6022 3.5 10.2346 3.65224C9.74458 3.85523 9.35523 4.24458 9.15224 4.73463C9 5.10218 9 5.56812 9 6.5V12.5H8.45596C6.37322 12.5 5.33185 12.5 5.05779 13.1003C4.78372 13.7006 5.49744 14.4183 6.92487 15.8536L10.4689 19.4172C11.1868 20.1391 11.5458 20.5 12 20.5C12.4542 20.5 12.8132 20.1391 13.5311 19.4172L17.0751 15.8536C18.5026 14.4183 19.2163 13.7006 18.9422 13.1003C18.6681 12.5 17.6268 12.5 15.544 12.5Z" />
            )}
          </svg>
        </div>
        <div>
          <p className="font-medium text-dark dark:text-gray-100 text-sm">{name}</p>
          <p className="text-xs text-grayText dark:text-gray-400">{date}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`font-semibold text-sm ${isIncome ? "text-income" : "text-dark dark:text-gray-100"}`}>
          {isIncome ? "+" : "-"}{amount}
        </span>
        {showActions && (
          <div className="flex gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); setEditing(true); }}
              className="p-1.5 hover:bg-grayLight dark:hover:bg-gray-700 rounded-full transition"
            >
              <svg className="w-4 h-4 text-iosBlue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleDelete(); }}
              className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition"
            >
              <svg className="w-4 h-4 text-expense" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
