"use client";

import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Comment01Icon, Calendar01Icon, CreditCardIcon } from "@hugeicons/core-free-icons";

export default function SocialProofStats() {
  const cards = [
    {
      icon: Comment01Icon,
      title: "Asking customers for money feels awkward",
      body: "You did the work. You delivered the goods. But calling your customer to ask for payment feels embarrassing and ruins relationships. So you wait—and the money stays stuck.",
      quote: "Bhai, I will pay tomorrow... 100%.",
      glowColor: "to-rose-500/15"
    },
    {
      icon: Calendar01Icon,
      title: "Dozens of customer bills get forgotten",
      body: "When you have dozens of customers, you lose track of who owes what. By the time you notice an invoice is overdue, weeks have passed. Keeping track in notebooks is a mess.",
      quote: "Oh, this bill has been pending for 3 months? I completely forgot.",
      glowColor: "to-amber-500/15"
    },
    {
      icon: CreditCardIcon,
      title: "Your cash flow gets stuck but bills don't",
      body: "Your rent, salaries, and supplier bills have strict deadlines. But when customers delay your payments, you run out of cash to run your daily business.",
      quote: "I don't have cash right now because my customers haven't paid me yet.",
      glowColor: "to-sky-500/20"
    }
  ];

  return (
    <section className="relative w-full overflow-hidden bg-[#FFFFFF] py-20 md:py-28 select-none">
      
      <div className="relative max-w-[1340px] mx-auto px-6 md:px-8 z-10 w-full flex flex-col space-y-12">
        
        {/* Header Block - Groups Badge & Title tightly */}
        <div className="flex flex-col items-center text-center ">
          {/* Pain Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border border-red-200/60 bg-red-50/40 text-red-600 text-sm font-medium tracking-tight font-outfit mb-5 select-none">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-red-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
           Sound familiar?
          </div>
          
          {/* Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-[3.55rem] font-normal text-gray-950 tracking-tight leading-[1.12] md:leading-[1.08] font-outfit">
            Every business owner <br />
            knows this pain.
          </h2>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full text-left">
          {cards.map((card, index) => (
            <div 
              key={index}
              className="bg-[#F5F3EB] rounded-[2rem] p-7 md:p-8 flex flex-col justify-between gap-6 relative overflow-hidden group hover:shadow-[0_16px_36px_rgba(0,0,0,0.02)] transition-all duration-300"
            >
              {/* Premium Glow Effect in Bottom Right */}
              <div className={`absolute -bottom-8 -right-8 w-36 h-36 rounded-full blur-2xl pointer-events-none transition-all duration-500 group-hover:scale-125 bg-gradient-to-br from-transparent ${card.glowColor}`} />
              
              <div className="space-y-4 relative z-10">
                {/* Icon Container */}
                <div className="w-10 h-10 rounded-2xl bg-white border border-black/[0.04] text-gray-900 flex items-center justify-center shrink-0 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                  <HugeiconsIcon icon={card.icon} className="w-5 h-5" />
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-[22px] font-medium tracking-tight text-gray-950 leading-snug font-outfit max-w-[280px]">
                  {card.title}
                </h3>

                {/* Body */}
                <p className="text-gray-500 text-[14.5px] leading-relaxed font-normal">
                  {card.body}
                </p>
              </div>

              {/* Quote Block container */}
              <div className="relative mt-2 pl-6">
                {/* Big decorative quotes icon */}
                <span className="absolute left-0 -top-1.5 text-zinc-300 text-5xl font-serif select-none pointer-events-none leading-none">“</span>
                <p className="text-zinc-600 font-sans  text-[16px] md:text-[17px] font-medium leading-relaxed relative z-10">
                  {card.quote}”
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

