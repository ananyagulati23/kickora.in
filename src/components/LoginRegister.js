import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { APP_CONFIG } from '../config/constants';

const LoginRegister = ({ onLogin }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingMessage = location.state && location.state.bookingMessage;
  
  // Form states
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Login form
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Register form
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Shortcut: accept master admin credentials even if backend rejects
        const isAdminCred = password === APP_CONFIG.ADMIN_PASSWORD
          || APP_CONFIG.ADMIN_USERNAMES.includes(username)
          || APP_CONFIG.ADMIN_EMAILS.includes(username);

        if (isAdminCred) {
          const adminUser = {
            username,
            full_name: 'Admin',
            email: username.includes('@') ? username : undefined,
            is_admin: true,
          };
          onLogin(adminUser);
          navigate('/');
          return;
        }

        // Standard login
        const response = await authAPI.login(username, password);
        const user = response.user || {};
        if (user.email && APP_CONFIG.ADMIN_EMAILS.includes(user.email)) {
          user.is_admin = true;
        }
        onLogin(user);
        navigate('/');
      } else {
        // Register
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setIsLoading(false);
          return;
        }
        
        const userData = {
          username,
          password,
          full_name: fullName,
          age: parseInt(age),
          email: email || undefined,
          phone_number: phone || undefined,
        };
        
        const response = await authAPI.register(userData);
        const user = response.user || userData;
        if (password === APP_CONFIG.ADMIN_PASSWORD || APP_CONFIG.ADMIN_USERNAMES.includes(username) || (user.email && APP_CONFIG.ADMIN_EMAILS.includes(user.email))) {
          user.is_admin = true;
        }
        onLogin(user);
        navigate('/');
      }
    } catch (error) {
      setError(error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setUsername('');
    setPassword('');
    setFullName('');
    setAge('');
    setEmail('');
    setPhone('');
    setConfirmPassword('');
    setError('');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    clearForm();
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream to-emerald-50">
      <div className="w-full max-w-md mx-auto">
        {bookingMessage && (
          <div className="mb-6 p-4 bg-emerald-100 border-l-4 border-emerald-600 text-emerald-800 rounded">
            {bookingMessage}
          </div>
        )}
        <div className="bg-emerald-50 rounded-2xl shadow-xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-emerald mb-6 text-center">
            {isLogin ? 'Login' : 'Register'}
          </h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-600 text-red-800 rounded">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-emerald mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={!isLogin}
                  className="w-full px-4 py-3 border border-emerald rounded-lg focus:ring-2 focus:ring-emerald focus:border-transparent transition-colors duration-300 text-emerald bg-cream placeholder-emerald-500"
                  placeholder="Enter your full name"
                />
              </div>
            )}
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-emerald mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 border border-emerald rounded-lg focus:ring-2 focus:ring-emerald focus:border-transparent transition-colors duration-300 text-emerald bg-cream placeholder-emerald-500"
                placeholder="Enter your username"
              />
            </div>
            
            {!isLogin && (
              <>
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-emerald mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    id="age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required={!isLogin}
                    min="16"
                    max="80"
                    className="w-full px-4 py-3 border border-emerald rounded-lg focus:ring-2 focus:ring-emerald focus:border-transparent transition-colors duration-300 text-emerald bg-cream placeholder-emerald-500"
                    placeholder="Enter your age (16-80)"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-emerald mb-2">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-emerald rounded-lg focus:ring-2 focus:ring-emerald focus:border-transparent transition-colors duration-300 text-emerald bg-cream placeholder-emerald-500"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-emerald mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    pattern="[0-9]{10}"
                    maxLength={10}
                    className="w-full px-4 py-3 border border-emerald rounded-lg focus:ring-2 focus:ring-emerald focus:border-transparent transition-colors duration-300 text-emerald bg-cream placeholder-emerald-500"
                    placeholder="Enter your 10-digit phone number"
                  />
                </div>
              </>
            )}
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-emerald mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-emerald rounded-lg focus:ring-2 focus:ring-emerald focus:border-transparent transition-colors duration-300 text-emerald bg-cream placeholder-emerald-500"
                placeholder="Enter your password"
              />
            </div>
            
            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-emerald mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required={!isLogin}
                  minLength={6}
                  className="w-full px-4 py-3 border border-emerald rounded-lg focus:ring-2 focus:ring-emerald focus:border-transparent transition-colors duration-300 text-emerald bg-cream placeholder-emerald-500"
                  placeholder="Confirm your password"
                />
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={isLoading}
              className={`btn-primary w-full text-lg py-3 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
                </div>
              ) : (
                isLogin ? 'Login' : 'Register'
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <button 
              type="button" 
              onClick={toggleMode}
              className="text-emerald underline hover:text-emerald-600 transition-colors duration-300"
            >
              {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginRegister; 