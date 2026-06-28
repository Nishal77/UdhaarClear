"use client";

import React from "react";
import Link from "next/link";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Anirudh Chopra",
      role: "Software Engineer @ Vertex",
      initials: "AC",
      hasImage: false,
      stars: 5,
      quote: "I really like using UdhaarClear. ",
      highlight: "The automated reminder templates and payment link components are very well made and helped me clear our pending dues much quicker.",
      quoteEnd: " I also liked that the dashboard reports are all at one place.",
      readMore: false,
    },
    {
      name: "Lucas Mira K",
      role: "Developer",
      initials: "LK",
      hasImage: false,
      stars: 5,
      quote: "UdhaarClear made my collection workflow much easier. ",
      highlight: "I found everything I needed in one place and saved a lot of time.",
      quoteEnd: " It is perfect for fast cash flow recovery.",
      readMore: false,
    },
    {
      name: "Jason M",
      role: "Frontend dev at Swift Co.",
      initials: "JM",
      hasImage: false,
      stars: 5,
      quote: "UdhaarClear helped me a lot. ",
      highlight: "Before, it took me a lot of time to follow up manually with clients but now I can automate everything much faster.",
      quoteEnd: " The reminder sequences are easy to use and the settings are simple to change.",
      readMore: true,
    },
    {
      name: "Anurag Joshi",
      role: "Frontend dev intern",
      initials: "AJ",
      hasImage: false,
      stars: 5,
      quote: "I've been using UdhaarClear for a while now, and it has saved me so much manual collection time. ",
      highlight: "The message templates are easy to customise and work smoothly for my clients. It's a really helpful tool with well-designed dashboards.",
      quoteEnd: "",
      readMore: true,
    },
    {
      name: "Rishabh Sethi",
      role: "Mobile app developer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      hasImage: true,
      stars: 5,
      quote: "As a business owner, ",
      highlight: "I love how UdhaarClear saves me from writing the same payment follow-up messages over and over again.",
      quoteEnd: " With a variety of ready-to-use WhatsApp templates, I can setup payment sequences easily and much faster.",
      readMore: false,
    },
    {
      name: "Raymond Chan Wai-Kit",
      role: "Senior Mobile App Developer",
      initials: "RK",
      hasImage: false,
      stars: 5,
      quote: "This platform is really helpful! ",
      highlight: "The reminder rules are well-made, easy to change, and saved me so much time.",
      quoteEnd: " I don't need to start from zero. It's simple to use and makes payment tracking much easier.",
      readMore: false,
    },
    {
      name: "Durga Jayasai",
      role: "Flutter Developer",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      hasImage: true,
      stars: 5,
      quote: "I've recently started using UdhaarClear, and it has been incredibly helpful. ",
      highlight: "The templates are well-designed, easy to customize, and saved me a lot of time!",
      quoteEnd: " Definitely worth it for any business owner looking to automate payment recovery.",
      readMore: false,
    },
    {
      name: "Fedy Belaid",
      role: "Flutter Developer",
      initials: "FB",
      hasImage: false,
      stars: 5,
      quote: "UdhaarClear is really super helpful! ",
      highlight: "The reminder automations are well-configured, easy to customize, and saved me a lot of time!",
      quoteEnd: " Definitely worth it for any business!",
      readMore: false,
    },
    {
      name: "Kevin Langat",
      role: "Full-Stack Web Developer",
      initials: "KL",
      hasImage: false,
      stars: 5,
      quote: "The reminder templates are well-structured and easy to customize. ",
      highlight: "This process saved me countless hours of work. I've integrated UdhaarClear into my projects,",
      quoteEnd: " and the seamless recovery experience has been a good thing for me.",
      readMore: false,
    },
    {
      name: "Mücahit Öztürk",
      role: "Business Analyst & Developer",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      hasImage: true,
      stars: 5,
      quote: "It speeds up my recovery workflow and helps me expand my collections rate ",
      highlight: "with impressive payment links. It's very easy to use, and I highly recommend it.",
      quoteEnd: "",
      readMore: false,
    },
    {
      name: "Md. Sifatullah",
      role: "Software Engineer",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
      hasImage: true,
      stars: 5,
      quote: "UdhaarClear has truly exceeded my expectations! ",
      highlight: "The vast collection of automated reminder rules makes payment collection incredibly efficient. What I love most is how seamlessly it accelerates the recovery process.",
      quoteEnd: "",
      readMore: true,
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
                {t.hasImage ? (
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover shrink-0 border border-zinc-100 shadow-sm"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-zinc-950 text-zinc-100 flex items-center justify-center font-bold text-xs shrink-0 select-none">
                    {t.initials}
                  </div>
                )}
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
