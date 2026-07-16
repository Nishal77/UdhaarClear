"use client";

import Link from "next/link";
import DotField from "../ui/DotField";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlayIcon, WorkUpdateIcon } from "@hugeicons/core-free-icons";

export default function Hero() {
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes drawPath {
            to { stroke-dashoffset: 0; }
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

        {/* Centered Content Container (Reduced vertical gap using space-y-10) */}
        <div className="relative max-w-[1340px] mx-auto px-6 md:px-8 z-10 w-full flex flex-col items-start space-y-10">

          {/* Top Text Block (Left-Aligned) */}
          <div className="flex flex-col items-start text-left space-y-8 max-w-5xl pt-8">
            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-[3.55rem] font-normal text-gray-950 tracking-tight leading-[1.12] md:leading-[1.08] max-w-5xl">
              Stop chasing payments. We handle everything after the invoice.

            </h1>

            {/* Paragraph Description */}
            <p className="text-gray-500 text-base md:text-lg leading-relaxed max-w-3xl font-normal font-sans">
              The moment a payment is overdue, UdhaarClear takes over, automated WhatsApp reminders, escalating follow-ups, and legal notices until every rupee lands. You just run your business.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-4 w-full sm:w-auto">
              <Link
                href="/signup"
                className="bg-[#B5F670] inline-flex items-center justify-center px-6.5 py-3 text-[14px] md:text-[15px] font-semibold text-black rounded-2xl shrink-0 select-none text-center"
              >
                Start Free 14 Days
              </Link>
              <Link
                href="#demo"
                className="inline-flex items-center justify-center gap-2 border border-black/[0.08] bg-white/50 hover:bg-white/80 active:scale-95 text-gray-700 hover:text-gray-950 font-semibold px-5.5 py-3 rounded-2xl transition-all duration-200 text-[14px] md:text-[15px] select-none text-center"
              >
                <HugeiconsIcon icon={WorkUpdateIcon} />
                How it works
              </Link>
            </div>
          </div>

          {/* Autoplay Video Container (Constrained Width - Removed mt-8 space gap) */}
          <div className="w-full bg-[#FAF9F6] rounded-[32px] border border-black/[0.05] shadow-[0_24px_60px_rgba(0,0,0,0.02)] overflow-hidden relative mt-0 select-none">
            <video
              src="/videos/video.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto object-cover block relative z-0"
            />
          </div>
        </div>
      </section>
    </>
  );
}