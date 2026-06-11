"use client";

import { useState, useEffect } from "react";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only check and set visibility on client side to avoid hydration mismatch
    const consent = localStorage.getItem("udhaarclear-cookie-consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("udhaarclear-cookie-consent", "accepted");
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem("udhaarclear-cookie-consent", "rejected");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 sm:right-auto sm:max-w-xl md:max-w-2xl z-50 bg-white border border-zinc-200/80 rounded-2xl shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1),_0_0_1px_rgba(0,0,0,0.05)] p-5 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-sm text-zinc-600 leading-relaxed font-sans pr-2">
          This site uses cookies to improve your experience and analyze site usage.
        </p>
        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
          <button
            onClick={handleReject}
            className="px-[18px] py-2.5 text-sm font-medium border border-zinc-300 hover:border-zinc-400 rounded-[10px] bg-white text-zinc-800 transition-all hover:bg-zinc-50 active:scale-[0.98] cursor-pointer"
          >
            Reject
          </button>
          <button
            onClick={handleAccept}
            className="px-[18px] py-2.5 text-sm font-medium rounded-[10px] bg-zinc-900 hover:bg-black text-white transition-all active:scale-[0.98] cursor-pointer"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
