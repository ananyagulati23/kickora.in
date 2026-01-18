import React, { useEffect, useRef } from 'react';

const Hero = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = heroRef.current?.querySelectorAll('.scroll-reveal');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section ref={heroRef} className="relative pt-24 pb-20 overflow-hidden bg-white">
      {/* Decorative Elements removed for clean white background */}
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8 scroll-reveal">
            <div className="inline-block px-4 py-2 bg-emerald-100 rounded-full">
              <span className="text-emerald-700 font-semibold text-sm">⚽ #1 Football Booking Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="text-gray-900">Play</span>{' '}
              <span className="text-gradient">Football</span>
              <br />
              <span className="text-gray-900">Your Way</span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
              No team? No problem. Book your slot, and we'll handle everything - equipment, turf, and teammates. 
              <span className="font-semibold text-emerald-600"> Just show up and play!</span>
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => scrollToSection('#booking')}
                className="btn-premium group"
              >
                <span className="relative z-10">Book Your Match</span>
                <svg className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              
              <button
                onClick={() => scrollToSection('#about')}
                className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl border-2 border-gray-200 hover:border-emerald-500 hover:text-emerald-600 transition-all hover:shadow-lg"
              >
                Learn More
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-600">500+</div>
                <div className="text-sm text-gray-600 mt-1">Matches Played</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-600">1000+</div>
                <div className="text-sm text-gray-600 mt-1">Happy Players</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-600">15+</div>
                <div className="text-sm text-gray-600 mt-1">Cities</div>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative scroll-reveal lg:pl-8">
            {/* Main Card */}
            <div className="relative modern-card p-8">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <div className="text-white text-center space-y-4 p-8">
                  <div className="w-32 h-32 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 2 L14 8 L20 8 L15 12 L17 18 L12 14 L7 18 L9 12 L4 8 L10 8 Z"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold">Book in 3 Steps</h3>
                  <p className="text-emerald-50">Select • Pay • Play</p>
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="absolute -top-6 -right-6 glass-card p-4 shadow-xl float-animation">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  ⚽
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Live Now</div>
                  <div className="text-sm text-gray-600">5 matches available</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 glass-card p-4 shadow-xl float-animation" style={{ animationDelay: '1s' }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  ⭐
                </div>
                <div>
                  <div className="font-semibold text-gray-900">4.9 Rating</div>
                  <div className="text-sm text-gray-600">Based on 1000+ reviews</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 