import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface InfoCardProps {
  image: string;
  title: string;
  description?: string;
  link?: string;
  linkText?: string;
}

export default function InfoCard({
  image,
  title,
  description,
  link,
  linkText = "Más información",
}: InfoCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative h-48 w-full">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#002F57] mb-2">{title}</h3>
        {description && (
          <p className="text-gray-600 text-sm mb-4">{description}</p>
        )}
        {link && (
          <Link
            href={link}
            className="inline-flex items-center text-[#49AE9C] hover:text-[#3d9585] font-medium transition-colors"
          >
            {linkText}
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        )}
      </div>
    </div>
  );
}
