'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

interface HoverCardProps {
  children: ReactNode;
  className?: string;
  href?: string;
  effect?: 'lift' | 'glow' | 'reveal' | 'tilt' | 'shine';
  glowColor?: string;
}

export default function HoverCard({
  children,
  className = '',
  href,
  effect = 'lift',
  glowColor = 'rgba(73, 174, 156, 0.4)',
}: HoverCardProps) {
  const effectClasses = {
    lift: 'transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl',
    glow: 'transition-all duration-300 hover:shadow-lg',
    reveal: 'group overflow-hidden',
    tilt: 'transition-transform duration-300 hover:rotate-1 hover:scale-105',
    shine: 'relative overflow-hidden group',
  };

  const glowStyle = effect === 'glow' ? { '--glow-color': glowColor } as React.CSSProperties : {};

  const content = (
    <div
      className={`
        ${effectClasses[effect]}
        ${effect === 'glow' ? 'hover:shadow-[0_0_30px_var(--glow-color)]' : ''}
        ${className}
      `}
      style={glowStyle}
    >
      {/* Shine effect overlay */}
      {effect === 'shine' && (
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none z-10" />
      )}
      {children}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
