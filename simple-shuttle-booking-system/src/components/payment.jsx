import React from "react";

const Payment = ({ shuttle, seats, onPaymentSuccess }) => {
  const handleBook = async () => {
    // Your Stripe Payment Link
    const paymentLink = "https://buy.stripe.com/test_7sY28t91X6gegc8gDwcwg00";

    // Open Stripe checkout in a new tab
    const paymentWindow = window.open(paymentLink, "_blank");

    // Polling to detect if the payment window is closed
    const paymentCheck = setInterval(() => {
      if (paymentWindow.closed) {
        clearInterval(paymentCheck);
        console.log("Stripe tab closed, calling onPaymentSuccess");

        // Pass both shuttle and seats so dashboard can save correctly
        onPaymentSuccess(shuttle, seats);
      }
    }, 1000);
  };

  return (
    <button
      onClick={handleBook}
      className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
    >
      Book
    </button>
  );
};

export default Payment;
