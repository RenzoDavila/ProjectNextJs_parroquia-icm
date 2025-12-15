'use client';

import { useRef, useEffect, useState, ReactNode } from 'react';

interface ParallaxSectionProps {
  children: ReactNode;
  backgroundImage?: string;
  backgroundColor?: string;
  speed?: number;
  overlay?: boolean;
  overlayColor?: string;
  overlayOpacity?: number;
  className?: string;
  minHeight?: string;
}

export default function ParallaxSection({
  children,
  backgroundImage,
  backgroundColor = 'transparent',
  speed = 0.5,
  overlay = true,
  overlayColor = '#000',
  overlayOpacity = 0.5,
  className = '',
  minHeight = '500px',
}: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const scrolled = window.scrollY;
        const sectionTop = rect.top + scrolled;
        const relativeScroll = scrolled - sectionTop;
        setOffset(relativeScroll * speed);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div
      ref={sectionRef}
      className={`relative overflow-hidden ${className}`}
      style={{ minHeight, backgroundColor }}
    >
      {backgroundImage && (
        <div
          className="absolute inset-0 w-full h-[120%] -top-[10%] bg-cover bg-center will-change-transform"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            transform: `translateY(${offset}px)`,
          }}
        />
      )}
      {overlay && (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: overlayColor, opacity: overlayOpacity }}
        />
      )}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
