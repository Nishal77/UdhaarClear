"use client";

import React from "react";

// --- EXISTING ACCOUNTS & SYSTEMS LOGOS ---

const TallyLogo = () => (
  <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20">
    <svg className="w-9 h-9" viewBox="200 80 600 320" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="m426.7 276.4c5.9-3.9 18.3-18.9 18.9-20.2s3.3-3.9.6-6.5-5.2-1.3-8.5.6c-3.2 1.3-16.9 12.4-22.1 16.3s-18.2 15.6-18.2 15.6-7.2 5.9-4.5 9.1 5.2 2 8.5.7c3.8-1.3 19.5-11.7 25.3-15.6zm-16.9-110h-3.2c-15.6 0-53.4 2.6-61.9 3.3-9.1.6-38.4 5.9-43.6 7.2s-2.6 4.5-2.6 4.5 5.2 5.9 7.8 7.8c2.6 2 6.5 7.8 11.7 5.2 5.9-2.6 34.5-5.2 43.6-6.5 5.8-.8 11.7-.8 17.6 0 0 0-24.7 32.5-28.6 38.4-3.9 5.2-25.4 34.5-30 41-3.9 6.5-14.3 22.8-18.9 30.6-3.9 7.8 3.2 7.2 3.2 7.2s16.9.6 20.8.6c3.2 0 3.9-2.6 4.6-3.9 1.5-3.4 3.2-6.6 5.2-9.8 3.3-5.2 10.4-16.9 18.2-30s17.6-25.4 24.7-35.2 15.6-20.8 17.6-23.4 9.8-13 11.7-15.6 2.6-2.6 5.2-2.6c3.3 0 23.4 1.3 31.9 2 9.1.7 21.5 1.3 29.3 2s5.2-3.3 5.2-3.3c.3-3.4-.4-6.8-2-9.8-2.6-5.2-4.6-4.6-4.6-4.6-10.2-3.1-51.2-5.1-62.9-5.1zm306 183.6c2 1.3 6.5 2.6 5.9 6.5 0 0-3.9 9.1-5.9 9.8s-5.2.6-11.7-2-38.4-10.4-46.9-12.4c-7.8-1.3-26.7-4.5-26.7-4.5s-2.6-1.3-6.5 5.2c-3.9 5.9-16.3 24.1-16.3 24.1-.4 1.5-1.7 2.6-3.3 2.6-2.6 0-12.4-.6-16.3-2.6s-5.2-2-2.6-5.9 11.1-21.5 15-24.7-2-2.6-3.9-3.2c-2 0-39.7-2.6-50.8-2-11.1 0-50.1 0-64.5 1.3s-65.8 5.9-78.8 7.8c-13.7 2-68.4 9.8-75.5 11.7-7.2 1.3-22.1 3.9-22.1 3.9-5 1.1-10.2.7-15-1.3-7.2-3.2-18.9-7.8-9.1-11.1s58.6-13 73.6-15c15-2.6 62.5-9.1 82-9.8c19.5-1.3 73.6-3.9 93.7-3.9 20.2 0 47.5 1.3 59.9 2.6 11.7.6 19.5 1.3 22.1 2s2.6-1.3 5.2-3.9 9.8-12.4 9.8-12.4 2.6-3.3-2.6-.6c-5.2 3.2-12.4 3.2-16.3-.6-3.9-3.9-5.2-6.5-7.2-5.9s-9.1 4.5-13 5.9-20.2 5.2-30-2c-9.8-6.5-10.4-9.8-11.7-12.4-1.3-3.2-2-3.2-5.2-1.3-3.3 2.6-14.3 7.8-18.9 9.8-4.2 2.3-8.9 3.4-13.7 3.2-6.5-.6-13.7-2.6-16.9-7.8s-3.3-9.1-6.5-6.5-21.5 13-31.2 15.6c-11.1 1.3-13.7 2.6-18.9 1.3-5.9-1.3-11.7-3.3-13.7-6.5s-2.6-3.9-5.2-2-9.8 7.2-15 6.5-18.9-3.9-26.7-17.6c-7.2-13.7-2-19.5 4.5-26 6.5-7.2 18.9-16.9 18.9-16.9s15-10.4 19.5-13c5.2-2.6 13-7.2 18.2-7.2s12.4 0 19.5 5.9 11.1 11.7 12.4 14.3c.6 2 3.9 10.4-1.3 16.3s-19.5 19.5-19.5 19.5-5.9 3.3-3.3 7.8c2.6 3.9 12.4-2.6 15-5.2 3.3-2 20.2-16.9 25.4-21.5 5.2-5.2 37.8-37.1 41-39.7 2.6-3.3 29.9-30 34.5-32.6 3.9-2.6 5.2-4.5 13-3.2 4.1.7 8 2 11.7 3.9 0 0 7.8 3.2 1.3 7.8-5.9 5.2-26.7 22.1-31.9 27.3s-20.1 20.2-24.6 25.4c-5.2 5.2-18.2 21.5-20.2 24.7s-3.3 6.5 0 9.1 9.1 0 15-5.2 24.1-20.2 30-26.7 40.4-38.4 43.6-41 18.9-15.6 18.9-15.6 2-2.6 6.5-2.6 9.1.6 11.7 2l7.8 3.9s3.3 1.3-2 5.2-33.9 26-41.7 34.5c-7.2 8.5-22.8 25.4-28.6 32.5-5.9 7.8-9.8 11.7-5.2 16.3 4.5 5.2 9.8 3.9 12.4 3.2s11.7-7.2 17.6-13.7c6.5-6.5 26-27.4 28.6-30 2-2.6 9.8-9.8 9.8-9.8s1.3-3.2 5.9-3.2 6.5.6 11.1 1.3c3.9 1.3 13 2.6 8.5 7.8-5.2 5.2-17.6 17.6-20.2 20.8s-13 15-15 18.2-4.5 7.2-2 9.1 9.8-.6 16.3-4.6c9.2-4.7 17.7-10.6 25.4-17.6 8.5-7.8 22.1-20.2 22.1-20.2s2-5.2 12.4-3.2c9.8 2 12.4 3.2 12.4 3.2s7.8 2 2.6 6.5-22.1 19.5-28.7 26c-6.5 5.9-26.7 26.7-30 30.6s-13 13-9.1 13.7 33.8 6.5 40.4 8.5c6 2.3 28.8 10.8 30.8 11.5z" fill="#00A389" />
      <path d="m429.3 282.9c5.9-3.9 18.2-18.9 18.9-20.2s3.2-3.9.6-6.5-5.2-1.3-8.5.6c-3.2 1.3-16.9 11.7-22.1 16.3-5.2 3.9-18.2 15.6-18.2 15.6s-7.2 5.9-4.6 9.1 5.2 2 8.5.7c3.9-1.3 19.6-11.7 25.4-15.6zm289.1 73.6c2 .6 6.5 2 6.5 6.5 0 0-4.6 9.1-5.9 9.8-2 .6-5.2.6-11.7-2s-38.4-10.4-46.9-12.4-27.3-5.2-27.3-5.2-2.6-1.3-6.5 4.6c-3.9 6.5-16.3 24.1-16.3 24.1-.4 1.5-1.7 2.6-3.2 2.6-2.6 0-12.4-.7-16.3-2.6s-5.2-2-2.6-5.9 11.1-21.5 15-24.7c3.2-3.2-2.6-2.6-4.6-3.2s-39.7-2.6-50.8-2c-11.1 0-50.1 0-64.5 1.3-14.3.6-65.1 5.9-78.8 7.8-13.7 2.6-68.4 9.8-75.5 11.7s-22.1 3.9-22.1 3.9c-5 1.1-10.2.7-15-1.3-7.2-3.2-18.9-7.8-9.1-11.1s58.6-13 73.6-15c15-2.6 62.5-9.1 82-9.8s73.6-3.9 93.8-3.9 47.5 1.3 59.9 2.6c11.7.6 19.5 1.3 22.1 2s2.6-1.3 5.2-3.9 9.8-12.4 9.8-12.4 2.6-3.9-2.6-.6c-4.6 3.2-12.4 3.2-16.3 0-3.9-3.9-5.2-7.2-7.2-5.9-4.2 2.3-8.5 4.3-13 5.9-3.9 1.3-20.8 5.2-30.6-1.3-9.8-7.2-10.4-9.8-11.7-13-1.3-4.5-2-4.5-5.2-2.6-3.3 1.9-14.3 7.8-18.9 9.8-4.1 2.4-8.9 3.3-13.7 2.6-6.5-.6-13.7-2.6-16.9-7.8-2.6-5.2-3.2-9.1-6.5-6.5s-21.5 13-31.2 15.6c-9.8 3.3-12.4 3.9-17.6 3.3-5.9-.6-11.7-3.3-13.7-6.5s-2.6-3.9-5.2-2.6c-2.6 2-9.8 7.2-15 7.2-5.2-.6-18.9-3.9-26-17.6s-2-19.5 4.6-26.7c6.5-6.5 18.2-16.9 18.2-16.9s15-11.1 19.5-13c5.2-2.6 13-7.2 18.2-7.2 7.1-.9 14.2 1.2 19.6 5.9 7.2 5.9 11.7 11.7 12.4 14.3s3.9 10.4-1.3 16.3-20.2 19.5-20.2 19.5-5.9 3.3-3.3 7.2 12.4-2.6 15.6-4.5c3.2-2.6 20.2-16.9 25.4-21.5 5.2-5.2 37.8-37.1 41-40.4 2.6-3.3 30-30 33.8-32.6 3.9-2.6 5.2-4.6 13-3.2 4.1.7 8 2 11.7 3.9 0 0 7.8 3.3 1.3 7.8-5.9 4.5-26.7 22.1-31.9 27.3s-20.2 20.2-24.7 25.4c-4.6 6.5-17.6 22.8-19.5 25.4-2 3.3-3.3 6.5 0 9.1 3.3 2 9.1 0 15-5.2s24.1-20.2 30-26.7c6.5-6.5 40.4-38.4 43.6-41.7 3.3-2.6 18.9-15 18.9-15s2-2.6 6.5-2.6 9.1.6 11.7 2l7.8 3.9s3.2 1.3-2 5.2-33.8 26-41 34.5c-7.8 8.5-22.8 25.4-28.7 32.6-5.9 7.8-9.8 11.1-5.2 16.3s9.8 3.9 12.4 3.3c6.5-3.7 12.4-8.3 17.6-13.7c6.5-6.5 26-28 28.7-30 2-2.6 9.8-9.8 9.8-9.8s1.3-3.2 5.9-3.2 6.5.6 11.1 1.3c3.9.6 13 2.6 8.5 7.8-5.2 5.2-17.6 18.2-20.2 20.8-2.6 3.2-13 15-15 18.2s-4.6 7.2-2 9.1 9.8-.6 16.3-4.6c9-4.8 17.3-10.7 24.7-17.6 8.5-7.8 22.1-20.2 22.1-20.2s2.6-5.2 12.4-3.2c9.8 2.6 12.4 3.2 12.4 3.2s7.8 2 2.6 6.5-22.1 20.2-28.6 26c-6.5 6.5-26.7 26.7-30 30.6s-13 13-9.1 13.7 33.9 5.9 40.4 7.9c5.1 3.9 28.6 11.7 30.5 13zm-336.6-162.1c-5.8-.8-11.7-.8-17.6 0-9.8 1.3-38.4 3.9-43.6 6.5s-9.8-3.3-11.7-5.2c-2.6-2-7.8-7.8-7.8-7.8s-2.6-3.3 2-4.6c5.2-1.3 34.5-5.9 43.6-7.2 9.1-.6 53.4-3.3 65.8-3.3 11.7 0 52.7 2.6 63.8 5.2 0 0 2-.6 4.6 4.6 1.2 3.3 1.9 6.9 2 10.4 0 0 2 3.9-5.2 3.3-8.5-.6-20.8-1.3-29.3-2s-28.6-2-31.9-2c-2.6 0-3.9 0-5.2 2.6-2 2.6-9.8 13-11.7 15.6s-10.4 13.7-17.6 23.5-16.3 22.1-24.7 34.5c-7.8 13-15 24.7-18.2 30-2 3.1-3.7 6.4-5.2 9.8-.6 1.3-1.3 3.3-5.2 3.3s-20.8-.6-20.8-.6-7.2.6-2.6-7.2c4.6-8.5 14.3-24.7 18.2-30.6 3.9-6.5 25.4-35.8 29.9-41 3.7-4.6 28.4-37.8 28.4-37.8z" fill="#ED1C24" />
    </svg>
  </div>
);

