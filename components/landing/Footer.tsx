"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import DotField from "../ui/DotField";


export default function Footer() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Add no-scrollbar class to html and body for a clean app-like scroll experience on landing pages
    document.documentElement.classList.add("no-scrollbar");
    document.body.classList.add("no-scrollbar");

    return () => {
      // Clean up when unmounting (e.g. navigating to dashboard)
      document.documentElement.classList.remove("no-scrollbar");
      document.body.classList.remove("no-scrollbar");
    };
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Thank you for subscribing to our newsletter!");
    setEmail("");
  };

  const sitemapLinks = [
    { label: "Home", href: "/" },
    { label: "Collections Engine", href: "#" },
    { label: "WhatsApp Sequences", href: "#" },
    { label: "Payment Links", href: "#" },
    { label: "MSME Guide", href: "/msme-samadhaan" },
    { label: "Pricing", href: "/pricing" },
    { label: "About Us", href: "#" },
    { label: "Contact Us", href: "mailto:sales@udhaarclear.com" },
  ];

  const resourceLinks = [
    { label: "Twitter", href: "https://x.com" },
    { label: "Terms of Service", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Data Agreement (DPA)", href: "#" },
    { label: "Legal Notices", href: "#" },
  ];

  const communityAvatars = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80",
    "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=100&h=100&q=80",
  ];

  return (
    <footer className="w-full bg-white select-none pb-6 pt-2">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 flex flex-col gap-0">

        {/* 1. SaaSleek-style CTA Card Section (Top Half) */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#B5F670] via-[#A3E635] to-[#82D42D] rounded-t-2xl p-8 md:p-14 lg:p-16 text-black flex flex-col md:flex-row items-center justify-between gap-10 border border-[#B5F670]/20 z-10">

          {/* Absolute Background Interactive DotField with Right-to-Left CSS Masking Fade */}
          <DotField 
            className="absolute right-0 top-0 bottom-0 w-full md:w-[55%] pointer-events-none select-none z-0 overflow-hidden"
            style={{
              maskImage: 'radial-gradient(circle at 100% 50%, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 75%)',
              WebkitMaskImage: 'radial-gradient(circle at 100% 50%, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 75%)'
            }}
            dotRadius={1.5}
            dotSpacing={14}
            gradientFrom="rgba(0, 0, 0, 0.38)"
            gradientTo="rgba(0, 0, 0, 0.38)"
            cursorRadius={180}
            bulgeStrength={45}
            bulgeOnly={true}
          />

          <div className="relative z-10 flex-1 text-left flex flex-col items-start">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-[1.1] font-outfit text-black max-w-2xl">
              Ready to Transform Your Collections with UdhaarClear?
            </h2>
            <p className="text-sm md:text-base text-black/85 mt-4 max-w-lg leading-relaxed font-medium">
              Take the next step toward smarter automation, automated recovery sequences, and healthy cash flow.
            </p>
            <Link
              href="/signup"
              className="mt-8 p-1.5 pr-7 bg-black hover:bg-zinc-900 text-white font-medium rounded-full text-sm transition-all duration-200 active:scale-95 flex items-center gap-3.5 cursor-pointer"
            >
              <div className="flex-shrink-0 w-9 h-9 bg-[#FFC700] rounded-full flex items-center justify-center">
                <div className="grid grid-cols-5 gap-[2px]">
                  {/* Row 0 */}
                  <span className="w-[3px] h-[3px] rounded-full bg-white/35" />
                  <span className="w-[3px] h-[3px] rounded-full bg-white/35" />
                  <span className="w-[3px] h-[3px] rounded-full bg-white" />
                  <span className="w-[3px] h-[3px] rounded-full bg-white/35" />
                  <span className="w-[3px] h-[3px] rounded-full bg-white/35" />

                  {/* Row 1 */}
                  <span className="w-[3px] h-[3px] rounded-full bg-white/35" />
                  <span className="w-[3px] h-[3px] rounded-full bg-white/35" />
                  <span className="w-[3px] h-[3px] rounded-full bg-white/35" />
                  <span className="w-[3px] h-[3px] rounded-full bg-white" />
                  <span className="w-[3px] h-[3px] rounded-full bg-white/35" />

                  {/* Row 2 */}
                  <span className="w-[3px] h-[3px] rounded-full bg-white" />
                  <span className="w-[3px] h-[3px] rounded-full bg-white" />
                  <span className="w-[3px] h-[3px] rounded-full bg-white" />
                  <span className="w-[3px] h-[3px] rounded-full bg-white" />
                  <span className="w-[3px] h-[3px] rounded-full bg-white" />

                  {/* Row 3 */}
                  <span className="w-[3px] h-[3px] rounded-full bg-white/35" />
                  <span className="w-[3px] h-[3px] rounded-full bg-white/35" />
                  <span className="w-[3px] h-[3px] rounded-full bg-white/35" />
                  <span className="w-[3px] h-[3px] rounded-full bg-white" />
                  <span className="w-[3px] h-[3px] rounded-full bg-white/35" />

                  {/* Row 4 */}
                  <span className="w-[3px] h-[3px] rounded-full bg-white/35" />
                  <span className="w-[3px] h-[3px] rounded-full bg-white/35" />
                  <span className="w-[3px] h-[3px] rounded-full bg-white" />
                  <span className="w-[3px] h-[3px] rounded-full bg-white/35" />
                  <span className="w-[3px] h-[3px] rounded-full bg-white/35" />
                </div>
              </div>
              Get started for free
            </Link>
          </div>

        </div>

        {/* 2. SaaSleek-style Footer Section (Bottom Half - Deep Black) */}
        <div className="relative overflow-hidden bg-[#08080C] text-white rounded-b-2xl pt-16 md:pt-20 lg:pt-24 pb-8 px-8 md:px-14 lg:px-16 border-t border-zinc-900/40 z-10">

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 items-start">

            {/* Sitemap Column */}
            <div className="col-span-12 sm:col-span-6 md:col-span-3 flex flex-col gap-5 text-left">
              <ul className="flex flex-col gap-4 text-sm font-medium text-zinc-400 font-sans">
                {sitemapLinks.map((link) => (
                  <li key={link.label} className="flex items-center group">
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      size={14}
                      className="text-[#ACF56C] mr-2 transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                    <Link href={link.href} className="hover:text-white transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Column */}
            <div className="col-span-12 sm:col-span-6 md:col-span-3 flex flex-col gap-5 text-left">
              <ul className="flex flex-col gap-4 text-sm font-medium text-zinc-400 font-sans">
                {resourceLinks.map((link) => (
                  <li key={link.label} className="flex items-center group">
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      size={14}
                      className="text-[#ACF56C] mr-2 transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                    {link.href.startsWith("http") ? (
                      <a href={link.href} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-200">
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className="hover:text-white transition-colors duration-200">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Empty spacer for grid alignment */}
            <div className="hidden lg:block lg:col-span-1" />

            {/* Newsletter Column */}
            <div className="col-span-12 md:col-span-5 flex flex-col items-start gap-6 text-left">
              <div className="w-full">
                <h4 className="text-lg font-medium text-white tracking-tight font-outfit mb-3">
                  Get the recovery playbook
                </h4>

                <form onSubmit={handleSubscribe} className="relative flex items-center w-full max-w-md bg-[#12131A] border border-zinc-800 rounded-2xl p-1.5 focus-within:border-[#B5F670]/40 transition-all">
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-transparent pl-4 pr-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none font-sans"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#B5F670] hover:bg-[#A3E635] text-black font-medium rounded-xl text-sm transition-all duration-200 active:scale-95 shrink-0 cursor-pointer shadow-sm text-center"
                  >
                    Submit
                  </button>
                </form>
              </div>

              {/* Social Proof (Stacked Avatars) */}
              <div className="flex items-center gap-4.5 mt-2">
                <div className="flex items-center -space-x-3 select-none">
                  {communityAvatars.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Community member ${idx + 1}`}
                      className="w-9 h-9 rounded-xl border border-black object-cover shrink-0 shadow-sm"
                    />
                  ))}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[14px] font-semibold text-white">Join <span className="text-[#ACF56C]">8,200+</span> Indian businesses </span>
                  <span className="text-[14px] font-medium text-white">
                    recovering money they were owed.
                  </span>

                </div>
              </div>

            </div>

          </div>

          {/* Massive Brand Watermark Logo */}
          <div className="w-full mt-16 md:mt-20 lg:mt-24 select-none overflow-hidden">
            <span className="text-[#ACF56C] font-extrabold text-[4.5rem] sm:text-[5rem] md:text-[6rem] lg:text-[7rem] tracking-tighter opacity-100 leading-[1.15] text-center select-none w-full block titlecase font-outfit">
              #Rishta apni jagah, Hisab apni jagah.
            </span>
          </div>

          {/* Bottom Copyright & Legal Links */}
          <div className="border-t border-zinc-900 mt-6 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
            <div className="text-xs font-medium text-zinc-500 font-sans">
              Made with ❤️ for Indian businesses
            </div>
            <div className="text-xs font-medium text-zinc-500 font-sans">
              © {new Date().getFullYear()} UdhaarClear. All rights reserved.
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
}
