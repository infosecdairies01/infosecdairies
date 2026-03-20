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

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userFullName");
    setUser(null);
  };

  const refreshAccessToken = async (): Promise<boolean> => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return false;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/token/refresh/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      if (!data?.access) return false;
      localStorage.setItem("accessToken", data.access);
      // Support refresh rotation
      if (data.refresh) {
        localStorage.setItem("refreshToken", data.refresh);
      }
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    const storedFullName = localStorage.getItem("userFullName");
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    // Restore session if we have an access token.
    if (storedEmail && accessToken) {
      setUser({ email: storedEmail, fullName: storedFullName || undefined });
      return;
    }

    // If access token missing/expired but refresh exists, silently refresh.
    if (storedEmail && refreshToken) {
      (async () => {
        const ok = await refreshAccessToken();
        if (ok) {
          setUser({ email: storedEmail, fullName: storedFullName || undefined });
        } else {
          logout();
        }
      })();
    }
  }, []);

  // Keep the user logged in by refreshing access token periodically.
  useEffect(() => {
    if (!user) return;
    const intervalMs = 10 * 60 * 1000; // 10 minutes
    const id = window.setInterval(async () => {
      const ok = await refreshAccessToken();
      if (!ok) {
        logout();
      }
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [user]);

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
