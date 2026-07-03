"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";

// --- CUSTOM SVG LOGOS ---

const TallyLogo = () => (
  <div className="w-12 h-12 rounded-xl bg-[#FFF6F6] border border-[#FFEAEA] flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110">
    <svg className="w-9 h-9" viewBox="200 80 600 320" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="m426.7 276.4c5.9-3.9 18.3-18.9 18.9-20.2s3.3-3.9.6-6.5-5.2-1.3-8.5.6c-3.2 1.3-16.9 12.4-22.1 16.3s-18.2 15.6-18.2 15.6-7.2 5.9-4.5 9.1 5.2 2 8.5.7c3.8-1.3 19.5-11.7 25.3-15.6zm-16.9-110h-3.2c-15.6 0-53.4 2.6-61.9 3.3-9.1.6-38.4 5.9-43.6 7.2s-2.6 4.5-2.6 4.5 5.2 5.9 7.8 7.8c2.6 2 6.5 7.8 11.7 5.2 5.9-2.6 34.5-5.2 43.6-6.5 5.8-.8 11.7-.8 17.6 0 0 0-24.7 32.5-28.6 38.4-3.9 5.2-25.4 34.5-30 41-3.9 6.5-14.3 22.8-18.9 30.6-3.9 7.8 3.2 7.2 3.2 7.2s16.9.6 20.8.6c3.2 0 3.9-2.6 4.6-3.9 1.5-3.4 3.2-6.6 5.2-9.8 3.3-5.2 10.4-16.9 18.2-30s17.6-25.4 24.7-35.2 15.6-20.8 17.6-23.4 9.8-13 11.7-15.6 2.6-2.6 5.2-2.6c3.3 0 23.4 1.3 31.9 2 9.1.7 21.5 1.3 29.3 2s5.2-3.3 5.2-3.3c.3-3.4-.4-6.8-2-9.8-2.6-5.2-4.6-4.6-4.6-4.6-10.2-3.1-51.2-5.1-62.9-5.1zm306 183.6c2 1.3 6.5 2.6 5.9 6.5 0 0-3.9 9.1-5.9 9.8s-5.2.6-11.7-2-38.4-10.4-46.9-12.4c-7.8-1.3-26.7-4.5-26.7-4.5s-2.6-1.3-6.5 5.2(c-3.9 5.9-16.3 24.1-16.3 24.1-.4 1.5-1.7 2.6-3.3 2.6-2.6 0-12.4-.6-16.3-2.6s-5.2-2-2.6-5.9 11.1-21.5 15-24.7-2-2.6-3.9-3.2c-2 0-39.7-2.6-50.8-2-11.1 0-50.1 0-64.5 1.3s-65.8 5.9-78.8 7.8c-13.7 2-68.4 9.8-75.5 11.7-7.2 1.3-22.1 3.9-22.1 3.9-5 1.1-10.2.7-15-1.3-7.2-3.2-18.9-7.8-9.1-11.1s58.6-13 73.6-15c15-2.6 62.5-9.1 82-9.8c19.5-1.3 73.6-3.9 93.7-3.9 20.2 0 47.5 1.3 59.9 2.6 11.7.6 19.5 1.3 22.1 2s2.6-1.3 5.2-3.9 9.8-12.4 9.8-12.4 2.6-3.3-2.6-.6c-5.2 3.2-12.4 3.2-16.3-.6-3.9-3.9-5.2-6.5-7.2-5.9s-9.1 4.5-13 5.9-20.2 5.2-30-2c-9.8-6.5-10.4-9.8-11.7-12.4-1.3-3.2-2-3.2-5.2-1.3-3.3 2.6-14.3 7.8-18.9 9.8-4.2 2.3-8.9 3.4-13.7 3.2-6.5-.6-13.7-2.6-16.9-7.8s-3.3-9.1-6.5-6.5-21.5 13-31.2 15.6c-11.1 1.3-13.7 2.6-18.9 1.3-5.9-1.3-11.7-3.3-13.7-6.5s-2.6-3.9-5.2-2-9.8 7.2-15 6.5-18.9-3.9-26.7-17.6c-7.2-13.7-2-19.5 4.5-26 6.5-7.2 18.9-16.9 18.9-16.9s15-10.4 19.5-13c5.2-2.6 13-7.2 18.2-7.2s12.4 0 19.5 5.9 11.1 11.7 12.4 14.3c.6 2 3.9 10.4-1.3 16.3s-19.5 19.5-19.5 19.5-5.9 3.3-3.3 7.8c2.6 3.9 12.4-2.6 15-5.2 3.3-2 20.2-16.9 25.4-21.5 5.2-5.2 37.8-37.1 41-39.7 2.6-3.3 29.9-30 34.5-32.6 3.9-2.6 5.2-4.5 13-3.2 4.1.7 8 2 11.7 3.9 0 0 7.8 3.2 1.3 7.8-5.9 5.2-26.7 22.1-31.9 27.3s-20.1 20.2-24.6 25.4c-5.2 5.2-18.2 21.5-20.2 24.7s-3.3 6.5 0 9.1 9.1 0 15-5.2 24.1-20.2 30-26.7 40.4-38.4 43.6-41 18.9-15.6 18.9-15.6 2-2.6 6.5-2.6 9.1.6 11.7 2l7.8 3.9s3.3 1.3-2 5.2-33.9 26-41.7 34.5c-7.2 8.5-22.8 25.4-28.6 32.5-5.9 7.8-9.8 11.7-5.2 16.3 4.5 5.2 9.8 3.9 12.4 3.2s11.7-7.2 17.6-13.7c6.5-6.5 26-27.4 28.6-30 2-2.6 9.8-9.8 9.8-9.8s1.3-3.2 5.9-3.2 6.5.6 11.1 1.3c3.9 1.3 13 2.6 8.5 7.8-5.2 5.2-17.6 17.6-20.2 20.8s-13 15-15 18.2-4.5 7.2-2 9.1 9.8-.6 16.3-4.6c9.2-4.7 17.7-10.6 25.4-17.6 8.5-7.8 22.1-20.2 22.1-20.2s2-5.2 12.4-3.2c9.8 2 12.4 3.2 12.4 3.2s7.8 2 2.6 6.5-22.1 19.5-28.7 26c-6.5 5.9-26.7 26.7-30 30.6s-13 13-9.1 13.7 33.8 6.5 40.4 8.5c6 2.3 28.8 10.8 30.8 11.5z" fill="#00A389" />
    </svg>
  </div>
);

