// Page-level Components - Home Page
import React, { lazy } from 'react';
import SEO from '../components/common/SEO';
import { organizationSchema } from '../utils/structuredData';

const Hero = lazy(() => import('../components/Hero'));
const VisionMission = lazy(() => import('../components/VisionMission'));
const Features = lazy(() => import('../components/Features'));
const BookingForm = lazy(() => import('../components/BookingForm'));
const FAQ = lazy(() => import('../components/FAQ'));
const Footer = lazy(() => import('../components/Footer'));

const HomePage = () => {
  return (
    <>
      <SEO
        title="Kickora - Book Your Football Match | Join Local Football Games"
        description="Discover and book football matches in your city. Connect with players, book slots, and enjoy competitive football with Kickora's easy booking platform."
        keywords="football booking, soccer matches, sports booking, kickora, football near me, book football match"
        url="https://kickora.com"
        structuredData={organizationSchema}
      />
      <div className="App">
        <Hero />
        <VisionMission />
        <Features />
        <BookingForm />
        <FAQ />
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
