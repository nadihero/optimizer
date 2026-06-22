"use client";

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
  const { deleteTransaction } = useApp();
  const isIncome = type === "income";

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl transition duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] active:scale-[0.98] active:bg-grayLight cursor-pointer group">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-grayLight rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color={iconColor} fill="none" stroke={iconColor} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            {isIncome ? (
              <path d="M15.544 11.5H15V17.5C15 18.4319 15 18.8978 14.8478 19.2654C14.6448 19.7554 14.2554 20.1448 13.7654 20.3478C13.3978 20.5 12.9319 20.5 12 20.5C11.0681 20.5 10.6022 20.5 10.2346 20.3478C9.74458 20.1448 9.35523 19.7554 9.15224 19.2654C9 18.8978 9 18.4319 9 17.5V11.5H8.45596C6.37322 11.5 5.33185 11.5 5.05779 10.8997C4.78372 10.2994 5.49744 9.58174 6.92487 8.14642L10.4689 4.58281C11.1868 3.86094 11.5458 3.5 12 3.5C12.4542 3.5 12.8132 3.86094 13.5311 4.58281L17.0751 8.14643C18.5026 9.58175 19.2163 10.2994 18.9422 10.8997C18.6681 11.5 17.6268 11.5 15.544 11.5Z" />
            ) : (
              <path d="M15.544 12.5H15V6.5C15 5.56812 15 5.10218 14.8478 4.73463C14.6448 4.24458 14.2554 3.85523 13.7654 3.65224C13.3978 3.5 12.9319 3.5 12 3.5C11.0681 3.5 10.6022 3.5 10.2346 3.65224C9.74458 3.85523 9.35523 4.24458 9.15224 4.73463C9 5.10218 9 5.56812 9 6.5V12.5H8.45596C6.37322 12.5 5.33185 12.5 5.05779 13.1003C4.78372 13.7006 5.49744 14.4183 6.92487 15.8536L10.4689 19.4172C11.1868 20.1391 11.5458 20.5 12 20.5C12.4542 20.5 12.8132 20.1391 13.5311 19.4172L17.0751 15.8536C18.5026 14.4183 19.2163 13.7006 18.9422 13.1003C18.6681 12.5 17.6268 12.5 15.544 12.5Z" />
            )}
          </svg>
        </div>
        <div>
          <p className="font-medium text-dark text-sm">{name}</p>
          <p className="text-xs text-grayText">{date}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`font-semibold text-sm ${isIncome ? "text-income" : "text-dark"}`}>
          {isIncome ? "+" : "-"}{amount}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm("Hapus transaksi ini?")) {
              deleteTransaction(id);
            }
          }}
          className="opacity-0 group-hover:opacity-100 transition p-1 hover:bg-red-50 rounded-full"
        >
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
