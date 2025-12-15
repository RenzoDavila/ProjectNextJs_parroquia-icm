'use client';

import { useState, useEffect } from 'react';
import PublicLayout from "@/components/layout/PublicLayout";
import SectionHeading from "@/components/ui/SectionHeading";
import { Clock, MapPin, Phone, Mail, X } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

type TeamMember = {
  id: number;
  name: string;
  role: string;
  bio: string | null;
  image_url: string;
  email: string | null;
  phone: string | null;
  display_order: number;
  is_active: boolean;
};

type ParishGroup = {
  id: number;
  name: string;
  description: string;
  meeting_day: string;
  meeting_time: string;
  contact_person: string | null;
  contact_phone: string | null;
  is_active: boolean;
};

export default function NosotrosPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [parishGroups, setParishGroups] = useState<ParishGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch team members
        const teamResponse = await fetch('/api/team');
        const teamData = await teamResponse.json();
        if (teamData.success) {
          setTeamMembers(teamData.data || []);
        }

        // Fetch parish groups
        const groupsResponse = await fetch('/api/parish-groups');
        const groupsData = await groupsResponse.json();
        if (groupsData.success) {
          setParishGroups(groupsData.data || []);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <PublicLayout>
      {/* Hero Banner */}
      <section 
        className="relative h-[300px] md:h-[400px] bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1548625149-fc4a29cf7092?q=80&w=2000')",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Nosotros</h1>
            <p className="text-lg md:text-xl">Parroquia del Inmaculado Corazón de María</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#002F57] mb-6">
                Parroquia Del Inmaculado Corazón de María
              </h2>
              
              {/* Office Hours */}
              <div className="mb-8">
                <div className="flex items-center text-[#002F57] mb-4">
                  <Clock className="w-5 h-5 mr-2" />
                  <h3 className="font-semibold text-lg">Horarios de Secretaría:</h3>
                </div>
                <div className="ml-7 text-gray-600">
                  <p className="font-semibold">Lunes a Viernes:</p>
                  <p>Mañanas: 8:00 a.m. / 12:30 p.m.</p>
                  <p>Tardes: 4:00 p.m. / 6:30 p.m.</p>
                  <p className="font-semibold mt-2">Sábados:</p>
                  <p>Mañanas: 9:00 a.m. / 12:00 m.</p>
                </div>
              </div>

              {/* Location */}
              <div className="mb-8">
                <div className="flex items-center text-[#002F57] mb-4">
                  <MapPin className="w-5 h-5 mr-2" />
                  <h3 className="font-semibold text-lg">Dirección:</h3>
                </div>
                <div className="ml-7 text-gray-600">
                  <p>{SITE_CONFIG.address}</p>
                </div>
              </div>

              {/* Contact */}
              <div className="flex items-center space-x-6">
                <a 
                  href={`tel:${SITE_CONFIG.phone}`}
                  className="flex items-center text-gray-600 hover:text-[#002F57] transition-colors"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  {SITE_CONFIG.phone}
                </a>
                <a 
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="flex items-center text-gray-600 hover:text-[#002F57] transition-colors"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  {SITE_CONFIG.email}
                </a>
              </div>
            </div>
            <div className="relative h-80 lg:h-[400px] rounded-lg overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=800"
                alt="Parroquia"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Directorio"
            subtitle="Conoce a nuestro equipo pastoral"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              <div className="col-span-full text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002F57] mx-auto"></div>
                <p className="mt-4 text-gray-600">Cargando equipo...</p>
              </div>
            ) : teamMembers.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-600">
                No hay miembros del equipo para mostrar
              </div>
            ) : (
              teamMembers.map((member) => (
                <div 
                  key={member.id}
                  onClick={() => setSelectedMember(member)}
                  className="bg-white rounded-lg shadow-lg overflow-hidden text-center p-6 transition-transform hover:-translate-y-1 cursor-pointer"
                >
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                    <img
                      src={member.image_url}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-[#002F57]">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Modal de detalles del miembro */}
      {selectedMember && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedMember(null)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-[#002F57] to-[#004080] text-white p-6">
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4">
                  <img
                    src={selectedMember.image_url}
                    alt={selectedMember.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-2xl font-bold">{selectedMember.name}</h2>
                <p className="text-[#6DFFE5] font-semibold mt-1">{selectedMember.role}</p>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Biografía */}
              {selectedMember.bio && (
                <div>
                  <h3 className="text-lg font-semibold text-[#002F57] mb-2">Biografía</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedMember.bio}</p>
                </div>
              )}

              {/* Información de contacto */}
              <div>
                <h3 className="text-lg font-semibold text-[#002F57] mb-3">Información de Contacto</h3>
                <div className="space-y-3">
                  {selectedMember.email && (
                    <a 
                      href={`mailto:${selectedMember.email}`}
                      className="flex items-center text-gray-600 hover:text-[#002F57] transition-colors group"
                    >
                      <div className="w-10 h-10 bg-[#002F57] group-hover:bg-[#004080] rounded-full flex items-center justify-center mr-3 transition-colors">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <span>{selectedMember.email}</span>
                    </a>
                  )}
                  
                  {selectedMember.phone && (
                    <a 
                      href={`tel:${selectedMember.phone}`}
                      className="flex items-center text-gray-600 hover:text-[#002F57] transition-colors group"
                    >
                      <div className="w-10 h-10 bg-[#002F57] group-hover:bg-[#004080] rounded-full flex items-center justify-center mr-3 transition-colors">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <span>{selectedMember.phone}</span>
                    </a>
                  )}

                  {!selectedMember.email && !selectedMember.phone && (
                    <p className="text-gray-500 italic">No hay información de contacto disponible</p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end border-t">
              <button
                onClick={() => setSelectedMember(null)}
                className="px-6 py-2 bg-[#002F57] text-white rounded-lg hover:bg-[#004080] transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mission & Identity Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Identidad / Misión / Espiritualidad"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-[#002F57] rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#002F57] mb-3">Identidad</h3>
              <p className="text-gray-600">
                Somos una parroquia con el carisma de San Antonio María Claret y el amor filial al Inmaculado Corazón de María.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-[#002F57] rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#002F57] mb-3">Misión</h3>
              <p className="text-gray-600">
                Amar y servir a Dios y al prójimo por todos los medios posibles.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-[#002F57] rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#002F57] mb-3">Espiritualidad</h3>
              <p className="text-gray-600">
                Desarrollamos con especial esmero la dimensión teologal y mística de nuestra vocación misionera.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Parish Groups Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Grupos Parroquiales"
            subtitle="Únete a nuestra comunidad"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              <div className="col-span-full text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002F57] mx-auto"></div>
                <p className="mt-4 text-gray-600">Cargando grupos...</p>
              </div>
            ) : parishGroups.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-600">
                No hay grupos parroquiales para mostrar
              </div>
            ) : (
              parishGroups.map((group) => (
                <div 
                  key={group.id}
                  className="bg-white rounded-lg shadow-lg p-6 transition-transform hover:-translate-y-1"
                >
                  <h3 className="text-lg font-semibold text-[#002F57] mb-3">{group.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{group.description}</p>
                  <div className="flex items-center text-sm text-[#49AE9C]">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Reunión: {group.meeting_day} a las {group.meeting_time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#002F57] mb-6">Un poco de historia</h2>
              <p className="text-gray-600 mb-4">
                Fundada en 1949, en la Arquidiócesis de Arequipa. La misión principal de la comunidad es el servicio pastoral en la parroquia urbana Corazón de María. La pastoral se desarrolla a través de las áreas de evangelización, liturgia, catequesis, grupos parroquiales y pastoral social.
              </p>
              <p className="text-gray-600 mb-4">
                La Parroquia tiene una intensa actividad parroquial en clave de misión. Está bien organizada en comunidades y sectores, servicios parroquiales, asociaciones y grupos comunitarios; en el Consejo parroquial están todos representados.
              </p>
              <p className="text-gray-600">
                Existe un Consejo permanente de cinco miembros que, con el Párroco, organizan la vida cotidiana y los asuntos urgentes de la Comunidad parroquial.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative h-48 rounded-lg overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1548625149-fc4a29cf7092?q=80&w=400"
                  alt="Historia 1"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative h-48 rounded-lg overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=400"
                  alt="Historia 2"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Claretianos Section */}
      <section className="py-16 bg-[#002F57] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Los Claretianos"
            titleColor="text-[#6DFFE5]"
            subtitleColor="text-white"
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold text-[#6DFFE5] mb-4">Un poco de historia</h3>
              <p className="text-gray-300 mb-4">
                La Congregación de los Misioneros Hijos del Inmaculado Corazón de María, popularmente conocidos como Claretianos fue fundada en 1849 por Antonio María Claret, un sacerdote catalán muy preocupado por el anuncio del Evangelio a la gente.
              </p>
              <h3 className="text-xl font-semibold text-[#6DFFE5] mb-4 mt-8">Somos</h3>
              <p className="text-gray-300 mb-4">
                Una congregación religiosa católica. Hemos surgido en la Iglesia para intentar vivir siguiendo a Jesucristo, al estilo de los Apóstoles, con una singular relación con el Corazón de María, a quien reconocemos como Madre y Formadora.
              </p>
              <p className="text-gray-300">
                Llegamos al Perú el día 7 de diciembre de 1909. En 2010 volvimos a unirnos con Bolivia, formando la Provincia de Perú-Bolivia.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#6DFFE5] mb-4">Claretianos en el mundo</h3>
              <p className="text-gray-300 mb-4">
                Desde 1849 nos hemos extendido por los cinco continentes y en la actualidad somos entre hermanos, Diáconos y Presbíteros algo más de 3.000 Misioneros.
              </p>
              <p className="text-gray-300">
                Estamos en más de 63 países, deseamos vivir nuestra condición de cristianos, con su consiguiente dimensión profética, en un mundo marcado en muchos lugares por la pobreza y la desigualdad.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
