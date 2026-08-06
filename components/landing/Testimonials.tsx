"use client";

import React from "react";
import Link from "next/link";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Rajesh Ahuja",
      role: "Ahuja Steel Traders, Ludhiana",
      initials: "RA",
      hasImage: false,
      stars: 5,
      quote: "Honestly I was calling customers myself for years, felt awkward every time. ",
      highlight: "Now the WhatsApp reminder just goes out on its own and half of them pay before I even have to think about it.",
      quoteEnd: " Saved my relationship with a few big clients too, no more awkward calls.",
      readMore: false,
    },
    {
      name: "Priya Menon",
      role: "CA, handles 40+ SME clients",
      initials: "PM",
      hasImage: false,
      stars: 5,
      quote: "Recommend this to most of my clients now. ",
      highlight: "The ledger sync alone saves me hours every month end — I used to reconcile everything manually in Excel.",
      quoteEnd: " Setup took maybe 20 minutes for each business.",
      readMore: true,
    },
    {
      name: "Suresh Patil",
      role: "Patil Hardware & Fittings, Pune",
      initials: "SP",
      hasImage: false,
      stars: 5,
      quote: "3 months pending payment, forgot it existed. ",
      highlight: "UdhaarClear flagged it, sent the legal notice draft, customer paid within the week.",
      quoteEnd: " Would've written that one off otherwise.",
      readMore: false,
    },
    {
      name: "Farida Sheikh",
      role: "Sheikh Textiles, wholesale",
      initials: "FS",
      hasImage: false,
      stars: 4,
      quote: "Took me a while to trust an automated message wouldn't sound rude to my regular buyers. ",
      highlight: "Turned out fine, the tone settings actually matter and you can soften it for repeat customers.",
      quoteEnd: " Still manually check the first message on new accounts though.",
      readMore: false,
    },
    {
      name: "Vikram Deshpande",
      role: "Contractor, civil works",
      initials: "VD",
      hasImage: false,
      stars: 5,
      quote: "Site work means I'm never at a desk to chase bills. ",
      highlight: "Now it runs on its own and I just check the dashboard once a week from my phone.",
      quoteEnd: " Cash flow is way less stressful now.",
      readMore: false,
    },
    {
      name: "Meena Iyer",
      role: "Iyer Electricals, distributor",
      initials: "MI",
      hasImage: false,
      stars: 5,
      quote: "We have maybe 60 retailers on credit at any time. ",
      highlight: "Used to be a full-time headache tracking who owes what. The reminder sequences handle most of it now.",
      quoteEnd: " Still call the big accounts myself, but the small ones sort themselves out.",
      readMore: true,
    },
    {
      name: "Aslam Qureshi",
      role: "Qureshi Auto Spares, Delhi",
      initials: "AQ",
      hasImage: false,
      stars: 5,
      quote: "UPI links in the reminder made a real difference. ",
      highlight: "Customers pay faster when it's one tap instead of asking them to do NEFT and share a screenshot.",
      quoteEnd: "",
      readMore: false,
    },
    {
      name: "Kavita Reddy",
      role: "Reddy Garments Manufacturing",
      initials: "KR",
      hasImage: false,
      stars: 4,
      quote: "Onboarding from our old Excel sheet was a bit of a pain, took a day to import everything correctly. ",
      highlight: "Worth it though, we've recovered close to 3 lakh from invoices I'd basically given up on.",
      quoteEnd: "",
      readMore: false,
    },
  ];

  return (
    <section className="relative w-full bg-[#09090B] py-20 md:py-28 lg:py-32 overflow-hidden border-b border-zinc-900">
      
      {/* 1. Top Header Section (inside centered container to align with logo) */}
      <div className="max-w-[1340px] mx-auto px-6 md:px-8">
        <div className="mb-14 md:mb-20 text-left">
          <span className="text-[16px] font-semibold tracking-tight text-[#B5F670] block mb-3 font-sans">
           Real businesses. Real recovery.
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight font-outfit text-white leading-[1.1] max-w-3xl">
            ₹40+ Lakh recovered.<br />These are the stories.
          </h2>
        </div>
      </div>

      {/* 2. Masonry Grid Section (inside centered container matching alignment) */}
      <div className="max-w-[1340px] mx-auto px-6 md:px-8">
        <div className="columns-1 sm:columns-2 lg:columns-4 gap-4 w-full">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="break-inside-avoid mb-4 bg-white border border-zinc-100 rounded-xl p-5 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.012)] flex flex-col justify-between text-left"
            >
              {/* Header */}
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-10 h-10 rounded-full bg-zinc-950 text-zinc-100 flex items-center justify-center font-bold text-xs shrink-0 select-none">
                  {t.initials}
                </div>
                <div className="flex flex-col text-left overflow-hidden">
                  <span className="text-[13.5px] font-semibold text-zinc-900 leading-snug truncate">
                    {t.name}
                  </span>
                  <span className="text-[11px] text-zinc-400 font-medium leading-none truncate">
                    {t.role}
                  </span>
                </div>
              </div>

              {/* Quote */}
              <p className="text-zinc-600 text-[13px] sm:text-[13.5px] leading-[1.6] font-normal font-sans">
                "{t.quote}
                {t.highlight && (
                  <span className="bg-yellow-100/90 text-zinc-950 font-medium px-0.5 rounded-[3px] mx-0.5">
                    {t.highlight}
                  </span>
                )}
                {t.quoteEnd && <span> {t.quoteEnd}</span>}"
              </p>

              {/* Read More */}
              {t.readMore && (
                <span className="text-[11.5px] font-semibold text-zinc-400 hover:text-zinc-600 transition-colors mt-3 block cursor-pointer">
                  Read more
                </span>
              )}
            </div>
          ))}

          {/* Join CTA Card inside the column grid */}
          <div className="break-inside-avoid mb-4 border border-dashed border-zinc-800 bg-zinc-900/20 rounded-xl p-6 flex flex-col items-center justify-center text-center min-h-[220px]">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 text-zinc-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            
            <h3 className="text-base font-semibold text-zinc-200 tracking-tight mb-1 font-outfit">
              Be the next success story.
            </h3>
            
            <p className="text-zinc-500 text-xs leading-relaxed max-w-[220px] mb-5 font-sans">
              Recover money you're owed automatically.
            </p>
            
            <Link 
              href="/signup" 
              className="px-5 py-2 bg-[#B5F670] hover:bg-[#A3E635] text-black text-xs font-semibold rounded-xl active:scale-95 transition-all duration-200 cursor-pointer shadow-sm font-sans"
            >
              Start now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
