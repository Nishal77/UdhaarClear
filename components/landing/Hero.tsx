"use client";

import Link from "next/link";


export default function Hero() {
  return (
    <section className="relative min-h-screen bg-white overflow-hidden flex flex-col justify-between pt-24">
      

      {/* Main Content (Centered) */}
      <div className="relative max-w-[1340px] mx-auto px-8 flex flex-col items-center text-center justify-center flex-1 w-full z-10 py-16 lg:py-24 space-y-10">
        
        {/* Announcement Badge */}
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50/70 border border-blue-100/50 px-4.5 py-2 text-sm font-medium text-[#000]">
          <span>🇮🇳</span>
          <span>Built for Indian MSMEs</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-[5rem] font-medium text-gray-900 tracking-tight leading-[1.1] max-w-5xl">
          Every Rupee You&apos;re Owed? <br />
          <span className="text-[#0047FF]">Recovered. Automatically.</span>
        </h1>

        {/* Paragraph Description */}
        <p className="text-gray-500 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto font-medium">
          UdhaarClear sends smart WhatsApp reminders that escalate from polite to legal — with a one-tap UPI payment link in every message. Stop chasing. Start collecting.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="#"
            className="inline-flex items-center justify-center bg-[#0047FF] hover:bg-blue-700 active:scale-95 text-white font-bold px-8 py-4 rounded-full shadow-lg shadow-blue-500/15 transition-all duration-200 text-base select-none"
          >
            Get Paid Faster — Free 14 Days
          </Link>
          <button
            onClick={() => {}}
            className="inline-flex items-center justify-center bg-[#EEF2FF] hover:bg-[#E0E7FF] border border-blue-100/50 text-[#0047FF] font-bold px-6 py-4 rounded-full active:scale-95 transition-all duration-200 text-base gap-2 cursor-pointer select-none"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Watch 90-second demo
          </button>
        </div>

        {/* Trust/Social Proof Badge */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-center gap-4">
            {/* Overlapping Avatars */}
            <div className="flex -space-x-3.5">
              <img
                className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm"
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80"
                alt="User 1"
              />
              <img
                className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm"
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&h=100&q=80"
                alt="User 2"
              />
              <img
                className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80"
                alt="User 3"
              />
            </div>

            {/* Bold Stats */}
            <span className="text-3xl font-black text-gray-900 font-outfit tracking-tight">2.3M+</span>
          </div>
          
          {/* Caption */}
          <p className="text-xs font-semibold text-gray-400 max-w-[210px] leading-normal uppercase tracking-wider text-center mx-auto">
            Trusted to use by millions users over 140 countries
          </p>
        </div>

      </div>

      {/* Bottom Banner (Curved Blue Panel) */}
      <div className="max-w-[1340px] mx-auto px-8 w-full z-10 -mt-16 mb-12">
        <div className="relative w-full h-[180px] md:h-[240px] bg-[#0047FF] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden flex items-center justify-center shadow-lg shadow-blue-500/10">
          {/* Repeating text running in the background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-10">
            <div className="text-white font-black text-[10vw] leading-none whitespace-nowrap tracking-[0.15em] font-outfit uppercase animate-marquee">
              MANAGEMENT • FINANCE • MANAGEMENT • FINANCE • MANAGEMENT • FINANCE
            </div>
          </div>

          {/* Framer badge style (Replicating "Made in Framer" look) */}
          <div className="absolute bottom-6 right-8 bg-white text-black font-semibold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-md">
            <svg className="w-3 h-3 text-[#0047FF]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
              <path d="M2 17L12 22L22 17"/>
              <path d="M2 12L12 17L22 12"/>
            </svg>
            <span className="text-[10px] font-bold text-gray-800">Made in Framer</span>
          </div>
        </div>
      </div>
    </section>
  );
}
