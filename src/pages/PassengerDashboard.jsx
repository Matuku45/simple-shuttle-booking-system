import React, { useState, useEffect } from "react";

const PassengerDashboard = () => {
  const [user, setUser] = useState({ name: "", email: "" });
  const [selectedShuttle, setSelectedShuttle] = useState(null);
  const [seatsToBook, setSeatsToBook] = useState(1);
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [search, setSearch] = useState({ date: "2025-09-25", seats: 1, origin: "", destination: "" });
  const [paidBookings, setPaidBookings] = useState([]);
  const [countdowns, setCountdowns] = useState({});

  // Load user info from localStorage
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) setUser({ name: loggedInUser.name, email: loggedInUser.email });
  }, []);

  const dummyShuttles = [
    { id: 1, route: "Johannesburg → Polokwane", date: "2025-09-25", time: "05:30", duration: "6.5 hrs", pickup: "10 min", seats: 10, price: 350 },
    { id: 2, route: "Pretoria → Durban", date: "2025-09-25", time: "08:00", duration: "3.2 hrs", pickup: "15 min", seats: 4, price: 400 },
    { id: 3, route: "Johannesburg → Bloemfontein", date: "2025-09-25", time: "12:30", duration: "1.1 hrs", pickup: "20 min", seats: 2, price: 280 },
    { id: 4, route: "Johannesburg → Polokwane", date: "2025-09-25", time: "15:45", duration: "5.5 hrs", pickup: "10 min", seats: 18, price: 520 }
  ];

  const navLinks = [
    { label: "Dashboard", href: "#" },
    { label: "Bookings", href: "#" },
    { label: "Profile", href: "#" },
    { label: "Support", href: "#" },
    { label: "Logout", href: "#" }
  ];

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const newCountdowns = {};
      dummyShuttles.forEach(shuttle => {
        const shuttleDate = new Date(`${shuttle.date}T${shuttle.time}:00`);
        const diff = shuttleDate - new Date();
        if (diff > 0) {
          const hours = Math.floor(diff / 1000 / 3600);
          const minutes = Math.floor((diff / 1000 % 3600) / 60);
          const seconds = Math.floor(diff / 1000 % 60);
          newCountdowns[shuttle.id] = `${hours}h ${minutes}m ${seconds}s`;
        } else newCountdowns[shuttle.id] = "Departed";
      });
      setCountdowns(newCountdowns);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleBook = shuttle => { setSelectedShuttle(shuttle); setSeatsToBook(1); setBookingSuccess(""); };
  const handleConfirmBooking = () => {
    if (seatsToBook < 1 || seatsToBook > selectedShuttle.seats) {
      setBookingSuccess("Invalid number of seats."); return;
    }
    const booking = { ...selectedShuttle, seatsBooked: seatsToBook, paid: true };
    setPaidBookings([...paidBookings, booking]);
    setBookingSuccess(`Booking confirmed for ${seatsToBook} seat(s) on ${selectedShuttle.route} (${selectedShuttle.time}, ${selectedShuttle.date}).`);
    setSelectedShuttle(null);
  };

  const filteredShuttles = dummyShuttles.filter(s =>
    (!search.origin || s.route.toLowerCase().includes(search.origin.toLowerCase())) &&
    (!search.destination || s.route.toLowerCase().includes(search.destination.toLowerCase()))
  );

  return (
    <section className="min-h-screen bg-slate-100 font-sans">
      {/* Top Nav */}
      <nav className="fixed top-0 left-0 right-0 h-16 flex items-center px-4 sm:px-6 bg-slate-900 text-white shadow-md z-50">
        <span className="font-bold text-lg tracking-wide">Passenger Dashboard</span>
        <div className="ml-auto flex items-center gap-3 sm:gap-6">
          <div className="hidden sm:flex flex-col text-right mr-4">
            <span className="font-semibold">{user.name}</span>
            <span className="text-sm text-gray-300">{user.email}</span>
          </div>
          {navLinks.map(link => (
            <a key={link.label} href={link.href} className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md font-medium text-sm ${link.label === "Logout" ? "bg-red-600" : ""} ${link.label === "Dashboard" ? "border-2 border-blue-500" : ""}`}>
              {link.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Side Nav */}
      <aside className="hidden md:flex fixed top-16 left-0 w-56 h-screen flex-col items-center pt-6 bg-blue-600 text-white shadow-md z-40">
        <div className="font-semibold text-lg mb-4 text-center">Welcome, {user.name}</div>
        {navLinks.map(link => (
          <a key={link.label} href={link.href} className={`w-full text-center py-3 mb-2 rounded-md font-medium ${link.label === "Dashboard" ? "bg-slate-900" : "hover:bg-blue-700 transition"}`}>
            {link.label}
          </a>
        ))}
      </aside>

      {/* Main Content */}
      <div className="md:ml-56 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        {/* Search */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
          <div className="bg-gradient-to-r from-sky-100 to-green-100 rounded-xl p-4 sm:p-6 mb-4 shadow-sm">
            <h3 className="text-lg sm:text-xl font-bold mb-3 text-slate-900">
              Travel smarter with <span className="text-green-600">MetroShuttle</span>
            </h3>
            <div className="flex flex-wrap gap-2 sm:gap-4">
              <input type="date" value={search.date} onChange={e => setSearch({ ...search, date: e.target.value })} className="flex-1 min-w-[120px] p-2 border rounded-md border-gray-300" />
              <input type="number" min={1} value={search.seats} onChange={e => setSearch({ ...search, seats: Number(e.target.value) })} className="flex-1 min-w-[80px] p-2 border rounded-md border-gray-300" />
              <input type="text" placeholder="Origin" value={search.origin} onChange={e => setSearch({ ...search, origin: e.target.value })} className="flex-1 min-w-[120px] p-2 border rounded-md border-gray-300" />
              <input type="text" placeholder="Destination" value={search.destination} onChange={e => setSearch({ ...search, destination: e.target.value })} className="flex-1 min-w-[120px] p-2 border rounded-md border-gray-300" />
              <button className="bg-green-600 text-white font-bold px-4 py-2 rounded-md shadow hover:bg-green-700 flex items-center">
                <span className="mr-2">🔍</span> Find shuttles
              </button>
            </div>
            <p className="mt-2 text-gray-700 text-sm sm:text-base">
              Choose your shuttle, reserve seats, and pay online — convenient and reliable transport across South Africa.
            </p>
          </div>

          {/* Shuttle List */}
          {filteredShuttles.map(shuttle => (
            <div key={shuttle.id} className="bg-white rounded-xl shadow-sm p-4 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border border-gray-200">
              <div className="flex-1 min-w-[220px]">
                <div className="text-gray-500 font-medium text-sm">{shuttle.date} • {shuttle.time} • {shuttle.duration}</div>
                <div className="text-blue-600 font-bold text-lg my-1">{shuttle.route}</div>
                <div className="text-gray-800 text-sm">Pickup window: {shuttle.pickup}</div>
                <div className="text-gray-500 text-sm">Seats left: <span className="font-bold text-blue-600">{shuttle.seats}</span></div>
                <div className="mt-1 font-bold text-red-500">Departure in: {countdowns[shuttle.id]}</div>
              </div>
              <div className="flex flex-col items-start sm:items-end mt-3 sm:mt-0">
                <div className="text-green-600 font-bold text-lg mb-1">ZAR {shuttle.price}</div>
                <div className="text-gray-500 text-sm">per seat</div>
                <button className="bg-green-600 text-white font-bold px-4 py-2 rounded-md mt-2 shadow hover:bg-green-700" onClick={() => handleBook(shuttle)}>Book &gt;</button>
              </div>
            </div>
          ))}

          {/* Paid Bookings */}
          {paidBookings.length > 0 && (
            <div className="mt-8 bg-sky-100 rounded-xl p-4 sm:p-6">
              <h3 className="font-bold text-slate-900 mb-3">Your Paid Bookings</h3>
              {paidBookings.map((b, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 mb-2 bg-white rounded-lg shadow-sm">
                  <div>
                    <div className="text-blue-600 font-bold">{b.route}</div>
                    <div className="text-gray-500 text-sm">{b.date} • {b.time} • Seats: {b.seatsBooked}</div>
                  </div>
                  <div className="font-bold text-green-600 mt-2 sm:mt-0">ZAR {b.price * b.seatsBooked}</div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default PassengerDashboard;
