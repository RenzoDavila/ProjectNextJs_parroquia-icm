"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

/**
 * Client-only version of PublicLayout for pages that need "use client".
 * Uses fallback constants since DB data can't be fetched in client components.
 * For pages that can be server components, use PublicLayout instead.
 */
export default function ClientPublicLayout({
  children,
  hasHero = false,
}: {
  children: React.ReactNode;
  hasHero?: boolean;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={`flex-grow ${!hasHero ? 'pt-[7.5rem]' : ''}`}>{children}</main>
      <Footer />
    </div>
  );
}