const ZohoBooksLogo = () => (
  <div className="w-12 h-12 rounded-xl bg-[#FFFBF0] border border-[#FEF0C7] flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110">
    <svg className="w-9 h-9" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="matrix(0.42 0 0 0.42 5.5 10.5)">
        <path d="M.5 19.7h111v118.9H.5z" fill="#fdb924" />
        <path d="M478.6 99.5c-2.2-5.5-5.5-10.5-9.8-14.8-4.1-4.2-8.7-7.4-13.9-9.5-5.1-2.1-10.6-3.2-16.6-3.2s-11.6 1.1-16.7 3.2c-5.2 2.1-9.8 5.3-13.9 9.5-4.3 4.3-7.5 9.3-9.7 14.8s-3.2 11.5-3.2 18.1c0 6.4 1.1 12.4 3.3 18a44.49 44.49 0 0 0 9.7 15c4 4.1 8.6 7.2 13.7 9.3s10.8 3.2 16.9 3.2c5.9 0 11.4-1.1 16.5-3.2s9.8-5.2 13.9-9.3c4.3-4.4 7.6-9.4 9.8-14.9s3.3-11.6 3.3-18c0-6.7-1.1-12.7-3.3-18.2zm-22.9 39.2c-4.3 5.1-10 7.7-17.4 7.7s-13.2-2.6-17.5-7.7-6.4-12.2-6.4-21.2c0-9.2 2.2-16.3 6.4-21.5 4.3-5.2 10-7.7 17.5-7.7 7.4 0 13.1 2.6 17.4 7.7 4.2 5.2 6.4 12.3 6.4 21.5 0 9-2.1 16.1-6.4 21.2z" fill="#fff" />
        <path d="M107.4 27l15.1 106.5-107.7 15.1L.3 45.7l6.3-4.9z" fill="#008cd2" transform="translate(257 27)" />
        <path d="M346.1 74.4c-.5-3.3-1.6-5.8-3.4-7.5-1.5-1.3-3.3-2-5.4-2-.5 0-1.1 0-1.7.1-2.8.4-4.9 1.7-6.2 3.8-1 1.5-1.4 3.4-1.4 5.6 0 .8.1 1.7.2 2.6l3.9 27.7-31 4.6-3.9-27.7c-.5-3.2-1.6-5.7-3.4-7.4-1.5-1.4-3.3-2.1-5.3-2.1-.5 0-1 0-1.5.1-2.9.4-5.1 1.7-6.5 3.8-1 1.5-1.4 3.4-1.4 5.6 0 .8.1 1.7.2 2.7l10.6 72.1c.5 3.3 1.6 5.8 3.6 7.5 1.5 1.3 3.3 1.9 5.5 1.9.6 0 1.2 0 1.8-.1 2.7-.4 4.7-1.7 6-3.8.9-1.5 1.3-3.3 1.3-5.4 0-.8-.1-1.7-.2-2.6l-4.3-28.5 31-4.6 4.3 28.5c.5 3.3 1.6 5.8 3.5 7.4 1.5 1.3 3.3 2 5.4 2 .5 0 1.1 0 1.7-.1 2.8-.4 4.9-1.7 6.2-3.8.9-1.5 1.4-3.3 1.4-5.5 0-.8-.1-1.7-.2-2.6z" fill="#fff" />
        <path d="M49.1 33.9l96.7 43.6-43.7 99.1L5.4 133z" fill="#26a146" transform="translate(123)" />
        <path d="M239.5 85.5c-2.1-5.6-5-10.4-8.8-14.4s-8.4-7.2-13.8-9.5-10.8-3.4-16.3-3.4h-.3c-5.6 0-11.1 1.3-16.5 3.7-5.7 2.5-10.6 5.9-14.8 10.4-4.2 4.4-7.6 9.8-10.2 16-2.6 6.1-4 12.3-4.3 18.4v2.1c0 5.4.9 10.7 2.8 15.9 2 5.5 4.9 10.2 8.7 14.2s8.5 7.2 14.1 9.5c5.3 2.3 10.7 3.4 16.2 3.4h.1c5.5 0 11-1.2 16.4-3.5 5.7-2.5 10.7-6 14.9-10.5 4.2-4.4 7.7-9.7 10.3-15.9s4-12.3 4.3-18.4v-1.8c.1-5.5-.8-10.9-2.8-16.2zm-19.3 28.8c-3.6 8.6-8.5 14.5-14.4 17.7-3.2 1.7-6.5 2.6-9.8 2.6-2.9 0-6-.7-9.1-2-6.8-2.9-11-7.5-12.8-14.1-.6-2.2-.9-4.5-.9-6.9 0-4.8 1.2-10.1 3.6-15.8 3.7-8.8 8.6-14.8 14.5-18.1 3.2-1.8 6.5-2.6 9.8-2.6 3 0 6 .7 9.2 2 6.7 2.9 10.9 7.5 12.7 14.1.6 2.1.9 4.4.9 6.8 0 5-1.2 10.4-3.7 16.3z" fill="#fff" />
        <path d="M108.1 38.8L124 143.7 17.2 160.4 0 55.4z" fill="#d92231" transform="translate(0 15)" />
        <path d="M96.6 142c-.8-1-2-1.7-3.4-2.2s-3.1-.7-5.2-.7c-1.9 0-4.1.2-6.5.6l-28.2 4.8c.3-2.2 1.4-5 3.3-8.5 2.1-3.9 5.3-8.6 9.4-14 a133.09 133.09 0 0 1 3.3-4.3c.5-.7 1.3-1.6 2.3-2.9 6.5-8.5 10.4-15.4 12-20.8.9-3.1 1.4-6.2 1.6-9.3.1-.9.1-1.7.1-2.5 0-2.2-.2-4.4-.6-6.6-.3-2-.8-3.6-1.5-4.9s-1.5-2.3-2.5-2.9c-1.1-.7-2.8-1-4.9-1-1.7 0-3.8.2-6.3.6L36.9 73c-3.9.7-6.9 1.8-8.7 3.6-1.5 1.4-2.2 3.2-2.2 5.2 0 .5 0 1.1 0 1.7-.5 2.8 1.9 4.8 4.2 5.8 1.4.6 3 .9 5 .9 1.3 0 2.8-.1 4.4-.4L66.9 85c0 .5.1 1 .1 1.4a14.26 14.26 0 0 1-.9 5c-.8 2.3-2.8 5.5-6.1 9.6l-4.2 5.2c-7.4 8.9-12.6 16.5-15.8 22.8-2.3 4.4-3.8 8.6-4.7 12.9-.5 2.5-.8 4.8-.8 7.1 0 1.6.1 3.2.4 4.7.4 2.2.9 4 1.6 5.4s1.7 2.5 2.8 3.1 2.6.8 4.8.8c2.7 0 6.4-.4 11.1-1.2l29.6-5.1c5.2-.9 8.9-2.2 11-3.9 1.7-1.4 2.6-3.3 2.6-5.5 0-.6-.1-1.2-.2-1.8-.2-1.3-.7-2.5-1.6-3.5z" fill="#fff" />
      </g>
    </svg>
  </div>
);

