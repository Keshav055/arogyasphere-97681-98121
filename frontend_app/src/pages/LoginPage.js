import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * Login page for user authentication (email/phone + password).
 * Integrates with /auth/token endpoint.
 */
const LoginPage = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const params = new URLSearchParams();
      params.append("username", form.username);
      params.append("password", form.password);
      // Try email or phone in username field as per backend
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE || "http://localhost:3001"}/auth/token`,
        params,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
      localStorage.setItem("token", res.data.access_token);
      navigate("/dashboard");
    } catch (err) {
      setError("Login failed: incorrect credentials.");
    }
  };

  return (
    <div className="container">
      <h2>Login to ArogyaMitr</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 340, margin: "auto" }}>
        <input
          name="username"
          type="text"
          placeholder="Email or Phone"
          value={form.username}
          onChange={handleChange}
          required
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
          Login
        </button>
      </form>
      <button className="btn" style={{ marginTop: 16, width: "100%" }} onClick={() => navigate("/oauth")}>
        Login with Google/Apple
      </button>
      <div style={{ fontSize: 12 }}>
        Don't have an account? <button style={{ color: "#3c83af", background: "none", border: "none" }} onClick={() => navigate("/signup")}>Sign up</button>
      </div>
      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
    </div>
  );
};

export default LoginPage;