const ZohoBooksLogo = () => (
  <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20">
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
  <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20">
    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none">
      <path d="M12 4h7.5c.83 0 1.5.67 1.5 1.5v13c0 .83-.67 1.5-1.5 1.5H12V4z" fill="#107C41" />
      <path d="M14 7h6M14 10h6M14 13h6M14 16h6M17 4v16" stroke="currentColor" strokeWidth="1.2" opacity="0.8" />
      <path d="M2.5 5.5h11c.83 0 1.5.67 1.5 1.5v10c0 .83-.67 1.5-1.5 1.5h-11A1.5 1.5 0 0 1 1 17V7c0-.83.67-1.5 1.5-1.5z" fill="#107C41" stroke="#107C41" strokeWidth="1.2" />
      <path d="M4.5 9L9.5 15M9.5 9L4.5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  </div>
);

const CSVLogo = () => (
  <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20">
    <svg className="w-7 h-7 text-[#334155] transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="currentColor" className="text-[#334155]/10" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M6.5 12h2a1 1 0 0 0 0-2H6.5v4h2" strokeWidth="1.8" />
      <path d="M11 12.5a.5.5 0 0 1 .5-.5h1A.5.5 0 0 1 13 12.5v.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 0-.5.5v.5a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5" strokeWidth="1.8" />
      <path d="M15.5 10l1.5 4 1.5-4" strokeWidth="1.8" />
    </svg>
  </div>
);

const GoogleSheetsLogo = () => (
  <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20">
    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none">
      <path d="M19 8.5V20c0 .83-.67 1.5-1.5 1.5h-11C5.67 21.5 5 20.83 5 20V4c0-.83.67-1.5 1.5-1.5h7.5L19 8.5z" fill="#0F9D58" />
      <path d="M14 2.5V7a1.5 1.5 0 0 0 1.5 1.5h4.5L14 2.5z" fill="#0B8043" opacity="0.4" />
      <rect x="8.5" y="11" width="7" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
      <line x1="12" y1="11" x2="12" y2="17" stroke="currentColor" strokeWidth="1.2" />
      <line x1="8.5" y1="14" x2="15.5" y2="14" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  </div>
);

const QuickBooksLogo = () => (
  <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20">
    <svg className="w-7 h-7 text-[#2CA01C]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm.642 4.1335c.9554 0 1.7296.776 1.7296 1.7332v9.0667h1.6c1.614 0 2.9275-1.3156 2.9275-2.933 0-1.6173-1.3136-2.9333-2.9276-2.9333h-.6654V7.3334h.6654c2.5722 0 4.6577 2.0897 4.6577 4.667 0 2.5774-2.0855 4.6666-4.6577 4.6666H12.642zM7.9837 7.333h3.3291v12.533c-.9555 0-1.73-.7759-1.73-1.7332V9.0662H7.9837c-1.6146 0-2.9277 1.316-2.9277 2.9334 0 1.6175 1.3131 2.9333 2.9277 2.9333h.6654v1.7332h-.6654c-2.5725 0-4.6577-2.0892-4.6577-4.6665 0-2.5771 2.0852-4.6666 4.6577-4.6666Z" />
    </svg>
  </div>
);

const BusyLogo = () => (
  <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20">
    <svg className="w-9 h-9" viewBox="0 0 48 48" fill="currentColor">
      <path d="M12 10h12c4.42 0 8 3.58 8 8 0 2.5-1.15 4.73-2.95 6.2C31.5 25.7 34 29.56 34 34c0 4.42-3.58 8-8 8H12V10zm8 6v8h4c2.21 0 4-1.79 4-4s-1.79-4-4-4h-4zm0 14v6h6c2.21 0 4-1.79 4-4s-1.79-4-4-4h-6z" fill="#005A9F" />
      <path d="M34 14l3 3 7-7" stroke="#E05A5A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M30 18l3 3 7-7" stroke="#E05A5A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.6" />
    </svg>
  </div>
);

// --- NEW COMPLEMENTARY PREMIUM BRAND LOGOS ---

const GPayLogo = () => (
  <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20">
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.2 9.4c-.4-.5-.9-.8-1.5-.8H9.3v8.5H12v-3h3.7c.6 0 1.1-.3 1.5-.8.4-.4.6-1.1.6-1.7s-.2-1.3-.6-1.7z" fill="#4285F4" />
      <path d="M7.5 8.5h-1.5v8.5h1.5v-8.5z" fill="#34A853" />
      <path d="M19.5 8.5H18v8.5h1.5v-8.5z" fill="#EA4335" />
      <circle cx="14" cy="17" r="2" fill="#FBBC05" />
    </svg>
  </div>
);

const PhonePeLogo = () => (
  <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20">
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="5" fill="#5f259f" />
      <path d="M6 5h7a3.5 3.5 0 0 1 3.5 3.5v1A3.5 3.5 0 0 1 13 13H8v5H6V5zm2 2v4h5a1.5 1.5 0 0 0 1.5-1.5v-1A1.5 1.5 0 0 0 13 7H8z" fill="white" />
    </svg>
  </div>
);

const PaytmLogo = () => (
  <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20">
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="5" fill="#002970" />
      <text x="12" y="15" textAnchor="middle" fill="#00b9f5" fontSize="7" fontWeight="bold" fontFamily="sans-serif" letterSpacing="0.1">Paytm</text>
    </svg>
  </div>
);

const WhatsAppLogo = () => (
  <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20">
    <svg className="w-7 h-7 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 1.977 14.053 1.05 11.42 1.05c-5.44 0-9.866 4.372-9.87 9.802 0 1.634.45 3.23 1.302 4.637L1.862 21.05l4.785-1.896zm11.758-5.38c-.322-.16-.1.08-.823-.482l-1.897-.936c-.322-.16-.672-.08-.913.16l-.804.985c-.242.24-.483.24-.805.08-3.15-1.53-4.357-3.266-4.81-4.068-.322-.56-.05-.88.192-1.12l.643-.723c.241-.24.322-.482.241-.803l-.964-2.329c-.08-.322-.241-.482-.563-.482-.321 0-.643.08-.884.241-.322.241-.884.723-.884 1.767 0 1.044.643 2.088 1.527 3.293 2.09 2.85 4.903 4.295 8.12 5.018.965.241 1.848.16 2.571-.08.803-.24 1.606-.883 1.847-1.686.241-.803.241-1.446.16-1.606-.081-.16-.322-.241-.643-.402z" />
      </svg>
    </div>
  );

const SlackLogo = () => (
  <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20">
    <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.04 15.17a2.52 2.52 0 1 1-2.52-2.52h2.52v2.52z" fill="#36C5F0" />
      <path d="M6.3 15.17a2.52 2.52 0 0 1 2.52-2.52h5.04a2.52 2.52 0 0 1 2.52 2.52v5.04a2.52 2.52 0 0 1-2.52 2.52H8.82a2.52 2.52 0 0 1-2.52-2.52v-5.04z" fill="#36C5F0" />
      <path d="M8.82 5.04a2.52 2.52 0 1 1 2.52 2.52v-2.52a2.52 2.52 0 0 1-2.52-2.52z" fill="#2EB67D" />
      <path d="M8.82 6.3a2.52 2.52 0 0 1 2.52 2.52v5.04a2.52 2.52 0 0 1-2.52 2.52H3.78A2.52 2.52 0 0 1 1.26 13.86V8.82A2.52 2.52 0 0 1 3.78 6.3H8.82z" fill="#2EB67D" />
      <path d="M18.96 8.83a2.52 2.52 0 1 1 2.52 2.52h-2.52V8.83z" fill="#ECB22E" />
      <path d="M17.7 8.83a2.52 2.52 0 0 1-2.52 2.52h-5.04a2.52 2.52 0 0 1-2.52-2.52V3.79a2.52 2.52 0 0 1 2.52-2.52h5.04a2.52 2.52 0 0 1 2.52 2.52v5.04z" fill="#ECB22E" />
      <path d="M15.18 18.96a2.52 2.52 0 1 1-2.52-2.52v2.52a2.52 2.52 0 0 1 2.52-2.52z" fill="#E01E5A" />
      <path d="M15.18 17.7a2.52 2.52 0 0 1-2.52-2.52v-5.04a2.52 2.52 0 0 1 2.52-2.52h5.04a2.52 2.52 0 0 1 2.52 2.52v5.04a2.52 2.52 0 0 1-2.52 2.52h-5.04z" fill="#E01E5A" />
    </svg>
  </div>
);

const TeamsLogo = () => (
  <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20">
    <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 6.5C11 7.88 9.88 9 8.5 9S6 7.88 6 6.5 7.12 4 8.5 4 11 5.12 11 6.5ZM17 8.5C17 9.6 16.1 10.5 15 10.5S13 9.6 13 8.5 13.9 6.5 15 6.5 17 7.4 17 8.5ZM8.5 10c-2.33 0-7 1.17-7 3.5V15h14v-1.5c0-2.33-4.67-3.5-7-3.5ZM15 11.5c-.75 0-1.78.13-2.75.38.7.67 1.25 1.54 1.57 2.62H21v-1c0-1.33-2.67-2-6-2Z" fill="#4B53E4" />
    </svg>
  </div>
);

const ChatGPTLogo = () => (
  <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20">
    <svg className="w-6 h-6 text-[#10A37F]" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.354 11.233a3.81 3.81 0 0 0 .285-1.986 3.856 3.856 0 0 0-2.31-3.136c-.167-.852-.647-1.616-1.344-2.14a3.864 3.864 0 0 0-3.791-.252 3.8 3.8 0 0 0-1.879-1.365 3.86 3.86 0 0 0-3.842 1.054 3.844 3.844 0 0 0-2.353 1.258 3.862 3.862 0 0 0-.742 3.738 3.8 3.8 0 0 0-1.503 1.765 3.859 3.859 0 0 0 .283 3.89 3.848 3.848 0 0 0 2.312 1.343c.168.852.646 1.618 1.343 2.143a3.867 3.867 0 0 0 3.791.253c.535.8 1.378 1.31 2.32 1.41a3.86 3.86 0 0 0 3.4-1.096c.866.52 1.884.6 2.81.222a3.863 3.863 0 0 0 2.274-3.567c.8-.52 1.375-1.357 1.503-2.322a3.858 3.858 0 0 0-.916-3.082zm-8.354 7.643a1.91 1.91 0 0 1-.955-.256l-3.26-1.883a.478.478 0 0 1-.239-.414V12.56l2.368 1.367a.478.478 0 0 0 .717-.414v-2.732l2.367 1.367v3.763c0 .54-.289 1.042-.758 1.312zm-3.955-2.585a1.915 1.915 0 0 1-.24-1.313l.635-3.662a.478.478 0 0 1 .414-.396l3.167-.547V13.13l-2.368 1.367V11.77l-2.368-1.367v3.764c0 .488.243.942.64 1.222zm-.965-5.317a1.914 1.914 0 0 1 .715-1.056l3.26-1.882c.166-.096.353-.146.541-.146.314 0 .62.14.827.398l1.62 2.805-2.367 1.367a.478.478 0 0 0-.239.414v2.732L9.08 10.974zm9.32 1.625l-2.368-1.367a.478.478 0 0 0-.717.414v2.732l-2.367-1.367V9.248c0-.54.29-1.041.759-1.311a1.91 1.91 0 0 1 2.637.697l1.62 2.805a.478.478 0 0 1 .436-.164zm-1.406 4.02l-3.167.548a.478.478 0 0 1-.414.396l-.635 3.662c-.09.53.076 1.07.458 1.455a1.915 1.915 0 0 0 2.39.22l3.26-1.883c.488-.282.791-.803.791-1.367V14.65l-2.683 1.55zm2.37-3.662V9.897a1.914 1.914 0 0 1-.715 1.056l-3.26 1.882c-.166.096-.353.146-.54.146a.955.955 0 0 1-.827-.398l-1.62-2.805 2.368-1.367a.478.478 0 0 0 .239-.414V6.265l2.683 1.549a1.91 1.91 0 0 1 .917 3.082zm-5.719-2.38a1.434 1.434 0 1 0 0-2.868 1.434 1.434 0 0 0 0 2.868z" />
      </svg>
    </div>
  );

const GeminiLogo = () => (
  <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20">
    <svg className="w-6 h-6 text-[#1A73E8]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C12 2 12.5 7.5 18 12C12.5 12 12 16.5 12 22C12 22 11.5 16.5 6 12C11.5 12 12 2 12 2Z" fill="url(#geminiGrad)" />
      <defs>
        <linearGradient id="geminiGrad" x1="6" y1="2" x2="18" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4285F4" />
          <stop offset="0.5" stopColor="#9B51E0" />
          <stop offset="1" stopColor="#E289F2" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

const ClaudeLogo = () => (
  <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20">
    <svg className="w-6 h-6 text-[#D97706]" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm-3-11.5c.83 0 1.5.67 1.5 1.5S9.83 13.5 9 13.5 7.5 12.83 7.5 12s.67-1.5 1.5-1.5zm6 0c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm-3 7.5c-2.33 0-3.5-1.17-3.5-2h7c0 .83-1.17 2-3.5 2z" />
    </svg>
  </div>
);

const RazorpayLogo = () => (
  <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20">
    <svg className="w-6 h-6 text-[#0B44CD]" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 2.5L12 8l-4.5 9.5H12L22 2.5z" fill="#0B44CD" />
      <path d="M12.5 11.5L2 21.5h16l-5.5-10z" fill="#0B44CD" opacity="0.8" />
    </svg>
  </div>
);

const StripeLogo = () => (
  <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20">
    <svg className="w-6 h-6 text-[#635BFF]" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.962 10.684c0-1.077-.923-1.442-2.308-1.442-1.77 0-3.385.539-4.846 1.308L5.577 6.454C7.423 5.454 9.885 5 11.962 5c4.346 0 7.23 2.115 7.23 6.038 0 5.462-4.615 6.654-7.923 7.615-1.846.539-2.923.846-2.923 1.539 0 .846.885 1.231 2.269 1.231 2.039 0 4-.808 5.616-1.808l1.385 4.077C15.692 24.692 13.154 25 11.038 25c-4.346 0-7.346-2.115-7.346-6.038 0-5.154 4.5-6.423 7.846-7.385 1.808-.538 2.424-.923 2.424-1.893z" />
    </svg>
  </div>
);

export default function Integrations() {
  const columnsList = [
    {
      title: "Accounting",
      icons: [TallyLogo, ZohoBooksLogo, QuickBooksLogo],
      pill: "Sync Invoices",
      pillIcon: (
        <svg className="w-3.5 h-3.5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
        </svg>
      )
    },
    {
      title: "Spreadsheets",
      icons: [ExcelLogo, GoogleSheetsLogo, CSVLogo],
      pill: "Bulk Upload",
      pillIcon: (
        <svg className="w-3.5 h-3.5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
        </svg>
      )
    },
    {
      title: "UPI & Wallets",
      icons: [GPayLogo, PhonePeLogo, PaytmLogo],
      pill: "UPI Payments",
      pillIcon: (
        <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <rect x="5" y="2" width="14" height="20" rx="2" />
          <line x1="12" y1="18" x2="12" y2="18" strokeLinecap="round" />
        </svg>
      )
    },
    {
      title: "Messaging",
      icons: [WhatsAppLogo, SlackLogo, TeamsLogo],
      pill: "Send Reminders",
      pillIcon: (
        <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      )
    },
    {
      title: "AI Engine",
      icons: [ChatGPTLogo, GeminiLogo, ClaudeLogo],
      pill: "Smart Follow-ups",
      pillIcon: (
        <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      )
    },
    {
      title: "Gateways",
      icons: [RazorpayLogo, StripeLogo, BusyLogo],
      pill: "Auto Reconcile",
      pillIcon: (
        <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
      )
    }
  ];

  return (
    <section id="integrations" className="relative w-full bg-[#FFFFFF] py-16 md:py-24 overflow-hidden px-4 md:px-8">
      
      {/* Light glow effects */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at top left, rgba(99, 102, 241, 0.05), transparent 600px),
            radial-gradient(circle at bottom right, rgba(0, 73, 255, 0.04), transparent 600px)
          `
        }}
      />

      <div className="relative max-w-[1340px] mx-auto z-10 text-center">
        
        {/* Badge */}
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
          Sync your invoice ledgers or import directly from accounting software, spreadsheets, and gateways. UdhaarClear automates the entire follow-up and reconciliation circle.
        </p>

        {/* Premium sky-themed container card */}
        <div 
          className="w-full max-w-[1280px] mx-auto rounded-3xl overflow-hidden relative flex flex-col justify-between pt-12 md:pt-16 pb-0 px-4 md:px-8 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://i.pinimg.com/736x/07/4f/70/074f70c50156b5e5ede3bdb50b214bc3.jpg')"
          }}
        >

          {/* Six Column Grid representing integrations categories */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-10 gap-x-4 w-full max-w-[1100px] mx-auto px-2 relative z-20">
            {columnsList.map((col, idx) => (
              <div key={idx} className="flex flex-col items-center group">
                <span className="text-blue-950/75 text-[10px] font-bold tracking-widest uppercase mb-3 select-none">
                  {col.title}
                </span>

                {/* Overlapping/spaced icons row */}
                <div className="flex items-center justify-center -space-x-1.5 mb-4 group-hover:-space-x-0.5 transition-all duration-300">
                  {col.icons.map((IconComponent, iconIdx) => (
                    <div 
                      key={iconIdx} 
                      className="transform group-hover:-translate-y-1 transition-transform duration-300"
                      style={{ transitionDelay: `${iconIdx * 50}ms` }}
                    >
                      <IconComponent />
                    </div>
                  ))}
                </div>

                {/* Pill */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/95 text-blue-950 text-[10px] font-bold rounded-full shadow-sm border border-white/40 hover:bg-white hover:shadow-md transition-all duration-200 select-none cursor-default">
                  {col.pillIcon}
                  <span>{col.pill}</span>
                </div>
              </div>
            ))}
          </div>

          {/* SVG connecting lines for desktop */}
          <div className="hidden lg:block relative w-full max-w-[1100px] mx-auto h-[120px] select-none pointer-events-none mt-4">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1100 120" preserveAspectRatio="none">
              {/* Paths from center of columns (91.67, 275, 458.33, 641.67, 825, 1008.33) down to center (550, 90) */}
              <path d="M 91.67 0 C 91.67 45, 550 45, 550 90" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none" />
              <path d="M 275 0 C 275 45, 550 45, 550 90" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none" />
              <path d="M 458.33 0 C 458.33 45, 550 45, 550 90" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none" />
              <path d="M 641.67 0 C 641.67 45, 550 45, 550 90" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none" />
              <path d="M 825 0 C 825 45, 550 45, 550 90" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none" />
              <path d="M 1008.33 0 C 1008.33 45, 550 45, 550 90" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none" />
              {/* Single vertical line connecting down to the portal header */}
              <path d="M 550 90 L 550 120" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none" />
            </svg>

            {/* Central glowing white circle logo */}
            <div className="absolute left-1/2 -translate-x-1/2 top-[90px] -translate-y-1/2 z-30">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-xl border border-white/40 ring-4 ring-white/15">
                <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center shadow-inner">
                  <span className="text-white font-extrabold text-base font-sans">₹</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile spacer / divider for connecting lines */}
          <div className="lg:hidden flex flex-col items-center justify-center my-6 relative z-10">
            <div className="w-px h-8 bg-white/30" />
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md border border-white/40">
              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-extrabold text-sm">
                ₹
              </div>
            </div>
            <div className="w-px h-8 bg-white/30" />
          </div>

          {/* Mockup Browser Window Portal */}
          <div className="w-full max-w-[1100px] mx-auto bg-white rounded-t-2xl shadow-2xl border border-gray-100/90 overflow-hidden relative z-20">
            {/* Browser Top Bar */}
            <div className="bg-gray-50/80 backdrop-blur-sm border-b border-gray-100/70 px-4 md:px-6 py-3 flex items-center justify-between">
              {/* Window controls */}
              <div className="flex items-center gap-1.5 select-none">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400 block" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 block" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400 block" />
              </div>
              
              {/* Address Bar */}
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1 text-[10px] md:text-[11px] text-gray-500 font-mono w-full max-w-[450px] mx-auto shadow-sm select-none">
                <svg className="w-3 h-3 text-green-600 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                </svg>
                <span className="truncate">https://portal.udhaarclear.com/recoveries/acme-logistics</span>
              </div>
              
              {/* Right space mock buttons */}
              <div className="hidden md:flex items-center gap-1">
                <span className="w-5 h-5 rounded bg-gray-200/50 block" />
                <span className="w-5 h-5 rounded bg-gray-200/50 block" />
              </div>
            </div>
            
            {/* Main App Layout */}
            <div className="grid grid-cols-4 min-h-[300px] md:min-h-[340px] bg-white text-left">
              {/* Sidebar (1/4 width) */}
              <div className="col-span-1 border-r border-gray-100 bg-gray-50/30 p-5 hidden md:block select-none">
                {/* Profile selector */}
                <div className="flex items-center gap-2.5 mb-8">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-white font-extrabold text-sm shadow-md">
                    ₹
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-800">UdhaarClear</h4>
                    <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">Client Panel</span>
                  </div>
                </div>
                
                {/* Navigation list */}
                <nav className="space-y-1">
                  <a href="#" className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-blue-600 bg-blue-50/50 rounded-lg">
                    <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                    </svg>
                    Ledger Dashboard
                  </a>
                  <a href="#" className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-500 hover:text-gray-800 rounded-lg transition-colors">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                    </svg>
                    Payment History
                  </a>
                  <a href="#" className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-500 hover:text-gray-800 rounded-lg transition-colors">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    Automated Rules
                  </a>
                </nav>
              </div>
              
              {/* Content Area (3/4 width or full width on mobile) */}
              <div className="col-span-4 md:col-span-3 p-4 md:p-6 flex flex-col justify-between">
                <div>
                  {/* Panel Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-xs md:text-sm font-bold text-gray-800">Pending Recoveries</h3>
                      <p className="text-[10px] text-gray-400">Total 3 invoices actively tracked via WhatsApp & UPI</p>
                    </div>
                    
                    {/* Search box */}
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Search customer..." 
                        className="text-xs bg-gray-50 border border-gray-200 rounded-lg pl-7 pr-3 py-1.5 w-full sm:w-[180px] focus:outline-none" 
                      />
                      <svg className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Active Recovery Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Card 1 */}
                    <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/40 hover:bg-white hover:shadow-md transition-all duration-200 cursor-default">
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                          SK
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-gray-800 truncate max-w-[100px]">Sharma Kirana</h4>
                          <span className="text-[9px] text-gray-400 font-mono">INV-2026-089</span>
                        </div>
                      </div>
                      <div className="space-y-1 mb-3">
                        <div className="text-[9px] text-gray-400">Due Amount</div>
                        <div className="text-sm font-bold text-gray-800">₹45,200</div>
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        Escalation L2 Sent
                      </span>
                    </div>
                    
                    {/* Card 2 */}
                    <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/40 hover:bg-white hover:shadow-md transition-all duration-200 relative overflow-hidden cursor-default">
                      {/* Top success bar */}
                      <div className="absolute top-0 inset-x-0 h-1 bg-green-500" />
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-xs">
                          VE
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-gray-800 truncate max-w-[100px]">Verma Logistics</h4>
                          <span className="text-[9px] text-gray-400 font-mono">INV-2026-077</span>
                        </div>
                      </div>
                      <div className="space-y-1 mb-3">
                        <div className="text-[9px] text-gray-400">Due Amount</div>
                        <div className="text-sm font-bold text-gray-800">₹1,28,000</div>
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold bg-green-50 text-green-700 border border-green-200">
                        Recovered via UPI
                      </span>
                    </div>
                    
                    {/* Card 3 */}
                    <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/40 hover:bg-white hover:shadow-md transition-all duration-200 cursor-default">
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">
                          GD
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-gray-800 truncate max-w-[100px]">Gupta Distrib.</h4>
                          <span className="text-[9px] text-gray-400 font-mono">INV-2026-102</span>
                        </div>
                      </div>
                      <div className="space-y-1 mb-3">
                        <div className="text-[9px] text-gray-400">Due Amount</div>
                        <div className="text-sm font-bold text-gray-800">₹89,500</div>
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        Polite Notice Sent
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Footer status bar */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50 text-[10px] text-gray-400">
                  <span>Showing 3 active ledgers</span>
                  <span className="text-green-500 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                    Live Syncing
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
}
