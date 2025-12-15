import { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "accent" | "outline" | "outline-light" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  external?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  external = false,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  const baseStyles = "group relative inline-flex items-center justify-center font-semibold rounded-full transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#49AE9C]/50 overflow-hidden";
  
  const variantStyles = {
    primary: "bg-gradient-to-r from-[#49AE9C] to-[#3d9585] text-white hover:from-[#3d9585] hover:to-[#2d7a6b] hover:shadow-lg hover:shadow-[#49AE9C]/30",
    secondary: "bg-gradient-to-r from-[#002F57] to-[#003d6d] text-white hover:from-[#003d6d] hover:to-[#004a80] hover:shadow-lg hover:shadow-[#002F57]/30",
    accent: "bg-gradient-to-r from-[#B35C00] to-[#d97706] text-white hover:from-[#d97706] hover:to-[#f59e0b] hover:shadow-lg hover:shadow-[#B35C00]/30",
    outline: "border-2 border-[#002F57] text-[#002F57] bg-transparent hover:bg-[#002F57] hover:text-white hover:shadow-lg",
    "outline-light": "border-2 border-white text-white bg-transparent hover:bg-white hover:text-gray-900 hover:shadow-lg",
    ghost: "text-[#002F57] hover:bg-[#002F57]/10",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={combinedStyles}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={combinedStyles}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={combinedStyles} {...props}>
      {children}
    </button>
  );
}
