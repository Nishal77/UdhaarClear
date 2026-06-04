"use client";

import React from "react";

// Custom SVG Logo for TallyPrime (Official Tally Solutions graphical mark)
const TallyLogo = () => (
  <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20">
    <svg className="w-9 h-9" viewBox="200 80 600 320" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Green/Teal Swoosh */}
      <path d="m426.7 276.4c5.9-3.9 18.3-18.9 18.9-20.2s3.3-3.9.6-6.5-5.2-1.3-8.5.6c-3.2 1.3-16.9 12.4-22.1 16.3s-18.2 15.6-18.2 15.6-7.2 5.9-4.5 9.1 5.2 2 8.5.7c3.8-1.3 19.5-11.7 25.3-15.6zm-16.9-110h-3.2c-15.6 0-53.4 2.6-61.9 3.3-9.1.6-38.4 5.9-43.6 7.2s-2.6 4.5-2.6 4.5 5.2 5.9 7.8 7.8c2.6 2 6.5 7.8 11.7 5.2 5.9-2.6 34.5-5.2 43.6-6.5 5.8-.8 11.7-.8 17.6 0 0 0-24.7 32.5-28.6 38.4-3.9 5.2-25.4 34.5-30 41-3.9 6.5-14.3 22.8-18.9 30.6-3.9 7.8 3.2 7.2 3.2 7.2s16.9.6 20.8.6c3.2 0 3.9-2.6 4.6-3.9 1.5-3.4 3.2-6.6 5.2-9.8 3.3-5.2 10.4-16.9 18.2-30s17.6-25.4 24.7-35.2 15.6-20.8 17.6-23.4 9.8-13 11.7-15.6 2.6-2.6 5.2-2.6c3.3 0 23.4 1.3 31.9 2 9.1.7 21.5 1.3 29.3 2s5.2-3.3 5.2-3.3c.3-3.4-.4-6.8-2-9.8-2.6-5.2-4.6-4.6-4.6-4.6-10.2-3.1-51.2-5.1-62.9-5.1zm306 183.6c2 1.3 6.5 2.6 5.9 6.5 0 0-3.9 9.1-5.9 9.8s-5.2.6-11.7-2-38.4-10.4-46.9-12.4c-7.8-1.3-26.7-4.5-26.7-4.5s-2.6-1.3-6.5 5.2c-3.9 5.9-16.3 24.1-16.3 24.1-.4 1.5-1.7 2.6-3.3 2.6-2.6 0-12.4-.6-16.3-2.6s-5.2-2-2.6-5.9 11.1-21.5 15-24.7-2-2.6-3.9-3.2c-2 0-39.7-2.6-50.8-2-11.1 0-50.1 0-64.5 1.3s-65.8 5.9-78.8 7.8c-13.7 2-68.4 9.8-75.5 11.7-7.2 1.3-22.1 3.9-22.1 3.9-5 1.1-10.2.7-15-1.3-7.2-3.2-18.9-7.8-9.1-11.1s58.6-13 73.6-15c15-2.6 62.5-9.1 82-9.8c19.5-1.3 73.6-3.9 93.7-3.9 20.2 0 47.5 1.3 59.9 2.6 11.7.6 19.5 1.3 22.1 2s2.6-1.3 5.2-3.9 9.8-12.4 9.8-12.4 2.6-3.3-2.6-.6c-5.2 3.2-12.4 3.2-16.3-.6-3.9-3.9-5.2-6.5-7.2-5.9s-9.1 4.5-13 5.9-20.2 5.2-30-2c-9.8-6.5-10.4-9.8-11.7-12.4-1.3-3.2-2-3.2-5.2-1.3-3.3 2.6-14.3 7.8-18.9 9.8-4.2 2.3-8.9 3.4-13.7 3.2-6.5-.6-13.7-2.6-16.9-7.8s-3.3-9.1-6.5-6.5-21.5 13-31.2 15.6c-11.1 1.3-13.7 2.6-18.9 1.3-5.9-1.3-11.7-3.3-13.7-6.5s-2.6-3.9-5.2-2-9.8 7.2-15 6.5-18.9-3.9-26.7-17.6c-7.2-13.7-2-19.5 4.5-26 6.5-7.2 18.9-16.9 18.9-16.9s15-10.4 19.5-13c5.2-2.6 13-7.2 18.2-7.2s12.4 0 19.5 5.9 11.1 11.7 12.4 14.3c.6 2 3.9 10.4-1.3 16.3s-19.5 19.5-19.5 19.5-5.9 3.3-3.3 7.8c2.6 3.9 12.4-2.6 15-5.2 3.3-2 20.2-16.9 25.4-21.5 5.2-5.2 37.8-37.1 41-39.7 2.6-3.3 29.9-30 34.5-32.6 3.9-2.6 5.2-4.5 13-3.2 4.1.7 8 2 11.7 3.9 0 0 7.8 3.2 1.3 7.8-5.9 5.2-26.7 22.1-31.9 27.3s-20.1 20.2-24.6 25.4c-5.2 5.2-18.2 21.5-20.2 24.7s-3.3 6.5 0 9.1 9.1 0 15-5.2 24.1-20.2 30-26.7 40.4-38.4 43.6-41 18.9-15.6 18.9-15.6 2-2.6 6.5-2.6 9.1.6 11.7 2l7.8 3.9s3.3 1.3-2 5.2-33.9 26-41.7 34.5c-7.2 8.5-22.8 25.4-28.6 32.5-5.9 7.8-9.8 11.7-5.2 16.3 4.5 5.2 9.8 3.9 12.4 3.2s11.7-7.2 17.6-13.7c6.5-6.5 26-27.4 28.6-30 2-2.6 9.8-9.8 9.8-9.8s1.3-3.2 5.9-3.2 6.5.6 11.1 1.3c3.9 1.3 13 2.6 8.5 7.8-5.2 5.2-17.6 17.6-20.2 20.8s-13 15-15 18.2-4.5 7.2-2 9.1 9.8-.6 16.3-4.6c9.2-4.7 17.7-10.6 25.4-17.6 8.5-7.8 22.1-20.2 22.1-20.2s2-5.2 12.4-3.2c9.8 2 12.4 3.2 12.4 3.2s7.8 2 2.6 6.5-22.1 19.5-28.7 26c-6.5 5.9-26.7 26.7-30 30.6s-13 13-9.1 13.7 33.8 6.5 40.4 8.5c6 2.3 28.8 10.8 30.8 11.5z" fill="#00A389" className="fill-[#00A389] group-hover:fill-white transition-colors duration-300" />
      {/* Red Swoosh */}
      <path d="m429.3 282.9c5.9-3.9 18.2-18.9 18.9-20.2s3.2-3.9.6-6.5-5.2-1.3-8.5.6c-3.2 1.3-16.9 11.7-22.1 16.3-5.2 3.9-18.2 15.6-18.2 15.6s-7.2 5.9-4.6 9.1 5.2 2 8.5.7c3.9-1.3 19.6-11.7 25.4-15.6zm289.1 73.6c2 .6 6.5 2 6.5 6.5 0 0-4.6 9.1-5.9 9.8-2 .6-5.2.6-11.7-2s-38.4-10.4-46.9-12.4-27.3-5.2-27.3-5.2-2.6-1.3-6.5 4.6c-3.9 6.5-16.3 24.1-16.3 24.1-.4 1.5-1.7 2.6-3.2 2.6-2.6 0-12.4-.7-16.3-2.6s-5.2-2-2.6-5.9 11.1-21.5 15-24.7c3.2-3.2-2.6-2.6-4.6-3.2s-39.7-2.6-50.8-2c-11.1 0-50.1 0-64.5 1.3-14.3.6-65.1 5.9-78.8 7.8-13.7 2.6-68.4 9.8-75.5 11.7s-22.1 3.9-22.1 3.9c-5 1.1-10.2.7-15-1.3-7.2-3.2-18.9-7.8-9.1-11.1s58.6-13 73.6-15c15-2.6 62.5-9.1 82-9.8s73.6-3.9 93.8-3.9 47.5 1.3 59.9 2.6c11.7.6 19.5 1.3 22.1 2s2.6-1.3 5.2-3.9 9.8-12.4 9.8-12.4 2.6-3.9-2.6-.6c-4.6 3.2-12.4 3.2-16.3 0-3.9-3.9-5.2-7.2-7.2-5.9-4.2 2.3-8.5 4.3-13 5.9-3.9 1.3-20.8 5.2-30.6-1.3-9.8-7.2-10.4-9.8-11.7-13-1.3-4.5-2-4.5-5.2-2.6-3.3 1.9-14.3 7.8-18.9 9.8-4.1 2.4-8.9 3.3-13.7 2.6-6.5-.6-13.7-2.6-16.9-7.8-2.6-5.2-3.2-9.1-6.5-6.5s-21.5 13-31.2 15.6c-9.8 3.3-12.4 3.9-17.6 3.3-5.9-.6-11.7-3.3-13.7-6.5s-2.6-3.9-5.2-2.6c-2.6 2-9.8 7.2-15 7.2-5.2-.6-18.9-3.9-26-17.6s-2-19.5 4.6-26.7c6.5-6.5 18.2-16.9 18.2-16.9s15-11.1 19.5-13c5.2-2.6 13-7.2 18.2-7.2 7.1-.9 14.2 1.2 19.6 5.9 7.2 5.9 11.7 11.7 12.4 14.3s3.9 10.4-1.3 16.3-20.2 19.5-20.2 19.5-5.9 3.3-3.3 7.2 12.4-2.6 15.6-4.5c3.2-2.6 20.2-16.9 25.4-21.5 5.2-5.2 37.8-37.1 41-40.4 2.6-3.3 30-30 33.8-32.6 3.9-2.6 5.2-4.6 13-3.2 4.1.7 8 2 11.7 3.9 0 0 7.8 3.3 1.3 7.8-5.9 4.5-26.7 22.1-31.9 27.3s-20.2 20.2-24.7 25.4c-4.6 6.5-17.6 22.8-19.5 25.4-2 3.3-3.3 6.5 0 9.1 3.3 2 9.1 0 15-5.2s24.1-20.2 30-26.7c6.5-6.5 40.4-38.4 43.6-41.7 3.3-2.6 18.9-15 18.9-15s2-2.6 6.5-2.6 9.1.6 11.7 2l7.8 3.9s3.2 1.3-2 5.2-33.8 26-41 34.5c-7.8 8.5-22.8 25.4-28.7 32.6-5.9 7.8-9.8 11.1-5.2 16.3s9.8 3.9 12.4 3.3c6.5-3.7 12.4-8.3 17.6-13.7 6.5-6.5 26-28 28.7-30 2-2.6 9.8-9.8 9.8-9.8s1.3-3.2 5.9-3.2 6.5.6 11.1 1.3c3.9.6 13 2.6 8.5 7.8-5.2 5.2-17.6 18.2-20.2 20.8-2.6 3.2-13 15-15 18.2s-4.6 7.2-2 9.1 9.8-.6 16.3-4.6c9-4.8 17.3-10.7 24.7-17.6 8.5-7.8 22.1-20.2 22.1-20.2s2.6-5.2 12.4-3.2c9.8 2.6 12.4 3.2 12.4 3.2s7.8 2 2.6 6.5-22.1 20.2-28.6 26c-6.5 6.5-26.7 26.7-30 30.6s-13 13-9.1 13.7 33.9 5.9 40.4 7.9c5.1 3.9 28.6 11.7 30.5 13zm-336.6-162.1c-5.8-.8-11.7-.8-17.6 0-9.8 1.3-38.4 3.9-43.6 6.5s-9.8-3.3-11.7-5.2c-2.6-2-7.8-7.8-7.8-7.8s-2.6-3.3 2-4.6c5.2-1.3 34.5-5.9 43.6-7.2 9.1-.6 53.4-3.3 65.8-3.3 11.7 0 52.7 2.6 63.8 5.2 0 0 2-.6 4.6 4.6 1.2 3.3 1.9 6.9 2 10.4 0 0 2 3.9-5.2 3.3-8.5-.6-20.8-1.3-29.3-2s-28.6-2-31.9-2c-2.6 0-3.9 0-5.2 2.6-2 2.6-9.8 13-11.7 15.6s-10.4 13.7-17.6 23.5-16.3 22.1-24.7 34.5c-7.8 13-15 24.7-18.2 30-2 3.1-3.7 6.4-5.2 9.8-.6 1.3-1.3 3.3-5.2 3.3s-20.8-.6-20.8-.6-7.2.6-2.6-7.2c4.6-8.5 14.3-24.7 18.2-30.6 3.9-6.5 25.4-35.8 29.9-41 3.7-4.6 28.4-37.8 28.4-37.8z" fill="#ED1C24" className="fill-[#ED1C24] group-hover:fill-white transition-colors duration-300" />
    </svg>
  </div>
);

