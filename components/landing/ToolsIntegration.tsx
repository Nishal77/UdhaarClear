"use client";

import React from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

// --- CUSTOM SVG LOGOS ---

const TallyLogo = () => (
  <div className="w-12 h-12 rounded-xl bg-[#FFF6F6] border border-[#FFEAEA] flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:scale-110">
    <svg className="w-9 h-9" viewBox="200 80 600 320" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="m426.7 276.4c5.9-3.9 18.3-18.9 18.9-20.2s3.3-3.9.6-6.5-5.2-1.3-8.5.6c-3.2 1.3-16.9 12.4-22.1 16.3s-18.2 15.6-18.2 15.6-7.2 5.9-4.5 9.1 5.2 2 8.5.7c3.8-1.3 19.5-11.7 25.3-15.6zm-16.9-110h-3.2c-15.6 0-53.4 2.6-61.9 3.3-9.1.6-38.4 5.9-43.6 7.2s-2.6 4.5-2.6 4.5 5.2 5.9 7.8 7.8c2.6 2 6.5 7.8 11.7 5.2 5.9-2.6 34.5-5.2 43.6-6.5 5.8-.8 11.7-.8 17.6 0 0 0-24.7 32.5-28.6 38.4-3.9 5.2-25.4 34.5-30 41-3.9 6.5-14.3 22.8-18.9 30.6-3.9 7.8 3.2 7.2 3.2 7.2s16.9.6 20.8.6c3.2 0 3.9-2.6 4.6-3.9 1.5-3.4 3.2-6.6 5.2-9.8 3.3-5.2 10.4-16.9 18.2-30s17.6-25.4 24.7-35.2 15.6-20.8 17.6-23.4 9.8-13 11.7-15.6 2.6-2.6 5.2-2.6c3.3 0 23.4 1.3 31.9 2 9.1.7 21.5 1.3 29.3 2s5.2-3.3 5.2-3.3c.3-3.4-.4-6.8-2-9.8-2.6-5.2-4.6-4.6-4.6-4.6-10.2-3.1-51.2-5.1-62.9-5.1zm306 183.6c2 1.3 6.5 2.6 5.9 6.5 0 0-3.9 9.1-5.9 9.8s-5.2.6-11.7-2-38.4-10.4-46.9-12.4c-7.8-1.3-26.7-4.5-26.7-4.5s-2.6-1.3-6.5 5.2c-3.9 5.9-16.3 24.1-16.3 24.1-.4 1.5-1.7 2.6-3.3 2.6-2.6 0-12.4-.6-16.3-2.6s-5.2-2-2.6-5.9 11.1-21.5 15-24.7-2-2.6-3.9-3.2c-2 0-39.7-2.6-50.8-2-11.1 0-50.1 0-64.5 1.3s-65.8 5.9-78.8 7.8c-13.7 2-68.4 9.8-75.5 11.7-7.2 1.3-22.1 3.9-22.1 3.9-5 1.1-10.2.7-15-1.3-7.2-3.2-18.9-7.8-9.1-11.1s58.6-13 73.6-15c15-2.6 62.5-9.1 82-9.8c19.5-1.3 73.6-3.9 93.7-3.9 20.2 0 47.5 1.3 59.9 2.6 11.7.6 19.5 1.3 22.1 2s2.6-1.3 5.2-3.9 9.8-12.4 9.8-12.4 2.6-3.3-2.6-.6c-5.2 3.2-12.4 3.2-16.3-.6-3.9-3.9-5.2-6.5-7.2-5.9s-9.1 4.5-13 5.9-20.2 5.2-30-2c-9.8-6.5-10.4-9.8-11.7-12.4-1.3-3.2-2-3.2-5.2-1.3-3.3 2.6-14.3 7.8-18.9 9.8-4.2 2.3-8.9 3.4-13.7 3.2-6.5-.6-13.7-2.6-16.9-7.8s-3.3-9.1-6.5-6.5-21.5 13-31.2 15.6c-11.1 1.3-13.7 2.6-18.9 1.3-5.9-1.3-11.7-3.3-13.7-6.5s-2.6-3.9-5.2-2-9.8 7.2-15 6.5-18.9-3.9-26.7-17.6c-7.2-13.7-2-19.5 4.5-26 6.5-7.2 18.9-16.9 18.9-16.9s15-10.4 19.5-13c5.2-2.6 13-7.2 18.2-7.2s12.4 0 19.5 5.9 11.1 11.7 12.4 14.3c.6 2 3.9 10.4-1.3 16.3s-19.5 19.5-19.5 19.5-5.9 3.3-3.3 7.8c2.6 3.9 12.4-2.6 15-5.2 3.3-2 20.2-16.9 25.4-21.5 5.2-5.2 37.8-37.1 41-39.7 2.6-3.3 29.9-30 34.5-32.6 3.9-2.6 5.2-4.5 13-3.2 4.1.7 8 2 11.7 3.9 0 0 7.8 3.2 1.3 7.8-5.9 5.2-26.7 22.1-31.9 27.3s-20.1 20.2-24.6 25.4c-5.2 5.2-18.2 21.5-20.2 24.7s-3.3 6.5 0 9.1 9.1 0 15-5.2 24.1-20.2 30-26.7 40.4-38.4 43.6-41 18.9-15.6 18.9-15.6 2-2.6 6.5-2.6 9.1.6 11.7 2l7.8 3.9s3.3 1.3-2 5.2-33.9 26-41.7 34.5c-7.2 8.5-22.8 25.4-28.6 32.5-5.9 7.8-9.8 11.7-5.2 16.3 4.5 5.2 9.8 3.9 12.4 3.2s11.7-7.2 17.6-13.7c6.5-6.5 26-27.4 28.6-30 2-2.6 9.8-9.8 9.8-9.8s1.3-3.2 5.9-3.2 6.5.6 11.1 1.3c3.9 1.3 13 2.6 8.5 7.8-5.2 5.2-17.6 17.6-20.2 20.8s-13 15-15 18.2-4.5 7.2-2 9.1 9.8-.6 16.3-4.6c9.2-4.7 17.7-10.6 25.4-17.6 8.5-7.8 22.1-20.2 22.1-20.2s2-5.2 12.4-3.2c9.8 2 12.4 3.2 12.4 3.2s7.8 2 2.6 6.5-22.1 19.5-28.7 26c-6.5 5.9-26.7 26.7-30 30.6s-13 13-9.1 13.7 33.8 6.5 40.4 8.5c6 2.3 28.8 10.8 30.8 11.5z" fill="#00A389" />
      <path d="m429.3 282.9c5.9-3.9 18.2-18.9 18.9-20.2s3.2-3.9.6-6.5-5.2-1.3-8.5.6c-3.2 1.3-16.9 11.7-22.1 16.3-5.2 3.9-18.2 15.6-18.2 15.6s-7.2 5.9-4.6 9.1 5.2 2 8.5.7c3.9-1.3 19.6-11.7 25.4-15.6zm289.1 73.6c2 .6 6.5 2 6.5 6.5 0 0-4.6 9.1-5.9 9.8-2 .6-5.2.6-11.7-2s-38.4-10.4-46.9-12.4-27.3-5.2-27.3-5.2-2.6-1.3-6.5 4.6c-3.9 6.5-16.3 24.1-16.3 24.1-.4 1.5-1.7 2.6-3.2 2.6-2.6 0-12.4-.7-16.3-2.6s-5.2-2-2.6-5.9 11.1-21.5 15-24.7c3.2-3.2-2.6-2.6-4.6-3.2s-39.7-2.6-50.8-2c-11.1 0-50.1 0-64.5 1.3-14.3.6-65.1 5.9-78.8 7.8-13.7 2.6-68.4 9.8-75.5 11.7s-22.1 3.9-22.1 3.9c-5 1.1-10.2.7-15-1.3-7.2-3.2-18.9-7.8-9.1-11.1s58.6-13 73.6-15c15-2.6 62.5-9.1 82-9.8s73.6-3.9 93.8-3.9 47.5 1.3 59.9 2.6c11.7.6 19.5 1.3 22.1 2s2.6-1.3 5.2-3.9 9.8-12.4 9.8-12.4 2.6-3.9-2.6-.6c-4.6 3.2-12.4 3.2-16.3 0-3.9-3.9-5.2-7.2-7.2-5.9-4.2 2.3-8.5 4.3-13 5.9-3.9 1.3-20.8 5.2-30.6-1.3-9.8-7.2-10.4-9.8-11.7-13-1.3-4.5-2-4.5-5.2-2.6-3.3 1.9-14.3 7.8-18.9 9.8-4.1 2.4-8.9 3.3-13.7 2.6-6.5-.6-13.7-2.6-16.9-7.8-2.6-5.2-3.2-9.1-6.5-6.5s-21.5 13-31.2 15.6c-9.8 3.3-12.4 3.9-17.6 3.3-5.9-.6-11.7-3.3-13.7-6.5s-2.6-3.9-5.2-2.6c-2.6 2-9.8 7.2-15 7.2-5.2-.6-18.9-3.9-26-17.6s-2-19.5 4.6-26.7c6.5-6.5 18.2-16.9 18.2-16.9s15-11.1 19.5-13c5.2-2.6 13-7.2 18.2-7.2 7.1-.9 14.2 1.2 19.6 5.9 7.2 5.9 11.7 11.7 12.4 14.3s3.9 10.4-1.3 16.3-20.2 19.5-20.2 19.5-5.9 3.3-3.3 7.2 12.4-2.6 15.6-4.5c3.2-2.6 20.2-16.9 25.4-21.5 5.2-5.2 37.8-37.1 41-40.4 2.6-3.3 30-30 33.8-32.6 3.9-2.6 5.2-4.6 13-3.2 4.1.7 8 2 11.7 3.9 0 0 7.8 3.3 1.3 7.8-5.9 4.5-26.7 22.1-31.9 27.3s-20.2 20.2-24.7 25.4c-4.6 6.5-17.6 22.8-19.5 25.4-2 3.3-3.3 6.5 0 9.1 3.3 2 9.1 0 15-5.2s24.1-20.2 30-26.7c6.5-6.5 40.4-38.4 43.6-41.7 3.3-2.6 18.9-15 18.9-15s2-2.6 6.5-2.6 9.1.6 11.7 2l7.8 3.9s3.2 1.3-2 5.2-33.8 26-41 34.5c-7.8 8.5-22.8 25.4-28.7 32.6-5.9 7.8-9.8 11.1-5.2 16.3s9.8 3.9 12.4 3.3c6.5-3.7 12.4-8.3 17.6-13.7c6.5-6.5 26-28 28.7-30 2-2.6 9.8-9.8 9.8-9.8s1.3-3.2 5.9-3.2 6.5.6 11.1 1.3c3.9.6 13 2.6 8.5 7.8-5.2 5.2-17.6 18.2-20.2 20.8-2.6 3.2-13 15-15 18.2s-4.6 7.2-2 9.1 9.8-.6 16.3-4.6c9-4.8 17.3-10.7 24.7-17.6 8.5-7.8 22.1-20.2 22.1-20.2s2.6-5.2 12.4-3.2c9.8 2.6 12.4 3.2 12.4 3.2s7.8 2 2.6 6.5-22.1 20.2-28.6 26c-6.5 6.5-26.7 26.7-30 30.6s-13 13-9.1 13.7 33.9 5.9 40.4 7.9c5.1 3.9 28.6 11.7 30.5 13zm-336.6-162.1c-5.8-.8-11.7-.8-17.6 0-9.8 1.3-38.4 3.9-43.6 6.5s-9.8-3.3-11.7-5.2c-2.6-2-7.8-7.8-7.8-7.8s-2.6-3.3 2-4.6c5.2-1.3 34.5-5.9 43.6-7.2 9.1-.6 53.4-3.3 65.8-3.3 11.7 0 52.7 2.6 63.8 5.2 0 0 2-.6 4.6 4.6 1.2 3.3 1.9 6.9 2 10.4 0 0 2 3.9-5.2 3.3-8.5-.6-20.8-1.3-29.3-2s-28.6-2-31.9-2c-2.6 0-3.9 0-5.2 2.6-2 2.6-9.8 13-11.7 15.6s-10.4 13.7-17.6 23.5-16.3 22.1-24.7 34.5c-7.8 13-15 24.7-18.2 30-2 3.1-3.7 6.4-5.2 9.8-.6 1.3-1.3 3.3-5.2 3.3s-20.8-.6-20.8-.6-7.2.6-2.6-7.2c4.6-8.5 14.3-24.7 18.2-30.6 3.9-6.5 25.4-35.8 29.9-41 3.7-4.6 28.4-37.8 28.4-37.8z" fill="#ED1C24" />
    </svg>
  </div>
);

