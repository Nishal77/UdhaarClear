"use client";

import React from "react";

export default function Features() {
  return (
    <section id="features" className="relative w-full bg-[#FFFFFF] py-20 md:py-28 lg:py-32 overflow-hidden">
      {/* Decorative background grid and lights */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at top right, rgba(99, 102, 241, 0.04), transparent 500px),
            radial-gradient(circle at bottom left, rgba(0, 73, 255, 0.03), transparent 500px)
          `
        }}
      />

      <div className="relative max-w-[1340px] mx-auto px-6 md:px-8 z-10 text-center">

        {/* Announcement Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border border-blue-200/60 bg-blue-50/40 text-[#0047FF] text-sm font-medium tracking-tight font-outfit mb-6">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[#0047FF]">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          Key Features
        </div>

        {/* Heading */}
        <h2 className="text-[2.75rem] md:text-[3.25rem] font-medium text-gray-900 tracking-tight leading-[1.15] font-outfit max-w-4xl mx-auto">
          Everything Your Business Needs to Recover Payments Faster.
        </h2>

        {/* Subheading */}
        <p className="text-gray-500 font-medium text-sm md:text-base mt-4 mb-16 max-w-3xl mx-auto leading-relaxed">
          UdhaarClear brings WhatsApp reminders, payment links, customer follow-ups, and recovery tracking into one simple system — so you collect faster without daily chasing.
        </p>

        {/* Outer Grid Border Frame */}
        <div className="relative border border-gray-200/70 bg-white max-w-[1280px] mx-auto shadow-[0_8px_30px_rgba(0,0,0,0.015)]">

          {/* Outer Corner Blueprint Ticks */}
          {/* Top-Left Corner Tick */}
          <div className="absolute -top-[9px] -left-[9px] w-[17px] h-[17px] z-30 pointer-events-none">
            <div className="absolute top-[8px] left-0 right-0 h-[1px] bg-gray-400" />
            <div className="absolute left-[8px] top-0 bottom-0 w-[1px] bg-gray-400" />
          </div>
          {/* Top-Right Corner Tick */}
          <div className="absolute -top-[9px] -right-[9px] w-[17px] h-[17px] z-30 pointer-events-none">
            <div className="absolute top-[8px] left-0 right-0 h-[1px] bg-gray-400" />
            <div className="absolute right-[8px] top-0 bottom-0 w-[1px] bg-gray-400" />
          </div>
          {/* Bottom-Left Corner Tick */}
          <div className="absolute -bottom-[9px] -left-[9px] w-[17px] h-[17px] z-30 pointer-events-none">
            <div className="absolute bottom-[8px] left-0 right-0 h-[1px] bg-gray-400" />
            <div className="absolute left-[8px] top-0 bottom-0 w-[1px] bg-gray-400" />
          </div>
          {/* Bottom-Right Corner Tick */}
          <div className="absolute -bottom-[9px] -right-[9px] w-[17px] h-[17px] z-30 pointer-events-none">
            <div className="absolute bottom-[8px] left-0 right-0 h-[1px] bg-gray-400" />
            <div className="absolute right-[8px] top-0 bottom-0 w-[1px] bg-gray-400" />
          </div>

          {/* Blueprint Crosshairs/Tick Markers at Corner Intersections */}
          <div className="absolute top-[36%] left-[33.3%] -translate-x-1/2 -translate-y-1/2 text-gray-300 font-light text-[14px] z-20 pointer-events-none hidden md:block">+</div>
          <div className="absolute top-[36%] left-[66.6%] -translate-x-1/2 -translate-y-1/2 text-gray-300 font-light text-[14px] z-20 pointer-events-none hidden md:block">+</div>
          <div className="absolute top-[64%] left-[33.3%] -translate-x-1/2 -translate-y-1/2 text-gray-300 font-light text-[14px] z-20 pointer-events-none hidden md:block">+</div>
          <div className="absolute top-[64%] left-[66.6%] -translate-x-1/2 -translate-y-1/2 text-gray-300 font-light text-[14px] z-20 pointer-events-none hidden md:block">+</div>

          {/* Row 1: 3 Column Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200/60 items-stretch">

            {/* Box 1: Intuitive Dashboard */}
            <div className="p-5 md:p-6 lg:p-7 flex flex-col justify-start gap-0 min-h-[360px] lg:min-h-[380px]">
              {/* Visual Container */}
              <div className="relative w-full h-[220px] flex items-center justify-center bg-[#FAFAFA] rounded-2xl border border-gray-100 shadow-inner overflow-hidden">
                {/* Dotted grid pattern inside */}
                <div
                  className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
                    backgroundSize: '16px 16px'
                  }}
                />

                {/* Premium Invoice Card */}
                <div className="relative z-10 bg-white border border-gray-150 rounded-2xl p-4 shadow-xl w-[95%] max-w-[240px]">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[#0047FF] font-bold text-[11px] tracking-tight mr-0.5">#</span>
                      <span className="text-[9px] font-bold text-gray-400 font-mono">INV-456789</span>
                      <h4 className="text-lg font-bold text-gray-900 tracking-tight font-outfit mt-1">
                        $284,342.57
                      </h4>
                      <span className="inline-block bg-amber-50 text-amber-700 border border-amber-200/60 text-[7.5px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider mt-1 select-none">
                        Due in 15 days
                      </span>
                    </div>

                    {/* Miniature template layout icon */}
                    <div className="w-10 h-12 bg-gray-50 border border-gray-150 rounded-lg p-1.5 flex flex-col justify-between shrink-0">
                      <div className="w-3.5 h-1 bg-[#0047FF]/20 rounded-sm" />
                      <div className="space-y-0.5">
                        <div className="w-6 h-0.5 bg-gray-200 rounded-sm" />
                        <div className="w-5 h-0.5 bg-gray-200 rounded-sm" />
                      </div>
                      <div className="flex justify-end">
                        <div className="w-2.5 h-1.5 bg-gray-200 rounded-[1px]" />
                      </div>
                    </div>
                  </div>

                  {/* To / From Addresses Form Mock */}
                  <div className="mt-4 pt-3 border-t border-gray-100/80 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-bold text-gray-400 w-8 select-none">To</span>
                      <div className="h-1 bg-gray-100 rounded-full w-20" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-bold text-gray-400 w-8 select-none">From</span>
                      <div className="h-1 bg-gray-100 rounded-full w-28" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-bold text-gray-400 w-8 select-none">Address</span>
                      <div className="h-1 bg-gray-100 rounded-full w-16" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="text-left mt-3">
                <h4 className="text-xl font-semibold text-gray-900 font-outfit mb-1.5">WhatsApp Reminders Your Customers Actually Notice</h4>
                <p className="text-gray-500 text-sm leading-relaxed font-medium">
                  Send clear payment reminders on WhatsApp, without repeated calls or ignored messages.
                </p>
              </div>
            </div>

            {/* Box 2: Seamless Integration Ecosystem */}
            <div className="p-5 md:p-6 lg:p-7 flex flex-col justify-start gap-0 min-h-[360px] lg:min-h-[380px]">
              {/* Visual Container */}
              <div className="relative w-full h-[220px] flex items-center justify-center bg-[#FAFAFA] rounded-2xl border border-gray-100 shadow-inner overflow-hidden">
                <div
                  className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
                    backgroundSize: '16px 16px'
                  }}
                />

                {/* Integration Card with Bottom Rainbow Shadow */}
                <div className="relative z-10 bg-white border border-gray-150 rounded-2xl shadow-xl w-[95%] max-w-[220px] overflow-hidden">

                  {/* Title Bar */}
                  <div className="border-b border-gray-100 px-3.5 py-2.5 flex items-center gap-1.5 text-[9px] text-gray-400 font-bold uppercase tracking-wider select-none bg-white">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-400">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                    <span>Integrations</span>
                  </div>

                  {/* Integration Items List */}
                  <div className="p-3 space-y-2.5 bg-white">
                    {/* Item 1: Gemini */}
                    <div className="border border-gray-100 rounded-xl p-2 flex items-center justify-between shadow-sm bg-[#FAFAFA]/70">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-50/50 border border-blue-100/50 flex items-center justify-center shrink-0">
                          {/* Spark Icon */}
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-blue-600">
                            <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" fill="currentColor" />
                          </svg>
                        </div>
                        <div>
                          <h5 className="text-[10px] font-bold text-gray-900">Gemini</h5>
                          <p className="text-[8px] text-gray-400 font-medium">The AI model that...</p>
                        </div>
                      </div>
                      <button className="w-5 h-5 rounded-md border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-all font-semibold text-xs bg-white cursor-pointer select-none">
                        +
                      </button>
                    </div>

                    {/* Item 2: Replit */}
                    <div className="border border-gray-100 rounded-xl p-2 flex items-center justify-between shadow-sm bg-[#FAFAFA]/70">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-orange-50/50 border border-orange-100/50 flex items-center justify-center shrink-0">
                          {/* Replit Bracket Icon */}
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-orange-600">
                            <path d="M4 6l6 6-6 6M20 18h-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <div>
                          <h5 className="text-[10px] font-bold text-gray-900">Replit</h5>
                          <p className="text-[8px] text-gray-400 font-medium">The AI model that...</p>
                        </div>
                      </div>
                      <button className="w-5 h-5 rounded-md border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-all font-semibold text-xs bg-white cursor-pointer select-none">
                        +
                      </button>
                    </div>
                  </div>

                  {/* Gradient shadow reflection at the bottom */}
                  <div className="h-1 w-full bg-gradient-to-r from-blue-400 via-pink-400 to-yellow-400 opacity-60" />
                </div>
              </div>

              {/* Description */}
              <div className="text-left mt-3">
                <h4 className="text-xl font-semibold text-gray-900 font-outfit mb-1.5">Payment Links That Make Every Payment Simple</h4>
                <p className="text-gray-500 text-sm leading-relaxed font-medium">
                Add a payment link to every reminder, so paying feels quick and easy.
                </p>
              </div>
            </div>

            {/* Box 3: Advanced Analytics Engine */}
            <div className="p-5 md:p-6 lg:p-7 flex flex-col justify-start gap-0 min-h-[360px] lg:min-h-[380px]">
              {/* Visual Container */}
              <div className="relative w-full h-[220px] flex items-center justify-center bg-[#FAFAFA] rounded-2xl border border-gray-100 shadow-inner overflow-hidden">
                <div
                  className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
                    backgroundSize: '16px 16px'
                  }}
                />

                {/* Advanced Analytics Card Stack */}
                <div className="relative w-[95%] max-w-[210px] h-[150px] select-none pointer-events-none">

                  {/* Third Card (Deepest Stack) */}
                  <div className="absolute inset-0 bg-white border border-gray-150 rounded-2xl shadow-sm -translate-y-3.5 translate-x-3.5 opacity-40 z-0 scale-95" />

                  {/* Second Card (Middle Stack) */}
                  <div className="absolute inset-0 bg-white border border-gray-150 rounded-2xl shadow-md -translate-y-2 translate-x-2 opacity-70 z-10 scale-98" />

                  {/* Top Card */}
                  <div className="absolute inset-0 bg-white border border-gray-150 rounded-2xl p-3.5 shadow-xl z-20 flex flex-col gap-2.5">
                    {/* Heading */}
                    <div>
                      <h5 className="text-[10px] font-extrabold text-gray-900">
                        <span className="text-[#D97706] bg-[#FEF3C7] px-1.5 py-0.5 rounded mr-0.5">Spending</span> Limit
                      </h5>
                      <p className="text-[7.5px] text-gray-400 font-bold uppercase tracking-wide mt-1 leading-none">
                        New users by First user primary channel group
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden flex shadow-inner border border-gray-200/40">
                      <div className="h-full bg-indigo-950 w-[20%]" />
                      <div className="h-full bg-indigo-600 w-[35%]" />
                      <div className="h-full bg-gray-200/50 w-[45%] flex items-center justify-center" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(156,163,175,0.1) 2px, rgba(156,163,175,0.1) 4px)' }} />
                    </div>

                    {/* Stats */}
                    <div className="flex justify-between items-center text-[9px] font-bold">
                      <div>
                        <span className="text-gray-950">40%</span>
                        <span className="text-gray-400 font-medium ml-0.5">Used</span>
                      </div>
                      <div>
                        <span className="text-gray-500">60%</span>
                        <span className="text-gray-400 font-medium ml-0.5">Free</span>
                      </div>
                    </div>

                    {/* Bullet Info Rows */}
                    <div className="pt-2 border-t border-gray-100 space-y-0.5 text-[8px] font-semibold">
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-800" />
                        <span>Running (20%) average of 12 Minutes</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                        <span>Swimming (20%)</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Description */}
              <div className="text-left mt-3">
                <h4 className="text-xl font-semibold text-gray-900 font-outfit mb-1.5">Friendly First. Serious Later. Formal When Needed.</h4>
                <p className="text-gray-500 text-sm leading-relaxed font-medium">
                  Start polite, become serious when delayed, and stay professional always.
                </p>
              </div>
            </div>

          </div>

          {/* Row 2: Stats and Testimonial */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200/60 border-t border-b border-gray-200/60 items-stretch bg-white">

            {/* Box 4: Stats (1/3 Width) */}
            <div className="relative p-5 md:p-6 flex items-center justify-around md:col-span-1 min-h-[130px]">
              <div className="text-center px-4">
                <span className="text-4xl lg:text-4xl font-bold tracking-tight text-gray-900 font-outfit leading-none">
                  ₹120 Cr+
                </span>
                <p className="text-[12px] text-gray-600 font-semibold tracking-tight mt-2 select-none">
                  Total Recovered
                </p>
              </div>
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-gray-200/60 hidden md:block" />
              <div className="text-center px-4">
                <span className="text-3xl lg:text-4xl font-semibold tracking-tight text-gray-900 font-outfit leading-none">
                  94.2%
                </span>
                <p className="text-[12px] text-gray-600 font-semibold tracking-tight mt-2 select-none">
                  Recovery Rate
                </p>
              </div>
            </div>

            {/* Box 5: Quote Testimonial (2/3 Width) */}
            <div className="p-5 md:p-6 lg:p-8 md:col-span-2 flex flex-col justify-center text-left min-h-[130px]">
              <div className="flex items-stretch gap-4 md:gap-5">
                {/* Thick Blue Vertical Line */}
                <div className="w-[3px] bg-blue-600 rounded-full shrink-0" />

                <div>
                  <p className="text-gray-700 text-sm md:text-base font-medium leading-relaxed font-outfit">
                    "No business owner should feel small asking for their own money. UdhaarClear helps you follow up professionally, recover payments faster, and keep customer relationships safe."
                  </p>

                  {/* Author and Profile */}
                  <div className="flex items-center gap-2 mt-2.5 select-none">
                    <img
                      className="w-5 h-5 rounded-full object-cover filter grayscale border border-gray-250"
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=32&h=32&q=80"
                      alt="Théo Balick"
                    />
                    <span className="text-xs text-gray-500 font-bold">
                      Théo Balick <span className="text-gray-300 font-light mx-1">·</span> <span className="font-medium text-gray-400">CTO, TechSolutions</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Row 3: 3 Column Feature Cards at Bottom */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200/60 items-stretch bg-white">

            {/* Box 6: Global Data Visualization */}
            <div className="p-5 md:p-6 lg:p-7 flex flex-col justify-start gap-0 min-h-[360px] lg:min-h-[380px]">
              {/* Visual Container */}
              <div className="relative w-full h-[220px] flex items-center justify-center bg-[#FAFAFA] rounded-2xl border border-gray-100 shadow-inner overflow-hidden">
                <div
                  className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
                    backgroundSize: '16px 16px'
                  }}
                />

                {/* World Map Background Visual */}
                <svg className="absolute inset-0 w-full h-full text-gray-200/40 p-4" viewBox="0 0 400 200" fill="currentColor">
                  {/* Americas */}
                  <path d="M20,40 h15 l10,20 l-5,40 l-10,10 l-15,-20 Z M35,110 h10 l15,40 l-5,20 l-15,-10 Z" />
                  {/* Greenland */}
                  <path d="M130,10 h30 l-10,20 l-20,-10 Z" />
                  {/* Europe & Africa */}
                  <path d="M150,40 h45 l15,30 l-10,40 l-25,10 l-25,-40 Z" />
                  {/* Asia & India */}
                  <path d="M220,30 h80 l30,30 l-15,60 l-45,20 l-30,-20 l-20,-50 Z" />
                  {/* Australia */}
                  <path d="M300,120 h25 l10,20 l-20,15 l-15,-15 Z" />
                </svg>

                {/* Floating Regional Pin Avatars */}
                {/* US Avatar Pin */}
                <div className="absolute top-[35%] left-[18%] z-10 group cursor-default">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping scale-150" />
                    <img
                      className="w-7 h-7 rounded-full border-2 border-white shadow-md object-cover"
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=32&h=32&q=80"
                      alt="US Region"
                    />
                  </div>
                </div>

                {/* Europe Avatar Pin */}
                <div className="absolute top-[28%] left-[45%] z-10 group cursor-default">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping scale-150" />
                    <img
                      className="w-7 h-7 rounded-full border-2 border-white shadow-md object-cover"
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=32&h=32&q=80"
                      alt="EU Region"
                    />
                  </div>
                </div>

                {/* Asia Avatar Pin */}
                <div className="absolute top-[42%] left-[70%] z-10 group cursor-default">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping scale-150" />
                    <img
                      className="w-7 h-7 rounded-full border-2 border-white shadow-md object-cover"
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=32&h=32&q=80"
                      alt="Asia Region"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="text-left mt-3">
                <h4 className="text-xl font-semibold text-gray-900 font-outfit mb-1.5">Recovery Dashboard That Shows Every Pending Rupee</h4>
                <p className="text-gray-500 text-sm leading-relaxed font-medium">
                  See pending, overdue, recovered, and followed-up invoices in one place.
                </p>
              </div>
            </div>

            {/* Box 7: Automated Escalation Engine */}
            <div className="p-5 md:p-6 lg:p-7 flex flex-col justify-start gap-0 min-h-[360px] lg:min-h-[380px]">
              {/* Visual Container */}
              <div className="relative w-full h-[220px] flex items-center justify-center bg-[#FAFAFA] rounded-2xl border border-gray-100 shadow-inner overflow-hidden">
                <div
                  className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
                    backgroundSize: '16px 16px'
                  }}
                />

                {/* Escalation Bubbles Container */}
                <div className="relative w-full h-full flex flex-col justify-center items-center px-4">
                  {/* Bubble 1: Friendly */}
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[9px] px-3.5 py-1.5 rounded-2xl max-w-[170px] -translate-x-5 -translate-y-3 font-semibold select-none shadow-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>Friendly: Invoice is due.</span>
                  </div>

                  {/* Bubble 2: Firm */}
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 text-[9px] px-3.5 py-1.5 rounded-2xl max-w-[170px] z-10 font-semibold select-none shadow-md flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span>Firm: Payment is past due.</span>
                  </div>

                  {/* Bubble 3: Legal/Formal */}
                  <div className="bg-rose-50 border border-rose-200 text-rose-800 text-[9px] px-3.5 py-1.5 rounded-2xl max-w-[170px] translate-x-5 translate-y-3 font-semibold select-none shadow-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                    <span>Formal: Settle dues today.</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="text-left mt-3">
                <h4 className="text-xl font-semibold text-gray-900 font-outfit mb-1.5">Customer Controls That Protect Important Relationships</h4>
                <p className="text-gray-500 text-sm leading-relaxed font-medium">
                Pause, adjust, or soften reminders for customers who need extra care.
                </p>
              </div>
            </div>

            {/* Box 8: One-Click UPI Settlement */}
            <div className="p-5 md:p-6 lg:p-7 flex flex-col justify-start gap-0 min-h-[360px] lg:min-h-[380px]">
              {/* Visual Container */}
              <div className="relative w-full h-[220px] flex items-center justify-center bg-[#FAFAFA] rounded-2xl border border-gray-100 shadow-inner overflow-hidden">
                <div
                  className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
                    backgroundSize: '16px 16px'
                  }}
                />

                {/* Payment Successful Card */}
                <div className="relative z-10 bg-white border border-gray-150 rounded-2xl p-4 shadow-xl w-[90%] max-w-[190px] flex flex-col items-center justify-center text-center gap-2">
                  {/* Success Circle check */}
                  <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 shadow-sm shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div>
                    <h6 className="text-[11px] font-bold text-gray-900">Payment Successful</h6>
                    <p className="text-[9px] text-gray-400 font-semibold mt-1">₹45,000 received via UPI</p>
                  </div>
                  {/* Mock small secure badge */}
                  <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-[#0047FF] text-[8px] font-bold tracking-tight">
                    Razorpay Secure
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="text-left mt-3">
                <h4 className="text-xl font-semibold text-gray-900 font-outfit mb-1.5">Team Tools That Keep Follow-Ups Organized</h4>
                <p className="text-gray-500 text-sm leading-relaxed font-medium">
                Let your team track reminders, payments, and customer activity clearly.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
