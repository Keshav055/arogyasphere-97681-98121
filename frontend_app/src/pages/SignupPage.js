import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth/AuthContext";

/**
 * Signup page for user registration (email/phone + password).
 * Calls /signup backend endpoint.
 */
const SignupPage = () => {
  const [form, setForm] = useState({ email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = { ...form };
      // Backend requires both email and phone -- enforce here
      if (!payload.email || !payload.phone) {
        setError("Please provide both Email and Phone.");
        return;
      }
      // Align endpoint and payload with backend requirement
      const res = await api.post(
        "/signup",
        payload
      );
      // Use token field as returned by backend
      loginWithToken(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      // Show backend error detail, fallback generic
      setError(
        err?.response?.data?.detail || "Signup failed. Please try a different email/phone."
      );
    }
  };

  return (
    <div className="container">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 340, margin: "auto" }}>
        <input
          name="email"
          type="email"
          placeholder="Email (optional)"
          value={form.email}
          onChange={handleChange}
          style={{ margin: 8, padding: 8, width: "100%" }}
        />
        <input
          name="phone"
          type="tel"
          placeholder="Phone (optional)"
          value={form.phone}
          onChange={handleChange}
          style={{ margin: 8, padding: 8, width: "100%" }}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={{ margin: 8, padding: 8, width: "100%" }}
        />
        <button type="submit" className="btn" style={{ width: "100%" }}>
          Sign Up
        </button>
      </form>
      <div style={{ fontSize: 12 }}>
        Already have an account? <button style={{ color: "#3c83af", background: "none", border: "none" }} onClick={() => navigate("/login")}>Login</button>
      </div>
      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
    </div>
  );
};
export default SignupPage;