const ZohoBooksLogo = () => (
  <div className="w-12 h-12 rounded-xl bg-[#FFFBF0] border border-[#FEF0C7] flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:scale-110">
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

const KhatabookLogo = () => (
  <div className="w-12 h-12 rounded-xl bg-[#FFF2F2] border border-[#FFE3E3] flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:scale-110">
    <svg className="w-7 h-7 text-[#E72C33]" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.5 2h14A1.5 1.5 0 0 1 21 3.5v17a1.5 1.5 0 0 1-1.5 1.5h-14A2.5 2.5 0 0 1 3 19.5v-15A2.5 2.5 0 0 1 5.5 2z" />
      <path d="M5.5 2v17.5A1.5 1.5 0 0 0 7 21h12.5V3.5A1.5 1.5 0 0 0 18 2H5.5z" fill="#FFF" />
      <path d="M9 6h7v2H9V6zm0 4h7v2H9v-2zm0 4h5v2H9v-2z" fill="#E72C33" />
      <rect x="5.5" y="4" width="1.5" height="14" fill="#E72C33" opacity="0.8" />
    </svg>
  </div>
);

const ExcelLogo = () => (
  <div className="w-12 h-12 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7] flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:scale-110">
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
      <path d="M12 4h7.5c.83 0 1.5.67 1.5 1.5v13c0 .83-.67 1.5-1.5 1.5H12V4z" fill="#107C41" />
      <path d="M14 7h6M14 10h6M14 13h6M14 16h6M17 4v16" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.8" />
      <path d="M2.5 5.5h11c.83 0 1.5.67 1.5 1.5v10c0 .83-.67 1.5-1.5 1.5h-11A1.5 1.5 0 0 1 1 17V7c0-.83.67-1.5 1.5-1.5z" fill="#107C41" stroke="#107C41" strokeWidth="1.2" />
      <path d="M4.5 9L9.5 15M9.5 9L4.5 15" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  </div>
);

const RazorpayLogo = () => (
  <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] border border-[#E0E7FF] flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:scale-110">
    <svg className="w-7 h-7 text-[#0B44CD]" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 2.5L12 8l-4.5 9.5H12L22 2.5z" fill="#0B44CD" />
      <path d="M12.5 11.5L2 21.5h16l-5.5-10z" fill="#0B44CD" opacity="0.8" />
    </svg>
  </div>
);

const UPILogo = () => (
  <div className="w-12 h-12 rounded-xl bg-[#F0F5FF] border border-[#DCE7FC] flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:scale-110">
    <svg className="w-8 h-8" viewBox="0 0 42 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.2 2h3.5c2.3 0 4 1.2 4 3.5s-1.7 3.5-4 3.5H4.8v4.5H3.2V2zm3.3 5.4c1.2 0 2.4-.5 2.4-1.9 0-1.3-1.2-1.9-2.4-1.9H4.8v3.8h1.7z" fill="#097939" />
      <path d="M12.5 2h1.6v8.2c0 1.2.8 1.9 1.8 1.9s1.8-.7 1.8-1.9V2h1.6v8.2c0 2.2-1.4 3.5-3.4 3.5s-3.4-1.3-3.4-3.5V2z" fill="#0B44CD" />
      <path d="M21.5 2h3.5c2.3 0 4 1.2 4 3.5s-1.7 3.5-4 3.5h-1.9v4.5h-1.6V2zm3.3 5.4c1.2 0 2.4-.5 2.4-1.9 0-1.3-1.2-1.9-2.4-1.9h-1.7v3.8h1.7z" fill="#0B44CD" />
      <path d="M31.2 13.5l3.5-9h1.5l-3.5 9h-1.5z" fill="#FFB703" />
      <path d="M34.2 13.5l3.5-9h1.5l-3.5 9h-1.5z" fill="#0B44CD" />
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
      badge: "Sync Ledger",
      description: "Direct ledger integration to pull outstanding bills and customer accounts.",
      logo: TallyLogo,
      colorClass: "hover:border-[#FFEAEA] hover:shadow-[0_8px_30px_rgba(255,234,234,0.3)]",
    },
    {
      name: "Zoho Books",
      badge: "API Sync",
      description: "Auto-sync invoice books directly from your Zoho cloud dashboard.",
      logo: ZohoBooksLogo,
      colorClass: "hover:border-[#FEF0C7] hover:shadow-[0_8px_30px_rgba(254,240,199,0.3)]",
    },
    {
      name: "Khatabook",
      badge: "Ledger Sync",
      description: "One-click data import for micro-retailers and business credit accounts.",
      logo: KhatabookLogo,
      colorClass: "hover:border-[#FFE3E3] hover:shadow-[0_8px_30px_rgba(255,227,227,0.3)]",
    },
    {
      name: "Excel",
      badge: "Bulk Upload",
      description: "Upload bulk invoice details directly using Excel spreadsheets or CSVs.",
      logo: ExcelLogo,
      colorClass: "hover:border-[#DCFCE7] hover:shadow-[0_8px_30px_rgba(220,252,231,0.3)]",
    },
    {
      name: "Razorpay",
      badge: "Pay-Links",
      description: "Create payment checkout pages instantly linked to invoice reminders.",
      logo: RazorpayLogo,
      colorClass: "hover:border-[#E0E7FF] hover:shadow-[0_8px_30px_rgba(224,231,255,0.3)]",
    },
    {
      name: "UPI",
      badge: "Instant Settle",
      description: "Request fast settlements directly to your bank using standard UPI rails.",
      logo: UPILogo,
      colorClass: "hover:border-[#DCE7FC] hover:shadow-[0_8px_30px_rgba(220,231,252,0.3)]",
    },
  ];

  return (
    <section id="tools-integration" className="relative w-full bg-[#FFFFFF] py-20 md:py-28 lg:py-32 overflow-hidden border-b border-gray-150/50">
      {/* Soft atmospheric background lights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/3 left-10 w-[300px] h-[300px] rounded-full bg-blue-50/40 blur-[80px]" />
        <div className="absolute bottom-1/3 right-10 w-[300px] h-[300px] rounded-full bg-[#00A389]/5 blur-[80px]" />
      </div>

      <div className="relative max-w-[1340px] mx-auto px-6 md:px-8 z-10 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border border-blue-200/60 bg-blue-50/40 text-[#0047FF] text-sm font-medium tracking-tight font-outfit mb-6 select-none shadow-sm">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[#0047FF]">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          Ecosystem Integrations
        </div>

        {/* Headline */}
        <h2 className="text-[2.75rem] md:text-[3.25rem] font-medium text-gray-900 tracking-tight leading-[1.15] font-outfit max-w-4xl mx-auto">
          Works With The Tools You Already Use.
        </h2>

        {/* Subheadline */}
        <p className="text-gray-500 font-medium text-sm md:text-base mt-4 mb-16 max-w-2xl mx-auto leading-relaxed">
          No migrations. No complicated setup. Import invoices from your existing tools and start recovering payments in minutes.
        </p>

        {/* 3-Column Grid for exactly the 6 requested tools */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1140px] mx-auto text-left mb-16">
          {tools.map((tool, idx) => {
            const LogoComponent = tool.logo;
            return (
              <div
                key={idx}
                className={`group relative border border-gray-200/70 bg-white rounded-2xl p-6 md:p-8 flex flex-col justify-between min-h-[200px] shadow-[0_2px_8px_rgba(0,0,0,0.01)] transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${tool.colorClass}`}
              >
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <LogoComponent />
                    <span className="inline-flex items-center text-[10px] font-bold text-gray-400 border border-gray-150 bg-gray-50/50 px-2 py-0.5 rounded-md uppercase tracking-wider select-none">
                      {tool.badge}
                    </span>
                  </div>
                  <h4 className="text-[19px] font-semibold text-gray-900 tracking-tight font-outfit mb-2">
                    {tool.name}
                  </h4>
                  <p className="text-gray-500 text-[13px] md:text-[14px] leading-relaxed font-medium">
                    {tool.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Small note */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 bg-blue-50/50 border border-blue-150/40 rounded-2xl px-6 py-4.5 max-w-2xl mx-auto text-center shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-[#0047FF] shrink-0" />
          <p className="text-gray-700 text-[14px] md:text-[15px] font-semibold font-outfit">
            Keep your current workflow. <span className="text-[#0047FF]">UdhaarClear handles the follow-up.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
