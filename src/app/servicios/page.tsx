import { Metadata } from "next";
import Link from "next/link";
import PublicLayout from "@/components/layout/PublicLayout";
import SectionHeading from "@/components/ui/SectionHeading";
import { FileText, Heart, Cross, Users, Calendar, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Servicios",
  description: "Servicios sacramentales de la parroquia: Bautismo y Matrimonio",
};

const baptismTypes = [
  {
    id: "ninos",
    title: "Bautismo de Niños",
    subtitle: "(0 a 6 años)",
    icon: Heart,
    description: "Sacramento de iniciación cristiana para los más pequeños.",
    requirements: [
      "Partida de nacimiento del niño (original y copia)",
      "DNI de los padres y padrinos (copia)",
      "Constancia de charla pre-bautismal de los padres y padrinos",
      "Partida de matrimonio eclesiástico de los padres (si aplica)",
    ],
    notes: [
      "Las charlas pre-bautismales se realizan el primer sábado de cada mes",
      "Los padrinos deben ser católicos, bautizados y confirmados",
      "Se solicita un ofrecimiento voluntario para el mantenimiento de la parroquia",
    ],
  },
  {
    id: "mayores",
    title: "Bautismo de Mayores",
    subtitle: "(7 años en adelante)",
    icon: Users,
    description: "Sacramento de iniciación cristiana para niños mayores, jóvenes y adultos.",
    requirements: [
      "Partida de nacimiento (original y copia)",
      "DNI del solicitante (copia)",
      "DNI de los padrinos (copia)",
      "Certificado de catequesis (proporcionado por la parroquia)",
      "2 fotografías tamaño carné",
    ],
    notes: [
      "Se requiere un proceso de catequesis previo",
      "La duración del proceso depende de la edad del candidato",
      "Para adultos, se prepara junto con los sacramentos de Confirmación y Eucaristía",
    ],
  },
  {
    id: "emergencia",
    title: "Bautismo de Emergencia",
    subtitle: "(Casos especiales)",
    icon: Cross,
    description: "Sacramento administrado en casos de peligro de muerte.",
    requirements: [
      "Comunicarse inmediatamente con la parroquia",
      "Certificado médico que acredite el estado de salud",
      "Datos del solicitante y padrinos",
    ],
    notes: [
      "Disponible las 24 horas del día",
      "Contactar al párroco o vicario de turno",
      "La regularización del sacramento se hace posteriormente",
    ],
  },
];

const marriageTypes = [
  {
    id: "ordinario",
    title: "Matrimonio Ordinario",
    subtitle: "Proceso regular",
    icon: Heart,
    description: "Celebración del sacramento del matrimonio con preparación completa.",
    requirements: [
      "Partida de bautismo de ambos contrayentes (actualizada, máximo 6 meses)",
      "DNI de ambos contrayentes (copia)",
      "Partida de nacimiento de ambos (original y copia)",
      "Certificado de confirmación de ambos",
      "Constancia de charlas pre-matrimoniales",
      "Declaración jurada de soltería ante notario",
      "2 testigos con DNI",
      "Recibo de amonestaciones publicadas",
    ],
    notes: [
      "El trámite debe iniciarse con 3 meses de anticipación",
      "Las charlas pre-matrimoniales duran aproximadamente 2 meses",
      "Se requiere entrevista con el párroco",
    ],
  },
  {
    id: "regularizacion",
    title: "Regularización de Matrimonio",
    subtitle: "Convalidación",
    icon: FileText,
    description: "Para parejas que desean regularizar su unión civil ante la Iglesia.",
    requirements: [
      "Partida de matrimonio civil (original)",
      "Partida de bautismo de ambos (actualizada)",
      "DNI de ambos contrayentes (copia)",
      "Certificado de confirmación de ambos",
      "Constancia de charlas pre-matrimoniales",
      "2 testigos con DNI",
    ],
    notes: [
      "Proceso más abreviado que el matrimonio ordinario",
      "Se requiere constancia de la celebración civil",
      "Entrevista con el párroco para evaluar el caso",
    ],
  },
];

