'use client';

import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  opacity?: number;
  border?: boolean;
  hoverEffect?: boolean;
  gradient?: boolean;
}

const blurValues = {
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
  xl: 'backdrop-blur-xl',
};

export default function GlassCard({
  children,
  className = '',
  blur = 'md',
  opacity = 0.1,
  border = true,
  hoverEffect = true,
  gradient = false,
}: GlassCardProps) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl
        ${blurValues[blur]}
        ${border ? 'border border-white/20' : ''}
        ${hoverEffect ? 'transition-all duration-500 hover:shadow-2xl hover:shadow-white/10 hover:-translate-y-2 hover:border-white/40' : ''}
        ${gradient ? 'bg-gradient-to-br from-white/20 to-white/5' : ''}
        ${className}
      `}
      style={{
        backgroundColor: gradient ? undefined : `rgba(255, 255, 255, ${opacity})`,
      }}
    >
      {/* Shine effect on hover */}
      {hoverEffect && (
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
        </div>
      )}
      {children}
    </div>
  );
}
