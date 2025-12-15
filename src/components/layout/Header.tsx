"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, SITE_CONFIG, SOCIAL_LINKS } from "@/lib/constants";
import { ChevronRight, Phone, Mail, Facebook, Youtube, Instagram, Lock } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // Determinar si estamos scrolleando hacia arriba o abajo
          if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // Scrolling hacia abajo - ocultar navbar
            setIsVisible(false);
          } else {
            // Scrolling hacia arriba - mostrar navbar
            setIsVisible(true);
          }
          
          // Actualizar si estamos en la parte superior
          setIsScrolled(currentScrollY > 50);
          setLastScrollY(currentScrollY);
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header className="w-full relative z-50">
      {/* Top Bar - Info de contacto y redes sociales */}
      <div className={`fixed top-0 left-0 right-0 z-50 bg-[#002F57] text-white transition-all duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10 text-sm">
            {/* Contacto */}
            <div className="flex items-center space-x-4">
              <a 
                href={`tel:${SITE_CONFIG.phone.replace(/[^0-9]/g, '')}`}
                className="sm:flex items-center space-x-1.5 hover:text-[#49AE9C] transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{SITE_CONFIG.phone}</span>
              </a>
              <a 
                href={`https://wa.me/51${SITE_CONFIG.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1.5 hover:text-[#25D366] transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span className="hidden sm:inline">{SITE_CONFIG.whatsapp}</span>
              </a>
            </div>

            {/* Redes sociales y Admin */}
            <div className="flex items-center space-x-3">
              <a 
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#1877F2] transition-colors p-1"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FF0000] transition-colors p-1"
                title="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a 
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#E4405F] transition-colors p-1"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <div className="w-px h-4 bg-white/30 mx-1"></div>
              <Link 
                href="/admin"
                className="flex items-center space-x-1 hover:text-[#49AE9C] transition-colors p-1"
                title="Panel de Administración"
              >
                <Lock className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation - Sticky with Glassmorphism and hide/show on scroll */}
      <nav className={`fixed left-0 right-0 z-40 transition-all duration-300 ${
        isVisible ? 'top-10' : '-translate-y-full top-0'
      } ${
        isScrolled 
          ? 'backdrop-blur-xl bg-white/70 shadow-lg shadow-black/5' 
          : 'bg-white/95 shadow-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 group">
              <div className="flex items-center">
                <div className={`relative overflow-hidden rounded-full shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-105 ${
                  isScrolled ? 'w-12 h-12' : 'w-14 h-14'
                }`}>
                  <Image
                    src="/images/logos/logo-parroquia.png"
                    alt={SITE_CONFIG.shortName}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <span className={`ml-3 text-lg font-semibold text-[#002F57] hidden sm:block transition-all duration-300 ${
                  isScrolled ? 'text-base' : ''
                }`}>
                  {SITE_CONFIG.shortName}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-4 py-2 text-gray-700 hover:text-[#002F57] font-medium transition-all duration-300 rounded-lg group ${
                    pathname === item.href
                      ? "text-[#002F57] bg-[#49AE9C]/10"
                      : "hover:bg-gray-100/80"
                  }`}
                >
                  {item.name}
                  <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-[#49AE9C] to-[#002F57] transition-all duration-300 rounded-full ${
                    pathname === item.href ? 'w-8' : 'w-0 group-hover:w-8'
                  }`}></span>
                </Link>
              ))}
            </div>

            {/* Reserve Button */}
            <div className="hidden lg:block">
              <Link
                href="/reservar"
                className="inline-flex items-center bg-gradient-to-r from-[#49AE9C] to-[#3d9585] text-white px-6 py-2.5 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#49AE9C]/30 hover:scale-105 hover:from-[#3d9585] hover:to-[#2d7a6b]"
              >
                Reservar
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden relative w-10 h-10 flex items-center justify-center text-gray-600 hover:text-[#002F57] transition-colors rounded-lg hover:bg-gray-100"
            >
              <span className={`absolute block w-6 h-0.5 bg-current transition-all duration-300 ${
                isMenuOpen ? 'rotate-45' : '-translate-y-2'
              }`}></span>
              <span className={`absolute block w-6 h-0.5 bg-current transition-all duration-300 ${
                isMenuOpen ? 'opacity-0' : 'opacity-100'
              }`}></span>
              <span className={`absolute block w-6 h-0.5 bg-current transition-all duration-300 ${
                isMenuOpen ? '-rotate-45' : 'translate-y-2'
              }`}></span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Slide down animation */}
        <div className={`lg:hidden transition-all duration-500 ease-in-out ${
          isMenuOpen ? 'max-h-screen opacity-100 pointer-events-auto' : 'max-h-0 opacity-0 pointer-events-none'
        }`}>
          <div className="backdrop-blur-xl bg-white/50 border-t border-gray-200/50 px-4 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-5rem)] shadow-xl">
            {NAV_ITEMS.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                style={{ animationDelay: `${index * 50}ms` }}
                className={`block py-3 px-4 text-gray-700 hover:text-[#002F57] hover:bg-white/40 font-medium transition-all duration-300 rounded-lg ${
                  pathname === item.href ? "text-[#002F57] bg-white/40 font-semibold" : ""
                } ${isMenuOpen ? 'animate-fadeInUp' : ''}`}
              >
                <span className="flex items-center justify-between">
                  {item.name}
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </span>
              </Link>
            ))}
            <Link
              href="/reservar"
              onClick={() => setIsMenuOpen(false)}
              className="block w-full text-center bg-gradient-to-r from-[#49AE9C] to-[#3d9585] text-white px-6 py-3.5 rounded-full font-semibold hover:shadow-lg transition-all duration-300 mt-4 shadow-md"
            >
              Reservar Ahora
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
