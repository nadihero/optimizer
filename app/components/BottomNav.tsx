"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <nav className="fixed bottom-4 left-4 right-4 bg-white border border-grayMid/30 z-50 max-w-md mx-auto rounded-3xl shadow-lg shadow-black/5">
        <div className="flex justify-around items-center py-2 px-2">
          <Link href="/" className={`flex flex-col items-center gap-1 p-2 transition ${isActive("/") ? "text-dark" : "text-grayText hover:text-dark hover:opacity-70"}`}>
            <div className="w-6 h-6">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 11.9896V14.5C3 17.7998 3 19.4497 4.02513 20.4749C5.05025 21.5 6.70017 21.5 10 21.5H14C17.2998 21.5 18.9497 21.5 19.9749 20.4749C21 19.4497 21 17.7998 21 14.5V11.9896C21 10.3083 21 9.46773 20.6441 8.74005C20.2882 8.01237 19.6247 7.49628 18.2976 6.46411L16.2976 4.90855C14.2331 3.30285 13.2009 2.5 12 2.5C10.7991 2.5 9.76689 3.30285 7.70242 4.90855L5.70241 6.46411C4.37533 7.49628 3.71179 8.01237 3.3559 8.74005C3 9.46773 3 10.3083 3 11.9896Z" />
                <path d="M15 21.5V16.5C15 15.0858 15 14.3787 14.5607 13.9393C14.1213 13.5 13.4142 13.5 12 13.5C10.5858 13.5 9.87868 13.5 9.43934 13.9393C9 14.3787 9 15.0858 9 16.5V21.5" />
              </svg>
            </div>
            <span className="text-[10px] font-medium">Home</span>
          </Link>

          <Link href="/stats" className={`flex flex-col items-center gap-1 p-2 transition ${isActive("/stats") ? "text-dark" : "text-grayText hover:text-dark hover:opacity-70"}`}>
            <div className="w-6 h-6">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
                <path d="M21 21H10C6.70017 21 5.05025 21 4.02513 19.9749C3 18.9497 3 17.2998 3 14V3" />
                <path d="M7 4H8" />
                <path d="M7 7H11" />
                <path d="M5 20C6.07093 18.053 7.52279 13.0189 10.3063 13.0189C12.2301 13.0189 12.7283 15.4717 14.6136 15.4717C17.8572 15.4717 17.387 10 21 10" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-[10px] font-medium">Stats</span>
          </Link>

          <Link href="/add" className="flex flex-col items-center gap-1 p-1 -mt-6 transition duration-200 hover:scale-110">
            <div className="w-14 h-14 bg-lime rounded-full flex items-center justify-center shadow-lg shadow-lime/40">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12.001 5.00003V19.002" />
                <path d="M19.002 12.002L4.99998 12.002" />
              </svg>
            </div>
          </Link>

          <Link href="/budget" className={`flex flex-col items-center gap-1 p-2 transition ${isActive("/budget") ? "text-dark" : "text-grayText hover:text-dark hover:opacity-70"}`}>
            <div className="w-6 h-6">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.0001 17V7C10.0001 5.11438 10.0001 4.17157 9.41427 3.58579C8.82849 3 7.88568 3 6.00005 3C4.11444 3 3.17163 3 2.58584 3.58578C2.00006 4.17157 2.00005 5.11437 2.00004 6.99998L2 17C1.99999 18.8856 1.99999 19.8284 2.58577 20.4142C3.17156 21 4.11438 21 6.00003 21C7.88567 21 8.82849 21 9.41427 20.4142C10.0001 19.8284 10.0001 18.8856 10.0001 17Z" />
                <path d="M21.4558 15.7091L19.0473 7.19224C18.572 5.51165 18.3343 4.67135 17.6838 4.2617C17.6312 4.22861 17.5772 4.19796 17.5218 4.16986C16.8358 3.82199 15.9877 4.04691 14.2916 4.49674C12.5529 4.95783 11.6836 5.18838 11.2632 5.84738C11.2293 5.90053 11.198 5.95524 11.1693 6.01134C10.8134 6.70684 11.057 7.5682 11.5442 9.2909L13.9527 17.8078C14.428 19.4884 14.6657 20.3287 15.3162 20.7383C15.3688 20.7714 15.4228 20.802 15.4782 20.8301C16.1642 21.178 17.0123 20.9531 18.7084 20.5033C20.4471 20.0422 21.3164 19.8116 21.7368 19.1526C21.7707 19.0995 21.802 19.0448 21.8307 18.9887C22.1866 18.2932 21.943 17.4318 21.4558 15.7091Z" />
                <path d="M2 7H10" />
                <path d="M12 9.00019L19 7" />
                <path d="M6.125 17H6M6.25 17C6.25 17.1381 6.13807 17.25 6 17.25C5.86193 17.25 5.75 17.1381 5.75 17C5.75 16.8619 5.86193 16.75 6 16.75C6.13807 16.75 6.25 16.8619 6.25 17Z" />
                <path d="M17.7307 16.75H17.6057M17.8557 16.75C17.8557 16.8881 17.7437 17 17.6057 17C17.4676 17 17.3557 16.8881 17.3557 16.75C17.3557 16.6119 17.4676 16.5 17.6057 16.5C17.7437 16.5 17.8557 16.6119 17.8557 16.75Z" />
              </svg>
            </div>
            <span className="text-[10px] font-medium">Budget</span>
          </Link>

          <div className="relative">
            <button onClick={() => setMoreMenuOpen(!moreMenuOpen)} className={`flex flex-col items-center gap-1 p-2 transition ${["/goals", "/debt", "/trials", "/subs", "/daily"].includes(pathname) ? "text-dark" : "text-grayText hover:text-dark hover:opacity-70"}`}>
              <div className="w-6 h-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 17.9808V12.7075C3 9.07416 3 7.25748 4.09835 6.12874C5.1967 5 6.96447 5 10.5 5C14.0355 5 15.8033 5 16.9017 6.12874C18 7.25748 18 9.07416 18 12.7075V17.9808C18 20.2867 18 21.4396 17.2755 21.8523C15.8724 22.6514 13.2405 19.9852 11.9906 19.1824C11.2657 18.7168 10.9033 18.484 10.5 18.484C10.0967 18.484 9.73425 18.7168 9.00938 19.1824C7.7595 19.9852 5.12763 22.6514 3.72454 21.8523C3 21.4396 3 20.2867 3 17.9808Z" />
                  <path d="M9 2H11C15.714 2 18.0711 2 19.5355 3.46447C21 4.92893 21 7.28595 21 12V18" />
                </svg>
              </div>
              <span className="text-[10px] font-medium">More</span>
            </button>
            {moreMenuOpen && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white rounded-2xl shadow-xl border border-grayMid/30 p-2 min-w-[140px]">
                <Link href="/goals" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-grayLight transition">
                  <svg className="w-4 h-4 text-grayText" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <span className="text-sm">Goals</span>
                </Link>
                <Link href="/debt" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-grayLight transition">
                  <svg className="w-4 h-4 text-grayText" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth={2} />
                    <line x1="12" y1="8" x2="12" y2="12" strokeWidth={2} />
                    <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth={2} />
                  </svg>
                  <span className="text-sm">Debt</span>
                </Link>
                <Link href="/trials" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-grayLight transition">
                  <svg className="w-4 h-4 text-grayText" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-sm">Trials</span>
                </Link>
                <Link href="/subs" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-grayLight transition">
                  <svg className="w-4 h-4 text-grayText" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth={2} />
                    <line x1="16" y1="2" x2="16" y2="6" strokeWidth={2} />
                    <line x1="8" y1="2" x2="8" y2="6" strokeWidth={2} />
                    <line x1="3" y1="10" x2="21" y2="10" strokeWidth={2} />
                  </svg>
                  <span className="text-sm">Subs</span>
                </Link>
                <Link href="/daily" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-grayLight transition">
                  <svg className="w-4 h-4 text-grayText" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth={2} />
                    <line x1="16" y1="2" x2="16" y2="6" strokeWidth={2} />
                    <line x1="8" y1="2" x2="8" y2="6" strokeWidth={2} />
                    <line x1="3" y1="10" x2="21" y2="10" strokeWidth={2} />
                  </svg>
                  <span className="text-sm">Daily</span>
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
