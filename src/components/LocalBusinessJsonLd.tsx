import {
  BUSINESS,
  DEFAULT_DESCRIPTION,
  LOCAL_FAQS,
  SERVICE_CITIES,
  SITE_URL,
} from "@/lib/seo";

export default function LocalBusinessJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}/#business`,
        name: BUSINESS.name,
        url: SITE_URL,
        image: `${SITE_URL}/logo-nav-white.jpg`,
        logo: `${SITE_URL}/logo-nav-white.png`,
        telephone: BUSINESS.phone,
        email: BUSINESS.email,
        description: DEFAULT_DESCRIPTION,
        priceRange: BUSINESS.priceRange,
        address: {
          "@type": "PostalAddress",
          addressLocality: BUSINESS.primaryCity,
          addressRegion: BUSINESS.region,
          addressCountry: BUSINESS.country,
        },
        areaServed: SERVICE_CITIES.map((city) => ({
          "@type": "City",
          name: city.name,
          containedInPlace: {
            "@type": "AdministrativeArea",
            name: "San Francisco Bay Area",
          },
        })),
        geo: {
          "@type": "GeoCoordinates",
          latitude: 37.6819,
          longitude: -121.768,
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Power Washing Services",
          itemListElement: [
            "Residential driveway & patio cleaning",
            "Soft wash siding & stucco",
            "HOA & community pressure washing",
            "Deck & fence cleaning",
          ].map((service, index) => ({
            "@type": "Offer",
            position: index + 1,
            itemOffered: {
              "@type": "Service",
              name: service,
              areaServed: "San Francisco Bay Area",
            },
          })),
        },
        sameAs: [SITE_URL],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: BUSINESS.name,
        description: DEFAULT_DESCRIPTION,
        publisher: { "@id": `${SITE_URL}/#business` },
        inLanguage: "en-US",
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: LOCAL_FAQS.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
