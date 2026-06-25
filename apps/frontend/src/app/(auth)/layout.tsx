import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-[#0b0b0b] text-[#ffffff] relative overflow-hidden px-4 py-8 font-sans">
      <div className="w-full max-w-[420px] relative z-10">{children}</div>
    </div>
  );
}
