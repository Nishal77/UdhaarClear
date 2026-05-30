"use client";

import React, { useState } from "react";

export default function Mockup() {
  const [hovered, setHovered] = useState(false);

  return (
    <div 
      className="relative flex items-center justify-center py-10 w-full"
      style={{ perspective: "1200px" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 3D Angled Phone Wrapper */}
      <div
        className="relative w-[310px] h-[630px] rounded-[50px] bg-slate-900 shadow-[25px_25px_50px_rgba(0,0,0,0.15),-10px_-10px_30px_rgba(255,255,255,0.8),inset_0_0_2px_2px_rgba(255,255,255,0.2)] border-[8px] border-slate-800 transition-all duration-700 ease-out"
        style={{
          transform: hovered
            ? "rotateY(-8deg) rotateX(8deg) rotateZ(1deg) scale(1.02) translateY(-10px)"
            : "rotateY(-18deg) rotateX(12deg) rotateZ(3deg)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Device Side Buttons (Visual Highlights) */}
        <div className="absolute -left-[11px] top-[110px] w-[3px] h-[50px] bg-slate-700 rounded-l" />
        <div className="absolute -left-[11px] top-[175px] w-[3px] h-[50px] bg-slate-700 rounded-l" />
        <div className="absolute -right-[11px] top-[140px] w-[3px] h-[75px] bg-slate-700 rounded-r" />

        {/* Screen Container */}
        <div className="relative w-full h-full rounded-[42px] overflow-hidden bg-white flex flex-col justify-between p-4 select-none">
          
          {/* iOS Top Bar & Dynamic Island */}
          <div className="flex items-center justify-between w-full px-4 pt-1 pb-2">
            <span className="text-[11px] font-bold text-gray-900">9:41</span>
            
            {/* Dynamic Island */}
            <div className="absolute left-1/2 -translate-x-1/2 top-3.5 w-24 h-5 bg-black rounded-full z-20 flex items-center justify-end px-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
              <span className="w-1 h-1 rounded-full bg-indigo-900/50" />
            </div>
            
            <div className="flex items-center gap-1.5">
              {/* Cellular Signal Icon */}
              <svg className="w-3.5 h-3.5 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                <rect x="2" y="16" width="3" height="5" rx="0.5" />
                <rect x="7" y="12" width="3" height="9" rx="0.5" />
                <rect x="12" y="8" width="3" height="13" rx="0.5" />
                <rect x="17" y="3" width="3" height="18" rx="0.5" />
              </svg>
              {/* Battery */}
              <div className="w-5 h-2.5 border border-gray-900 rounded-sm p-[1px] flex items-center">
                <div className="h-full w-4 bg-gray-900 rounded-2xs" />
                <div className="w-[1.5px] h-1 bg-gray-900 rounded-r-3xs ml-[0.5px]" />
              </div>
            </div>
          </div>

          {/* Main App Content Scroll Container */}
          <div className="flex-1 overflow-y-auto no-scrollbar pt-2 flex flex-col gap-4">
            
            {/* User Greeting */}
            <div className="flex items-center justify-between px-2">
              <div>
                <p className="text-[10px] text-gray-400 font-medium leading-none">Good morning,</p>
                <h4 className="text-sm font-bold text-gray-900 mt-1 font-outfit">James Lee</h4>
              </div>
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"
                alt="Avatar"
                className="w-8 h-8 rounded-full border border-gray-100 object-cover"
              />
            </div>

            {/* Currency Tabs */}
            <div className="flex items-center justify-between px-2">
              <div className="flex gap-1.5">
                <span className="px-2.5 py-0.5 text-[9px] font-bold text-white bg-blue-600 rounded-full">USD</span>
                <span className="px-2.5 py-0.5 text-[9px] font-medium text-gray-400 bg-gray-100 rounded-full hover:bg-gray-200 cursor-pointer">IDR</span>
              </div>
              <button className="text-[9px] font-semibold text-blue-600 hover:underline flex items-center gap-0.5">
                <span>+</span> Add Currency
              </button>
            </div>

            {/* Glassmorphic Fizen Debit Card */}
            <div className="relative mx-1 h-36 rounded-2xl p-4 text-white overflow-hidden shadow-lg shadow-blue-500/10 flex flex-col justify-between transition-transform duration-300 hover:scale-[1.02]">
              {/* Card Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 z-0" />
              <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] z-0" />
              {/* Soft decorative light circles */}
              <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-white/10 rounded-full blur-xl" />
              <div className="absolute -left-4 -top-4 w-20 h-20 bg-blue-400/20 rounded-full blur-lg" />

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 rounded bg-white/20 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                      <path d="M2 17L12 22L22 17" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-bold tracking-tight">Fizen Card</span>
                </div>
                <div className="flex -space-x-1.5 opacity-90">
                  <div className="w-3.5 h-3.5 rounded-full bg-white/40" />
                  <div className="w-3.5 h-3.5 rounded-full bg-white/70" />
                </div>
              </div>

              <div className="relative z-10 my-2">
                <div className="text-[9px] text-white/70 font-medium">Balance</div>
                <div className="text-xl font-bold flex items-center gap-1 tracking-tight font-outfit">
                  $2,736.15
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex items-center justify-center text-[7px] text-white font-bold p-0.5">
                    ✓
                  </div>
                </div>
              </div>

              <div className="relative z-10 flex items-center justify-between text-[9px] text-white/80 font-mono tracking-widest">
                <span>•••• 5318</span>
                <span className="text-[8px] font-sans opacity-70">12/28</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-2 px-1">
              <button className="flex flex-col items-center justify-center py-2.5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <span className="text-[9px] font-semibold text-gray-600 mt-1.5">Top-up</span>
              </button>
              <button className="flex flex-col items-center justify-center py-2.5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                </div>
                <span className="text-[9px] font-semibold text-gray-600 mt-1.5">Withdraw</span>
              </button>
              <button className="flex flex-col items-center justify-center py-2.5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                  </svg>
                </div>
                <span className="text-[9px] font-semibold text-gray-600 mt-1.5">Transfer</span>
              </button>
            </div>

            {/* Transactions */}
            <div className="flex flex-col gap-2 px-1">
              <div className="flex items-center justify-between text-[11px] font-bold px-1">
                <span className="text-gray-900 font-outfit">Transactions</span>
                <button className="text-blue-600 text-[9px] font-semibold hover:underline">See all</button>
              </div>

              <div className="flex flex-col gap-1.5">
                {/* Transaction 1 */}
                <div className="flex items-center justify-between p-2 bg-gray-50/60 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center">
                      {/* Apple Icon */}
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.49-.62.72-1.16 1.87-1.02 2.98 1.11.09 2.24-.6 2.95-1.41z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-900 leading-tight">Apple Store</p>
                      <p className="text-[8px] text-gray-400 mt-0.5">iPhone 12 Case</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-red-500">-$120.90</p>
                    <p className="text-[7px] text-gray-400 mt-0.5">09:30 AM</p>
                  </div>
                </div>

                {/* Transaction 2 */}
                <div className="flex items-center justify-between p-2 bg-gray-50/60 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80"
                      alt="User"
                      className="w-7 h-7 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-[10px] font-bold text-gray-900 leading-tight">Ilya Vasil</p>
                      <p className="text-[8px] text-gray-400 mt-0.5">Energy Drink</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-emerald-500">+$50.00</p>
                    <p className="text-[7px] text-gray-400 mt-0.5">08:12 AM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* App Bottom Tab Navigation */}
          <div className="border-t border-gray-100 pt-2 flex items-center justify-between px-3 text-gray-400">
            <button className="flex flex-col items-center text-blue-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              <span className="text-[7px] font-semibold mt-0.5">Home</span>
            </button>
            <button className="flex flex-col items-center hover:text-gray-900 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
              </svg>
              <span className="text-[7px] font-medium mt-0.5">Statistics</span>
            </button>
            
            {/* Center Floating Button */}
            <div className="relative -top-4 w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>

            <button className="flex flex-col items-center hover:text-gray-900 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75-3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
              </svg>
              <span className="text-[7px] font-medium mt-0.5">Cards</span>
            </button>
            <button className="flex flex-col items-center hover:text-gray-900 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <span className="text-[7px] font-medium mt-0.5">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
