"use client";

import React from "react";
import { 
  MessageSquare,
  Flag,
  Paperclip,
  MoreHorizontal,
  ArrowDown,
  User,
  Heart
} from "lucide-react";

export default function Problem() {
  const painPoints = [
    {
      title: "Asking for Your Own Money Feels Awkward",
      description: "Following up for payment should not feel personal or uncomfortable.",
    },
    {
      title: "You Need the Payment, But You Don’t Want to Lose the Customer",
      description: "Recover dues without sounding rude, pushy, or desperate.",
    },
    {
      title: "One Delayed Payment Can Disturb Your Whole Business",
      description: "When money gets stuck, your cash flow feels the pressure.",
    },
    {
      title: "Manual Follow-Ups Become Messy Very Fast",
      description: "Chats, calls, sheets, and reminders become hard to track.",
    },
  ];

  return (
    <section className="relative w-full bg-[#FFFFFF] py-20 md:py-28 lg:py-32 overflow-hidden">
      
      {/* Decorative background grid and lights */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at top right, rgba(0, 73, 255, 0.05), transparent 500px),
            radial-gradient(circle at bottom left, rgba(239, 68, 68, 0.03), transparent 500px)
          `
        }}
      />

      <div className="relative max-w-[1340px] mx-auto px-6 md:px-8 z-10 text-left">
        
        {/* Title */}
        <h2 className="text-[2.75rem] md:text-[3.25rem] font-medium text-gray-900 tracking-tight leading-[1.15] font-outfit max-w-4xl">
          Chasing Payments Shouldn’t Be the Hardest Part of Business.
        </h2>

        {/* Subheading */}
        <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-3xl mt-6 font-normal">
          You delivered the work. You sent the invoice. But now your money is stuck — and you are forced to remind, call, wait, and follow up again.
        </p>

        {/* Pain Cards Asymmetric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-16 md:mt-20 text-left w-full">
          {painPoints.map((point, index) => {
            // Row 1: card 0 = narrow (2), card 1 = wide (3)
            // Row 2: card 2 = wide (3), card 3 = narrow (2)
            const colSpan =
              index === 0 ? "md:col-span-2" :
              index === 1 ? "md:col-span-3" :
              index === 2 ? "md:col-span-3" :
                            "md:col-span-2";
            return (
              <div 
                key={index} 
                className={`${colSpan} relative bg-white border border-gray-200/50 rounded-[2rem] p-5 md:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.01)] flex flex-col`}
              >
                {index === 1 ? (
                  // Card 2: illustration top, text pinned to bottom
                  <>
                    <div className="w-full flex-1 flex">
                      <BalanceSpectrumVisual />
                    </div>
                    <div className="mt-5">
                      <h3 className="text-xl font-semibold text-gray-900 tracking-tight font-outfit leading-snug">
                        {point.title}
                      </h3>
                      <p className="text-gray-500 text-sm md:text-base leading-relaxed mt-2 font-normal">
                        {point.description}
                      </p>
                    </div>
                  </>
                ) : (
                  <div>
                    {index === 0 && (
                      <div className="mb-4 w-full">
                        <TaskBoardVisual />
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight font-outfit leading-snug">
                      {point.title}
                    </h3>
                    <p className="text-gray-500 text-sm md:text-base leading-relaxed mt-2 font-normal">
                      {point.description}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Closing Line Callout */}
        <div className="mt-16 md:mt-24 max-w-3xl text-left">
          <div className="p-6 bg-blue-50/40 border-l-4 border-[#0047FF] rounded-r-2xl">
            <p className="text-gray-800 text-base md:text-lg font-semibold leading-relaxed font-outfit italic">
              &ldquo;The problem isn’t that you’re not following up. The problem is that you’re doing it manually.&rdquo;
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

function BalanceSpectrumVisual() {
  return (
    <div
      className="relative rounded-[1.5rem] overflow-hidden select-none pointer-events-none w-full flex-1 flex flex-col justify-center bg-[#FAFAFA] border border-gray-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.015)]"
      style={{ padding: "28px 20px 28px" }}
    >
      {/* Flow diagram — Flex Container for perfect automatic alignment */}
      <div className="flex items-center justify-between w-full relative" style={{ height: 168 }}>

        {/* LEFT — Trigger pill */}
        <div className="flex-shrink-0 z-10">
          <div
            className="flex items-center gap-2 bg-white border border-gray-200 rounded-full shadow-sm"
            style={{ padding: "0 14px 0 10px", height: 32 }}
          >
            <span
              className="flex items-center justify-center rounded-full bg-green-100"
              style={{ width: 20, height: 20 }}
            >
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M2 5.5L4.5 8L9 3" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="text-gray-800 text-[11px] font-semibold font-outfit whitespace-nowrap">Pending Payment</span>
          </div>
        </div>

        {/* Line 1: Left to Center (automatically stretches to fill gap) */}
        <div className="flex-1 h-[1.5px] bg-[#D1D5DB] min-w-[8px]" />

        {/* CENTER — Dark hub pill */}
        <div className="flex-shrink-0 z-10">
          <div
            className="flex items-center gap-2 bg-gray-900 rounded-full shadow-lg"
            style={{ padding: "0 16px 0 12px", height: 36 }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="2.5" stroke="#9CA3AF" strokeWidth="1.3" />
              <path d="M7 2V4M7 10V12M2 7H4M10 7H12" stroke="#9CA3AF" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <span className="text-white text-[11px] font-bold font-outfit whitespace-nowrap tracking-tight">Professional Follow Up</span>
          </div>
        </div>

        {/* Line 2: Center to Right (SVG scales to fill exact gap) */}
        <div className="flex-1 h-full relative min-w-[24px]">
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 168"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Center hub to top-right pill */}
            <path
              d="M 0 84 C 50 84, 50 42, 100 42"
              stroke="#D1D5DB"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              vectorEffect="non-scaling-stroke"
            />
            {/* Center hub to middle-right pill — horizontal */}
            <path
              d="M 0 84 L 100 84"
              stroke="#D1D5DB"
              strokeWidth="1.5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            {/* Center hub to bottom-right pill */}
            <path
              d="M 0 84 C 50 84, 50 126, 100 126"
              stroke="#D1D5DB"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>

        {/* RIGHT — Three output pills, vertically stacked */}
        <div className="flex-shrink-0 flex flex-col gap-2.5 z-10">
          <div
            className="flex items-center gap-2 bg-white border border-gray-200 rounded-full shadow-sm"
            style={{ padding: "0 14px 0 8px", height: 32 }}
          >
            <span className="flex items-center justify-center rounded-full bg-green-50 border border-green-100" style={{ width: 20, height: 20 }}>
              <MessageSquare className="w-2.5 h-2.5 text-green-600" />
            </span>
            <span className="text-gray-700 text-[11px] font-medium font-outfit whitespace-nowrap">Get Paid</span>
          </div>

          <div
            className="flex items-center gap-2 bg-white border border-gray-200 rounded-full shadow-sm"
            style={{ padding: "0 14px 0 8px", height: 32 }}
          >
            <span className="flex items-center justify-center rounded-full bg-blue-50 border border-blue-100" style={{ width: 20, height: 20 }}>
              <Paperclip className="w-2.5 h-2.5 text-blue-600" />
            </span>
            <span className="text-gray-700 text-[11px] font-medium font-outfit whitespace-nowrap">Payment Link</span>
          </div>

          <div
            className="flex items-center gap-2 bg-white border border-gray-200 rounded-full shadow-sm"
            style={{ padding: "0 14px 0 8px", height: 32 }}
          >
            <span className="flex items-center justify-center rounded-full bg-rose-50 border border-rose-100" style={{ width: 20, height: 20 }}>
              <Heart className="w-2.5 h-2.5 fill-rose-500 text-rose-500" />
            </span>
            <span className="text-gray-700 text-[11px] font-medium font-outfit whitespace-nowrap">Trust Kept</span>
          </div>
        </div>

      </div>
    </div>
  );
}


function TaskBoardVisual() {
  return (
    <div className="bg-[#FAFAFA] border border-gray-200/60 rounded-[1.5rem] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.015)] space-y-3.5 select-none pointer-events-none">
      {/* Column Header */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
          <span className="font-semibold text-gray-900 text-[13px] font-outfit">In Progress</span>
        </div>
        <MoreHorizontal className="w-4 h-4 text-gray-400" />
      </div>

      {/* Task List */}
      <div className="space-y-2.5">
        {/* Task 1: API Integration */}
        <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-[0_2px_8px_rgba(0,0,0,0.015)] space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-900 text-xs font-outfit">API Integration</span>
            <Flag className="w-3.5 h-3.5 text-[#FF5A5F] fill-[#FF5A5F]" />
          </div>
          <p className="text-gray-500 text-[10px] leading-snug">
            Connect payment gateway endpoints
          </p>
          <div className="flex justify-between items-center pt-2 border-t border-gray-50">
            {/* Overlapping Avatars */}
            <div className="flex -space-x-1.5">
              <img 
                className="w-4.5 h-4.5 rounded-full border border-white object-cover filter grayscale" 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=32&h=32&q=80" 
                alt="Member 1" 
              />
              <img 
                className="w-4.5 h-4.5 rounded-full border border-white object-cover" 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=32&h=32&q=80" 
                alt="Member 2" 
              />
            </div>
            {/* Task Stats */}
            <div className="flex items-center gap-2 text-[9px] text-gray-400 font-medium">
              <span className="flex items-center gap-0.5">
                <MessageSquare className="w-3 h-3 text-gray-300" /> 4
              </span>
              <span className="flex items-center gap-0.5">
                <Paperclip className="w-3 h-3 text-gray-300" /> 2
              </span>
            </div>
          </div>
        </div>

        {/* Task 2: User Testing */}
        <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-[0_2px_8px_rgba(0,0,0,0.015)] space-y-2 opacity-60">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-900 text-xs font-outfit">User Testing</span>
          </div>
          <p className="text-gray-500 text-[10px] leading-snug">
            Run usability tests with beta users
          </p>
          <div className="flex justify-between items-center pt-2 border-t border-gray-50">
            <img 
              className="w-4.5 h-4.5 rounded-full border border-white object-cover" 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=32&h=32&q=80" 
              alt="Member 2" 
            />
          </div>
        </div>


      </div>
    </div>
  );
}
