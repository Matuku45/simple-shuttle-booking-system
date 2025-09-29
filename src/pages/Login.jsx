import React, { useState } from "react";
import flightImage from "../components/imgs/flight.jpeg";

const Login = ({ onSignUpClick, onForgotPasswordClick }) => {
  const [form, setForm] = useState({ username: "", password: "", role: "booker" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement login logic here
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-slate-100 p-5">
      <div className="flex flex-col md:flex-row w-full max-w-4xl rounded-xl overflow-hidden shadow-lg">
        
        {/* Left Side - Form */}
        <div className="flex-1 bg-white p-10 flex flex-col justify-center min-w-[280px]">
          <div className="text-center mb-8">
            <img
              src={flightImage}
              alt="logo"
              className="w-40 h-40 object-cover rounded-xl shadow-md mx-auto mb-4"
            />
            <h3 className="text-blue-700 mb-2 text-2xl font-semibold">Shuttle Booking System</h3>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Phone number or email"
              className="w-full p-3 border border-blue-400 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-3 border border-blue-400 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full p-3 border border-blue-400 rounded-lg bg-slate-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="booker">Booker</option>
              <option value="organizer">Flight Organizer (Admin)</option>
            </select>

            <button
              type="submit"
              className="w-full bg-blue-700 text-white font-bold py-3 rounded-lg hover:bg-blue-800 transition"
            >
              Sign In
            </button>

            <div className="text-center">
              <a
                href="#"
                className="text-blue-500 underline"
                onClick={(e) => {
                  e.preventDefault();
                  onForgotPasswordClick?.();
                }}
              >
                Forgot password?
              </a>
            </div>

            <div className="text-center flex justify-center items-center gap-2">
              <span>Don't have an account?</span>
              <button
                type="button"
                className="border border-red-600 text-red-600 font-bold px-4 py-2 rounded-lg hover:bg-red-50 transition"
                onClick={onSignUpClick}
              >
                Create new
              </button>
            </div>
          </form>
        </div>

        {/* Right Side - Background Image */}
        <div
          className="flex-1 relative min-w-[280px] flex items-center justify-center text-white p-8 text-center"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(29,78,216,0.8), rgba(69,123,157,0.8)), url(${flightImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div className="bg-black bg-opacity-30 p-6 rounded-lg">
            <h3 className="mb-4 text-xl font-semibold">We are more than just a company</h3>
            <p>
              Plan and book your trips easily. Whether you are a passenger or organizer, our shuttle booking system ensures a seamless experience.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Login;
