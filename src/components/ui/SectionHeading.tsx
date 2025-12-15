interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  titleColor?: string;
  subtitleColor?: string;
  centered?: boolean;
  light?: boolean;
}

export default function SectionHeading({
  title,
  subtitle,
  titleColor,
  subtitleColor,
  centered = true,
  light = false,
}: SectionHeadingProps) {
  const defaultTitleColor = light ? "text-white" : "text-[#002F57]";
  const defaultSubtitleColor = light ? "text-white" : "text-[#002F57]";
  
  return (
    <div className={`mb-8 ${centered ? "text-center" : ""}`}>
      <h2 className={`text-3xl md:text-4xl font-bold ${titleColor || defaultTitleColor}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-2 text-lg ${subtitleColor || defaultSubtitleColor}`}>{subtitle}</p>
      )}
    </div>
  );
}
