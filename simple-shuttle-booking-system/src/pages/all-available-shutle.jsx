// C:\Users\Thabiso\Downloads\simple-shuttle-booking-system\simple-shuttle-booking-system\src\pages\all-available-shutle.jsx
import React, { useState, useEffect } from "react";

export default function AllAvailableShuttle({ shuttles, setShuttles }) {
  const [formData, setFormData] = useState({ id: null, name: "", seats: "", status: "Active" });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch shuttles from backend on mount if not provided
  useEffect(() => {
    if (!shuttles || shuttles.length === 0) fetchShuttles();
  }, []);

  const fetchShuttles = async () => {
    try {
      const res = await fetch("https://shuttle-booking-system.fly.dev/api/shuttles");
      if (!res.ok) throw new Error("Failed to fetch shuttles");
      const data = await res.json();
      setShuttles(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.seats) return alert("Please fill all fields");

    setLoading(true);
    try {
      let res, data;
      if (isEditing) {
        // Update shuttle
        res = await fetch(`https://shuttle-booking-system.fly.dev/api/shuttles/${formData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Failed to update shuttle");
        data = await res.json();
        setShuttles(shuttles.map(s => (s.id === data.id ? data : s)));
        setIsEditing(false);
      } else {
        // Add new shuttle
        res = await fetch("https://shuttle-booking-system.fly.dev/api/shuttles/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Failed to add shuttle");
        data = await res.json();
        setShuttles([...shuttles, data]);
      }
      setFormData({ id: null, name: "", seats: "", status: "Active" });
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (shuttle) => {
    setFormData(shuttle);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this shuttle?")) return;

    try {
      const res = await fetch(`https://shuttle-booking-system.fly.dev/api/shuttles/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete shuttle");
      setShuttles(shuttles.filter(s => s.id !== id));
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">All Available Shuttles</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Shuttle Form */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">{isEditing ? "Edit Shuttle" : "Add Shuttle"}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Shuttle Name / Route"
            value={formData.name}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
            required
          />
          <input
            type="number"
            name="seats"
            placeholder="Number of Seats"
            value={formData.seats}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
            required
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Processing..." : isEditing ? "Update" : "Add"}
          </button>
        </form>
      </div>

      {/* Shuttle Table */}
      <div className="bg-white shadow rounded p-4 overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="border px-4 py-2 text-left">Shuttle Name / Route</th>
              <th className="border px-4 py-2 text-left">Seats</th>
              <th className="border px-4 py-2 text-left">Status</th>
              <th className="border px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shuttles.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No shuttles available.
                </td>
              </tr>
            ) : (
              shuttles.map((shuttle) => (
                <tr key={shuttle.id} className="even:bg-gray-50">
                  <td className="border px-4 py-2">{shuttle.name}</td>
                  <td className="border px-4 py-2">{shuttle.seats}</td>
                  <td className="border px-4 py-2">{shuttle.status}</td>
                  <td className="border px-4 py-2 text-center space-x-2">
                  <button
  onClick={() => handleEdit(shuttle)}
  className="bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500"
>
  Edit
</button>

                    <button
                      onClick={() => handleDelete(shuttle.id)}
                      className="bg-red-600 px-2 py-1 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
