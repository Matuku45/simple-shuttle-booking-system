import React, { useState, useEffect } from "react";

const accentColor = "#2563eb"; // Professional blue
const mainColor = "#1e293b";   // Dark blue for header/nav
const highlightColor = "#38b000"; // Success green

// Dummy shuttle data
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

const PassengerDashboard = () => {
  const [selectedShuttle, setSelectedShuttle] = useState(null);
  const [seatsToBook, setSeatsToBook] = useState(1);
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [search, setSearch] = useState({ date: "2025-09-25", seats: 1, origin: "", destination: "" });
  const [paidBookings, setPaidBookings] = useState([]);
  const [countdowns, setCountdowns] = useState({});

  // Update countdown timers every second
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
        } else {
          newCountdowns[shuttle.id] = "Departed";
        }
      });
      setCountdowns(newCountdowns);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleBook = shuttle => {
    setSelectedShuttle(shuttle);
    setSeatsToBook(1);
    setBookingSuccess("");
  };

  const handleConfirmBooking = () => {
    if (seatsToBook < 1 || seatsToBook > selectedShuttle.seats) {
      setBookingSuccess("Invalid number of seats.");
      return;
    }
    const booking = {
      ...selectedShuttle,
      seatsBooked: seatsToBook,
      paid: true
    };
    setPaidBookings([...paidBookings, booking]);
    setBookingSuccess(`Booking confirmed for ${seatsToBook} seat(s) on ${selectedShuttle.route} (${selectedShuttle.time}, ${selectedShuttle.date}).`);
    setSelectedShuttle(null);
  };

  const filteredShuttles = dummyShuttles.filter(s =>
    (!search.origin || s.route.toLowerCase().includes(search.origin.toLowerCase())) &&
    (!search.destination || s.route.toLowerCase().includes(search.destination.toLowerCase()))
  );

  return (
    <section style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "Segoe UI, Arial, sans-serif" }}>
      
      {/* Top Navigation */}
      <nav style={{ width: "100%", background: mainColor, color: "#fff", padding: "0 0 0 220px", height: "64px", display: "flex", alignItems: "center", position: "fixed", top: 0, left: 0, zIndex: 100, boxShadow: "0 2px 8px rgba(30,41,59,0.10)" }}>
        <span style={{ fontWeight: "bold", fontSize: "1.4rem", marginLeft: "16px", letterSpacing: "1px" }}>Passenger Dashboard</span>
        <div style={{ marginLeft: "auto", marginRight: "32px", display: "flex", gap: "24px" }}>
          {navLinks.map(link => (
            <a key={link.label} href={link.href} style={{ color: "#fff", textDecoration: "none", fontWeight: "500", fontSize: "1rem", padding: "8px 16px", borderRadius: "6px", background: link.label === "Logout" ? "#e63946" : "transparent", border: link.label === "Dashboard" ? `2px solid ${accentColor}` : "none" }}>{link.label}</a>
          ))}
        </div>
      </nav>

      {/* Side Navigation */}
      <aside style={{ position: "fixed", top: 0, left: 0, width: "200px", height: "100vh", background: accentColor, color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "80px", boxShadow: "2px 0 8px rgba(37,99,235,0.10)", zIndex: 99 }}>
        <div style={{ fontWeight: "bold", fontSize: "1.15rem", marginBottom: "28px", letterSpacing: "0.5px" }}>Welcome, Passenger</div>
        {navLinks.map(link => (
          <a key={link.label} href={link.href} style={{ color: "#fff", textDecoration: "none", fontWeight: "500", fontSize: "1rem", padding: "12px 0", width: "100%", textAlign: "center", borderRadius: "6px", marginBottom: "10px", background: link.label === "Dashboard" ? "#1e293b" : "transparent", transition: "background 0.2s" }}>{link.label}</a>
        ))}
      </aside>

      {/* Main Content */}
      <div style={{ marginLeft: "220px", paddingTop: "80px", paddingBottom: "32px" }}>
        {/* Search Form */}
        <div style={{ maxWidth: "950px", margin: "0 auto", background: "#fff", borderRadius: "18px", boxShadow: "0 4px 24px rgba(37,99,235,0.10)", padding: "32px" }}>
          <div style={{ background: "linear-gradient(90deg, #e0f2fe 0%, #e0ffe0 100%)", borderRadius: "14px", padding: "24px", marginBottom: "32px", boxShadow: "0 2px 8px rgba(37,99,235,0.07)" }}>
            <h3 style={{ fontSize: "1.35rem", fontWeight: "bold", marginBottom: "18px", color: mainColor }}>Travel smarter with <span style={{ color: highlightColor }}>MetroShuttle</span></h3>
            <div style={{ display: "flex", gap: "18px", flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 120px" }}>
                <label style={{ fontWeight: "500", color: accentColor }}>Date</label>
                <input type="date" value={search.date} onChange={e => setSearch({ ...search, date: e.target.value })} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #b3b3b3", marginTop: "6px", fontSize: "1rem" }} />
              </div>
              <div style={{ flex: "1 1 80px" }}>
                <label style={{ fontWeight: "500", color: accentColor }}>Seats</label>
                <input type="number" min={1} value={search.seats} onChange={e => setSearch({ ...search, seats: Number(e.target.value) })} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #b3b3b3", marginTop: "6px", fontSize: "1rem" }} />
              </div>
              <div style={{ flex: "1 1 180px" }}>
                <label style={{ fontWeight: "500", color: accentColor }}>Origin</label>
                <input type="text" placeholder="e.g. Pretoria" value={search.origin} onChange={e => setSearch({ ...search, origin: e.target.value })} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #b3b3b3", marginTop: "6px", fontSize: "1rem" }} />
              </div>
              <div style={{ flex: "1 1 180px" }}>
                <label style={{ fontWeight: "500", color: accentColor }}>Destination</label>
                <input type="text" placeholder="e.g. Durban" value={search.destination} onChange={e => setSearch({ ...search, destination: e.target.value })} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #b3b3b3", marginTop: "6px", fontSize: "1rem" }} />
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", flex: "1 1 120px" }}>
                <button style={{ background: highlightColor, color: "#fff", fontWeight: "bold", border: "none", borderRadius: "8px", padding: "12px 28px", fontSize: "1.1rem", marginTop: "18px", boxShadow: "0 2px 8px rgba(56,176,0,0.10)", cursor: "pointer" }} onClick={e => e.preventDefault()}><span style={{ marginRight: "8px" }}>🔍</span> Find shuttles</button>
              </div>
            </div>
            <div style={{ marginTop: "12px", color: "#22223b", fontSize: "1rem" }}>Choose your shuttle, reserve seats, and pay online — convenient and reliable transport across South Africa.</div>
          </div>

          {/* Shuttle List */}
          {filteredShuttles.map(shuttle => (
            <div key={shuttle.id} style={{ background: "#fff", borderRadius: "14px", boxShadow: "0 2px 8px rgba(56,176,0,0.08)", padding: "18px 24px", marginBottom: "22px", display: "flex", alignItems: "center", border: "1.5px solid #e5e7eb" }}>
              <div style={{ flex: "1 1 0", minWidth: "220px" }}>
                <div style={{ color: "#64748b", fontWeight: "500", fontSize: "0.98rem" }}>{shuttle.date} &bull; {shuttle.time} &bull; {shuttle.duration}</div>
                <div style={{ fontWeight: "bold", color: accentColor, fontSize: "1.15rem", margin: "6px 0" }}>{shuttle.route}</div>
                <div style={{ color: "#22223b", fontSize: "0.98rem" }}>Pickup window: {shuttle.pickup}</div>
                <div style={{ color: "#64748b", fontSize: "0.98rem" }}>Seats left: <span style={{ fontWeight: "bold", color: accentColor }}>{shuttle.seats}</span></div>
                <div style={{ marginTop: "6px", fontWeight: "bold", color: "#ef4444" }}>Departure in: {countdowns[shuttle.id]}</div>
              </div>
              <div style={{ flex: "0 0 120px", textAlign: "right" }}>
                <div style={{ color: highlightColor, fontWeight: "bold", fontSize: "1.15rem", marginBottom: "6px" }}>ZAR {shuttle.price}</div>
                <div style={{ color: "#64748b", fontSize: "0.95rem" }}>per seat</div>
                <button style={{ background: highlightColor, color: "#fff", border: "none", borderRadius: "8px", padding: "10px 28px", fontWeight: "bold", cursor: "pointer", marginTop: "8px", fontSize: "1rem", boxShadow: "0 2px 8px rgba(56,176,0,0.10)" }} onClick={() => handleBook(shuttle)}>Book &gt;</button>
              </div>
            </div>
          ))}

          {/* Paid Bookings */}
          {paidBookings.length > 0 && (
            <div style={{ marginTop: "40px", background: "#e0f2fe", borderRadius: "14px", padding: "20px" }}>
              <h3 style={{ fontWeight: "bold", color: mainColor, marginBottom: "18px" }}>Your Paid Bookings</h3>
              {paidBookings.map((b, index) => (
                <div key={index} style={{ padding: "12px", marginBottom: "10px", borderRadius: "10px", background: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 8px rgba(37,99,235,0.05)" }}>
                  <div>
                    <div style={{ fontWeight: "bold", color: accentColor }}>{b.route}</div>
                    <div style={{ color: "#64748b" }}>{b.date} &bull; {b.time} &bull; Seats: {b.seatsBooked}</div>
                  </div>
                  <div style={{ fontWeight: "bold", color: highlightColor }}>ZAR {b.price * b.seatsBooked}</div>
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
