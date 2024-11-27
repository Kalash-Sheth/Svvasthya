import React from 'react';

const PaymentModal = ({ amount, currency = 'INR', description, onSuccess, onFailure }) => {
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const initiatePayment = async () => {
    const isScriptLoaded = await loadRazorpayScript();

    if (!isScriptLoaded) {
      alert('Razorpay SDK failed to load. Please try again.');
      return;
    }

    const options = {
      key: 'rzp_test_RZBy4nkvOo5e8L', 
      amount: amount * 100, // Amount in paise (1 INR = 100 paise)
      currency,
      name: 'Svvasthya',
      description: description || 'Payment for services',
      image: 'https://example.com/logo.png', // Replace with your logo URL
      handler: (response) => {
        onSuccess(response);
      },
      prefill: {
        name: 'Your Name', // Replace with user's name
        email: 'user@example.com', // Replace with user's email
        contact: '9999999999', // Replace with user's phone number
      },
      notes: {
        address: 'Svvasthya HQ', // Optional
      },
      theme: {
        color: '#3399cc', // Customize as per your app's theme
      },
    };

    const paymentObject = new window.Razorpay(options);

    paymentObject.on('payment.failed', function (response) {
      onFailure(response.error);
    });

    paymentObject.open();
  };

  return (
    <button onClick={initiatePayment} className="payment-button">
      Pay ₹{amount}
    </button>
  );
};

export default PaymentModal;
