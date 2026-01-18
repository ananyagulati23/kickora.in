// Structured Data Schemas for SEO
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "SportsOrganization",
  "name": "Kickora",
  "description": "Football match booking platform",
  "url": "https://kickora.com",
  "logo": "https://kickora.com/logo.png",
  "sameAs": [
    "https://facebook.com/kickora",
    "https://twitter.com/kickora",
    "https://instagram.com/kickora"
  ]
};

export const createEventSchema = (match) => ({
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  "name": match.name || "Football Match",
  "description": match.description,
  "startDate": match.date,
  "location": {
    "@type": "Place",
    "name": match.location,
    "address": match.address
  },
  "offers": {
    "@type": "Offer",
    "url": `https://kickora.com/matches/${match.id}`,
    "price": match.price,
    "priceCurrency": "INR",
    "availability": "https://schema.org/InStock"
  },
  "organizer": organizationSchema
});

export const createBreadcrumbSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});