const ExcelLogo = () => (
  <div className="w-12 h-12 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7] flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110">
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
      <path d="M12 4h7.5c.83 0 1.5.67 1.5 1.5v13c0 .83-.67 1.5-1.5 1.5H12V4z" fill="#107C41" />
      <path d="M14 7h6M14 10h6M14 13h6M14 16h6M17 4v16" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.8" />
      <path d="M2.5 5.5h11c.83 0 1.5.67 1.5 1.5v10c0 .83-.67 1.5-1.5 1.5h-11A1.5 1.5 0 0 1 1 17V7c0-.83.67-1.5 1.5-1.5z" fill="#107C41" stroke="#107C41" strokeWidth="1.2" />
      <path d="M4.5 9L9.5 15M9.5 9L4.5 15" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  </div>
);

const RazorpayLogo = () => (
  <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] border border-[#E0E7FF] flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110">
    <svg className="w-7 h-7 text-[#0B44CD]" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 2.5L12 8l-4.5 9.5H12L22 2.5z" fill="#0B44CD" />
      <path d="M12.5 11.5L2 21.5h16l-5.5-10z" fill="#0B44CD" opacity="0.8" />
    </svg>
  </div>
);

const WhatsAppApiLogo = () => (
  <div className="w-12 h-12 rounded-xl bg-[#E8F8F0] border border-[#D0F0DC] flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110">
    <svg className="w-7 h-7 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.012 2C6.48 2 2 6.48 2 12.012c0 1.764.468 3.42 1.284 4.896L2 22l5.244-1.373a9.932 9.932 0 004.768 1.217c5.532 0 10.012-4.48 10.012-10.012C22.024 6.48 17.544 2 12.012 2zm0 18.337c-1.572 0-3.12-.42-4.476-1.212l-.324-.192-3.324.87.888-3.24-.216-.342A8.286 8.286 0 013.68 12.01c0-4.577 3.732-8.311 8.332-8.311 4.6 0 8.312 3.734 8.312 8.314a8.324 8.324 0 01-8.312 8.324z" />
      <path d="M15.93 13.916c-.216-.108-1.272-.624-1.464-.696-.2-.072-.336-.108-.48.108-.144.216-.552.696-.684.852-.12.144-.252.168-.468.06-1.044-.516-1.788-1.032-2.52-2.292-.096-.168.096-.156.276-.516.18-.36.096-.672-.048-.852-.144-.216-.48-1.152-.66-1.584-.168-.42-.36-.36-.492-.36h-.42c-.144 0-.384.06-.588.276-.204.216-.78.756-.78 1.848s.804 2.148.912 2.292c.108.144 1.584 2.424 3.828 3.396.54.228.96.372 1.284.48.54.168 1.032.144 1.428.084.444-.06 1.272-.516 1.452-1.02.18-.504.18-.936.12-1.02-.06-.084-.216-.132-.432-.24z" />
    </svg>
  </div>
);

