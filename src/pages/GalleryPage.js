// Page-level Components - Gallery Page
import React from 'react';
import SEO from '../components/common/SEO';
import Gallery from '../components/Gallery';
import Footer from '../components/Footer';

const GalleryPage = () => {
  return (
    <>
      <SEO
        title="Football Gallery - Kickora"
        description="Explore photos and moments from our football matches. See the action, passion, and community spirit of Kickora players."
        keywords="football gallery, match photos, kickora images, sports photography"
        url="https://kickora.com/gallery"
      />
      <Gallery />
      <Footer />
    </>
  );
};

export default GalleryPage;
