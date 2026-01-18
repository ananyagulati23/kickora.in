// SEO Component for Meta Tags and Structured Data
import React from 'react';

const SEO = ({ 
  title = 'Kickora - Book Your Football Match', 
  description = 'Join football matches in your city. Book slots, find players, and enjoy the beautiful game with Kickora.',
  keywords = 'football, booking, sports, matches, kickora, soccer',
  image = '/og-image.jpg',
  url = 'https://kickora.com',
  type = 'website',
  structuredData = null
}) => {
  React.useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update meta tags
    const metaTags = {
      description,
      keywords,
      'og:title': title,
      'og:description': description,
      'og:image': image,
      'og:url': url,
      'og:type': type,
      'twitter:card': 'summary_large_image',
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': image,
    };

    Object.entries(metaTags).forEach(([key, value]) => {
      const attribute = key.startsWith('og:') || key.startsWith('twitter:') ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${key}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, key);
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', value);
    });

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    // Add structured data if provided
    if (structuredData) {
      let script = document.querySelector('script[type="application/ld+json"]');
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }
  }, [title, description, keywords, image, url, type, structuredData]);

  return null;
};

export default SEO;
