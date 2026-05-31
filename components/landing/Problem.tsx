"use client";

import React from "react";
import { 
  MessageSquare,
  Flag,
  Paperclip,
  MoreHorizontal
} from "lucide-react";

export default function Problem() {
  const painPoints = [
    {
      title: "Asking for Your Own Money Feels Awkward",
    },
    {
      title: "You Need the Payment, But You Don’t Want to Lose the Customer",
    },
    {
      title: "One Delayed Payment Can Disturb Your Whole Business",
    },
    {
      title: "Manual Follow-Ups Become Messy Very Fast",
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

        {/* Pain Cards Horizontal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 md:mt-20 text-left max-w-5xl">
          {painPoints.map((point, index) => {
            return (
              <div 
                key={index} 
                className="relative bg-white border border-gray-200/50 rounded-[2rem] p-7 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.01)] flex flex-col justify-between"
              >
                <div>
                  {index === 0 && (
                    <div className="mb-6 w-full">
                      <TaskBoardVisual />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight font-outfit leading-snug">
                    {point.title}
                  </h3>
                </div>
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

        {/* Task 3: Documentation */}
        <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-[0_2px_8px_rgba(0,0,0,0.015)] space-y-2 opacity-25">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-900 text-xs font-outfit">Documentation</span>
          </div>
          <p className="text-gray-500 text-[10px] leading-snug">
            Write API reference docs
          </p>
          <div className="flex justify-between items-center pt-2 border-t border-gray-50">
            <img 
              className="w-4.5 h-4.5 rounded-full border border-white object-cover filter grayscale" 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=32&h=32&q=80" 
              alt="Member 1" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
