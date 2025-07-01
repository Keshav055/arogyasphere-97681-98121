import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api, API_BASE } from "../api";
const TOKEN_STORE_KEY = "token";

const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => localStorage.getItem(TOKEN_STORE_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!token);
  const [error, setError] = useState("");

  // PUBLIC_INTERFACE
  const saveToken = (t) => {
    if (t) {
      localStorage.setItem(TOKEN_STORE_KEY, t);
      setTokenState(t);
    } else {
      localStorage.removeItem(TOKEN_STORE_KEY);
      setTokenState(null);
    }
  };

  // PUBLIC_INTERFACE
  const logout = useCallback(() => {
    saveToken(null);
    setUser(null);
  }, []);

  // PUBLIC_INTERFACE
  const fetchUser = useCallback(async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/auth/whoami`);
      setUser(res.data || null);
      setLoading(false);
    } catch (err) {
      setUser(null);
      setError("Session expired or unauthorized. Please login again.");
      setLoading(false);
      logout();
    }
  }, [token, logout]);

  // On token change, fetch whoami
  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [token, fetchUser]);

  // PUBLIC_INTERFACE
  const loginWithToken = (jwt) => {
    saveToken(jwt);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        error,
        setError,
        loginWithToken,
        logout,
        refetchUser: fetchUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// PUBLIC_INTERFACE
/**
 * Access the authentication context: {user, token, error, loading, loginWithToken, logout, refetchUser}
 */
export function useAuth() {
  return useContext(AuthContext);
}

/**
 * Hook to enforce authentication – redirects or returns loading state if not authenticated.
 */
export function useRequireAuth(navigate, redirectTo = "/login") {
  const { token, loading, user, logout } = useAuth();
  useEffect(() => {
    if (!loading && !token) {
      // Not authenticated
      navigate(redirectTo);
    }
  }, [token, loading, navigate, redirectTo]);
  return { user, token, loading, logout };
}
