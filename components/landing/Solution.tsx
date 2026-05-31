"use client";

import React from "react";
import { 
  HeartHandshake, 
  Link as LinkIcon, 
  Sparkles, 
  LayoutDashboard 
} from "lucide-react";

export default function Solution() {
  const solutionCards = [
    {
      title: "Polite Reminders That Feel Human",
      description: "Start with respectful WhatsApp reminders that protect your customer relationship.",
      icon: HeartHandshake,
      iconBg: "bg-emerald-50 border-emerald-100/50 text-emerald-500",
    },
    {
      title: "Payment Links That Make Paying Easy",
      description: "Every reminder includes a simple payment link, so customers can pay without asking for bank details again.",
      icon: LinkIcon,
      iconBg: "bg-blue-50 border-blue-100/50 text-[#0047FF]",
    },
    {
      title: "Smart Follow-ups When Customers Delay",
      description: "If a customer ignores the first reminder, UdhaarClear continues the follow-up in a more serious tone.",
      icon: Sparkles,
      iconBg: "bg-violet-50 border-violet-100/50 text-violet-500",
    },
    {
      title: "Clear Dashboard for Every Invoice",
      description: "Know who paid, who delayed, who opened the reminder, and who needs attention today.",
      icon: LayoutDashboard,
      iconBg: "bg-amber-50 border-amber-100/50 text-amber-500",
    },
  ];

  return (
    <section className="relative w-full bg-[#FFFFFF] py-20 md:py-28 lg:py-32 overflow-hidden border-b border-gray-100">
      
      {/* Decorative background grid and lights */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at top right, rgba(0, 73, 255, 0.03), transparent 500px),
            radial-gradient(circle at bottom left, rgba(16, 185, 129, 0.03), transparent 500px)
          `
        }}
      />

      <div className="relative max-w-[1340px] mx-auto px-6 md:px-8 z-10 text-center">
        
        {/* Title */}
        <h2 className="text-[2.75rem] md:text-[3.25rem] font-medium text-gray-900 tracking-tight leading-[1.15] font-outfit max-w-4xl mx-auto">
          UdhaarClear Follows Up for You — Professionally, Patiently, and Automatically.
        </h2>

        {/* Subheading */}
        <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mt-6 font-normal">
          Your customers get the right reminder at the right time. First polite. Then firm. And only when needed, formal. You stay professional, while UdhaarClear keeps the payment moving.
        </p>

        {/* Solution Cards Horizontal Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 md:mt-20 text-left max-w-7xl mx-auto">
          {solutionCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div 
                key={index} 
                className="relative bg-white border border-gray-200/50 rounded-[2rem] p-7 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.01)] flex flex-col justify-between min-h-[240px] sm:min-h-[260px]"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-6 shrink-0 ${card.iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-3 font-outfit">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed font-normal">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
