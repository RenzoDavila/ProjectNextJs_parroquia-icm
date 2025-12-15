'use client';

import { useRef, useEffect, useState, ReactNode } from 'react';

interface AnimateOnScrollProps {
  children: ReactNode;
  animation?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in' | 'zoom-out' | 'flip-up' | 'flip-down';
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
  once?: boolean;
}

const animationStyles: Record<string, { initial: React.CSSProperties; animate: React.CSSProperties }> = {
  'fade-up': {
    initial: { opacity: 0, transform: 'translateY(40px)' },
    animate: { opacity: 1, transform: 'translateY(0)' },
  },
  'fade-down': {
    initial: { opacity: 0, transform: 'translateY(-40px)' },
    animate: { opacity: 1, transform: 'translateY(0)' },
  },
  'fade-left': {
    initial: { opacity: 0, transform: 'translateX(-40px)' },
    animate: { opacity: 1, transform: 'translateX(0)' },
  },
  'fade-right': {
    initial: { opacity: 0, transform: 'translateX(40px)' },
    animate: { opacity: 1, transform: 'translateX(0)' },
  },
  'zoom-in': {
    initial: { opacity: 0, transform: 'scale(0.8)' },
    animate: { opacity: 1, transform: 'scale(1)' },
  },
  'zoom-out': {
    initial: { opacity: 0, transform: 'scale(1.2)' },
    animate: { opacity: 1, transform: 'scale(1)' },
  },
  'flip-up': {
    initial: { opacity: 0, transform: 'perspective(1000px) rotateX(45deg)' },
    animate: { opacity: 1, transform: 'perspective(1000px) rotateX(0)' },
  },
  'flip-down': {
    initial: { opacity: 0, transform: 'perspective(1000px) rotateX(-45deg)' },
    animate: { opacity: 1, transform: 'perspective(1000px) rotateX(0)' },
  },
};

export default function AnimateOnScroll({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 600,
  className = '',
  threshold = 0.1,
  once = true,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, once]);

  const styles = animationStyles[animation];

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...(isVisible ? styles.animate : styles.initial),
        transition: `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}
