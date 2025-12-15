"use client";

import Image from "next/image";

interface InfiniteSliderProps {
  items: {
    id: string;
    image: string;
    link: string;
    alt: string;
  }[];
  title?: string;
  subtitle?: string;
  bgColor?: string;
  titleColor?: string;
  subtitleColor?: string;
}

export default function InfiniteSlider({
  items,
  title,
  subtitle,
  bgColor = "bg-white",
  titleColor = "text-[#002F57]",
  subtitleColor = "text-gray-600",
}: InfiniteSliderProps) {
  // Duplicate items for infinite scroll effect
  const duplicatedItems = [...items, ...items];

  return (
    <section className={`py-12 ${bgColor} overflow-hidden`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        {title && (
          <h2 className={`text-3xl font-bold text-center ${titleColor}`}>
            {title}
          </h2>
        )}
        {subtitle && (
          <p className={`text-center mt-2 ${subtitleColor}`}>{subtitle}</p>
        )}
      </div>

      <div className="relative">
        <div className="flex slider-track" style={{ width: `${items.length * 2 * 220}px` }}>
          {duplicatedItems.map((item, index) => (
            <a
              key={`${item.id}-${index}`}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 w-[200px] h-[200px] mx-2.5 relative group"
            >
              <div className="w-full h-full relative rounded-lg overflow-hidden shadow-md transition-transform duration-300 group-hover:scale-105">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  className="object-cover"
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
