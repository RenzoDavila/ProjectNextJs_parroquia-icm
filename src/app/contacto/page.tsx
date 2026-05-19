import PublicLayout from "@/components/layout/PublicLayout";
import ContactForm from "@/components/ui/ContactForm";
import { getSiteConfig } from "@/lib/db/site-config";

export const revalidate = 300; // ISR cache de 5 minutos

export default async function ContactoPage() {
  const { siteConfig } = await getSiteConfig();

  return (
    <PublicLayout>
      <ContactForm
        siteConfig={{
          phone: siteConfig.phone,
          email: siteConfig.email,
          address: siteConfig.address,
        }}
      />
    </PublicLayout>
  );
}
