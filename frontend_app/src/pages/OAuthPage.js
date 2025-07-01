import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * OAuth social login page (Google/Apple, mock interface, matches /auth/oauth).
 */
const OAuthPage = () => {
  const [provider, setProvider] = useState("google");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE || "http://localhost:3001"}/auth/oauth`,
        { provider, token }
      );
      localStorage.setItem("token", res.data.access_token);
      navigate("/dashboard");
    } catch {
      setError("OAuth login failed.");
    }
  };

  return (
    <div className="container">
      <h2>Social Login</h2>
      <select value={provider} onChange={(e) => setProvider(e.target.value)} style={{ margin: 8, padding: 8 }}>
        <option value="google">Google</option>
        <option value="apple">Apple</option>
      </select>
      <input
        type="text"
        placeholder="OAuth Token (simulate)"
        value={token}
        onChange={e => setToken(e.target.value)}
        style={{ margin: 8, padding: 8, width: "100%" }}
      />
      <button className="btn" style={{ marginTop: 10, width: "100%" }} onClick={handleLogin}>
        Login with {provider.charAt(0).toUpperCase() + provider.slice(1)}
      </button>
      <button className="btn" style={{ marginTop: 10, width: "100%" }} onClick={() => navigate("/login")}>
        Back to Login
      </button>
      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
    </div>
  );
};
export default OAuthPage;
