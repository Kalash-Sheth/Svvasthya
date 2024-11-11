import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PaymentModal = ({ isOpen, onClose, amount, customerDetails, onPaymentSuccess }) => {
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    if (isOpen && amount) {
      createRazorpayOrder();
    }
  }, [isOpen, amount]);

  const createRazorpayOrder = async () => {
    try {
    const response = await axios.post('/api/create-order', { amount });
      if (response.data.orderId) {
        setOrderId(response.data.orderId);
      } else {
        console.error('Failed to create Razorpay order');
      }
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
    }
  };

  const handlePayment = () => {
    if (!orderId) {
      alert('Order creation failed. Please try again.');
      return;
    }

    const options = {
      key: 'YOUR_RAZORPAY_KEY_ID', // Your Razorpay Key ID
      amount: amount * 100, // Amount in paise (1 INR = 100 paise)
      currency: 'INR',
      name: 'Svvasthya Service',
      description: 'Payment for Svvasthya service',
      order_id: orderId, // Order ID received from backend
      handler: function (response) {
        console.log('Payment successful:', response);
        onPaymentSuccess(response); // Pass the payment response to the parent component
      },
      prefill: {
        name: customerDetails.name,
        email: customerDetails.email,
        contact: customerDetails.contact,
      },
      theme: {
        color: '#F37254',
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <h2>Complete Your Payment</h2>
        <p>Amount: ₹{amount}</p>
        <button onClick={handlePayment} disabled={!orderId}>
          Pay Now
        </button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

// Parent Component
const CheckoutPage = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [amount, setAmount] = useState(500); // Example amount
  const [customerDetails, setCustomerDetails] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    contact: '9876543210',
  });

  const handlePaymentSuccess = (paymentDetails) => {
    console.log('Payment successful', paymentDetails);
    // You can update your backend or UI here based on payment success
  };

  return (
    <div>
      <button onClick={() => setIsPaymentModalOpen(true)}>Proceed to Payment</button>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        amount={amount}
        customerDetails={customerDetails}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

// Styles
const style = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  modal: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    maxWidth: '400px',
    width: '100%',
  },
  button: {
    margin: '10px',
    padding: '10px 20px',
    backgroundColor: '#F37254',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  disabledButton: {
    margin: '10px',
    padding: '10px 20px',
    backgroundColor: '#ccc',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'not-allowed',
  },
};

export default CheckoutPage;
