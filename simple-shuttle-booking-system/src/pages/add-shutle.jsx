import React, { useState, useEffect } from "react";

export default function AddShuttle({ title = "Add Shuttle", onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    route: "",
    date: "",
    time: "",
    duration: "",
    pickup: "",
    seats: "",
    price: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill form if initialData is provided (for editing)
  useEffect(() => {
    if (initialData) {
      setFormData({
        route: initialData.route || "",
        date: initialData.date || "",
        time: initialData.time || "",
        duration: initialData.duration || "",
        pickup: initialData.pickup || "",
        seats: initialData.seats ?? "",
        price: initialData.price ?? "",
      });
    }
  }, [initialData]);

  // Fixed handleChange: just store the value directly
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        seats: Number(formData.seats),
        price: Number(formData.price),
      };

      if (title.includes("Add")) {
        const response = await fetch(
          "https://shuttle-booking-system.fly.dev/api/shuttles/add",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          const resData = await response.json();
          throw new Error(resData.message || "Failed to add shuttle");
        }

        const newShuttle = await response.json();
        onSubmit(newShuttle);
      } else {
        // For editing
        onSubmit(payload);
      }

      if (!initialData) {
        setFormData({
          route: "",
          date: "",
          time: "",
          duration: "",
          pickup: "",
          seats: "",
          price: "",
        });
      }

      onClose();
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none"
          aria-label="Close modal"
        >
          &times;
        </button>
        <h3 className="text-center text-gray-900 font-semibold text-2xl mb-6">{title}</h3>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Route", name: "route", type: "text", placeholder: "Pretoria → Durban" },
            { label: "Date", name: "date", type: "date" },
            { label: "Time", name: "time", type: "time" },
            { label: "Duration", name: "duration", type: "text", placeholder: "e.g. 6h" },
            { label: "Pickup Window", name: "pickup", type: "text", placeholder: "13:45 - 14:15" },
            { label: "Seats", name: "seats", type: "number", min: 1 },
            { label: "Price (ZAR)", name: "price", type: "number", min: 1 },
          ].map(({ label, name, type, placeholder, min }) => (
            <div key={name} className="flex flex-col">
              <label htmlFor={name} className="font-medium text-gray-700 mb-1">
                {label}
              </label>
              <input
                id={name}
                type={type}
                required
                min={min}
                placeholder={placeholder}
                value={formData[name]}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-semibold py-3 rounded-md transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Processing..." : title.includes("Add") ? "Add Shuttle" : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
