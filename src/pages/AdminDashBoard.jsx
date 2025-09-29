import React, { useState } from "react";

const accentColor = "#2563eb";   // Tailwind blue-600
const mainColor = "#1e293b";     // Tailwind slate-800
const highlightColor = "#38b000"; // Tailwind green-600

const initialShuttles = [
  { id: 1, route: "Johannesburg → Polokwane", date: "2025-09-25", time: "05:30", duration: "6.5 hrs", pickup: "10 min", seats: 10, price: 350 },
  { id: 2, route: "Pretoria → Durban", date: "2025-09-25", time: "08:00", duration: "3.2 hrs", pickup: "15 min", seats: 4, price: 400 }
];

const initialPayments = [
  { id: 1, passenger: "John Doe", shuttle: "Pretoria → Durban", amount: 800, status: "Paid" },
  { id: 2, passenger: "Jane Smith", shuttle: "Johannesburg → Polokwane", amount: 350, status: "Pending" }
];

const navLinks = [
  { label: "Dashboard", href: "#" },
  { label: "Manage Shuttles", href: "#" },
  { label: "Payments", href: "#" },
  { label: "Logout", href: "#" }
];

const AdminDashboard = () => {
  const [shuttles, setShuttles] = useState(initialShuttles);
  const [payments] = useState(initialPayments);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(null);
  const [newShuttle, setNewShuttle] = useState({
    route: "", date: "", time: "", duration: "", pickup: "", seats: "", price: ""
  });

  const handleAddShuttle = (e) => {
    e.preventDefault();
    setShuttles([...shuttles, { ...newShuttle, id: Date.now() }]);
    setShowAdd(false);
    setNewShuttle({ route: "", date: "", time: "", duration: "", pickup: "", seats: "", price: "" });
  };

  const handleEditShuttle = (e) => {
    e.preventDefault();
    setShuttles(shuttles.map(s => s.id === showEdit.id ? { ...showEdit } : s));
    setShowEdit(null);
  };

  const handleDeleteShuttle = (id) => {
    if (window.confirm("Delete this shuttle?")) {
      setShuttles(shuttles.filter(s => s.id !== id));
    }
  };

  return (
    <section className="min-h-screen bg-gray-100 font-sans">
      {/* Top Nav */}
      <nav className="fixed top-0 left-0 w-full h-16 bg-slate-800 text-white flex items-center px-4 z-50 shadow">
        <span className="font-bold text-lg sm:text-xl ml-4">Admin Dashboard</span>
        <div className="ml-auto flex gap-4 sm:gap-6 mr-4">
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              className={`font-medium px-3 py-1 rounded ${
                link.label === "Logout" ? "bg-red-600" : ""
              } ${link.label === "Dashboard" ? "border-2 border-blue-600" : ""}`}
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Side Nav */}
      <aside className="fixed top-0 left-0 w-52 h-full bg-blue-600 text-white flex flex-col items-center pt-20 shadow-lg hidden sm:flex">
        <div className="font-bold text-base mb-7">Welcome, Admin</div>
        {navLinks.map(link => (
          <a
            key={link.label}
            href={link.href}
            className={`w-full text-center py-3 mb-2 rounded ${
              link.label === "Dashboard" ? "bg-slate-800" : "hover:bg-blue-700"
            } font-medium`}
          >
            {link.label}
          </a>
        ))}
      </aside>

      {/* Main Content */}
      <div className="sm:ml-52 pt-20 pb-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-blue-600 mb-4 sm:mb-0">Shuttle Management</h2>
            <button
              onClick={() => setShowAdd(true)}
              className="bg-green-600 text-white font-bold rounded-lg px-6 py-2 shadow hover:bg-green-700 transition"
            >
              + Add Shuttle
            </button>
          </div>

          {/* Shuttle List */}
          <div className="space-y-4">
            {shuttles.map(shuttle => (
              <div key={shuttle.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white rounded-lg shadow-sm border p-4">
                <div className="flex-1 min-w-[180px]">
                  <div className="text-gray-500 text-sm">{shuttle.date} • {shuttle.time} • {shuttle.duration}</div>
                  <div className="font-bold text-blue-600 text-lg my-1">{shuttle.route}</div>
                  <div className="text-gray-700 text-sm">Pickup window: {shuttle.pickup}</div>
                  <div className="text-gray-500 text-sm">Seats left: <span className="font-bold text-blue-600">{shuttle.seats}</span></div>
                </div>
                <div className="flex flex-col items-end mt-3 sm:mt-0">
                  <div className="text-green-600 font-bold text-lg">ZAR {shuttle.price}</div>
                  <div className="text-gray-500 text-sm">per seat</div>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => setShowEdit({ ...shuttle })} className="bg-blue-600 text-white px-3 py-1 rounded font-medium hover:bg-blue-700 transition">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteShuttle(shuttle.id)} className="bg-red-600 text-white px-3 py-1 rounded font-medium hover:bg-red-700 transition">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Shuttle Modal */}
          {showAdd && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-md relative">
                <button onClick={() => setShowAdd(false)} className="absolute top-3 right-3 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl">×</button>
                <h3 className="text-center text-blue-600 font-bold text-xl mb-4">Add Shuttle</h3>
                <form onSubmit={handleAddShuttle} className="space-y-3">
                  {["route", "date", "time", "duration", "pickup", "seats", "price"].map(field => (
                    <div key={field} className="flex flex-col">
                      <label className="font-medium text-blue-600 capitalize">{field}</label>
                      <input
                        type={field === "date" ? "date" : field === "time" ? "time" : field === "seats" || field === "price" ? "number" : "text"}
                        required
                        min={field === "seats" || field === "price" ? 1 : undefined}
                        value={newShuttle[field]}
                        onChange={e => setNewShuttle({ ...newShuttle, [field]: e.target.value })}
                        className="mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder={field === "route" ? "e.g. Pretoria → Durban" : undefined}
                      />
                    </div>
                  ))}
                  <button type="submit" className="w-full bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-700 transition">Add Shuttle</button>
                </form>
              </div>
            </div>
          )}

          {/* Edit Shuttle Modal */}
          {showEdit && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-md relative">
                <button onClick={() => setShowEdit(null)} className="absolute top-3 right-3 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl">×</button>
                <h3 className="text-center text-blue-600 font-bold text-xl mb-4">Edit Shuttle</h3>
                <form onSubmit={handleEditShuttle} className="space-y-3">
                  {["route", "date", "time", "duration", "pickup", "seats", "price"].map(field => (
                    <div key={field} className="flex flex-col">
                      <label className="font-medium text-blue-600 capitalize">{field}</label>
                      <input
                        type={field === "date" ? "date" : field === "time" ? "time" : field === "seats" || field === "price" ? "number" : "text"}
                        required
                        min={field === "seats" || field === "price" ? 1 : undefined}
                        value={showEdit[field]}
                        onChange={e => setShowEdit({ ...showEdit, [field]: e.target.value })}
                        className="mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  ))}
                  <button type="submit" className="w-full bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-700 transition">Save Changes</button>
                </form>
              </div>
            </div>
          )}

          {/* Payments */}
          <div className="mt-12">
            <h2 className="text-blue-600 font-bold text-xl mb-4">Payments Tracker</h2>
            <div className="overflow-x-auto rounded-lg shadow">
              <table className="min-w-full bg-gray-50">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    {["Passenger", "Shuttle", "Amount", "Status"].map(header => (
                      <th key={header} className="px-4 py-2 text-left">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {payments.map(pay => (
                    <tr key={pay.id} className="bg-white">
                      <td className="px-4 py-2">{pay.passenger}</td>
                      <td className="px-4 py-2">{pay.shuttle}</td>
                      <td className="px-4 py-2">ZAR {pay.amount}</td>
                      <td className={`px-4 py-2 font-bold ${pay.status === "Paid" ? "text-green-600" : "text-red-600"}`}>{pay.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
