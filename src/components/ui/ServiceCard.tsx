import Link from "next/link";
import { Clock, Calendar, Heart, MapPin, Phone, Mail, ArrowRight, Users, Book, Star, Info } from "lucide-react";

type IconType = "clock" | "calendar" | "heart" | "map" | "phone" | "mail" | "users" | "book" | "star" | "info";

interface ServiceCardProps {
  icon: IconType;
  title: string;
  description: string;
  link?: string;
}

const iconMap: Record<IconType, React.ComponentType<{ className?: string }>> = {
  clock: Clock,
  calendar: Calendar,
  heart: Heart,
  map: MapPin,
  phone: Phone,
  mail: Mail,
  users: Users,
  book: Book,
  star: Star,
  info: Info,
};

export default function ServiceCard({ icon, title, description, link }: ServiceCardProps) {
  const IconComponent = iconMap[icon];
  
  const content = (
    <div className="group relative bg-white rounded-2xl shadow-lg p-8 text-center transition-all duration-500 hover:shadow-2xl overflow-hidden h-full flex flex-col">
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#002F57]/5 to-[#49AE9C]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Icon container with animation */}
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-[#002F57] to-[#003d6d] rounded-2xl rotate-180 group-hover:rotate-0 transition-transform duration-500"></div>
        <div className="relative w-full h-full rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-120 transition-all duration-500">
          <IconComponent className="w-10 h-10 text-[#6DFFE5] group-hover:scale-110 transition-transform duration-300" />
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-[#002F57] mb-3 group-hover:text-[#003d6d] transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-600 text-sm mb-6 leading-relaxed flex-grow">
          {description}
        </p>
        {link && (
          <span className="inline-flex items-center justify-center text-[#49AE9C] font-semibold group-hover:text-[#3d9585] transition-colors duration-300 mt-auto">
            Más información
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
          </span>
        )}
      </div>

      {/* Decorative corner */}
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-tl from-[#49AE9C]/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
  );

  if (link) {
    return <Link href={link} className="block h-full">{content}</Link>;
  }

  return content;
}
