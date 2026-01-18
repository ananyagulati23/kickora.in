import React, { useEffect, useRef } from 'react';

const Features = () => {
  const featuresRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('revealed');
            }, index * 100);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = featuresRef.current?.querySelectorAll('.scroll-reveal');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: "⚽",
      title: "Quality Equipment",
      description: "Professional-grade footballs, goals, and safety gear provided for every match.",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      icon: "🏟️",
      title: "Premium Turfs",
      description: "Well-maintained, professional football turfs with proper markings and lighting.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: "👥",
      title: "Match Coordination",
      description: "We handle team formation, scheduling, and ensure balanced matches for everyone.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: "⏰",
      title: "Flexible Timing",
      description: "Book slots at your convenience - early morning, afternoon, or late evening.",
      gradient: "from-amber-500 to-orange-500"
    }
  ];

  return (
    <section ref={featuresRef} className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16 scroll-reveal">
          <div className="inline-block px-4 py-2 bg-emerald-100 rounded-full mb-4">
            <span className="text-emerald-700 font-semibold text-sm">✨ Our Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose <span className="text-gradient">Kickora</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need for the perfect football experience, all in one place.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="modern-card p-8 text-center scroll-reveal group"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div className="feature-icon mb-6">
                <span className="text-4xl">{feature.icon}</span>
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
              
              {/* Gradient Bar */}
              <div className={`mt-6 h-1 w-16 mx-auto rounded-full bg-gradient-to-r ${feature.gradient} transform scale-0 group-hover:scale-100 transition-transform`}></div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center scroll-reveal">
          <div className="glass-card inline-block p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Experience the Difference?
            </h3>
            <p className="text-gray-600 mb-6 max-w-xl">
              Join thousands of players who trust Kickora for their football needs.
            </p>
            <button className="btn-premium">
              Book Your First Match
              <svg className="inline-block ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
 