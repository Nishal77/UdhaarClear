"use client";

import Link from "next/link";
import { 
  FileText, 
  Send, 
  MessageSquare, 
  Eye, 
  Check, 
  Banknote,
  Receipt
} from "lucide-react";
import DotField from "../ui/DotField";


export default function Hero() {
  return (
    <>
      {/* Global styles for scrollbar & keyframe animations */}
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

          /* Staggered animation values for mockup flow */
          @keyframes fadeInScale {
            from {
              opacity: 0;
              transform: scale(0.96) translateY(10px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }

          @keyframes drawPath {
            from {
              stroke-dashoffset: 120;
            }
            to {
              stroke-dashoffset: 0;
            }
          }

          .animate-fade-in-card {
            animation: fadeInScale 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
          }

          .animate-draw-line {
            stroke-dasharray: 120;
            stroke-dashoffset: 120;
            animation: drawPath 0.8s ease-out forwards;
          }
        `
      }} />

      <section
        className="relative w-full overflow-hidden bg-white pt-24 pb-24 md:pt-32 md:pb-32"
      >
        {/* DotField Background constrained to top section */}
        <div 
          className="absolute top-0 left-0 w-full h-[480px] md:h-[530px] pointer-events-none overflow-hidden z-0"
          style={{
            maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
          }}
        >
          <DotField
            dotRadius={1.5}
            dotSpacing={14}
            bulgeStrength={60}
            glowRadius={160}
            sparkle={false}
            waveAmplitude={0}
            gradientFrom="rgba(168, 85, 247, 0.25)"
            gradientTo="rgba(99, 102, 241, 0.2)"
            glowColor="rgba(168, 85, 247, 0.08)"
          />
        </div>

        {/* Premium ambient decorative background glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-15%] w-[50%] h-[60%] rounded-full bg-gradient-to-tr from-blue-50/20 to-emerald-50/15 blur-[130px]" />
          <div className="absolute bottom-[-10%] right-[-15%] w-[50%] h-[60%] rounded-full bg-gradient-to-bl from-yellow-50/15 to-rose-50/10 blur-[130px]" />
        </div>

        {/* Centered Content Container */}
        <div className="relative max-w-[1340px] mx-auto px-6 md:px-8 z-10 w-full flex flex-col items-start space-y-16">
          
          {/* Top Text Block (Left-Aligned) */}
          <div className="flex flex-col items-start text-left space-y-8 max-w-3xl pt-8">
            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-medium text-gray-950 tracking-tight leading-[1.12] md:leading-[1.08] max-w-2xl">
              Customers Not Paying? <br />
              <span className="bg-gradient-to-r from-gray-950 via-slate-800 to-gray-900 bg-clip-text text-transparent">We Follow Up Until They Do.</span>
            </h1>

            {/* Paragraph Description */}
            <p className="text-gray-500 text-base md:text-lg leading-relaxed max-w-2xl font-normal font-sans">
              Upload unpaid invoices and UdhaarClear automatically follows up through email, WhatsApp, payment links, and MSME legal escalation until payment is received.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-4 w-full sm:w-auto">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center bg-gray-950 hover:bg-gray-900 active:scale-95 text-white font-semibold px-8 py-4 rounded-full shadow-lg shadow-black/5 transition-all duration-200 text-sm md:text-base select-none text-center"
              >
                Start Recovering
              </Link>
              <Link
                href="#demo"
                className="inline-flex items-center justify-center gap-2 border border-black/[0.08] bg-white/50 hover:bg-white/80 active:scale-95 text-gray-700 hover:text-gray-950 font-semibold px-6 py-4 rounded-full transition-all duration-200 text-sm md:text-base select-none text-center"
              >
                <svg className="w-4 h-4 fill-current text-gray-400" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch demo
              </Link>
            </div>
          </div>

          {/* Bottom Large Mockup Box Container (Wider) */}
          <div className="w-full bg-[#FAF9F6] border border-black/[0.06] rounded-[32px] shadow-[0_24px_60px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col z-10 relative">
            
            {/* Dotted Grid Pattern */}
            <div 
              className="absolute inset-0 opacity-[0.45] pointer-events-none z-0" 
              style={{
                backgroundImage: "radial-gradient(#C5C2B9 1.2px, transparent 1.2px)",
                backgroundSize: "20px 20px"
              }}
            />
            
            {/* Ambient Lighting Glows */}
            <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-blue-100/10 blur-[100px] z-0 pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-emerald-100/10 blur-[100px] z-0 pointer-events-none" />

            {/* Inner Content canvas */}
            <div className="w-full px-4 py-12 flex items-center justify-center relative z-10 h-[560px] sm:h-[620px] md:h-[680px]">
              <div className="scale-[0.76] sm:scale-[0.86] md:scale-95 lg:scale-100 origin-center transition-all duration-300">
                <InteractiveMockup />
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}

function InteractiveMockup() {
  return (
    <div className="relative w-full min-w-[440px] max-w-[440px] h-[680px] select-none bg-transparent">
      
      {/* Connecting Flow lines SVG */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        viewBox="0 0 440 680" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 6 5 L 0 8.5 z" fill="#D4C2A8" />
          </marker>
        </defs>

        {/* Line 1: Card 1 right edge to Card 2 top */}
        <path 
          d="M 290 76 L 335 76 C 345 76, 345 86, 345 96 L 345 150" 
          stroke="#E6DBC6" 
          strokeWidth="1.2" 
          markerEnd="url(#arrow)"
          className="animate-draw-line"
          style={{ animationDelay: "0.4s" }}
        />

        {/* Line 2: Card 2 bottom to Card 3 right */}
        <path 
          d="M 335 222 L 335 266 C 335 276, 325 276, 315 276 L 210 276" 
          stroke="#E6DBC6" 
          strokeWidth="1.2" 
          markerEnd="url(#arrow)"
          className="animate-draw-line"
          style={{ animationDelay: "0.9s" }}
        />

        {/* Line 3: Card 3 bottom to Card 4 top */}
        <path 
          d="M 105 312 L 105 330" 
          stroke="#E6DBC6" 
          strokeWidth="1.2" 
          markerEnd="url(#arrow)"
          className="animate-draw-line"
          style={{ animationDelay: "1.4s" }}
        />

        {/* Line 4: Card 4 bottom to Card 5 left */}
        <path 
          d="M 105 402 L 105 456 C 105 466, 115 466, 125 466 L 230 466" 
          stroke="#E6DBC6" 
          strokeWidth="1.2" 
          markerEnd="url(#arrow)"
          className="animate-draw-line"
          style={{ animationDelay: "1.9s" }}
        />

        {/* Line 5: Card 5 bottom to Card 6 right */}
        <path 
          d="M 335 517 L 335 586 C 335 596, 325 596, 315 596 L 280 596" 
          stroke="#E6DBC6" 
          strokeWidth="1.2" 
          markerEnd="url(#arrow)"
          className="animate-draw-line"
          style={{ animationDelay: "2.4s" }}
        />
      </svg>

      {/* Card 1: OVERDUE INVOICE */}
      <div 
        className="absolute top-[10px] left-[80px] w-[210px] h-[132px] bg-white border border-black/[0.04] rounded-[20px] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300 z-10"
        style={{ animationDelay: "0s" }}
      >
        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
          <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
            <FileText className="w-3.5 h-3.5" />
          </div>
          OVERDUE INVOICE
        </div>
        <div className="flex flex-col gap-1 text-xs text-gray-755">
          <div className="flex justify-between">
            <span className="text-gray-400">Amount</span>
            <span className="font-semibold text-gray-950">₹48,000</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Customer</span>
            <span className="font-semibold text-gray-950">ABC Corp</span>
          </div>
          <div className="flex justify-between items-center mt-0.5">
            <span className="text-gray-400">Status</span>
            <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded-full">
              Overdue 45 Days
            </span>
          </div>
        </div>
      </div>

      {/* Card 2: EMAIL REMINDER SENT */}
      <div 
        className="absolute top-[150px] left-[230px] w-[210px] h-[72px] bg-white border border-black/[0.04] rounded-[20px] p-3 shadow-[0_8px_32px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300 z-10"
        style={{ animationDelay: "0.5s" }}
      >
        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
          <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <Send className="w-3.5 h-3.5" />
          </div>
          EMAIL REMINDER SENT
        </div>
        <div className="flex justify-between items-center text-xs text-gray-750">
          <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium">
            Sent
            <Check className="w-3 h-3 text-emerald-500 stroke-[3]" />
          </span>
          <span className="text-gray-400 text-[10px]">10:30 AM</span>
        </div>
      </div>

      {/* Card 3: WHATSAPP REMINDER DELIVERED */}
      <div 
        className="absolute top-[240px] left-[0px] w-[210px] h-[72px] bg-white border border-black/[0.04] rounded-[20px] p-3 shadow-[0_8px_32px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300 z-10"
        style={{ animationDelay: "1s" }}
      >
        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <MessageSquare className="w-3.5 h-3.5" />
          </div>
          WHATSAPP REMINDER
        </div>
        <div className="flex justify-between items-center text-xs text-gray-755">
          <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium">
            Delivered
            <Check className="w-3 h-3 text-emerald-500 stroke-[3]" />
          </span>
          <span className="text-gray-400 text-[10px]">10:32 AM</span>
        </div>
      </div>

      {/* Card 4: PAYMENT LINK OPENED */}
      <div 
        className="absolute top-[330px] left-[0px] w-[210px] h-[72px] bg-white border border-black/[0.04] rounded-[20px] p-3 shadow-[0_8px_32px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300 z-10"
        style={{ animationDelay: "1.5s" }}
      >
        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <Eye className="w-3.5 h-3.5" />
          </div>
          PAYMENT LINK OPENED
        </div>
        <div className="flex justify-between items-center text-xs text-gray-755">
          <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium">
            Viewed
            <Check className="w-3 h-3 text-emerald-500 stroke-[3]" />
          </span>
          <span className="text-gray-400 text-[10px]">11:15 AM</span>
        </div>
      </div>

      {/* Card 5: PAYMENT RECEIVED */}
      <div 
        className="absolute top-[415px] left-[230px] w-[210px] h-[102px] bg-white border border-black/[0.04] rounded-[20px] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300 z-10"
        style={{ animationDelay: "2s" }}
      >
        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
          <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <Receipt className="w-3.5 h-3.5" />
          </div>
          PAYMENT RECEIVED
        </div>
        <div className="flex flex-col gap-1 text-xs text-gray-700">
          <div className="flex justify-between">
            <span className="text-gray-455">Amount:</span>
            <span className="font-semibold text-gray-950">₹48,000</span>
          </div>
          <div className="flex justify-between items-center border-t border-gray-100 pt-2 mt-1">
            <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
              Received
              <Check className="w-3 h-3 text-emerald-500 stroke-[3]" />
            </span>
            <span className="text-gray-400 text-[10px]">11:20 AM</span>
          </div>
        </div>
      </div>

      {/* Card 6: MONEY RECOVERED */}
      <div 
        className="absolute top-[530px] left-[60px] w-[220px] h-[132px] bg-emerald-50 border border-emerald-500/20 rounded-[20px] p-4 shadow-[0_12px_24px_rgba(16,185,129,0.04)] hover:shadow-[0_16px_40px_rgba(16,185,129,0.08)] hover:-translate-y-0.5 transition-all duration-300 z-10"
        style={{ animationDelay: "2.5s" }}
      >
        <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-sm shadow-emerald-500/25">
            <Banknote className="w-3.5 h-3.5" />
          </div>
          MONEY RECOVERED
        </div>
        <div className="flex flex-col gap-1 text-xs text-emerald-900 font-sans">
          <div className="flex justify-between">
            <span className="text-emerald-600/70">Amount</span>
            <span className="font-bold">₹48,000</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-emerald-600/70">Status</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded">
              Fully Recovered
              <Check className="w-2.5 h-2.5 text-emerald-600 stroke-[3]" />
            </span>
          </div>
          <p className="text-[10px] text-emerald-600/80 mt-1 border-t border-emerald-200/40 pt-1.5">
            Funds added to balance
          </p>
        </div>
      </div>

    </div>
  );
}