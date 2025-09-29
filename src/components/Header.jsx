import React, { useState } from "react";

const Header = ({ onChangeView }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: "Home", view: "home", color: "text-red-400", hover: "hover:text-red-300" },
    { name: "Login", view: "login", color: "text-yellow-400", hover: "hover:text-yellow-300" },
    { name: "Sign Up", view: "signup", color: "text-green-400", hover: "hover:text-green-300" },
    { name: "Passenger", view: "passenger", color: "text-purple-400", hover: "hover:text-purple-300" },
    { name: "Admin", view: "admin", color: "text-pink-400", hover: "hover:text-pink-300" },
    { name: "About", view: "about", color: "text-blue-400", hover: "hover:text-blue-300" },
  ];

  return (
    <header className="w-full bg-blue-900 text-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3 sm:px-6">
        {/* Title */}
        <div className="text-xl sm:text-2xl font-bold tracking-wide">
          Shuttle Booking Pro
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => onChangeView(item.view)}
              className={`font-medium px-3 py-1 rounded transition-colors duration-200 ${item.color} ${item.hover}`}
            >
              {item.name}
            </button>
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-white text-3xl focus:outline-none"
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="md:hidden bg-blue-800 shadow-md">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => {
                onChangeView(item.view);
                setMobileOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 font-medium ${item.color} ${item.hover} transition-colors duration-200`}
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
