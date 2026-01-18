// Page-level Components - Login/Register Page
import React from 'react';
import SEO from '../components/common/SEO';
import LoginRegister from '../components/LoginRegister';

const AuthPage = ({ onLogin }) => {
  return (
    <>
      <SEO
        title="Login or Register - Kickora"
        description="Login to your Kickora account or create a new account to start booking football matches and connecting with players."
        keywords="kickora login, register, sign up, football booking account"
        url="https://kickora.com/login"
      />
      <LoginRegister onLogin={onLogin} />
    </>
  );
};

export default AuthPage;
