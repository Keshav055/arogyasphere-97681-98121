import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth/AuthContext";

/**
 * Signup page for user registration (email/phone + password).
 * Calls /auth/register backend endpoint.
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
      if (!payload.email && !payload.phone) {
        setError("Please provide Email or Phone.");
        return;
      }
      const res = await api.post(
        "/auth/register",
        payload
      );
      loginWithToken(res.data.access_token);
      navigate("/dashboard");
    } catch (err) {
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
