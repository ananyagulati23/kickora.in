import React, { useState, useEffect } from 'react';
import { matchesAPI } from '../services/api';

const Matches = ({ onBook, isAdmin, onUpdateMatch, isLoggedIn, onCancelBooking, getUserBookings, isUserBooked }) => {
  const [matches, setMatches] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingMatch, setEditingMatch] = useState(null);
  const [editForm, setEditForm] = useState({
    time: '',
    location: '',
    price: ''
  });

  // Fetch matches and user bookings on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [matchesData, bookingsData] = await Promise.all([
          matchesAPI.getAll(),
          isLoggedIn ? matchesAPI.getUserBookings() : Promise.resolve([])
        ]);
        setMatches(matchesData);
        setUserBookings(bookingsData);
      } catch (error) {
        setError('Failed to load matches');
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isLoggedIn]);

  const handleEdit = (match) => {
    setEditingMatch(match.id);
    setEditForm({
      time: match.time,
      location: match.location,
      price: match.price || '₹299/player'
    });
  };

  const handleSave = async () => {
    if (editForm.time && editForm.location && editForm.price) {
      try {
        await onUpdateMatch(editingMatch, editForm);
        setEditingMatch(null);
        setEditForm({ time: '', location: '', price: '' });
        // Refresh matches after update
        const updatedMatches = await matchesAPI.getAll();
        setMatches(updatedMatches);
      } catch (error) {
        setError('Failed to update match');
      }
    }
  };

  const handleCancel = () => {
    setEditingMatch(null);
    setEditForm({ time: '', location: '', price: '' });
  };

  const handleBook = async (match) => {
    try {
      await matchesAPI.book(match.id);
      // Refresh matches and bookings after booking
      const [updatedMatches, updatedBookings] = await Promise.all([
        matchesAPI.getAll(),
        matchesAPI.getUserBookings()
      ]);
      setMatches(updatedMatches);
      setUserBookings(updatedBookings);
      onBook(match);
    } catch (error) {
      setError('Failed to book match');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await matchesAPI.cancel(bookingId);
      // Refresh bookings after cancellation
      const updatedBookings = await matchesAPI.getUserBookings();
      setUserBookings(updatedBookings);
      onCancelBooking(bookingId);
    } catch (error) {
      setError('Failed to cancel booking');
    }
  };

  const formatBookingTime = (bookingTime) => {
    const bookingDate = new Date(bookingTime);
    const currentDate = new Date();
    const hoursDifference = (currentDate - bookingDate) / (1000 * 60 * 60);
    
    if (hoursDifference < 1) {
      return `${Math.floor(hoursDifference * 60)} minutes ago`;
    } else if (hoursDifference < 24) {
      return `${Math.floor(hoursDifference)} hours ago`;
    } else {
      return `${Math.floor(hoursDifference / 24)} days ago`;
    }
  };

  const canCancelBooking = (bookingTime) => {
    const bookingDate = new Date(bookingTime);
    const currentDate = new Date();
    const hoursDifference = (currentDate - bookingDate) / (1000 * 60 * 60);
    return hoursDifference <= 24;
  };

  const isUserBookedForMatch = (matchId) => {
    return userBookings.some(booking => booking.match_id === matchId);
  };

  const getUserBookingForMatch = (matchId) => {
    return userBookings.find(booking => booking.match_id === matchId);
  };

  if (isLoading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-cream to-emerald-50 pt-24 pb-16">
        <div className="container-custom">
          <div className="flex items-center justify-center h-64">
            <div className="text-emerald text-xl">Loading matches...</div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-cream to-emerald-50 pt-24 pb-16">
        <div className="container-custom">
          <div className="text-center">
            <div className="text-red-600 text-xl mb-4">{error}</div>
            <button 
              onClick={() => window.location.reload()} 
              className="btn-primary"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-white pt-24 pb-16">
      <div className="container-custom">
        <h2 className="text-3xl md:text-4xl font-bold text-emerald mb-10 text-center">Upcoming Matches This Week</h2>
        
        {/* My Bookings Section */}
        {isLoggedIn && userBookings.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-emerald mb-6 text-center">My Bookings</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userBookings.map((booking) => {
                const match = matches.find(m => m.id === booking.match_id);
                if (!match) return null;
                
                const canCancel = canCancelBooking(booking.booking_time);
                
                return (
                  <div key={booking.id} className="bg-emerald-100 rounded-xl p-4 border-2 border-emerald">
                    <div className="flex justify-between items-start mb-3">
                      <span className="bg-emerald text-cream px-2 py-1 rounded text-xs font-medium">
                        Confirmed
                      </span>
                      <span className="text-xs text-emerald-600">
                        {formatBookingTime(booking.booking_time)}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="font-semibold text-emerald-900">{match.date} at {match.time}</div>
                      <div className="text-emerald-700">{match.location}</div>
                      <div className="text-emerald-600 font-medium">₹{match.price}/player</div>
                      {canCancel ? (
                        <div className="text-xs text-emerald-600">
                          ✓ Full refund available
                        </div>
                      ) : (
                        <div className="text-xs text-red-600">
                          ✗ Cancellation period expired
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      disabled={!canCancel}
                      className={`w-full mt-3 py-2 px-4 rounded-lg font-medium transition-colors duration-300 ${
                        canCancel
                          ? 'bg-red-600 text-cream hover:bg-red-700'
                          : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      }`}
                    >
                      {canCancel ? 'Cancel Booking' : 'Cancellation Expired'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {isLoggedIn && userBookings.length === 0 && (
          <div className="text-center text-emerald-600 py-8 mb-8">
            <p>You haven't booked any matches yet.</p>
            <p className="text-sm mt-2">Book a match below to get started!</p>
          </div>
        )}
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {matches.map((match) => {
            const isBooked = isUserBookedForMatch(match.id);
            const userBooking = getUserBookingForMatch(match.id);
            
            return (
              <div key={match.id} className="bg-emerald-50 rounded-2xl shadow-lg p-6 flex flex-col justify-between relative">
                {isAdmin && (
                  <button
                    onClick={() => handleEdit(match)}
                    className="absolute top-4 right-4 text-emerald-600 hover:text-emerald-800 transition-colors duration-200"
                    title="Edit match details"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                )}

                {/* Booking Status Badge */}
                {isBooked && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-emerald text-cream px-3 py-1 rounded-full text-sm font-medium">
                      Booked
                    </span>
                  </div>
                )}

                {/* Availability Badge */}
                {!isBooked && (
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      match.players_left === 0 ? 'bg-red-600 text-cream' : 'bg-emerald text-cream'
                    }`}>
                      {match.players_left === 0 ? 'Full' : 'Available'}
                    </span>
                  </div>
                )}

                {editingMatch === match.id ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-semibold text-emerald">{match.date}</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-emerald mb-1">Time</label>
                        <input
                          type="text"
                          value={editForm.time}
                          onChange={(e) => setEditForm({...editForm, time: e.target.value})}
                          className="w-full px-3 py-2 border border-emerald rounded-lg focus:ring-2 focus:ring-emerald focus:border-transparent transition-colors duration-300 text-emerald bg-cream"
                          placeholder="e.g., 6:00 PM"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-emerald mb-1">Location</label>
                        <input
                          type="text"
                          value={editForm.location}
                          onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                          className="w-full px-3 py-2 border border-emerald rounded-lg focus:ring-2 focus:ring-emerald focus:border-transparent transition-colors duration-300 text-emerald bg-cream"
                          placeholder="e.g., Andheri West Turf"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-emerald mb-1">Price</label>
                        <input
                          type="text"
                          value={editForm.price}
                          onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                          className="w-full px-3 py-2 border border-emerald rounded-lg focus:ring-2 focus:ring-emerald focus:border-transparent transition-colors duration-300 text-emerald bg-cream"
                          placeholder="e.g., ₹299/player"
                        />
                      </div>
                    </div>
                    <div className="mb-2 text-emerald font-semibold">Players Left: {match.players_left} / {match.max_players}</div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSave}
                        className="flex-1 bg-emerald text-cream py-2 px-4 rounded-lg font-medium hover:bg-emerald-600 transition-colors duration-300"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex-1 bg-emerald-100 text-emerald-700 py-2 px-4 rounded-lg font-medium hover:bg-emerald-200 transition-colors duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-semibold text-emerald">{match.date}</span>
                      <span className="text-emerald-600 font-bold">{match.time}</span>
                    </div>
                    <div className="mb-2 text-emerald-700 font-medium">{match.location}</div>
                    <div className="mb-2 text-emerald">11-a-side</div>
                    <div className="mb-2 text-emerald-600 font-semibold">Slots Left: {match.players_left} / {match.max_players}</div>
                    <div className="mb-4 text-emerald-600 font-semibold">₹{match.price}/player</div>
                    
                    {/* Booking Information */}
                    {isBooked && userBooking && (
                      <div className="mb-4 p-3 bg-emerald-100 rounded-lg">
                        <div className="text-sm text-emerald-700 mb-2">
                          <strong>Booked:</strong> {formatBookingTime(userBooking.booking_time)}
                        </div>
                        {canCancelBooking(userBooking.booking_time) ? (
                          <div className="text-xs text-emerald-600">
                            Full refund available if cancelled within 24 hours
                          </div>
                        ) : (
                          <div className="text-xs text-red-600">
                            Cancellation period expired (24 hours)
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="space-y-2">
                      {isBooked ? (
                        <button
                          onClick={() => handleCancelBooking(userBooking.id)}
                          disabled={!canCancelBooking(userBooking.booking_time)}
                          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-300 ${
                            canCancelBooking(userBooking.booking_time)
                              ? 'bg-red-600 text-cream hover:bg-red-700'
                              : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                          }`}
                        >
                          {canCancelBooking(userBooking.booking_time) ? 'Cancel Booking' : 'Cancellation Expired'}
                        </button>
                      ) : (
                        <>
                          <button
                            className="btn-primary mt-2 disabled:opacity-60 disabled:cursor-not-allowed w-full"
                            onClick={() => handleBook(match)}
                            disabled={match.players_left === 0}
                          >
                            {match.players_left === 0 ? 'Full' : 'Book Now'}
                          </button>
                          {!isLoggedIn && (
                            <div className="text-center text-xs text-emerald-700 mt-2">
                              Login to manage or cancel bookings
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Matches; 