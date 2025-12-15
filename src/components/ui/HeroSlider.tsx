"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, ArrowDown } from "lucide-react";

interface HeroSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  description: string;
}

interface HeroSliderProps {
  slides: HeroSlide[];
  autoPlayInterval?: number;
}

export default function HeroSlider({ slides, autoPlayInterval = 5000 }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToSlide = useCallback((index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 600);
  }, [isAnimating]);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % slides.length);
  }, [currentSlide, slides.length, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  }, [currentSlide, slides.length, goToSlide]);

  useEffect(() => {
    const timer = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(timer);
  }, [nextSlide, autoPlayInterval]);

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            index === currentSlide ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-105"
          }`}
        >
          {/* Background Image with Parallax Effect */}
          <div
            className="absolute inset-0 bg-cover bg-center transform scale-110 transition-transform duration-[8000ms] ease-out"
            style={{
              backgroundImage: `url(${slide.image})`,
              transform: index === currentSlide ? 'scale(1.1)' : 'scale(1.15)',
            }}
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-2xl ml-auto text-right">
                {/* Decorative line */}
                <div 
                  className={`h-1 w-20 bg-gradient-to-r from-[#49AE9C] to-[#6DFFE5] ml-auto mb-6 rounded-full transform transition-all duration-700 delay-100 ${
                    index === currentSlide ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
                  }`}
                />
                
                <h3
                  className={`text-xl md:text-2xl lg:text-3xl text-[#6DFFE5] mb-3 font-light tracking-wide transform transition-all duration-700 delay-200 ${
                    index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                  }`}
                >
                  {slide.title}
                </h3>
                <h2
                  className={`text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight text-shadow-lg transform transition-all duration-700 delay-300 ${
                    index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                  }`}
                >
                  {slide.subtitle}
                </h2>
                <p
                  className={`text-lg md:text-xl text-white/80 max-w-xl ml-auto leading-relaxed transform transition-all duration-700 delay-500 ${
                    index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                  }`}
                >
                  {slide.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows - Glassmorphism */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 bottom-0 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full backdrop-blur-md bg-white/10 border border-white/20 text-white hover:bg-white/30 hover:scale-110 transition-all duration-300 group cursor-pointer"
        aria-label="Slide anterior"
      >
        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 bottom-0 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full backdrop-blur-md bg-white/10 border border-white/20 text-white hover:bg-white/30 hover:scale-110 transition-all duration-300 group cursor-pointer"
        aria-label="Siguiente slide"
      >
        <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
        <div 
          className="h-full bg-gradient-to-r from-[#49AE9C] to-[#6DFFE5] transition-all duration-300"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>

      {/* Dots Indicator - Modern Style */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="group relative cursor-pointer"
            aria-label={`Ir al slide ${index + 1}`}
          >
            <span className={`block transition-all duration-500 rounded-full ${
              index === currentSlide
                ? "w-10 h-3 bg-gradient-to-r from-[#49AE9C] to-[#6DFFE5]"
                : "w-3 h-3 bg-white/40 hover:bg-white/60"
            }`} />
          </button>
        ))}
      </div>

      {/* Scroll Down Indicator */}
      <button 
        onClick={scrollToContent}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 text-white/70 hover:text-white transition-colors animate-bounce cursor-pointer"
        aria-label="Desplazar hacia abajo"
      >
        <ArrowDown className="w-6 h-6" />
      </button>

      {/* Side Decorative Elements */}
      <div className="absolute top-1/4 left-8 w-px h-32 bg-gradient-to-b from-transparent via-white/30 to-transparent hidden lg:block" />
      <div className="absolute bottom-1/4 right-8 w-px h-32 bg-gradient-to-b from-transparent via-white/30 to-transparent hidden lg:block" />
    </section>
  );
}
