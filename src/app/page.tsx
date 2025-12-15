'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PublicLayout from '@/components/layout/PublicLayout';
import HeroSlider from '@/components/ui/HeroSlider';
import ServiceCard from '@/components/ui/ServiceCard';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';
import { SocialMediaSection } from '@/components/ui/SocialEmbed';
import { EXTERNAL_LINKS, SITE_CONFIG } from '@/lib/constants';

// Tipos para los datos dinámicos
type Banner = {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  link?: string;
  linkText?: string;
};

type HomeService = {
  id: number;
  title: string;
  description: string;
  icon: 'clock' | 'calendar' | 'heart' | 'users' | 'book' | 'star' | 'info' | 'map' | 'phone' | 'mail';
  link_url: string;
};

type InterestPage = {
  id: number;
  title: string;
  image_url: string;
  link_url: string;
};

type PageContent = {
  welcome: {
    content: {
      title: string;
      subtitle: string;
      description: string;
    };
    image_url: string;
  } | null;
  pastoralJuvenil: {
    content: {
      title: string;
      description: string;
      buttonText: string;
      buttonUrl: string;
    };
    image_url: string;
  } | null;
  msc: {
    content: {
      title: string;
      subtitle: string;
      description: string;
      buttonText: string;
      buttonUrl: string;
    };
    image_url: string;
  } | null;
};

type DonationInfo = {
  id: number;
  title: string;
  subtitle: string;
  bank_name: string;
  bank_logo_url: string | null;
  account_type: string;
  account_number: string;
  cci: string;
  account_holder: string;
  church_image_url: string | null;
  heart_image_url: string | null;
  purpose_title: string | null;
  purpose_description: string | null;
  purpose_image_url: string | null;
  is_active: boolean;
};

// Datos de fallback (si la DB no está disponible)
const fallbackServices = [
  {
    id: 1,
    icon: 'clock' as const,
    title: 'Horarios y Servicios',
    description: 'Consulta los horarios de misas, confesiones y servicios parroquiales.',
    link_url: '/horarios',
  },
  {
    id: 2,
    icon: 'calendar' as const,
    title: 'Reservaciones',
    description: 'Reserva misas, bautizos, matrimonios y otros sacramentos.',
    link_url: '/reservar',
  },
  {
    id: 3,
    icon: 'heart' as const,
    title: 'Servicios Pastorales',
    description: 'Conoce nuestros grupos pastorales y actividades comunitarias.',
    link_url: '/servicios',
  },
];

