import React, { useState, useEffect, useRef } from 'react';
import { testimonialsAPI } from '../services/api';

const StarRating = ({ rating, setRating, editable }) => (
  <div className="flex items-center space-x-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        className={`text-2xl transition-all ${
          star <= rating
            ? 'text-amber-400 drop-shadow-lg'
            : 'text-gray-300'
        }`}
        onClick={editable ? () => setRating(star) : undefined}
        disabled={!editable}
        aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
      >
        ★
      </button>
    ))}
  </div>
);

const Testimonials = ({ isLoggedIn, isAdmin, currentUser }) => {
  const sectionRef = useRef(null);
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('revealed');
            }, index * 50);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll('.scroll-reveal');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [testimonials]);

  // Fetch testimonials on component mount
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setIsLoading(true);
        const data = await testimonialsAPI.getAll();
        setTestimonials(data);
      } catch (error) {
        setError('Failed to load testimonials');
        console.error('Error fetching testimonials:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (text.trim() && rating) {
      try {
        const userName = isLoggedIn && currentUser ? currentUser.full_name : (name.trim() || 'Anonymous');
        const testimonialData = {
          text: text.trim(),
          rating,
          name: userName,
        };
        
        await testimonialsAPI.create(testimonialData);
        
        // Refresh testimonials after submission
        const updatedTestimonials = await testimonialsAPI.getAll();
        setTestimonials(updatedTestimonials);
        
        setText('');
        setRating(5);
        setName('');
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 2000);
      } catch (error) {
        setError('Failed to submit testimonial');
      }
    }
  };

  const handleDelete = async (testimonialId) => {
    try {
      await testimonialsAPI.delete(testimonialId);
      // Refresh testimonials after deletion
      const updatedTestimonials = await testimonialsAPI.getAll();
      setTestimonials(updatedTestimonials);
    } catch (error) {
      setError('Failed to delete testimonial');
    }
  };

  const canDeleteTestimonial = (testimonial) => {
    return isAdmin || (isLoggedIn && currentUser && testimonial.user_id === currentUser.id);
  };

  if (isLoading) {
    return (
      <section id="testimonials" className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600 text-lg">Loading testimonials...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="testimonials" className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-16 scroll-reveal">
          <div className="inline-block px-4 py-2 bg-amber-100 rounded-full mb-4">
            <span className="text-amber-700 font-semibold text-sm">⭐ Testimonials</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our <span className="text-gradient">Players Say</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real experiences from our growing community of football enthusiasts.
          </p>
        </div>

        {/* Submission Form */}
        <div className="max-w-2xl mx-auto mb-16 scroll-reveal">
          <div className="glass-card p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Share Your Experience</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Your Testimonial</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  required
                  rows={4}
                  className="premium-input"
                  placeholder="Write your experience..."
                />
              </div>
              
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                <label className="text-gray-700 font-semibold">Your Rating:</label>
                <StarRating rating={rating} setRating={setRating} editable={true} />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {isLoggedIn && currentUser ? 'Your Name (from profile)' : 'Your Name (optional)'}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="premium-input"
                  placeholder={isLoggedIn && currentUser ? currentUser.name : "Enter your name or leave blank for anonymous"}
                  disabled={isLoggedIn && currentUser}
                />
              </div>
              
              <button type="submit" className="btn-premium w-full text-lg py-4">
                Submit Testimonial  
                <svg className="inline-block ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
              
              {submitted && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-center animate-fade-in">
                  ✓ Thank you for your feedback!
                </div>
              )}
              {error && <div className="text-red-600 text-center mt-2">{error}</div>}
            </form>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id || index}
              className="testimonial-card scroll-reveal group relative"
            >
              {canDeleteTestimonial(testimonial) && (
                <button
                  onClick={() => handleDelete(testimonial.id)}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                  title={isAdmin ? "Delete review (Admin)" : "Delete my review"}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
              
              {/* Quote Icon */}
              <div className="text-6xl text-emerald-200 leading-none mb-4">"</div>
              
              <div className="flex items-center mb-4">
                <StarRating rating={testimonial.rating} setRating={() => {}} editable={false} />
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                {testimonial.text}
              </p>
              
              <div className="flex items-center border-t border-gray-100 pt-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  {testimonial.name ? testimonial.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {new Date(testimonial.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {testimonials.length === 0 && (
          <div className="text-center py-16 scroll-reveal">
            <div className="glass-card inline-block p-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-gray-600 text-xl font-semibold">No reviews yet</p>
              <p className="text-gray-500 mt-2">Be the first to share your experience!</p>
            </div>
          </div>
        )}

        {testimonials.length > 0 && (
          <div className="scroll-reveal">
            <div className="modern-card p-10 lg:p-12 bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
              <div className="flex justify-center items-center mb-4">
                <StarRating rating={Math.round(testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length)} setRating={() => {}} editable={false} />
              </div>
              <h3 className="text-3xl font-bold mb-2">
                {(testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1)}/5 Average Rating
              </h3>
              <p className="text-lg opacity-90 mb-8">
                Based on {testimonials.length} review{testimonials.length !== 1 ? 's' : ''} from our community
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-4xl font-bold mb-2">
                    {testimonials.length > 0 ? Math.round((testimonials.filter(t => t.rating >= 4).length / testimonials.length) * 100) : 0}%
                  </div>
                  <div className="text-sm opacity-80">Satisfaction Rate</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">{testimonials.length}</div>
                  <div className="text-sm opacity-80">Happy Players</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">
                    {testimonials.length > 0 ? Math.round((testimonials.filter(t => t.rating >= 4).length / testimonials.length) * 100) : 0}%
                  </div>
                  <div className="text-sm opacity-80">Would Recommend</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">
                    {testimonials.length > 0 ? (testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1) : '0.0'}
                  </div>
                  <div className="text-sm opacity-80">Average Rating</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials; 