"use client";

import { useState, useEffect } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import SectionHeading from "@/components/ui/SectionHeading";
import { Clock, User, Church } from "lucide-react";

type MassTime = {
  id: number;
  day_type: string;
  time: string;
  location: string;
  is_active: boolean;
  display_order: number;
};

type MassSchedules = {
  weekdays: MassTime[];
  saturdays: MassTime[];
  sundays: MassTime[];
};

const confessionSchedule = [
  { day: "Lunes a Viernes", time: "6:30 a.m. - 7:00 a.m. y 8:30 a.m. - 9:00 a.m." },
  { day: "Lunes a Viernes", time: "6:30 p.m. - 7:00 p.m." },
  { day: "Sábados", time: "5:00 p.m. - 6:00 p.m." },
];

const officeHours = {
  weekdays: {
    morning: { start: "8:00 a.m.", end: "12:30 p.m." },
    afternoon: { start: "4:00 p.m.", end: "6:30 p.m." },
  },
  saturdays: {
    morning: { start: "9:00 a.m.", end: "12:00 m." },
  },
};

const pastorSchedule = [
  { day: "Lunes a Viernes", time: "10:00 a.m. - 12:00 p.m." },
  { day: "Lunes a Viernes", time: "5:00 p.m. - 6:00 p.m." },
];

const vicarSchedule = [
  { day: "Lunes a Viernes", time: "9:00 a.m. - 11:00 a.m." },
  { day: "Lunes a Viernes", time: "4:00 p.m. - 5:30 p.m." },
];

