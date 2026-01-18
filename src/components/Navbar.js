import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ 
  isMenuOpen, 
  setIsMenuOpen, 
  isLoggedIn,
  currentUser,
  onShowProfile,
  onLogout
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Upcoming Matches', href: '/matches', isLink: true },
    { name: 'Testimonials', href: '/testimonials', isLink: true },
    { name: 'Gallery', href: '/gallery', isLink: true },
    { name: 'Payment Gateway', href: '/payment', isLink: true },
  ];

  const handleLogoClick = () => {
    navigate('/');
    setIsMenuOpen(false);
  };

  useEffect(() => {
    // On homepage load, check if we need to scroll to a section
    if (location.pathname === '/') {
      const scrollTo = sessionStorage.getItem('scrollTo');
      if (scrollTo) {
        setTimeout(() => {
          const element = document.querySelector(scrollTo);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 200);
        sessionStorage.removeItem('scrollTo');
      }
    }
  }, [location.pathname]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/90 backdrop-blur-lg shadow-xl py-2' 
        : 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-md py-3'
    }`}>
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center cursor-pointer group" onClick={handleLogoClick}>
            <img 
              src="/logo.png" 
              alt="Kickora Logo" 
              className="h-12 w-auto object-contain transition-transform group-hover:scale-105" 
            />
            <span className={`ml-3 text-2xl font-bold transition-colors ${
              scrolled ? 'text-gray-900' : 'text-white'
            }`}>
              Kickora
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`font-semibold transition-all duration-300 relative group ${
                  scrolled 
                    ? 'text-gray-700 hover:text-emerald-600' 
                    : 'text-white hover:text-emerald-100'
                }`}
                onClick={() => setIsMenuOpen && setIsMenuOpen(false)}
              >
                {item.name}
                <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                  scrolled ? 'bg-emerald-600' : 'bg-white'
                }`}></span>
              </Link>
            ))}
          </div>

          {/* User Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={onShowProfile}
                  className={`font-semibold transition-colors duration-300 ${
                    scrolled ? 'text-gray-700 hover:text-emerald-600' : 'text-white hover:text-emerald-100'
                  }`}
                >
                  👋 {currentUser?.full_name || currentUser?.name || 'User'}
                </button>
                <button
                  onClick={onLogout}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    scrolled 
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn-premium"
              >
                Login/Register
              </Link>
            )}
            {/* Admin toggle removed: admin via Login credentials */}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-all duration-300 ${
              scrolled 
                ? 'text-gray-700 hover:bg-gray-100' 
                : 'text-white hover:bg-white/20'
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`md:hidden py-6 mt-4 rounded-lg transition-all ${
            scrolled ? 'bg-white/95 shadow-lg' : 'bg-white/10 backdrop-blur-md'
          }`}>
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-left font-semibold px-4 py-2 rounded-lg transition-all duration-300 ${
                    scrolled 
                      ? 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-600' 
                      : 'text-white hover:bg-white/20'
                  }`}
                  onClick={() => setIsMenuOpen && setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {isLoggedIn ? (
                <div className="space-y-2 border-t border-white/20 pt-4 mt-2">
                  <button
                    onClick={() => {
                      onShowProfile();
                      setIsMenuOpen(false);
                    }}
                    className={`text-left font-semibold px-4 py-2 rounded-lg transition-all duration-300 w-full ${
                      scrolled 
                        ? 'text-gray-700 hover:bg-gray-100' 
                        : 'text-white hover:bg-white/20'
                    }`}
                  >
                    👋 {currentUser?.full_name || currentUser?.name || 'User'}
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsMenuOpen(false);
                    }}
                    className={`text-left font-semibold px-4 py-2 rounded-lg transition-all duration-300 w-full ${
                      scrolled 
                        ? 'text-gray-700 hover:bg-gray-100' 
                        : 'text-white hover:bg-white/20'
                    }`}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="btn-premium mx-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login/Register
                </Link>
              )}
              {/* Admin toggle removed in mobile menu */}
            </div>
          </div>
        )}
      </div>

      {/* Admin Login Modal removed */}
    </nav>
  );
};

export default Navbar; 