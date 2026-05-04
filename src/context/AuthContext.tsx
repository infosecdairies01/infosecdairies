import React, { createContext, useContext, useEffect, useState } from "react";
import { apiUrl } from "@/services/api";
import { verifyJwtLocally } from "@/lib/jwtVerify";

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
    // Get userEmail before removing it from localStorage
    const userEmail = localStorage.getItem("userEmail");
    
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userFullName");
    
    // Clear user-specific activity data when logging out
    if (userEmail) {
      const userSpecificKey = `user_activity_log_${userEmail}`;
      localStorage.removeItem(userSpecificKey);
    }
    
    setUser(null);
  };

  const refreshAccessToken = async (): Promise<boolean> => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return false;
    try {
      const res = await fetch(apiUrl("/api/auth/token/refresh/"), {
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

    (async () => {
      // Restore session only after cryptographically verifying the stored token.
      // This instantly destroys any fake session an attacker may have injected.
      if (storedEmail && accessToken) {
        try {
          const payload = await verifyJwtLocally(accessToken);
          if (payload.email?.toLowerCase() === storedEmail.toLowerCase()) {
            setUser({ email: storedEmail, fullName: storedFullName || undefined });
            return;
          }
        } catch {
          // Token invalid, tampered, or expired — fall through to refresh / logout
        }
      }

      // Access token missing / invalid: try silent refresh
      if (storedEmail && refreshToken) {
        const ok = await refreshAccessToken();
        if (ok) {
          // After refresh, the new access token is already stored; verify it too
          const newToken = localStorage.getItem("accessToken");
          if (newToken) {
            try {
              const payload = await verifyJwtLocally(newToken);
              if (payload.email?.toLowerCase() === storedEmail.toLowerCase()) {
                setUser({ email: storedEmail, fullName: storedFullName || undefined });
                return;
              }
            } catch {
              // Refreshed token also fails verification
            }
          }
        }
        logout();
      }
    })();
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
