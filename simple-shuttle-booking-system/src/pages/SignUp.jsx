import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://shuttle-booking-system.fly.dev";

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    repeatPassword: "",
    role: "",
    agree: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false); // <-- fix added
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.agree) {
      setError("You must agree to the terms of service.");
      return;
    }
    if (form.password !== form.repeatPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/users/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        console.error("Server returned non-JSON:", text);
        setError("Server returned invalid response. Check backend URL.");
        return;
      }

      if (!response.ok) {
        setError(data?.message || "Something went wrong!");
        return;
      }

      setSuccess("Account created successfully!");
      console.log("User created:", data);

      // Optionally redirect after a delay
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Network or fetch error:", err);
      setError("Cannot reach server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{
        backgroundImage:
          "url('https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp')",
      }}
    >
      <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl shadow-lg p-8 sm:p-10 w-full max-w-md">
        <div className="text-center mb-6">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
            alt="logo"
            className="w-36 mx-auto sm:w-44"
          />
          <h4 className="mt-2 text-gray-700 text-lg sm:text-xl font-semibold">
            We are The Lotus Team
          </h4>
        </div>

        <h2 className="text-center text-blue-800 font-bold text-xl sm:text-2xl uppercase mb-8">
          Create an account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full p-3 border border-blue-400 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="w-full p-3 border border-blue-400 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-3 border border-blue-400 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            name="repeatPassword"
            value={form.repeatPassword}
            onChange={handleChange}
            placeholder="Repeat your password"
            className="w-full p-3 border border-blue-400 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-3 border border-blue-400 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="passenger">Passenger</option>
          </select>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
              id="agree"
              className="mr-2 w-4 h-4 text-blue-600 accent-blue-600"
            />
            <label htmlFor="agree" className="text-gray-700 text-sm sm:text-base">
              I agree to the{" "}
              <a href="#!" className="text-blue-600 underline">
                Terms of service
              </a>
            </label>
          </div>

          {error && <div className="text-red-600 text-center">{error}</div>}
          {success && <div className="text-green-600 text-center">{success}</div>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-blue-400" : "bg-blue-700 hover:bg-blue-800"
            } text-white font-bold py-3 rounded-xl text-lg transition-colors duration-200 shadow-md`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6 text-sm sm:text-base">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 font-semibold underline">
            Login here
          </a>
        </p>
      </div>
    </section>
  );
};

export default SignUp;