const fallbackInterestPages = [
  { id: 1, title: 'Catequesis', image_url: 'https://images.unsplash.com/photo-1544776193-52f10d0f912c?w=400', link_url: '#' },
  { id: 2, title: 'Cáritas', image_url: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400', link_url: '#' },
  { id: 3, title: 'Jóvenes', image_url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400', link_url: '#' },
  { id: 4, title: 'Familias', image_url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400', link_url: '#' },
];

// Fallback para banners (coherente con los datos de la DB)
const fallbackBanners: Banner[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=2000',
    title: 'Bienvenidos',
    subtitle: 'Parroquia Inmaculado Corazón de María',
    description: 'Una comunidad de fe, esperanza y amor en el corazón de Arequipa',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?w=2000',
    title: 'Reserva tu Misa',
    subtitle: 'Intenciones de Misa',
    description: 'Solicita una intención de misa para tus seres queridos de manera fácil y rápida',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=2000',
    title: 'Pastoral Juvenil',
    subtitle: 'Jóvenes por Cristo',
    description: 'Únete a nuestra comunidad de jóvenes comprometidos con la fe y el servicio',
  },
];

export default function HomePage() {
  const [banners, setBanners] = useState<Banner[]>(fallbackBanners);
  const [services, setServices] = useState<HomeService[]>(fallbackServices);
  const [interestPages, setInterestPages] = useState<InterestPage[]>(fallbackInterestPages);
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [donationInfo, setDonationInfo] = useState<DonationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDynamicContent();
  }, []);

  const loadDynamicContent = async () => {
    try {
      // Cargar banners
      const bannersRes = await fetch('/api/banners');
      const bannersData = await bannersRes.json();
      if (bannersData.success && bannersData.slides?.length > 0) {
        setBanners(bannersData.slides);
      }

      // Cargar servicios
      const servicesRes = await fetch('/api/home-services');
      const servicesData = await servicesRes.json();
      if (servicesData.success && servicesData.data?.length > 0) {
        setServices(servicesData.data);
      }

      // Cargar páginas de interés
      const pagesRes = await fetch('/api/interest-pages');
      const pagesData = await pagesRes.json();
      if (pagesData.success && pagesData.data?.length > 0) {
        setInterestPages(pagesData.data);
      }

      // Cargar contenido de página
      const contentRes = await fetch('/api/home-content');
      const contentData = await contentRes.json();
      if (contentData.success && contentData.data) {
        setPageContent(contentData.data);
      }

      // Cargar información de donaciones
      const donationRes = await fetch('/api/donation-info');
      const donationData = await donationRes.json();
      if (donationData.success && donationData.data) {
        setDonationInfo(donationData.data);
      }
    } catch (error) {
      console.log('Usando datos de fallback:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PublicLayout hasHero>
      <main>
        <HeroSlider slides={banners} />

        <section className="relative py-8 overflow-hidden h-screen w-full">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/bg/bienvenidos-bg.jpg"
              alt="Fondo Bienvenidos"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center backdrop-blur-xl bg-white/20 rounded-3xl p-8 md:p-12 shadow-2xl border border-white/30">
              <SectionHeading 
                title={pageContent?.welcome?.content.title || "Bienvenidos"} 
                subtitle={pageContent?.welcome?.content.subtitle || "a nuestra parroquia"} 
              />
              <p className="text-lg text-white mb-8 font-medium drop-shadow-lg">{SITE_CONFIG.description}</p>
              <p className="text-white/95 leading-relaxed drop-shadow-md">
                {pageContent?.welcome?.content.description || 
                  "Los Misioneros del Sagrado Corazón de Jesús (MSC) te invitan a ser parte de nuestra comunidad parroquial. Aquí encontrarás un espacio de fe, oración y servicio al prójimo."}
              </p>

              <div className="relative mt-6 max-w-xs mx-auto">
                <Image
                  src={pageContent?.welcome?.image_url || "/images/about/principal.jpg"}
                  alt="Parroquia ICM"
                  width={400}
                  height={400}
                  className="w-full h-auto rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Sección de Donaciones */}
        {donationInfo && donationInfo.is_active && (
          <section className="py-12 bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="container mx-auto px-4">
              <SectionHeading 
                title={donationInfo.title} 
                subtitle={donationInfo.subtitle} 
                centered 
              />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12 max-w-6xl mx-auto">
                {/* Card de Propósito */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative h-64 bg-gradient-to-br from-blue-600 to-indigo-700">
                    {donationInfo.purpose_image_url ? (
                      <Image 
                        src={donationInfo.purpose_image_url} 
                        alt="Propósito de donaciones" 
                        fill 
                        className="object-cover opacity-80"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-32 h-32 text-white/30" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {donationInfo.purpose_title || 'Tu Apoyo Marca la Diferencia'}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {donationInfo.purpose_description || 
                        'Tus donaciones nos permiten continuar con nuestra misión pastoral, mantener los servicios religiosos y apoyar a nuestra comunidad.'}
                    </p>
                  </div>
                </div>

                {/* Card de Datos Bancarios */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl font-bold">Datos Bancarios</h3>
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <p className="text-blue-100">Realiza tu donación de forma segura</p>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    {/* Banco */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-blue-900 mb-1">Banco</p>
                      <p className="text-2xl font-bold text-blue-700">{donationInfo.bank_name}</p>
                    </div>

                    {/* Número de Cuenta */}
                    <div className="border-l-4 border-blue-500 pl-4">
                      <p className="text-sm text-gray-600 mb-1">{donationInfo.account_type}</p>
                      <p className="text-xl font-mono font-bold text-gray-900">{donationInfo.account_number}</p>
                    </div>

                    {/* CCI */}
                    <div className="border-l-4 border-indigo-500 pl-4">
                      <p className="text-sm text-gray-600 mb-1">CCI (Código Interbancario)</p>
                      <p className="text-xl font-mono font-bold text-gray-900">{donationInfo.cci}</p>
                    </div>

                    {/* Titular */}
                    <div className="bg-gray-50 rounded-lg p-4 mt-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Titular de la cuenta</p>
                      <p className="text-lg font-semibold text-gray-900">{donationInfo.account_holder}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <SectionHeading title="Estamos para lo que necesites" subtitle="" centered />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                  link={service.link_url}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <SectionHeading title="Síguenos" subtitle="En redes sociales" centered />
            <div className="mt-12">
              <SocialMediaSection />
            </div>
          </div>
        </section>

        <section className="relative py-24 overflow-hidden">
          {/* Fondo con Parallax */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/bg/gallery-bg.jpg"
              alt="Galería de fotos"
              fill
              className="object-cover"
              style={{ transform: 'scale(1.1)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80" />
          </div>

          {/* Contenido */}
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="backdrop-blur-sm bg-white/5 rounded-3xl p-12 max-w-4xl mx-auto border border-white/10">
              <SectionHeading title="Galería de Fotos" subtitle="Nuestros momentos" centered light />
              <p className="text-lg text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
                Revive los mejores momentos de nuestra comunidad parroquial a través
                de nuestra galería fotográfica.
              </p>
              <Link 
                href="/galeria" 
                className="inline-flex items-center justify-center border-2 border-white text-white bg-transparent hover:bg-white hover:text-gray-900 transition-all duration-300 px-8 py-3 text-lg font-semibold rounded-full hover:scale-105 active:scale-95"
              >
                Ver Galería
              </Link>
            </div>
          </div>

          {/* Decoración adicional */}
          <div className="absolute top-10 left-10 w-20 h-20 border-4 border-white/20 rounded-full" />
          <div className="absolute bottom-10 right-10 w-32 h-32 border-4 border-white/10 rounded-full" />
        </section>

        <section className="py-16 bg-gradient-to-r from-primary to-primary-dark">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {pageContent?.pastoralJuvenil?.content.title || "Pastoral Juvenil"}
                </h2>
                <p className="text-lg mb-6 opacity-90">
                  {pageContent?.pastoralJuvenil?.content.description || 
                    "Un espacio para jóvenes donde compartimos nuestra fe, realizamos actividades de formación y servicio, y construimos una comunidad de amistad en Cristo."}
                </p>
                
                {/* Redes Sociales */}
                <div className="flex gap-4">
                  <a
                    href="https://www.instagram.com/pjvc.aqp?igshid=1ufwoqa78jqdv"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
                    aria-label="Instagram"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  
                  <a
                    href="https://www.facebook.com/pastoraljuvenilvocacionalclaretianaAqp/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
                    aria-label="Facebook"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  
                  <a
                    href="https://www.tiktok.com/@pjvc.aqp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center w-12 h-12 rounded-full bg-black text-white hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
                    aria-label="TikTok"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  </a>
                </div>
              </div>
              <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-xl">
                <Image
                  src={pageContent?.pastoralJuvenil?.image_url || "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600"}
                  alt="Pastoral Juvenil"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1 relative h-64 md:h-80 rounded-lg overflow-hidden shadow-xl">
                <Image
                  src={"/images/home/misioneros.jpg"}
                  alt="Provincia Perú-Bolivia MSC"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
                  {pageContent?.msc?.content.title || "Provincia Perú - Bolivia"}
                </h2>
                <h3 className="text-xl text-primary mb-4">
                  {pageContent?.msc?.content.subtitle || "Misioneros del Sagrado Corazón de Jesús"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {pageContent?.msc?.content.description || 
                    "Somos parte de la Congregación de los Misioneros del Sagrado Corazón de Jesús (MSC), fundada por el P. Julio Chevalier en Francia en 1854. Nuestra misión es llevar el amor del Corazón de Jesús a todos los pueblos."}
                </p>
                <Button href={pageContent?.msc?.content.buttonUrl || EXTERNAL_LINKS.peruBolivia.website} variant="primary" external>
                  {pageContent?.msc?.content.buttonText || "Conoce más sobre los MSC"}
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <SectionHeading title="Páginas de Interés" subtitle="Recursos adicionales" centered />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {interestPages.map((page) => (
                <Link
                  key={page.id}
                  href={page.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative h-40 rounded-lg overflow-hidden shadow-lg"
                >
                  <Image 
                    src={page.image_url} 
                    alt={page.title} 
                    fill 
                    className="object-cover transition-transform duration-300 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="px-8 text-white font-semibold text-lg">{page.title}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
