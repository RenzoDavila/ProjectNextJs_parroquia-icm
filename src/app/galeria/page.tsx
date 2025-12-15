"use client";

import { useState } from "react";
import Image from "next/image";
import PublicLayout from "@/components/layout/PublicLayout";
import SectionHeading from "@/components/ui/SectionHeading";
import { Calendar, ChevronDown, X } from "lucide-react";

// Gallery data organized by year
const galleryData = {
  2024: [
    {
      id: "1",
      title: "Semana Santa 2024",
      date: "Marzo 2024",
      coverImage: "https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=600",
      images: [
        "https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=800",
        "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?q=80&w=800",
        "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=800",
      ],
    },
    {
      id: "2",
      title: "Fiesta Patronal",
      date: "Agosto 2024",
      coverImage: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=600",
      images: [
        "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=800",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800",
      ],
    },
  ],
  2023: [
    {
      id: "3",
      title: "Navidad 2023",
      date: "Diciembre 2023",
      coverImage: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?q=80&w=600",
      images: [
        "https://images.unsplash.com/photo-1512389142860-9c449e58a543?q=80&w=800",
        "https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=800",
      ],
    },
    {
      id: "4",
      title: "Corpus Christi 2023",
      date: "Junio 2023",
      coverImage: "https://images.unsplash.com/photo-1548690595-90c53c39a7e4?q=80&w=600",
      images: [
        "https://images.unsplash.com/photo-1548690595-90c53c39a7e4?q=80&w=800",
      ],
    },
    {
      id: "5",
      title: "Primera Comunión",
      date: "Mayo 2023",
      coverImage: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=600",
      images: [
        "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=800",
        "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=800",
      ],
    },
  ],
  2022: [
    {
      id: "6",
      title: "Misión Parroquial",
      date: "Octubre 2022",
      coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600",
      images: [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800",
      ],
    },
  ],
};

type GalleryEvent = {
  id: string;
  title: string;
  date: string;
  coverImage: string;
  images: string[];
};

export default function GaleriaPage() {
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedEvent, setSelectedEvent] = useState<GalleryEvent | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const years = Object.keys(galleryData).map(Number).sort((a, b) => b - a);
  const events = galleryData[selectedYear as keyof typeof galleryData] || [];

  return (
    <PublicLayout>
      {/* Hero Banner */}
      <section 
        className="relative h-[300px] md:h-[400px] bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=2000')",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Galería de Fotos</h1>
            <p className="text-lg md:text-xl">Momentos especiales de nuestra comunidad</p>
          </div>
        </div>
      </section>

      {/* Year Filter */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <span className="text-gray-600 font-medium flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Filtrar por año:
            </span>
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="appearance-none bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#002F57] cursor-pointer"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
            </div>
            <div className="flex gap-2">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedYear === year
                      ? "bg-[#002F57] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title={`Eventos ${selectedYear}`}
            subtitle={`${events.length} álbumes disponibles`}
          />
          
          {events.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transition-transform hover:-translate-y-1"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="relative h-48">
                    <Image
                      src={event.coverImage}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-lg font-bold">{event.title}</h3>
                      <p className="text-sm text-gray-200">{event.date}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600">
                      {event.images.length} {event.images.length === 1 ? "foto" : "fotos"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No hay eventos para este año.</p>
            </div>
          )}
        </div>
      </section>

      {/* Event Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-black/75 transition-opacity"
              onClick={() => setSelectedEvent(null)}
            />
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-[#002F57] px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedEvent.title}</h3>
                  <p className="text-[#6DFFE5] text-sm">{selectedEvent.date}</p>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-white hover:text-[#6DFFE5] transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedEvent.images.map((image, idx) => (
                    <div
                      key={idx}
                      className="relative h-40 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setLightboxImage(image)}
                    >
                      <Image
                        src={image}
                        alt={`${selectedEvent.title} - ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 text-white hover:text-[#6DFFE5] transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full">
            <Image
              src={lightboxImage}
              alt="Imagen ampliada"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[#002F57] mb-4">¿Tienes fotos para compartir?</h2>
          <p className="text-gray-600 mb-8">
            Si tienes fotografías de eventos parroquiales que te gustaría compartir, 
            envíanoslas y con gusto las incluiremos en nuestra galería.
          </p>
          <a 
            href="mailto:icmpamiraflores@gmail.com?subject=Fotos%20para%20la%20galería"
            className="inline-block px-8 py-3 bg-[#002F57] text-white font-semibold rounded-lg hover:bg-[#001f3d] transition-colors"
          >
            Enviar Fotos
          </a>
        </div>
      </section>
    </PublicLayout>
  );
}
