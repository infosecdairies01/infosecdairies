import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { apiUrl } from "@/services/api";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        setError(null);

        const res = await fetch(apiUrl("/api/auth/google/jwt/"), {
          method: "GET",
          credentials: "include", // send Django session cookie
        });

        if (!res.ok) {
          setError("Could not complete Google login. Please try again.");
          return;
        }

        const data = await res.json();

        // Check if Google signup requires email verification
        if (data.requires_verification) {
          navigate(`/verify-email?email=${encodeURIComponent(data.email)}`, { replace: true });
          return;
        }

        const user = data.user || {};
        const tokens = data.tokens || {};

        if (!user.email || !tokens.access) {
          setError("Invalid response from server during Google login.");
          return;
        }

        login({ email: user.email, fullName: user.full_name, tokens });
        navigate("/dashboard", { replace: true });
      } catch (err) {
        setError("Network error while completing Google login.");
      }
    };

    fetchTokens();
  }, [login, navigate]);

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center text-foreground">
        <h1 className="text-2xl font-bold mb-2">Completing Google sign-in...</h1>
        <p className="text-muted-foreground mb-4">
          Please wait while we secure your session.
        </p>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </main>
  );
};

export default GoogleCallback;