export default function HorariosPage() {
  const [massSchedules, setMassSchedules] = useState<MassSchedules>({
    weekdays: [],
    saturdays: [],
    sundays: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await fetch('/api/schedules');
      const data = await response.json();
      if (data.success) {
        setMassSchedules(data.data);
      }
    } catch (error) {
      console.error('Error al cargar horarios:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PublicLayout>
      {/* Hero Banner */}
      <section 
        className="relative h-[300px] md:h-[400px] bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1548690595-90c53c39a7e4?q=80&w=2000')",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Horarios</h1>
            <p className="text-lg md:text-xl">Misas, Secretaría y Atención Pastoral</p>
          </div>
        </div>
      </section>

      {/* Mass Schedule Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Horarios de Misas"
            subtitle="Celebraciones Eucarísticas"
          />
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002F57] mx-auto"></div>
                <p className="mt-4 text-gray-600">Cargando horarios...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Lunes a Viernes */}
              <div className="bg-gray-50 rounded-lg p-6 shadow-lg">
                <div className="flex items-center mb-6">
                  <Clock className="w-8 h-8 text-[#002F57] mr-3" />
                  <h3 className="text-xl font-bold text-[#002F57]">Lunes a Viernes</h3>
                </div>
                
                <div className="space-y-3">
                  {massSchedules.weekdays.length > 0 ? (
                    massSchedules.weekdays.map((mass) => (
                      <div key={mass.id} className="bg-white rounded-lg p-4 border-l-4 border-[#49AE9C]">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[#002F57] text-lg">{mass.time}</span>
                          <Church className="w-4 h-4 text-gray-400" />
                        </div>
                        <span className="text-xs text-gray-500 mt-1 block">{mass.location}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No hay horarios disponibles</p>
                  )}
                </div>
              </div>
              
              {/* Sábados */}
              <div className="bg-gray-50 rounded-lg p-6 shadow-lg">
                <div className="flex items-center mb-6">
                  <Clock className="w-8 h-8 text-[#002F57] mr-3" />
                  <h3 className="text-xl font-bold text-[#002F57]">Sábados</h3>
                </div>
                
                <div className="space-y-3">
                  {massSchedules.saturdays.length > 0 ? (
                    massSchedules.saturdays.map((mass) => (
                      <div key={mass.id} className="bg-white rounded-lg p-4 border-l-4 border-[#49AE9C]">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[#002F57] text-lg">{mass.time}</span>
                          <Church className="w-4 h-4 text-gray-400" />
                        </div>
                        <span className="text-xs text-gray-500 mt-1 block">{mass.location}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No hay horarios disponibles</p>
                  )}
                </div>
              </div>
              
              {/* Domingos */}
              <div className="bg-gray-50 rounded-lg p-6 shadow-lg">
                <div className="flex items-center mb-6">
                  <Clock className="w-8 h-8 text-[#002F57] mr-3" />
                  <h3 className="text-xl font-bold text-[#002F57]">Domingos y Feriados</h3>
                </div>
                
                <div className="space-y-3">
                  {massSchedules.sundays.length > 0 ? (
                    massSchedules.sundays.map((mass) => (
                      <div key={mass.id} className="bg-white rounded-lg p-4 border-l-4 border-[#49AE9C]">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[#002F57] text-lg">{mass.time}</span>
                          <Church className="w-4 h-4 text-gray-400" />
                        </div>
                        <span className="text-xs text-gray-500 mt-1 block">{mass.location}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No hay horarios disponibles</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Confession Schedule */}
      <section className="py-16 bg-[#002F57]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Horarios de Confesión"
            titleColor="text-[#6DFFE5]"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {confessionSchedule.map((schedule, idx) => (
              <div 
                key={`confession-${schedule.day}-${idx}`}
                className="bg-white/10 rounded-lg p-6 text-center backdrop-blur-sm"
              >
                <h4 className="text-[#6DFFE5] font-semibold mb-2">{schedule.day}</h4>
                <p className="text-white">{schedule.time}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Office Hours */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Horarios de Secretaría"
            subtitle="Atención administrativa"
          />
          
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-6 border-b md:border-b-0 md:border-r border-gray-200">
                  <h4 className="text-xl font-semibold text-[#002F57] mb-4">Lunes a Viernes</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Mañanas:</span>
                      <span className="font-semibold text-[#002F57]">
                        {officeHours.weekdays.morning.start} - {officeHours.weekdays.morning.end}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Tardes:</span>
                      <span className="font-semibold text-[#002F57]">
                        {officeHours.weekdays.afternoon.start} - {officeHours.weekdays.afternoon.end}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-semibold text-[#002F57] mb-4">Sábados</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Mañanas:</span>
                      <span className="font-semibold text-[#002F57]">
                        {officeHours.saturdays.morning.start} - {officeHours.saturdays.morning.end}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pastoral Attention */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Atención Pastoral"
            subtitle="Horarios de atención de los sacerdotes"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Pastor */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <User className="w-8 h-8 text-[#002F57] mr-3" />
                <h3 className="text-xl font-bold text-[#002F57]">Párroco</h3>
              </div>
              <div className="space-y-3">
                {pastorSchedule.map((schedule, idx) => (
                  <div key={`pastor-${schedule.day}-${idx}`} className="flex justify-between items-center">
                    <span className="text-gray-600">{schedule.day}:</span>
                    <span className="font-semibold text-[#002F57]">{schedule.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Vicar */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <User className="w-8 h-8 text-[#002F57] mr-3" />
                <h3 className="text-xl font-bold text-[#002F57]">Vicario Parroquial</h3>
              </div>
              <div className="space-y-3">
                {vicarSchedule.map((schedule, idx) => (
                  <div key={`vicar-${schedule.day}-${idx}`} className="flex justify-between items-center">
                    <span className="text-gray-600">{schedule.day}:</span>
                    <span className="font-semibold text-[#002F57]">{schedule.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Note */}
      <section className="py-8 bg-[#49AE9C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white text-lg">
            <strong>Nota:</strong> Los horarios pueden variar en días festivos y celebraciones especiales. 
            Consulte nuestra página de Facebook o llámenos para confirmar.
          </p>
        </div>
      </section>
    </PublicLayout>
  );
}
