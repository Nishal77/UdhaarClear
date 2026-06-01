"use client";

import * as React from "react";

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  asChild?: boolean;
}

export function Tooltip({ content, children }: TooltipProps) {
  return (
    <div className="relative group/tooltip inline-block">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-lg shadow-md opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 font-sans">
        {content}
        {/* Tooltip arrow */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
      </div>
    </div>
  );
}
