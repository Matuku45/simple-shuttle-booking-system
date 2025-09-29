import React, { useState } from 'react';

const bgImage =
  "url('https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp')";

const mainColor = "#1d4ed8"; // App primary color
const accentColor = "#457b9d"; // Accent color

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    repeatPassword: "",
    agree: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.repeatPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (form.password !== form.repeatPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!form.agree) {
      setError("You must agree to the Terms of service.");
      return;
    }
    // Simulate success (replace with actual API call)
    setSuccess("Account created successfully! You can now log in.");
    setForm({
      name: "",
      email: "",
      password: "",
      repeatPassword: "",
      agree: false,
    });
  };

  return (
    <section
      style={{
        minHeight: "100vh",
        backgroundImage: bgImage,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)",
          borderRadius: "18px",
          boxShadow: "0 4px 24px rgba(69,123,157,0.10)",
          padding: "32px 24px",
          maxWidth: "420px",
          width: "100%",
        }}
      >
        <div className="text-center">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
            style={{ width: "185px" }}
            alt="logo"
          />
          <h4 className="mt-1 mb-5 pb-1">We are The Lotus Team</h4>
        </div>

        <h2
          style={{
            textTransform: "uppercase",
            textAlign: "center",
            marginBottom: "28px",
            color: mainColor,
            fontWeight: "bold",
            letterSpacing: "1px",
            fontSize: "2rem",
          }}
        >
          Create an account
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "18px" }}>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: `1px solid ${accentColor}`,
                fontSize: "1rem",
                outline: "none",
              }}
            />
          </div>
          <div style={{ marginBottom: "18px" }}>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your Email"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: `1px solid ${accentColor}`,
                fontSize: "1rem",
                outline: "none",
              }}
            />
          </div>
          <div style={{ marginBottom: "18px" }}>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: `1px solid ${accentColor}`,
                fontSize: "1rem",
                outline: "none",
              }}
            />
          </div>
          <div style={{ marginBottom: "18px" }}>
            <input
              type="password"
              name="repeatPassword"
              value={form.repeatPassword}
              onChange={handleChange}
              placeholder="Repeat your password"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: `1px solid ${accentColor}`,
                fontSize: "1rem",
                outline: "none",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "18px",
            }}
          >
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
              id="agree"
              style={{ marginRight: "8px" }}
            />
            <label
              htmlFor="agree"
              style={{ fontSize: "0.98rem" }}
            >
              I agree all statements in{" "}
              <a
                href="#!"
                style={{
                  color: accentColor,
                  textDecoration: "underline",
                }}
              >
                Terms of service
              </a>
            </label>
          </div>
          {error && (
            <div
              style={{
                color: "#e63946",
                marginBottom: "12px",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}
          {success && (
            <div
              style={{
                color: "#38b000",
                marginBottom: "12px",
                textAlign: "center",
              }}
            >
              {success}
            </div>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "8px",
            }}
          >
            <button
              type="submit"
              style={{
                background: mainColor,
                color: "#fff",
                fontWeight: "bold",
                padding: "12px 32px",
                borderRadius: "10px",
                border: "none",
                fontSize: "1.1rem",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(69,123,157,0.10)",
                transition: "background 0.2s",
              }}
            >
              Register
            </button>
          </div>
          <p
            style={{
              textAlign: "center",
              color: "#6c757d",
              marginTop: "24px",
              fontSize: "1rem",
            }}
          >
            Have already an account?{" "}
            <a
              href="/login"
              style={{
                color: accentColor,
                fontWeight: "bold",
                textDecoration: "underline",
              }}
            >
              Login here
            </a>
          </p>
        </form>
      </div>
    </section>
  );
};

export default SignUp;