"use client";

import Link from "next/link";
import Image from "next/image";
import { SITE_CONFIG, SOCIAL_LINKS, NAV_ITEMS } from "@/lib/constants";
import { Facebook, Youtube, Instagram, Phone, Mail, MapPin, ChevronRight, Heart, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-[#002F57] to-[#001d36] text-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#49AE9C]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#6DFFE5]/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
      
      {/* Main Footer */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center mb-6 group">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                <Image
                  src="/images/logos/logo-parroquia.png"
                  alt={SITE_CONFIG.shortName}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-white to-[#6DFFE5] bg-clip-text text-transparent">
                {SITE_CONFIG.shortName}
              </span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              {SITE_CONFIG.description}
            </p>
            {/* Social Links */}
            <div className="flex space-x-3">
              <a
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-gray-300 hover:bg-red-500 hover:text-white hover:scale-110 transition-all duration-300"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-gray-300 hover:bg-blue-600 hover:text-white hover:scale-110 transition-all duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-gray-300 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 hover:text-white hover:scale-110 transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 flex items-center">
              <span className="w-8 h-1 bg-gradient-to-r from-[#49AE9C] to-[#6DFFE5] rounded-full mr-3"></span>
              Enlaces Rápidos
            </h3>
            <ul className="space-y-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="group flex items-center text-gray-300 hover:text-white transition-all duration-300 text-sm"
                  >
                    <ChevronRight className="w-4 h-4 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#6DFFE5]" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{item.name}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/reservar"
                  className="group inline-flex items-center px-4 py-2 mt-2 bg-gradient-to-r from-[#49AE9C] to-[#3d9585] rounded-full text-white text-sm font-semibold hover:shadow-lg hover:shadow-[#49AE9C]/30 hover:scale-105 transition-all duration-300"
                >
                  Reservar Misa
                  <ExternalLink className="w-3 h-3 ml-2 group-hover:rotate-12 transition-transform" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 flex items-center">
              <span className="w-8 h-1 bg-gradient-to-r from-[#49AE9C] to-[#6DFFE5] rounded-full mr-3"></span>
              Contáctanos
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href={`tel:${SITE_CONFIG.phone.replace(/\D/g, "")}`}
                  className="group flex items-center text-gray-300 hover:text-white transition-all duration-300 text-sm"
                >
                  <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mr-3 group-hover:bg-[#49AE9C] transition-colors duration-300">
                    <Phone className="w-4 h-4" />
                  </span>
                  {SITE_CONFIG.phone}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/51${SITE_CONFIG.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center text-gray-300 hover:text-green-400 transition-all duration-300 text-sm"
                >
                  <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mr-3 group-hover:bg-green-500 group-hover:text-white transition-colors duration-300">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </span>
                  {SITE_CONFIG.whatsapp}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="group flex items-center text-gray-300 hover:text-white transition-all duration-300 text-sm"
                >
                  <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mr-3 group-hover:bg-[#49AE9C] transition-colors duration-300">
                    <Mail className="w-4 h-4" />
                  </span>
                  {SITE_CONFIG.email}
                </a>
              </li>
              <li>
                <div className="group flex items-start text-gray-300 text-sm">
                  <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mr-3 flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <span className="leading-relaxed">{SITE_CONFIG.address}</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Office Hours */}
          <div>
            <h3 className="text-lg font-bold mb-6 flex items-center">
              <span className="w-8 h-1 bg-gradient-to-r from-[#49AE9C] to-[#6DFFE5] rounded-full mr-3"></span>
              Horarios
            </h3>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <div className="mb-4">
                <span className="text-[#6DFFE5] font-semibold text-sm">Lunes a Viernes</span>
                <div className="mt-2 space-y-1 text-gray-300 text-sm">
                  <p className="flex justify-between">
                    <span>Mañana:</span>
                    <span className="font-medium text-white">8:00 - 12:30</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Tarde:</span>
                    <span className="font-medium text-white">4:00 - 6:30</span>
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-white/10">
                <span className="text-[#6DFFE5] font-semibold text-sm">Sábados</span>
                <p className="mt-2 flex justify-between text-gray-300 text-sm">
                  <span>Mañana:</span>
                  <span className="font-medium text-white">9:00 - 12:00</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="relative border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p className="flex items-center">
              © {new Date().getFullYear()} {SITE_CONFIG.name}. 
              <span className="hidden sm:inline ml-1">Todos los derechos reservados.</span>
            </p>
            <p className="mt-3 md:mt-0 flex items-center gap-2">
              Desarrollado con 
              <Heart className="w-4 h-4 text-red-500 animate-pulse" fill="currentColor" />
              para la comunidad
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
