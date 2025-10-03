import React, { useState, useEffect } from "react";
import TrackPayment from "./track-payment";

const BASE_URL = "https://shuttle-booking-system.fly.dev";

const PassengerDashboard = () => {
  const [user, setUser] = useState({ name: "Passenger", email: "" });
  const [shuttles, setShuttles] = useState([]);
  const [seatsToBook, setSeatsToBook] = useState(1);
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [search, setSearch] = useState({ date: "", seats: 1, origin: "", destination: "" });
  const [paidBookings, setPaidBookings] = useState([]);
  const [countdowns, setCountdowns] = useState({});
  const [error, setError] = useState("");

  // Load logged-in user
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser && loggedInUser.name) setUser({ name: loggedInUser.name, email: loggedInUser.email });
  }, []);

  // Fetch shuttles
  useEffect(() => {
    const fetchShuttles = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/shuttles`);
        if (!res.ok) throw new Error("Failed to fetch shuttles");
        const data = await res.json();
        setShuttles(Array.isArray(data) ? data : data.shuttles || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };
    fetchShuttles();
  }, []);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const newCountdowns = {};
      shuttles.forEach((shuttle) => {
        const shuttleDate = new Date(`${shuttle.date}T${shuttle.time}:00`);
        const diff = shuttleDate - new Date();
        if (diff > 0) {
          const hours = Math.floor(diff / 1000 / 3600);
          const minutes = Math.floor((diff / 1000 % 3600) / 60);
          const seconds = Math.floor(diff / 1000 % 60);
          newCountdowns[shuttle.id] = `${hours}h ${minutes}m ${seconds}s`;
        } else {
          newCountdowns[shuttle.id] = "Departed";
        }
      });
      setCountdowns(newCountdowns);
    }, 1000);
    return () => clearInterval(interval);
  }, [shuttles]);

  // Filter shuttles
  const filteredShuttles = shuttles.filter(
    (s) =>
      (!search.origin || s.route.toLowerCase().includes(search.origin.toLowerCase())) &&
      (!search.destination || s.route.toLowerCase().includes(search.destination.toLowerCase())) &&
      (!search.date || s.date === search.date) &&
      (!search.seats || s.seats >= search.seats)
  );

  // Handle booking confirmation
  const handleConfirmBooking = (shuttle, seats) => {
    const booking = { ...shuttle, seatsBooked: seats, paid: true };
    setPaidBookings([...paidBookings, booking]);
    setBookingSuccess(
      `Booking confirmed for ${seats} seat(s) on ${shuttle.route} (${shuttle.time}, ${shuttle.date}).`
    );
  };

  // Save payment to backend
  const savePayment = async (shuttle, seats) => {
    try {
      const paymentData = {
        passenger_name: user.name,
        shuttle_id: Number(shuttle.id),
        booking_id: Math.floor(Math.random() * 1000000),
        amount: Math.round(Number(shuttle.price) * Number(seats)),
        status: "Paid",
        payment_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };

      const res = await fetch(`${BASE_URL}/api/payments/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(paymentData),
      });

      const data = await res.json();
      console.log("Payment save response:", data);

      if (data.success) {
        handleConfirmBooking(shuttle, seats);
      } else {
        console.error("Failed to save payment:", data);
        alert("Payment save failed: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Payment save error", err);
      alert("Payment save error: " + err.message);
    }
  };

  // Handle booking & payment inline
  const handleBookShuttle = (shuttle) => {
    const paymentLink = "https://buy.stripe.com/test_7sY28t91X6gegc8gDwcwg00";
    const paymentWindow = window.open(paymentLink, "_blank");

    const paymentCheck = setInterval(() => {
      if (paymentWindow.closed) {
        clearInterval(paymentCheck);
        console.log("Stripe tab closed, saving payment...");
        savePayment(shuttle, seatsToBook);
      }
    }, 1000);
  };

  return (
    <div className="flex h-screen w-screen bg-gray-100 text-black">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col flex-shrink-0 shadow-lg">
        <div className="flex items-center justify-center h-20 border-b border-gray-700">
          <div className="text-2xl font-bold tracking-wide">MetroShuttle</div>
        </div>
        <div className="flex flex-col items-center justify-center p-4 border-b border-gray-700">
          <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-xl font-bold text-white mb-2">
            {user.name ? user.name[0].toUpperCase() : "P"}
          </div>
          <div className="text-white font-bold text-lg">{user.name}</div>
          <div className="text-gray-400 text-sm">{user.email}</div>
        </div>
        <nav className="flex flex-col flex-grow p-4 space-y-3">
          <a href="#" className="py-2 px-3 rounded hover:bg-gray-800 transition font-medium">Dashboard</a>
          <a href="#" className="py-2 px-3 rounded hover:bg-gray-800 transition font-medium">Bookings</a>
          <a href="#" className="py-2 px-3 rounded hover:bg-gray-800 transition font-medium">Profile</a>
          <a href="#" className="py-2 px-3 rounded hover:bg-gray-800 transition font-medium">Support</a>
          <a href="/login" className="py-2 px-3 rounded bg-red-600 hover:bg-red-700 transition text-white font-semibold">Logout</a>
        </nav>
        <div className="p-4 border-t border-gray-700 text-sm text-gray-400">
          &copy; {new Date().getFullYear()} MetroShuttle
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex flex-col flex-grow overflow-auto p-6 space-y-6">
        {/* Booking Success Alert */}
        {bookingSuccess && (
          <div className="bg-green-100 text-green-800 border border-green-400 p-3 rounded-md mb-4">
            {bookingSuccess}
          </div>
        )}

        {/* Search Section */}
        <section className="bg-white rounded-lg shadow p-6 max-w-7xl mx-auto">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">Find a Shuttle</h2>
          <div className="flex flex-wrap gap-4">
            <input type="date" value={search.date} onChange={(e) => setSearch({ ...search, date: e.target.value })} className="flex-1 min-w-[150px] p-2 border border-gray-300 rounded-md" />
            <input type="number" min={1} value={search.seats} onChange={(e) => setSearch({ ...search, seats: Number(e.target.value) })} className="flex-1 min-w-[100px] p-2 border border-gray-300 rounded-md" />
            <input type="text" placeholder="Origin" value={search.origin} onChange={(e) => setSearch({ ...search, origin: e.target.value })} className="flex-1 min-w-[150px] p-2 border border-gray-300 rounded-md" />
            <input type="text" placeholder="Destination" value={search.destination} onChange={(e) => setSearch({ ...search, destination: e.target.value })} className="flex-1 min-w-[150px] p-2 border border-gray-300 rounded-md" />
          </div>
        </section>

        {/* Shuttle List */}
        <section className="bg-white rounded-lg shadow p-6 max-w-7xl mx-auto">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Available Shuttles</h2>
          {error && <p className="text-red-500">{error}</p>}
          {!error && filteredShuttles.length === 0 && <p className="text-gray-500">No shuttles match your search.</p>}
          {filteredShuttles.map((shuttle) => (
            <div key={shuttle.id} className="border border-gray-200 rounded-md p-4 mb-4 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <div className="text-blue-700 font-semibold text-lg md:text-xl">{shuttle.route}</div>
                <div className="text-sm text-gray-600">{shuttle.date} • {shuttle.time} • {shuttle.duration}</div>
                <div className="text-sm text-gray-600">Pickup: {shuttle.pickup} • Seats: {shuttle.seats}</div>
                <div className="text-sm text-red-500">Departure in: {countdowns[shuttle.id]}</div>
              </div>
              <div className="text-right mt-2 md:mt-0">
                <div className="text-green-600 font-bold text-lg md:text-xl">ZAR {shuttle.price}</div>
                <button
                  onClick={() => handleBookShuttle(shuttle)}
                  className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                >
                  Book
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Paid Bookings */}
        {paidBookings.length > 0 && (
          <section className="bg-white rounded-lg shadow p-6 max-w-7xl mx-auto">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Your Bookings</h2>
            {paidBookings.map((b, i) => (
              <div key={i} className="border border-gray-200 rounded-md p-4 mb-3">
                <div className="text-blue-700 font-semibold text-lg md:text-xl">{b.route}</div>
                <div className="text-sm text-gray-600">{b.date} • {b.time} • {b.duration}</div>
                <div className="text-sm">Seats booked: {b.seatsBooked}</div>
                <div className="text-green-600 font-bold mt-1">Total Paid: ZAR {b.price * b.seatsBooked}</div>
              </div>
            ))}
          </section>
        )}

        {/* Payment Tracker */}
        <TrackPayment />
      </main>
    </div>
  );
};

export default PassengerDashboard;
