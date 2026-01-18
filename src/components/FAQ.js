import React, { useState, useEffect, useRef } from 'react';

const FAQ = () => {
  const sectionRef = useRef(null);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('revealed');
            }, index * 80);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll('.scroll-reveal');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const faqs = [
    {
      q: 'How do I book a football match? ',
      a: 'Use the booking form to submit your name and phone number. Our team will contact you within 2 hours to confirm your slot, turf location, and timing.',
    },
    {
      q: 'Do you provide equipment and turf?',
      a: 'Yes — we provide professional-grade footballs, bibs, goals (where needed), and coordinate premium turfs with proper markings and lighting.',
    },
    {
      q: 'Can I join without a team?',
      a: 'Absolutely. We manage balanced match coordination and can place you into teams based on availability, skill level, and preferred positions.',
    },
    {
      q: 'What are the available timings?',
      a: 'We run matches throughout the day: early mornings, afternoons, and late evenings. Let us know your preference and we’ll align the slot.',
    },
    {
      q: 'Is payment handled online?',
      a: 'Yes. We support secure online payments via our payment gateway. You’ll receive a confirmation once the booking is finalized.',
    },
  ];

  const toggle = (idx) => setOpenIndex((prev) => (prev === idx ? null : idx));

  return (
    <section ref={sectionRef} id="faq" className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-16 scroll-reveal">
          <div className="inline-block px-4 py-2 bg-emerald-100 rounded-full mb-4">
            <span className="text-emerald-700 font-semibold text-sm">❓ FAQs</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about booking and playing with Kickora.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="modern-card p-0 overflow-hidden mb-6 scroll-reveal">
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-6 text-left"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${idx}`}
                >
                  <span className="text-lg md:text-xl font-semibold text-gray-900">{item.q}</span>
                  <span
                    className={`ml-4 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isOpen ? 'bg-emerald-600 text-white rotate-45' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  id={`faq-panel-${idx}`}
                  className={`px-6 pb-6 text-gray-600 leading-relaxed transition-all ${
                    isOpen ? 'block' : 'hidden'
                  }`}
                >
                  {item.a}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center scroll-reveal">
          <button className="btn-premium">
            Still have questions? Contact us
            <svg className="inline-block ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
