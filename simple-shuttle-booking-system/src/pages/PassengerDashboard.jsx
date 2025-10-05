import React, { useState, useEffect } from "react";
import TrackPayment from "./track-payment";

const BASE_URL = "https://shuttle-booking-system.fly.dev";

const PassengerDashboard = () => {
  const [user, setUser] = useState({ name: "Passenger", email: "" });
  const [editUser, setEditUser] = useState(user);
  const [shuttles, setShuttles] = useState([]);
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [search, setSearch] = useState({ date: "", seats: 1, origin: "", destination: "" });
  const [countdowns, setCountdowns] = useState({});
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("book");
  const [seatsSelection, setSeatsSelection] = useState({});
  const [bookings, setBookings] = useState(JSON.parse(localStorage.getItem("bookings")) || []);

  // Load user
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser && loggedInUser.name) {
      setUser(loggedInUser);
      setEditUser(loggedInUser);
    }
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

  // Save profile
  const handleUpdateProfile = () => {
    setUser(editUser);
    localStorage.setItem("user", JSON.stringify(editUser));
    alert("Profile updated successfully!");
  };

  // Save booking locally
  const addBookingLocal = (shuttle, seats) => {
    const newBooking = {
      id: Math.floor(Math.random() * 1000000),
      shuttle_id: shuttle.id,
      route: shuttle.route,
      date: shuttle.date,
      time: shuttle.time,
      seats,
      price: shuttle.price,
    };
    const updatedBookings = [...bookings, newBooking];
    setBookings(updatedBookings);
    localStorage.setItem("bookings", JSON.stringify(updatedBookings));
    setBookingSuccess(
      `Booking added locally for ${seats} seat(s) on ${shuttle.route} (${shuttle.time}, ${shuttle.date}).`
    );
  };

  // Booking handler
  const handleBookShuttle = (shuttle) => {
    const seats = seatsSelection[shuttle.id] || 1;

    // Save booking locally immediately
    addBookingLocal(shuttle, seats);

    // Open Stripe for payment
    const stripeLink = "https://buy.stripe.com/test_7sY28t91X6gegc8gDwcwg00";
    const paymentWindow = window.open(stripeLink, "_blank");

    const paymentCheck = setInterval(() => {
      if (paymentWindow.closed) {
        clearInterval(paymentCheck);

        // Save payment after Stripe closes
        const bookingId = bookings.length ? bookings[bookings.length - 1].id : new Date().getTime();
        const paymentData = {
          passenger_name: user.name,
          shuttle_id: shuttle.id,
          booking_id: bookingId,
          amount: shuttle.price * seats,
          status: "Paid",
          payment_date: new Date().toISOString(),
        };

        fetch(`${BASE_URL}/api/payments/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paymentData),
        })
          .then((res) => res.json())
          .then((data) => console.log("Payment saved:", data))
          .catch((err) => console.error("Payment error:", err));
      }
    }, 1000);
  };

  const filteredShuttles = shuttles.filter(
    (s) =>
      (!search.origin || s.route.toLowerCase().includes(search.origin.toLowerCase())) &&
      (!search.destination || s.route.toLowerCase().includes(search.destination.toLowerCase())) &&
      (!search.date || s.date === search.date) &&
      (!search.seats || s.seats >= search.seats)
  );

  return (
    <div className="flex h-screen w-screen bg-gray-100 text-black">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col flex-shrink-0 shadow-xl">
        <div className="flex items-center justify-center h-20 border-b border-gray-700">
          <div className="text-2xl font-bold tracking-wide text-red-400">MetroShuttle</div>
        </div>
        <div className="flex flex-col items-center justify-center p-4 border-b border-gray-700">
          <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-xl font-bold text-white mb-2 shadow-md">
            {user.name ? user.name[0].toUpperCase() : "P"}
          </div>
          <div className="text-white font-bold text-lg">{user.name}</div>
          <div className="text-gray-300 text-sm">{user.email}</div>
        </div>
        <nav className="flex flex-col flex-grow p-4 space-y-3">
          <button
            onClick={() => setActiveTab("book")}
            className={`py-2 px-3 rounded-md font-semibold text-left transition ${
              activeTab === "book" ? "bg-red-600 text-white" : "text-gray-200 hover:bg-gray-800"
            }`}
          >
            🚍 Book Shuttles
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`py-2 px-3 rounded-md font-semibold text-left transition ${
              activeTab === "bookings" ? "bg-red-600 text-white" : "text-gray-200 hover:bg-gray-800"
            }`}
          >
            🗒 My Bookings
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`py-2 px-3 rounded-md font-semibold text-left transition ${
              activeTab === "profile" ? "bg-red-600 text-white" : "text-gray-200 hover:bg-gray-800"
            }`}
          >
            👤 Profile
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            className={`py-2 px-3 rounded-md font-semibold text-left transition ${
              activeTab === "payments" ? "bg-red-600 text-white" : "text-gray-200 hover:bg-gray-800"
            }`}
          >
            💳 Track Payments
          </button>
          <a
            href="/login"
            className="mt-4 py-2 px-3 rounded-md bg-red-700 hover:bg-red-800 transition text-white font-bold text-center"
          >
            🚪 Logout
          </a>
        </nav>
        <div className="p-4 border-t border-gray-700 text-sm text-gray-400">
          &copy; {new Date().getFullYear()} MetroShuttle
        </div>
      </aside>

      {/* Main */}
      <main className="flex flex-col flex-grow overflow-auto p-6 space-y-6">
        {bookingSuccess && (
          <div className="bg-green-100 text-green-800 border border-green-400 p-3 rounded-md mb-4">
            {bookingSuccess}
          </div>
        )}

        {/* BOOK SHUTTLES */}
        {activeTab === "book" && (
          <>
            {/* Search Section */}
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Find a Shuttle</h2>
              <div className="flex flex-wrap gap-4">
                <input
                  type="date"
                  value={search.date}
                  onChange={(e) => setSearch({ ...search, date: e.target.value })}
                  className="flex-1 min-w-[150px] p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="number"
                  min={1}
                  value={search.seats}
                  onChange={(e) => setSearch({ ...search, seats: Number(e.target.value) })}
                  className="flex-1 min-w-[100px] p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Origin"
                  value={search.origin}
                  onChange={(e) => setSearch({ ...search, origin: e.target.value })}
                  className="flex-1 min-w-[150px] p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Destination"
                  value={search.destination}
                  onChange={(e) => setSearch({ ...search, destination: e.target.value })}
                  className="flex-1 min-w-[150px] p-2 border border-gray-300 rounded-md"
                />
              </div>
            </section>

            {/* Shuttle List */}
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Available Shuttles</h2>
              {error && <p className="text-red-500">{error}</p>}
              {!error && filteredShuttles.length === 0 && <p className="text-gray-500">No shuttles match your search.</p>}
              {filteredShuttles.map((shuttle) => (
                <div
                  key={shuttle.id}
                  className="border border-gray-200 rounded-md p-4 mb-4 flex flex-col md:flex-row justify-between items-start md:items-center"
                >
                  <div>
                    <div className="text-blue-700 font-semibold text-lg md:text-xl">{shuttle.route}</div>
                    <div className="text-sm text-gray-600">{shuttle.date} • {shuttle.time} • {shuttle.duration}</div>
                    <div className="text-sm text-gray-600">Pickup: {shuttle.pickup} • Seats: {shuttle.seats}</div>
                    <div className="text-sm text-red-500">Departure in: {countdowns[shuttle.id]}</div>
                  </div>
                  <div className="text-right mt-2 md:mt-0">
                    <div className="text-green-600 font-bold text-lg md:text-xl">ZAR {shuttle.price}</div>

                    {/* Seats dropdown */}
                    <select
                      value={seatsSelection[shuttle.id] || 1}
                      onChange={(e) =>
                        setSeatsSelection({ ...seatsSelection, [shuttle.id]: Number(e.target.value) })
                      }
                      className="mt-2 border border-gray-300 rounded-md p-2"
                    >
                      {[...Array(Math.min(shuttle.seats, 10)).keys()].map((n) => (
                        <option key={n + 1} value={n + 1}>
                          {n + 1} seat{n > 0 ? "s" : ""}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => handleBookShuttle(shuttle)}
                      className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition block w-full"
                    >
                      Book
                    </button>
                  </div>
                </div>
              ))}
            </section>
          </>
        )}

        {/* MY BOOKINGS */}
        {activeTab === "bookings" && (
          <section className="bg-white rounded-lg shadow-md p-6 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">My Bookings</h2>
            {bookings.length === 0 && <p className="text-gray-500">You have no bookings yet.</p>}
            {bookings.map((b) => (
              <div key={b.id} className="border border-gray-200 rounded-md p-4 mb-4 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-lg">{b.route}</div>
                  <div className="text-sm text-gray-600">{b.date} • {b.time}</div>
                  <div className="text-sm text-gray-600">Seats: {b.seats} • Price: ZAR {b.price}</div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* PROFILE */}
        {activeTab === "profile" && (
          <section className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Update Profile</h2>
            <div className="space-y-4">
              <input
                type="text"
                value={editUser.name}
                onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                placeholder="Full Name"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
              />
              <input
                type="email"
                value={editUser.email}
                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                placeholder="Email"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
              />
              <button
                onClick={handleUpdateProfile}
                className="w-full bg-red-600 text-white py-3 rounded-md font-bold hover:bg-red-700 transition"
              >
                ✅ Update Profile
              </button>
            </div>
          </section>
        )}

        {/* PAYMENTS */}
        {activeTab === "payments" && (
          <section className="bg-white rounded-lg shadow-md p-6 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Payments</h2>
            <TrackPayment passengerName={user.name} />
          </section>
        )}
      </main>
    </div>
  );
};

export default PassengerDashboard;
