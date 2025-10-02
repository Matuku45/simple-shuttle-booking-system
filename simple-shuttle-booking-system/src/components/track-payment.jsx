// C:\Users\Thabiso\Downloads\simple-shuttle-booking-system\simple-shuttle-booking-system\src\components\track-payment.jsx
import React from "react";

export default function TrackPayment({ payments }) {
  return (
    <section id="payments" className="bg-white rounded-lg shadow p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Payments Tracker</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="border border-gray-300 px-4 py-2 text-left">Passenger</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Shuttle</th>
              <th className="border border-gray-300 px-4 py-2 text-right">Amount (ZAR)</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center text-gray-500 py-4">
                  No payments recorded.
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.id} className="even:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{payment.passenger}</td>
                  <td className="border border-gray-300 px-4 py-2">{payment.shuttle}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">R {payment.amount}</td>
                  <td className="border border-gray-300 px-4 py-2">{payment.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
