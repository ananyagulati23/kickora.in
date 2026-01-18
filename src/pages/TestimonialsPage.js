// Page-level Components - Testimonials Page
import React from 'react';
import SEO from '../components/common/SEO';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

const TestimonialsPage = ({ isLoggedIn, isAdmin, currentUser }) => {
  return (
    <>
      <SEO
        title="Player Testimonials - Kickora"
        description="Read what our community members say about their football experience with Kickora. Join thousands of satisfied players."
        keywords="kickora reviews, testimonials, player feedback, football community"
        url="https://kickora.com/testimonials"
      />
      <Testimonials 
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        currentUser={currentUser}
      />
      <Footer />
    </>
  );
};

export default TestimonialsPage;
