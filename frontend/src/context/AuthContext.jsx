import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("skillbridgeToken"));
  const [loading, setLoading] = useState(true);

  const saveAuth = (authToken, authUser) => {
    localStorage.setItem("skillbridgeToken", authToken);
    setToken(authToken);
    setUser(authUser);
  };

  const login = async (formData) => {
    const { data } = await api.post("/auth/login", formData);
    saveAuth(data.token, data.user);
    return data;
  };

  const register = async (formData) => {
    const { data } = await api.post("/auth/register", formData);
    saveAuth(data.token, data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("skillbridgeToken");
    setToken(null);
    setUser(null);
  };

  const fetchCurrentUser = async () => {
    if (!localStorage.getItem("skillbridgeToken")) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, fetchCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
