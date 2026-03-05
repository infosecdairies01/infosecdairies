import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthUser {
  email: string;
  fullName?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (data: { email: string; fullName?: string; tokens?: { access?: string; refresh?: string } }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    const storedFullName = localStorage.getItem("userFullName");
    const accessToken = localStorage.getItem("accessToken");
    if (storedEmail && accessToken) {
      setUser({ email: storedEmail, fullName: storedFullName || undefined });
    }
  }, []);

  const login: AuthContextValue["login"] = (data) => {
    const { email, fullName, tokens } = data;
    if (tokens?.access) {
      localStorage.setItem("accessToken", tokens.access);
    }
    if (tokens?.refresh) {
      localStorage.setItem("refreshToken", tokens.refresh);
    }
    localStorage.setItem("userEmail", email);
    if (fullName) {
      localStorage.setItem("userFullName", fullName);
    } else {
      localStorage.removeItem("userFullName");
    }
    setUser({ email, fullName });
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userFullName");
    setUser(null);
  };

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
