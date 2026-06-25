import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password: string;
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  if (!password) return null;

  // Track password strength criteria
  const criteria = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const score = Object.values(criteria).filter(Boolean).length;

  const getStrengthText = () => {
    if (score <= 1) return 'Weak';
    if (score <= 3) return 'Medium';
    return 'Strong';
  };

  const getStrengthColor = () => {
    if (score <= 1) return 'bg-[#ffa16c]'; // Fey Ember for Weak
    if (score <= 3) return 'bg-[#ffd166]'; // Yellowish for Medium
    return 'bg-[#4ebe96]'; // Fey Growth for Strong
  };

  const getTextColor = () => {
    if (score <= 1) return 'text-[#ffa16c]';
    if (score <= 3) return 'text-[#ffd166]';
    return 'text-[#4ebe96]';
  };

  return (
    <div className="space-y-3 pt-2 pb-1">
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
        <span className="text-[#868f97]">Password Strength</span>
        <span className={getTextColor()}>{getStrengthText()}</span>
      </div>

      {/* Animated Progress Bar */}
      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden flex gap-1">
        {[1, 2, 3, 4].map((barIdx) => (
          <div
            key={barIdx}
            className={`flex-1 h-full rounded-full transition-all duration-300 ${
              score >= barIdx ? getStrengthColor() : 'bg-transparent'
            }`}
          />
        ))}
      </div>

      {/* Requirement Checklist */}
      <ul className="text-[11px] grid grid-cols-2 gap-x-4 gap-y-2 pt-2">
        <li className="flex items-center gap-2 font-medium text-[#868f97]">
          {criteria.length ? (
            <Check size={12} className="text-[#4ebe96] shrink-0" />
          ) : (
            <div className="w-3 h-3 border border-[#868f97]/50 rounded-full shrink-0" />
          )}
          <span className={criteria.length ? 'text-[#ffffff]' : ''}>8+ Characters</span>
        </li>
        <li className="flex items-center gap-2 font-medium text-[#868f97]">
          {criteria.uppercase ? (
            <Check size={12} className="text-[#4ebe96] shrink-0" />
          ) : (
            <div className="w-3 h-3 border border-[#868f97]/50 rounded-full shrink-0" />
          )}
          <span className={criteria.uppercase ? 'text-[#ffffff]' : ''}>Uppercase</span>
        </li>
        <li className="flex items-center gap-2 font-medium text-[#868f97]">
          {criteria.lowercase ? (
            <Check size={12} className="text-[#4ebe96] shrink-0" />
          ) : (
            <div className="w-3 h-3 border border-[#868f97]/50 rounded-full shrink-0" />
          )}
          <span className={criteria.lowercase ? 'text-[#ffffff]' : ''}>Lowercase</span>
        </li>
        <li className="flex items-center gap-2 font-medium text-[#868f97]">
          {criteria.number ? (
            <Check size={12} className="text-[#4ebe96] shrink-0" />
          ) : (
            <div className="w-3 h-3 border border-[#868f97]/50 rounded-full shrink-0" />
          )}
          <span className={criteria.number ? 'text-[#ffffff]' : ''}>Number</span>
        </li>
      </ul>
    </div>
  );
}
