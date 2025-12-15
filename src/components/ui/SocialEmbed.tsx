'use client';

import { useSyncExternalStore } from 'react';
import { SOCIAL_LINKS } from '@/lib/constants';

// SVG Icons
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
  </svg>
);

const ExternalLinkIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
  </svg>
);

// Tarjeta de fallback para Firefox
function FallbackCard({ 
  platform, 
  url, 
  title,
  description 
}: { 
  platform: 'facebook' | 'youtube' | 'instagram';
  url: string;
  title: string;
  description: string;
}) {
  const configs = {
    facebook: {
      icon: FacebookIcon,
      gradient: 'from-blue-600 to-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconBg: 'bg-blue-600',
    },
    youtube: {
      icon: YoutubeIcon,
      gradient: 'from-red-600 to-red-700',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconBg: 'bg-red-600',
    },
    instagram: {
      icon: InstagramIcon,
      gradient: 'from-purple-600 via-pink-600 to-orange-500',
      bgColor: 'bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50',
      borderColor: 'border-pink-200',
      iconBg: 'bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500',
    },
  };
  
  const config = configs[platform];
  const Icon = config.icon;
  
  return (
    <a 
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block rounded-xl overflow-hidden shadow-lg border ${config.borderColor} h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}
    >
      <div className={`bg-gradient-to-r ${config.gradient} p-4`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-white font-bold text-lg">{title}</h3>
        </div>
      </div>
      <div className={`${config.bgColor} p-6 flex flex-col items-center justify-center text-center min-h-[200px] md:h-[86%]`}>
        <div className={`w-16 h-16 ${config.iconBg} rounded-full flex items-center justify-center mb-4 shadow-lg`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        <p className="text-gray-600 mb-4 text-sm">{description}</p>
        <span className="inline-flex items-center gap-2 text-gray-700 font-medium">
          Visitar <ExternalLinkIcon className="w-4 h-4" />
        </span>
      </div>
    </a>
  );
}

// Componente de YouTube (siempre visible en todos los navegadores)
function YouTubeEmbed() {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg bg-white">
      {/* Header YouTube */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <YoutubeIcon className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-white font-bold text-lg">YouTube</h3>
        </div>
      </div>
      <div className="flex flex-col h-[450px]">
        <div className="flex-1 p-1">
          <iframe 
            width="100%" 
            height="100%"
            src="https://www.youtube.com/embed/videoseries?list=UU4ixCXfHtD-8Ns88kJdEucA"
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="border-0 rounded"
            title="YouTube - Canal 1"
          />
        </div>
        <div className="flex-1 p-1">
          <iframe 
            width="100%" 
            height="100%"
            src="https://www.youtube.com/embed?listType=playlist&list=UUNZ4QrvoHFv5theSyg5XZaw"
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="border-0 rounded"
            title="YouTube - Canal 2"
          />
        </div>
      </div>
    </div>
  );
}

export function SocialMediaSection() {
  // Detectar Firefox usando useSyncExternalStore para evitar problemas de hidratación
  const isFirefox = useSyncExternalStore(
    () => () => {}, // subscribe - no necesitamos suscripciones
    () => typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().includes('firefox'), // getSnapshot (cliente)
    () => false // getServerSnapshot (servidor)
  );

  // En Firefox, mostrar fallback solo para Instagram y Facebook, pero YouTube siempre con iframe
  if (isFirefox) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FallbackCard
          platform="instagram"
          url={SOCIAL_LINKS.instagram}
          title="Instagram"
          description="Fotos y momentos de nuestra comunidad parroquial"
        />
        <YouTubeEmbed />
        <FallbackCard
          platform="facebook"
          url={SOCIAL_LINKS.facebook}
          title="Facebook"
          description="Síguenos para noticias y eventos de la parroquia"
        />
      </div>
    );
  }

  // En otros navegadores (Chrome, Edge, Safari), mostrar iframes directamente
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Instagram Embed */}
      <div className="rounded-xl overflow-hidden shadow-lg bg-white">
        {/* Header Instagram */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <InstagramIcon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-white font-bold text-lg">Instagram</h3>
          </div>
        </div>
        <iframe 
          width="100%" 
          height="450" 
          src="https://www.instagram.com/picmaqp/embed/" 
          frameBorder="0"
          className="border-0"
          title="Instagram - Parroquia ICM"
        />
      </div>

      {/* YouTube Embeds - Reutilizamos el componente */}
      <YouTubeEmbed />

      {/* Facebook Page Plugin */}
      <div className="rounded-xl overflow-hidden shadow-lg bg-white">
        {/* Header Facebook */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <FacebookIcon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-white font-bold text-lg">Facebook</h3>
          </div>
        </div>
        <iframe
          src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FDel-Inmaculado-Coraz%C3%B3n-de-Mar%C3%ADa-Miraflores-AQP-104673071260189%2F&tabs=timeline&width=340&height=450&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=false&appId=118909448694662"
          width="100%" 
          height="450" 
          style={{ border: 'none', overflow: 'hidden' }} 
          scrolling="no" 
          frameBorder="0"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          title="Facebook - Parroquia ICM"
        />
      </div>
    </div>
  );
}

export default SocialMediaSection;
