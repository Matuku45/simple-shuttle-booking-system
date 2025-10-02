import React, { useState, useEffect } from "react";

const BASE_URL = "https://shuttle-booking-system.fly.dev";

const ShuttleAdminDashboard = () => {
  const [shuttles, setShuttles] = useState([]);
  const [payments, setPayments] = useState([]);
  const [formData, setFormData] = useState({
    route: "",
    date: "",
    time: "",
    duration: "",
    pickup: "",
    seats: "",
    price: "",
  });
  const [editData, setEditData] = useState({
    id: null,
    route: "",
    seats: "",
    status: "Active",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load logged-in user
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
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

  // Fetch payments
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/payments`);
        if (!res.ok) throw new Error("Failed to fetch payments");
        const data = await res.json();
        setPayments(Array.isArray(data) ? data : data.payments || []);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchPayments();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  // Add Shuttle
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = { ...formData, seats: Number(formData.seats), price: Number(formData.price) };
      const res = await fetch(`${BASE_URL}/api/shuttles/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const resData = await res.json();
        throw new Error(resData.message || "Failed to add shuttle");
      }
      const newShuttle = await res.json();
      setShuttles((prev) => [...prev, { ...newShuttle, id: newShuttle._id || newShuttle.id }]);
      setFormData({ route: "", date: "", time: "", duration: "", pickup: "", seats: "", price: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Edit Shuttle
  const handleEdit = (shuttle) => {
    setEditData(shuttle);
    setIsEditing(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/shuttles/${editData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      if (!res.ok) throw new Error("Failed to update shuttle");
      const data = await res.json();
      setShuttles(shuttles.map((s) => (s.id === (data._id || data.id) ? { ...data, id: data._id || data.id } : s)));
      setIsEditing(false);
      setEditData({ id: null, route: "", seats: "", status: "Active" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete Shuttle
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this shuttle?")) return;
    try {
      const res = await fetch(`${BASE_URL}/api/shuttles/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete shuttle");
      setShuttles(shuttles.filter((s) => s.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-gray-100 text-black">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col flex-shrink-0 shadow-lg">
        <div className="flex flex-col items-center justify-center h-24 border-b border-gray-700">
          <div className="text-lg font-semibold">{user ? `Hi, ${user.username}` : "Not logged in"}</div>
          <div className="text-sm text-gray-300">{user?.role || ""}</div>
        </div>
        <div className="flex items-center justify-center h-16 border-b border-gray-700">
          <div className="text-2xl font-bold tracking-wide">ShuttleAdmin</div>
        </div>
        <nav className="flex flex-col flex-grow p-4 space-y-3">
          <a href="#add-shuttle" className="py-2 px-3 rounded hover:bg-gray-800 font-medium">Add Shuttle</a>
          <a href="#all-shuttles" className="py-2 px-3 rounded hover:bg-gray-800 font-medium">Shuttles</a>
          <a href="#payments" className="py-2 px-3 rounded hover:bg-gray-800 font-medium">Payments</a>
          <a href="#payments" className="py-2 px-3 rounded hover:bg-gray-800 font-medium">Profile</a>
        </nav>
        <div className="p-4 border-t border-gray-700 text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Shuttle Admin
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex flex-col flex-grow overflow-auto p-6 space-y-6">
        {/* Add Shuttle */}
        <section id="add-shuttle" className="bg-white p-6 rounded shadow">
          <h2 className="bg-yellow-400 text-black px-2 py-1 rounded hover:bg-yellow-500 font-bold">{isEditing ? "Edit Shuttle" : "Add Shuttle"}</h2>
          {error && <p className="text-red-600 font-medium">{error}</p>}
          <form onSubmit={isEditing ? handleUpdate : handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="route" placeholder="Route" value={isEditing ? editData.route : formData.route} onChange={(e) => isEditing ? setEditData({...editData, route: e.target.value}) : handleChange(e)} required className="border border-gray-400 p-2 rounded"/>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required className="border border-gray-400 p-2 rounded"/>
            <input type="time" name="time" value={formData.time} onChange={handleChange} required className="border border-gray-400 p-2 rounded"/>
            <input type="text" name="duration" placeholder="Duration" value={formData.duration} onChange={handleChange} className="border border-gray-400 p-2 rounded"/>
            <input type="text" name="pickup" placeholder="Pickup" value={formData.pickup} onChange={handleChange} className="border border-gray-400 p-2 rounded"/>
            <input type="number" name="seats" placeholder="Seats" value={isEditing ? editData.seats : formData.seats} onChange={(e) => isEditing ? setEditData({...editData, seats: e.target.value}) : handleChange(e)} required className="border border-gray-400 p-2 rounded"/>
            <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required className="border border-gray-400 p-2 rounded"/>
            <button type="submit" disabled={loading} className="bg-yellow-400 text-black px-2 py-1 rounded hover:bg-yellow-500 font-bold">
              {loading ? "Processing..." : isEditing ? "Update Shuttle" : "Add Shuttle"}
            </button>
          </form>
        </section>

        {/* All Shuttles */}
        <section id="all-shuttles" className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">All Shuttles</h2>
          {shuttles.length === 0 ? <p>No shuttles available.</p> : (
            <table className="w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border text-black">Route</th>
                  <th className="p-2 border text-black">Seats</th>
                  <th className="p-2 border text-black">Status</th>
                  <th className="p-2 border text-black">Actions</th>
                </tr>
              </thead>
              <tbody>
                {shuttles.map((shuttle) => (
                  <tr key={shuttle.id}>
                    <td className="p-2 border text-black">{shuttle.route}</td>
                    <td className="p-2 border text-black">{shuttle.seats}</td>
                    <td className="p-2 border text-black">{shuttle.status}</td>
                    <td className="p-2 border space-x-2">
                      <button onClick={() => handleEdit(shuttle)} className="bg-yellow-400 text-black px-2 py-1 rounded hover:bg-yellow-500 font-bold">Edit</button>
                      <button onClick={() => handleDelete(shuttle.id)} className="bg-yellow-400 text-black px-2 py-1 rounded hover:bg-yellow-500 font-bold">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* Payments Section */}
        <section id="payments" className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Payments</h2>
          {payments.length === 0 ? <p>No payments available.</p> : (
            <ul className="list-disc pl-5 text-black">
              {payments.map((p, idx) => <li key={idx}>{p.details}</li>)}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
};

export default ShuttleAdminDashboard;
