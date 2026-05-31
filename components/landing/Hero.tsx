"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <>
      {/* Global styles to hide the scrollbar */}
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Hide scrollbar for Chrome, Safari and Opera */
          ::-webkit-scrollbar {
            display: none;
          }
          /* Hide scrollbar for IE, Edge and Firefox */
          html, body {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
        `
      }} />

      {/* Ensured no min-h-screen and no bottom padding on the section */}
      <section 
        className="relative bg-white bg-cover bg-center bg-no-repeat overflow-hidden flex flex-col items-center justify-start pt-24"
        style={{
          backgroundImage: "url('/hero2.jpg')"
        }}
      >
        
        {/* Main Content (Centered) */}
        <div className="relative max-w-[1340px] mx-auto px-8 flex flex-col items-center text-center justify-center w-full z-10 pt-16 lg:pt-24 space-y-10">
          
          {/* Main Heading */}
          <h1 className="text-5xl md:text-[4rem] font-medium text-gray-900 tracking-tight max-w-5xl">
            Get Paid Faster Without Spoiling Customer Relationships.
          </h1>

          {/* Paragraph Description */}
          <p className="text-gray-700 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto font-normal">
            UdhaarClear sends smart WhatsApp reminders that escalate from polite to legal, with a one tap UPI payment link in every message. Stop chasing. Start collecting.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="#"
              className="inline-flex items-center justify-center bg-[#0047FF] hover:bg-blue-700 active:scale-95 text-white font-medium px-8 py-4 rounded-full shadow-lg shadow-blue-500/15 transition-all duration-200 text-base select-none"
            >
              Get Paid Faster — Free 14 Days
            </Link>
            <button
              onClick={() => {}}
              className="inline-flex items-center justify-center bg-[#000] hover:bg-[#000]/90 text-white font-medium px-6 py-4 rounded-3xl transition-all duration-200 text-base gap-2 cursor-pointer select-none"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Schedule a Demo
            </button>
          </div>
        </div>

        {/* Dashboard Mockup Image */}
        {/* Removed CSS mask and added items-end to push the image firmly to the bottom edge */}
        <div className="w-full max-w-[1440px] mx-auto relative z-10 flex justify-center items-end mt-1 px-4 md:px-8 overflow-hidden">
          <img 
            src="/hero5.png" 
            alt="Dashboard mockup" 
            className="w-full h-auto select-none block max-w-full drop-shadow-2xl -mb-[18%]"
            style={{
              clipPath: "inset(0px 0px 18% 0px)"
            }}
            draggable={false}
          />
        </div>

        {/* Full-width White Gradient Overlay Mask */}
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none z-20" />
      </section>
    </>
  );
}