const MSMESamadhaanLogo = () => (
  <div className="w-12 h-12 rounded-xl bg-[#FFF5EB] border border-[#FFE6CC] flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110">
    <svg className="w-7 h-7 text-[#E65C00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3v17" />
      <path d="M5 20h14" />
      <path d="M3 7h18" />
      <path d="M6 7c0 4.5 1.5 6 3 6s3-1.5 3-6" />
      <path d="M12 7c0 4.5 1.5 6 3 6s3-1.5 3-6" />
    </svg>
  </div>
);

interface ToolItem {
  name: string;
  badge: string;
  description: string;
  logo: React.ComponentType;
  colorClass: string;
}

export default function ToolsIntegration() {
  const tools: ToolItem[] = [
    {
      name: "Tally",
      badge: "1-Click Sync",
      description: "Connect Tally in one click. Automatically import all your unpaid bills and customer accounts without manual entry.",
      logo: TallyLogo,
      colorClass: "border-slate-200/80 bg-[#FAF9F6]",
    },
    {
      name: "Zoho Books",
      badge: "Cloud Sync",
      description: "Sync Zoho Books automatically. Pull all your outstanding invoices directly from your Zoho dashboard in real-time.",
      logo: ZohoBooksLogo,
      colorClass: "border-slate-200/80 bg-[#FAF9F6]",
    },
    {
      name: "WhatsApp",
      badge: "Official API",
      description: "Official WhatsApp messaging. We use approved templates so your business phone number is 100% safe from getting banned.",
      logo: WhatsAppApiLogo,
      colorClass: "border-slate-200/80 bg-[#FAF9F6]",
    },
    {
      name: "MSME Samadhaan",
      badge: "Govt Portal",
      description: "Government legal portal filing. Automatically prepares and pre-fills the exact files needed to claim your money on MSME Samadhaan.",
      logo: MSMESamadhaanLogo,
      colorClass: "border-slate-200/80 bg-[#FAF9F6]",
    },
    {
      name: "Razorpay",
      badge: "Instant Settle",
      description: "Instant payment checkout. Send direct payment links so customers can pay instantly via UPI, Google Pay, PhonePe, or cards.",
      logo: RazorpayLogo,
      colorClass: "border-slate-200/80 bg-[#FAF9F6]",
    },
    {
      name: "Excel",
      badge: "Bulk Import",
      description: "Easy spreadsheet upload. No software? Just drag and drop your Excel or CSV sheet to upload hundreds of unpaid invoices instantly.",
      logo: ExcelLogo,
      colorClass: "border-slate-200/80 bg-[#FAF9F6]",
    },
  ];

  return (
    <section id="tools-integration" className="relative w-full bg-[#FFFFFF] py-20 md:py-28 lg:py-32 overflow-hidden">
      {/* Soft atmospheric background lights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/3 left-10 w-[300px] h-[300px] rounded-full bg-blue-50/40 blur-[80px]" />
        <div className="absolute bottom-1/3 right-10 w-[300px] h-[300px] rounded-full bg-[#00A389]/5 blur-[80px]" />
      </div>

      <div className="relative max-w-[1340px] mx-auto px-6 md:px-8 z-10 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border border-blue-200/60 bg-blue-50/40 text-[#0047FF] text-sm font-medium tracking-tight font-outfit mb-6 select-none">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[#0047FF]">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          Ecosystem Integrations
        </div>

        {/* Headline */}
        <h2 className="text-[2.75rem] md:text-[3.25rem] font-normal text-gray-950 tracking-tight leading-[1.15] font-outfit max-w-4xl mx-auto">
          Works With The Tools You Already Use <br className="hidden sm:inline" />
           <span className="bg-gradient-to-r from-black to-[#B5F670] bg-clip-text text-transparent font-normal"> — With More Coming Soon.</span> 
        </h2>

        {/* Subheadline */}
        <p className="text-gray-500 font-normal text-sm md:text-base mt-4 mb-16 max-w-2xl mx-auto leading-relaxed">
          No migrations. No complicated setup. Import invoices from your existing tools and start recovering payments in minutes.
        </p>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-[1340px] mx-auto text-left mb-16">
          {tools.map((tool, idx) => {
            const LogoComponent = tool.logo;
            return (
              <div
                key={idx}
                className={`relative border rounded-3xl p-4 md:p-6 flex flex-col justify-between min-h-[240px] transition-all duration-300 ${tool.colorClass}`}
              >
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <LogoComponent />
                    <span className="inline-flex items-center text-[10px] font-medium text-zinc-500 border border-black/[0.04] bg-white px-2.5 py-0.5 rounded-full select-none">
                      {tool.badge}
                    </span>
                  </div>
                  <h4 className="text-lg font-medium text-gray-950 tracking-tight font-outfit mb-2">
                    {tool.name}
                  </h4>
                  <p className="text-zinc-500 text-[13px] md:text-[14px] leading-relaxed font-normal">
                    {tool.description}
                  </p>
                </div>
              </div>
            );
          })}

          {/* 7th Card: More coming soon placeholder (spans 2 columns on desktop) */}
          <div className="lg:col-span-2 border border-dashed border-slate-200 bg-slate-50/15 rounded-3xl p-6 md:p-8 flex flex-col justify-center items-center text-center min-h-[240px]">
            <div className="w-9 h-9 rounded-full bg-slate-100/85 border border-slate-200/50 flex items-center justify-center mb-3">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-[14px] font-medium text-slate-400">
              More Coming Soon
            </span>
            <p className="text-[11.5px] text-slate-400/80 mt-1 max-w-[280px] font-sans">
              Custom API bindings and direct CRM integrations are currently in private beta.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