// Custom SVG Logo for Zoho Books (Official 2023 Zoho corporate logo interlocking blocks)
const ZohoBooksLogo = () => (
  <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20">
    <svg className="w-9 h-9" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="matrix(0.42 0 0 0.42 5.5 10.5)">
        {/* Yellow O block */}
        <path d="M.5 19.7h111v118.9H.5z" fill="#fdb924" className="fill-[#fdb924] group-hover:fill-white transition-colors duration-300" transform="translate(384 37)" />
        <path d="M478.6 99.5c-2.2-5.5-5.5-10.5-9.8-14.8-4.1-4.2-8.7-7.4-13.9-9.5-5.1-2.1-10.6-3.2-16.6-3.2s-11.6 1.1-16.7 3.2c-5.2 2.1-9.8 5.3-13.9 9.5-4.3 4.3-7.5 9.3-9.7 14.8s-3.2 11.5-3.2 18.1c0 6.4 1.1 12.4 3.3 18a44.49 44.49 0 0 0 9.7 15c4 4.1 8.6 7.2 13.7 9.3s10.8 3.2 16.9 3.2c5.9 0 11.4-1.1 16.5-3.2s9.8-5.2 13.9-9.3c4.3-4.4 7.6-9.4 9.8-14.9s3.3-11.6 3.3-18c0-6.7-1.1-12.7-3.3-18.2zm-22.9 39.2c-4.3 5.1-10 7.7-17.4 7.7s-13.2-2.6-17.5-7.7-6.4-12.2-6.4-21.2c0-9.2 2.2-16.3 6.4-21.5 4.3-5.2 10-7.7 17.5-7.7 7.4 0 13.1 2.6 17.4 7.7 4.2 5.2 6.4 12.3 6.4 21.5 0 9-2.1 16.1-6.4 21.2z" fill="#fff" className="fill-white group-hover:fill-[#0047FF] transition-colors duration-300" />
        
        {/* Blue H block */}
        <path d="M107.4 27l15.1 106.5-107.7 15.1L.3 45.7l6.3-4.9z" fill="#008cd2" className="fill-[#008cd2] group-hover:fill-white transition-colors duration-300" transform="translate(257 27)" />
        <path d="M346.1 74.4c-.5-3.3-1.6-5.8-3.4-7.5-1.5-1.3-3.3-2-5.4-2-.5 0-1.1 0-1.7.1-2.8.4-4.9 1.7-6.2 3.8-1 1.5-1.4 3.4-1.4 5.6 0 .8.1 1.7.2 2.6l3.9 27.7-31 4.6-3.9-27.7c-.5-3.2-1.6-5.7-3.4-7.4-1.5-1.4-3.3-2.1-5.3-2.1-.5 0-1 0-1.5.1-2.9.4-5.1 1.7-6.5 3.8-1 1.5-1.4 3.4-1.4 5.6 0 .8.1 1.7.2 2.7l10.6 72.1c.5 3.3 1.6 5.8 3.6 7.5 1.5 1.3 3.3 1.9 5.5 1.9.6 0 1.2 0 1.8-.1 2.7-.4 4.7-1.7 6-3.8.9-1.5 1.3-3.3 1.3-5.4 0-.8-.1-1.7-.2-2.6l-4.3-28.5 31-4.6 4.3 28.5c.5 3.3 1.6 5.8 3.5 7.4 1.5 1.3 3.3 2 5.4 2 .5 0 1.1 0 1.7-.1 2.8-.4 4.9-1.7 6.2-3.8.9-1.5 1.4-3.3 1.4-5.5 0-.8-.1-1.7-.2-2.6z" fill="#fff" className="fill-white group-hover:fill-[#0047FF] transition-colors duration-300" />
        
        {/* Green O block */}
        <path d="M49.1 33.9l96.7 43.6-43.7 99.1L5.4 133z" fill="#26a146" className="fill-[#26a146] group-hover:fill-white transition-colors duration-300" transform="translate(123)" />
        <path d="M239.5 85.5c-2.1-5.6-5-10.4-8.8-14.4s-8.4-7.2-13.8-9.5-10.8-3.4-16.3-3.4h-.3c-5.6 0-11.1 1.3-16.5 3.7-5.7 2.5-10.6 5.9-14.8 10.4-4.2 4.4-7.6 9.8-10.2 16-2.6 6.1-4 12.3-4.3 18.4v2.1c0 5.4.9 10.7 2.8 15.9 2 5.5 4.9 10.2 8.7 14.2s8.5 7.2 14.1 9.5c5.3 2.3 10.7 3.4 16.2 3.4h.1c5.5 0 11-1.2 16.4-3.5 5.7-2.5 10.7-6 14.9-10.5 4.2-4.4 7.7-9.7 10.3-15.9s4-12.3 4.3-18.4v-1.8c.1-5.5-.8-10.9-2.8-16.2zm-19.3 28.8c-3.6 8.6-8.5 14.5-14.4 17.7-3.2 1.7-6.5 2.6-9.8 2.6-2.9 0-6-.7-9.1-2-6.8-2.9-11-7.5-12.8-14.1-.6-2.2-.9-4.5-.9-6.9 0-4.8 1.2-10.1 3.6-15.8 3.7-8.8 8.6-14.8 14.5-18.1 3.2-1.8 6.5-2.6 9.8-2.6 3 0 6 .7 9.2 2 6.7 2.9 10.9 7.5 12.7 14.1.6 2.1.9 4.4.9 6.8 0 5-1.2 10.4-3.7 16.3z" fill="#fff" className="fill-white group-hover:fill-[#0047FF] transition-colors duration-300" />
        
        {/* Red Z block */}
        <path d="M108.1 38.8L124 143.7 17.2 160.4 0 55.4z" fill="#d92231" className="fill-[#d92231] group-hover:fill-white transition-colors duration-300" transform="translate(0 15)" />
        <path d="M96.6 142c-.8-1-2-1.7-3.4-2.2s-3.1-.7-5.2-.7c-1.9 0-4.1.2-6.5.6l-28.2 4.8c.3-2.2 1.4-5 3.3-8.5 2.1-3.9 5.3-8.6 9.4-14 a133.09 133.09 0 0 1 3.3-4.3c.5-.7 1.3-1.6 2.3-2.9 6.5-8.5 10.4-15.4 12-20.8.9-3.1 1.4-6.2 1.6-9.3.1-.9.1-1.7.1-2.5 0-2.2-.2-4.4-.6-6.6-.3-2-.8-3.6-1.5-4.9s-1.5-2.3-2.5-2.9c-1.1-.7-2.8-1-4.9-1-1.7 0-3.8.2-6.3.6L36.9 73c-3.9.7-6.9 1.8-8.7 3.6-1.5 1.4-2.2 3.2-2.2 5.2 0 .5 0 1.1 0 1.7.5 2.8 1.9 4.8 4.2 5.8 1.4.6 3 .9 5 .9 1.3 0 2.8-.1 4.4-.4L66.9 85c0 .5.1 1 .1 1.4a14.26 14.26 0 0 1-.9 5c-.8 2.3-2.8 5.5-6.1 9.6l-4.2 5.2c-7.4 8.9-12.6 16.5-15.8 22.8-2.3 4.4-3.8 8.6-4.7 12.9-.5 2.5-.8 4.8-.8 7.1 0 1.6.1 3.2.4 4.7.4 2.2.9 4 1.6 5.4s1.7 2.5 2.8 3.1 2.6.8 4.8.8c2.7 0 6.4-.4 11.1-1.2l29.6-5.1c5.2-.9 8.9-2.2 11-3.9 1.7-1.4 2.6-3.3 2.6-5.5 0-.6-.1-1.2-.2-1.8-.2-1.3-.7-2.5-1.6-3.5z" fill="#fff" className="fill-white group-hover:fill-[#0047FF] transition-colors duration-300" />
      </g>
    </svg>
  </div>
);

