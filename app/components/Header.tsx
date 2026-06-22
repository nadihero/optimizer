"use client";

import { getGreeting } from "@/app/lib/utils";

export default function Header() {
  return (
    <header className="px-5 pt-12 pb-2">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-grayText mb-0.5">{getGreeting()}</p>
          <h1 className="text-xl font-bold text-dark">Asdarium D.</h1>
        </div>
        <div className="flex gap-2">
          <button className="w-10 h-10 bg-grayLight rounded-full flex items-center justify-center hover:bg-grayMid transition relative">
            <svg className="w-5 h-5 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
