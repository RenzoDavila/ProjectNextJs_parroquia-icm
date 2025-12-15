import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function PublicLayout({
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