// Custom SVG Logo for Excel (Official Microsoft Excel 2019+ grid and letter block)
const ExcelLogo = () => (
  <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20">
    <svg className="w-8 h-8 text-white group-hover:text-white transition-colors duration-300" viewBox="0 0 24 24" fill="none">
      {/* Right portion: Grid spreadsheet cover */}
      <path d="M12 4h7.5c.83 0 1.5.67 1.5 1.5v13c0 .83-.67 1.5-1.5 1.5H12V4z" fill="#107C41" className="fill-[#107C41] group-hover:fill-white transition-colors duration-300" />
      {/* White grid lines inside the right portion */}
      <path d="M14 7h6M14 10h6M14 13h6M14 16h6M17 4v16" stroke="currentColor" strokeWidth="1.2" className="text-white group-hover:text-[#0047FF] transition-colors duration-300" opacity="0.8" />
      {/* Left portion: Excel 'X' box */}
      <path d="M2.5 5.5h11c.83 0 1.5.67 1.5 1.5v10c0 .83-.67 1.5-1.5 1.5h-11A1.5 1.5 0 0 1 1 17V7c0-.83.67-1.5 1.5-1.5z" fill="#107C41" stroke="#107C41" strokeWidth="1.2" className="stroke-[#107C41] group-hover:stroke-white fill-[#107C41] group-hover:fill-white transition-all duration-300" />
      {/* The Letter 'X' */}
      <path d="M4.5 9L9.5 15M9.5 9L4.5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="text-white group-hover:text-[#0047FF] transition-colors duration-300" />
    </svg>
  </div>
);

// Custom SVG Logo for CSV (Delimited spreadsheet file type logo)
const CSVLogo = () => (
  <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20">
    <svg className="w-7 h-7 text-[#334155] group-hover:text-white transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      {/* Document border */}
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="currentColor" className="text-[#334155]/10 group-hover:text-white/10 transition-colors duration-300" />
      <polyline points="14 2 14 8 20 8" />
      {/* Custom styled C, S, V lines */}
      <path d="M6.5 12h2a1 1 0 0 0 0-2H6.5v4h2" strokeWidth="1.8" />
      <path d="M11 12.5a.5.5 0 0 1 .5-.5h1A.5.5 0 0 1 13 12.5v.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 0-.5.5v.5a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5" strokeWidth="1.8" />
      <path d="M15.5 10l1.5 4 1.5-4" strokeWidth="1.8" />
    </svg>
  </div>
);

// Custom SVG Logo for Google Sheets (Official Google Sheets 2020+ green folded cover and spreadsheet grid)
const GoogleSheetsLogo = () => (
  <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20">
    <svg className="w-8 h-8 text-white transition-colors duration-300" viewBox="0 0 24 24" fill="none">
      {/* Google Sheets Page Cover */}
      <path d="M19 8.5V20c0 .83-.67 1.5-1.5 1.5h-11C5.67 21.5 5 20.83 5 20V4c0-.83.67-1.5 1.5-1.5h7.5L19 8.5z" fill="#0F9D58" className="fill-[#0F9D58] group-hover:fill-white transition-colors duration-300" />
      {/* Folded corner */}
      <path d="M14 2.5V7a1.5 1.5 0 0 0 1.5 1.5h4.5L14 2.5z" fill="#0B8043" className="fill-[#0B8043] group-hover:fill-white transition-colors duration-300" opacity="0.4" />
      {/* White Grid pattern inside */}
      <rect x="8.5" y="11" width="7" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.2" className="text-white group-hover:text-[#0047FF] transition-colors duration-300" />
      <line x1="12" y1="11" x2="12" y2="17" stroke="currentColor" strokeWidth="1.2" className="text-white group-hover:text-[#0047FF] transition-colors duration-300" />
      <line x1="8.5" y1="14" x2="15.5" y2="14" stroke="currentColor" strokeWidth="1.2" className="text-white group-hover:text-[#0047FF] transition-colors duration-300" />
    </svg>
  </div>
);

// Custom SVG Logo for QuickBooks (Official QuickBooks trademark insignia from Simple Icons)
const QuickBooksLogo = () => (
  <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20">
    <svg className="w-7 h-7 text-[#2CA01C] group-hover:text-white transition-colors duration-300" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm.642 4.1335c.9554 0 1.7296.776 1.7296 1.7332v9.0667h1.6c1.614 0 2.9275-1.3156 2.9275-2.933 0-1.6173-1.3136-2.9333-2.9276-2.9333h-.6654V7.3334h.6654c2.5722 0 4.6577 2.0897 4.6577 4.667 0 2.5774-2.0855 4.6666-4.6577 4.6666H12.642zM7.9837 7.333h3.3291v12.533c-.9555 0-1.73-.7759-1.73-1.7332V9.0662H7.9837c-1.6146 0-2.9277 1.316-2.9277 2.9334 0 1.6175 1.3131 2.9333 2.9277 2.9333h.6654v1.7332h-.6654c-2.5725 0-4.6577-2.0892-4.6577-4.6665 0-2.5771 2.0852-4.6666 4.6577-4.6666Z" />
    </svg>
  </div>
);

// Custom SVG Logo for Busy ERP (Official Busy Infotech branding checkmark design)
const BusyLogo = () => (
  <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20">
    <svg className="w-9 h-9" viewBox="0 0 48 48" fill="currentColor">
      {/* Bold B */}
      <path d="M12 10h12c4.42 0 8 3.58 8 8 0 2.5-1.15 4.73-2.95 6.2C31.5 25.7 34 29.56 34 34c0 4.42-3.58 8-8 8H12V10zm8 6v8h4c2.21 0 4-1.79 4-4s-1.79-4-4-4h-4zm0 14v6h6c2.21 0 4-1.79 4-4s-1.79-4-4-4h-6z" fill="#005A9F" className="fill-[#005A9F] group-hover:fill-white transition-colors duration-300" />
      {/* Double tick red */}
      <path d="M34 14l3 3 7-7" stroke="#E05A5A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" className="stroke-[#E05A5A] group-hover:stroke-white transition-colors duration-300" />
      <path d="M30 18l3 3 7-7" stroke="#E05A5A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" className="stroke-[#E05A5A] group-hover:stroke-white transition-colors duration-300" opacity="0.6" />
    </svg>
  </div>
);

// Custom SVG Logo for Manual Entry (Premium, detail-rich pad and editing pencil)
const ManualEntryLogo = () => (
  <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20">
    <svg className="w-7 h-7 text-[#6366F1] group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      {/* Clipboard / Pad */}
      <rect x="8" y="2" width="8" height="4" rx="1" fill="currentColor" opacity="0.25" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      {/* Pencil / Pen writing */}
      <path d="M12 11h4M12 15h4M9 11h.01M9 15h.01" strokeWidth="2.5" />
      <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z" fill="currentColor" />
    </svg>
  </div>
);

export default function Integrations() {
  const integrationsList = [
    { name: "TallyPrime", logo: TallyLogo },
    { name: "Zoho Books", logo: ZohoBooksLogo },
    { name: "Excel", logo: ExcelLogo },
    { name: "CSV", logo: CSVLogo },
    { name: "Google Sheets", logo: GoogleSheetsLogo },
    { name: "QuickBooks", logo: QuickBooksLogo },
    { name: "Busy ERP", logo: BusyLogo },
    { name: "Manual Entry", logo: ManualEntryLogo }
  ];

  return (
    <section id="integrations" className="relative w-full bg-[#FFFFFF] py-16 md:py-20 overflow-hidden px-4 md:px-8">
      
      {/* Soft background lighting lights */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at top left, rgba(99, 102, 241, 0.05), transparent 600px),
            radial-gradient(circle at bottom right, rgba(0, 73, 255, 0.04), transparent 600px)
          `
        }}
      />

      <div className="relative max-w-[1340px] mx-auto px-6 md:px-8 z-10 text-center">
        
        {/* Announcement Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border border-blue-200/60 bg-blue-50/40 text-[#0047FF] text-sm font-medium tracking-tight font-outfit mb-6 select-none">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[#0047FF]">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          Integrations
        </div>

        {/* Heading */}
        <h2 className="text-[2.75rem] md:text-[3.25rem] font-medium text-gray-900 tracking-tight leading-[1.15] font-outfit max-w-4xl mx-auto">
          Works With the Tools You Already Use.
        </h2>

        {/* Subheading */}
        <p className="text-gray-500 font-medium text-sm md:text-base mt-4 mb-16 max-w-3xl mx-auto leading-relaxed">
          Bring in your pending invoices from Tally, Zoho, Excel, CSV, or Google Sheets. UdhaarClear takes care of the follow-up, payment links, and recovery tracking.
        </p>

        {/* Mockup-styled 4-Column Rectangular Dividers Grid Container */}
        <div className="relative border border-gray-200/80 bg-white max-w-[1280px] mx-auto overflow-hidden">

          {/* Row 1 (first 4 integrations) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-gray-200/80 items-stretch">
            {integrationsList.slice(0, 4).map((item, idx) => {
              const Logo = item.logo;
              return (
                <div 
                  key={idx}
                  className="group relative p-12 flex flex-col items-center justify-center text-center min-h-[180px] lg:min-h-[220px] bg-white hover:bg-[#0047FF] transition-all duration-300 ease-out cursor-pointer"
                >
                  {/* Logo Container */}
                  <div className="mb-5">
                    <Logo />
                  </div>

                  {/* Integration Full Name Text */}
                  <h3 className="text-xl md:text-2xl font-medium tracking-tight text-gray-900 group-hover:text-white transition-colors duration-300 font-outfit select-none">
                    {item.name}
                  </h3>
                </div>
              );
            })}
          </div>

          {/* Divider line between rows */}
          <div className="h-px w-full bg-gray-200/80 hidden lg:block" />

          {/* Row 2 (next 4 integrations) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-gray-200/80 items-stretch border-t border-gray-200/80 lg:border-t-0">
            {integrationsList.slice(4, 8).map((item, idx) => {
              const Logo = item.logo;
              return (
                <div 
                  key={idx}
                  className="group relative p-12 flex flex-col items-center justify-center text-center min-h-[180px] lg:min-h-[220px] bg-white hover:bg-[#0047FF] transition-all duration-300 ease-out cursor-pointer"
                >
                  {/* Logo Container */}
                  <div className="mb-5">
                    <Logo />
                  </div>

                  {/* Integration Full Name Text */}
                  <h3 className="text-xl md:text-2xl font-medium tracking-tight text-gray-900 group-hover:text-white transition-colors duration-300 font-outfit select-none">
                    {item.name}
                  </h3>
                </div>
              );
            })}
          </div>

        </div>

      </div>

    </section>
  );
}
