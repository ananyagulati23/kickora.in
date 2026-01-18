// Page-level Components - Matches Page
import React from 'react';
import SEO from '../components/common/SEO';
import Matches from '../components/Matches';
import { createBreadcrumbSchema } from '../utils/structuredData';

const MatchesPage = ({ onBook, isAdmin, onUpdateMatch, isLoggedIn, onCancelBooking, getUserBookings, isUserBooked }) => {
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', url: 'https://kickora.com' },
    { name: 'Matches', url: 'https://kickora.com/matches' }
  ]);

  return (
    <>
      <SEO
        title="Available Football Matches - Kickora"
        description="Browse and book available football matches in your area. Find the perfect game that matches your schedule and skill level."
        keywords="football matches, available games, book football, sports events, kickora matches"
        url="https://kickora.com/matches"
        structuredData={breadcrumbSchema}
      />
      <Matches 
        onBook={onBook}
        isAdmin={isAdmin}
        onUpdateMatch={onUpdateMatch}
        isLoggedIn={isLoggedIn}
        onCancelBooking={onCancelBooking}
        getUserBookings={getUserBookings}
        isUserBooked={isUserBooked}
      />
    </>
  );
};

export default MatchesPage;