export default function ServiciosPage() {
  return (
    <PublicLayout>
      {/* Hero Banner */}
      <section 
        className="relative h-[300px] md:h-[400px] bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=2000')",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Servicios Sacramentales</h1>
            <p className="text-lg md:text-xl">Bautismo y Matrimonio</p>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg text-gray-600">
            Los sacramentos son signos eficaces de la gracia, instituidos por Cristo y confiados a la Iglesia. 
            A través de ellos, se nos confiere la vida divina. Aquí encontrarás información sobre los servicios 
            sacramentales que ofrecemos en nuestra parroquia.
          </p>
        </div>
      </section>

      {/* Baptism Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Sacramento del Bautismo"
            subtitle="Puerta de entrada a la vida cristiana"
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {baptismTypes.map((baptism) => {
              const IconComponent = baptism.icon;
              return (
                <div 
                  key={baptism.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:-translate-y-1"
                >
                  <div className="bg-[#002F57] p-6 text-white text-center">
                    <IconComponent className="w-12 h-12 mx-auto mb-3" />
                    <h3 className="text-xl font-bold">{baptism.title}</h3>
                    <p className="text-[#6DFFE5] text-sm">{baptism.subtitle}</p>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-4">{baptism.description}</p>
                    
                    <h4 className="font-semibold text-[#002F57] mb-3 flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Requisitos
                    </h4>
                    <ul className="space-y-2 mb-4">
                      {baptism.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 mr-2 text-[#49AE9C] flex-shrink-0 mt-0.5" />
                          {req}
                        </li>
                      ))}
                    </ul>
                    
                    <h4 className="font-semibold text-[#002F57] mb-3 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Notas importantes
                    </h4>
                    <ul className="space-y-2">
                      {baptism.notes.map((note, idx) => (
                        <li key={idx} className="text-sm text-gray-500 italic">
                          • {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Marriage Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Sacramento del Matrimonio"
            subtitle="Unión sagrada ante Dios"
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {marriageTypes.map((marriage) => {
              const IconComponent = marriage.icon;
              return (
                <div 
                  key={marriage.id}
                  className="bg-gray-50 rounded-lg shadow-lg overflow-hidden transition-transform hover:-translate-y-1"
                >
                  <div className="bg-[#49AE9C] p-6 text-white">
                    <div className="flex items-center">
                      <IconComponent className="w-10 h-10 mr-4" />
                      <div>
                        <h3 className="text-xl font-bold">{marriage.title}</h3>
                        <p className="text-white/80 text-sm">{marriage.subtitle}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-4">{marriage.description}</p>
                    
                    <h4 className="font-semibold text-[#002F57] mb-3 flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Requisitos
                    </h4>
                    <ul className="space-y-2 mb-4">
                      {marriage.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 mr-2 text-[#49AE9C] flex-shrink-0 mt-0.5" />
                          {req}
                        </li>
                      ))}
                    </ul>
                    
                    <h4 className="font-semibold text-[#002F57] mb-3 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Notas importantes
                    </h4>
                    <ul className="space-y-2">
                      {marriage.notes.map((note, idx) => (
                        <li key={idx} className="text-sm text-gray-500 italic">
                          • {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#002F57]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">¿Necesitas más información?</h2>
          <p className="text-gray-300 mb-8">
            Si tienes dudas sobre los requisitos o el proceso para alguno de nuestros servicios sacramentales, 
            no dudes en contactarnos. Estamos aquí para ayudarte.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contacto"
              className="px-8 py-3 bg-[#6DFFE5] text-[#002F57] font-semibold rounded-lg hover:bg-[#5ee8cf] transition-colors"
            >
              Contáctanos
            </Link>
            <Link 
              href="/horarios"
              className="px-8 py-3 border-2 border-[#6DFFE5] text-[#6DFFE5] font-semibold rounded-lg hover:bg-[#6DFFE5] hover:text-[#002F57] transition-colors"
            >
              Ver Horarios
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
