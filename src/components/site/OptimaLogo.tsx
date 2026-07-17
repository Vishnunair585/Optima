import React from "react";

type OptimaLogoProps = {
  className?: string;
};

export function OptimaLogo({ className = "h-8 w-8" }: OptimaLogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="optimaGradient" x1="0%" y1="100%" x2="50%" y2="0%">
          <stop offset="0%" stopColor="#7c3aed" /> {/* Violet */}
          <stop offset="100%" stopColor="#3b82f6" /> {/* Blue */}
        </linearGradient>
      </defs>
      
      {/* The letter A stylized */}
      <path
        d="M20 90 L50 20 L80 90 L60 90 L50 65 L35 90 Z"
        fill="url(#optimaGradient)"
      />
      
      {/* The 4-point star in the center/crossbar */}
      <path
        d="M50 45 Q50 60 30 65 Q50 70 50 85 Q50 70 70 65 Q50 60 50 45 Z"
        fill="#ffffff"
      />
    </svg>
  );
}
