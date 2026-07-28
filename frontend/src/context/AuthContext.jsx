import { createContext, useContext, useState, useEffect } from "react";
import api, { setAccessToken, getAccessToken } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, try a silent refresh. If the user still has a valid
  // refresh cookie from a previous visit, this logs them back in
  // without asking for a password again.
  useEffect(() => {
    const tryRefresh = async () => {
      try {
        const { data } = await api.post("/refresh");
        setAccessToken(data.accessToken);
        const dashboard = await api.get("/dashboard");
        setUser(dashboard.data.user);
      } catch (err) {
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    tryRefresh();
  }, []);

  const signup = async (name, email, password) => {
    const { data } = await api.post("/signup", { name, email, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
  };

  const login = async (email, password) => {
    const { data } = await api.post("/login", { email, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signup, login, logout, isAuthenticated: !!getAccessToken() }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
