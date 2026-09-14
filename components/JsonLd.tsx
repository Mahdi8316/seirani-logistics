import { siteConfig } from "@/lib/site";
import { getServices, getContact } from "@/lib/content";

/**
 * داده‌ی ساختاریافته‌ی schema.org برای موتورهای جستجو
 * (Organization + WebSite + فهرست خدمات).
 */
export default async function JsonLd() {
  const url = siteConfig.url;
  const services = getServices();
  const contact = getContact();

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${url}/#organization`,
        name: siteConfig.name,
        legalName: siteConfig.legalName,
        url,
        description: siteConfig.description,
        slogan: siteConfig.tagline,
        logo: `${url}/assets/logo.jpg`,
        image: `${url}/og.png`,
        email: contact.email,
        telephone: contact.phoneHref,
        address: {
          "@type": "PostalAddress",
          addressCountry: "IR",
          addressLocality: "تهران",
          streetAddress: contact.address,
        },
        areaServed: [
          { "@type": "Country", name: "ایران" },
          { "@type": "Country", name: "ترکیه" },
          { "@type": "Place", name: "اروپا" },
        ],
        makesOffer: services.map((s) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: s.title,
            description: s.body,
          },
        })),
      },
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        url,
        name: siteConfig.name,
        description: siteConfig.description,
        inLanguage: "fa-IR",
        publisher: { "@id": `${url}/#organization` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // داده‌ی ثابت و کنترل‌شده — تزریق امن.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
