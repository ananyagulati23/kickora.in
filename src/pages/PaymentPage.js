// Page-level Components - Payment Page
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/common/SEO';

const PaymentPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="Secure Payment - Kickora"
        description="Complete your football match booking with our secure payment gateway."
        keywords="kickora payment, secure booking, football payment"
        url="https://kickora.com/payment"
      />
      <div className="min-h-screen bg-gradient-to-br from-cream to-emerald-50 pt-24 pb-16">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-emerald mb-6">Payment Gateway</h1>
            <p className="text-emerald-700 mb-8">
              This is where the payment gateway will be integrated. You can update this page later.
            </p>
            <button
              onClick={() => navigate('/matches')}
              className="btn-primary"
            >
              Back to Matches
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;
