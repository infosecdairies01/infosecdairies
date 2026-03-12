import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { apiUrl } from "@/services/api";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordRules = useMemo(() => {
    const value = password || "";
    return {
      minLen: value.length >= 10,
      upper: /[A-Z]/.test(value),
      lower: /[a-z]/.test(value),
      digit: /\d/.test(value),
      symbol: /[^A-Za-z0-9]/.test(value),
    };
  }, [password]);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGoogleLogin = () => {
    window.location.href = apiUrl("/accounts/google/login/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    if (!isLogin) {
      if (!firstName || !lastName) {
        setError("First name and last name are required for sign up.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    try {
      setLoading(true);

      const url = isLogin
        ? `/api/auth/login/`
        : `/api/auth/register/`;

      const body = isLogin
        ? { email, password }
        : { full_name: `${firstName} ${lastName}`.trim(), email, password };

      const response = await fetch(apiUrl(url), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data && typeof data === "object") {
          const firstErrorKey = Object.keys(data)[0];
          const firstErrorValue =
            firstErrorKey && Array.isArray(data[firstErrorKey])
              ? data[firstErrorKey][0]
              : data[firstErrorKey] || data.detail || "Something went wrong. Please try again.";
          setError(String(firstErrorValue));
        } else {
          setError("Something went wrong. Please try again.");
        }
        return;
      }

      // Check if registration requires email verification
      if (!isLogin && data.requires_verification) {
        setSuccess("Verification code sent! Redirecting to verification page...");
        setTimeout(() => {
          navigate(`/verify-email?email=${encodeURIComponent(data.email)}`);
        }, 1000);
        return;
      }

      const tokens = data.tokens;

      // CRITICAL: Verify token cryptographically to prevent response manipulation attacks
      // Attacker can modify 401 response to 200 with fake tokens - this catches that
      if (tokens?.access) {
        const verifyResponse = await fetch(apiUrl("/api/auth/verify/"), {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${tokens.access}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!verifyResponse.ok) {
          setError("Invalid session. Please try logging in again.");
          setLoading(false);
          return;
        }

        const verifyData = await verifyResponse.json();
        if (!verifyData.valid) {
          setError("Session validation failed. Please try again.");
          setLoading(false);
          return;
        }
      } else {
        setError("Authentication failed. Please try again.");
        setLoading(false);
        return;
      }

      const userData = data.user || {};
      const userEmail: string = userData.email || email;
      const fullNameFromApi: string | undefined =
        userData.full_name || `${firstName} ${lastName}`.trim() || undefined;

      login({ email: userEmail, fullName: fullNameFromApi, tokens });

      setSuccess(isLogin ? "Logged in successfully." : "Account created successfully.");

      setTimeout(() => {
        navigate("/courses");
      }, 800);
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="absolute inset-0 circuit-pattern opacity-5" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 animate-fade-up">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
            <span className="font-bold text-2xl gradient-text">InfosecDairies</span>
          </Link>
          <h1 className="text-3xl font-bold mt-4">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isLogin
              ? "Enter your credentials to access your account"
              : "Sign up to start your blue team journey"}
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-8 animate-fade-up" style={{ animationDelay: "100ms" }}>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="First name"
                    className="bg-background"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Last name"
                    className="bg-background"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="bg-background"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="bg-background pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {!isLogin && (
                <div className="mt-2 rounded-md border border-border bg-background/40 p-3">
                  <p className="text-xs text-muted-foreground mb-2">Password must include:</p>
                  <div className="space-y-1 text-xs">
                    <div className={passwordRules.minLen ? "text-green-500" : "text-muted-foreground"}>
                      At least 10 characters
                    </div>
                    <div className={passwordRules.upper ? "text-green-500" : "text-muted-foreground"}>
                      One uppercase letter (A-Z)
                    </div>
                    <div className={passwordRules.lower ? "text-green-500" : "text-muted-foreground"}>
                      One lowercase letter (a-z)
                    </div>
                    <div className={passwordRules.digit ? "text-green-500" : "text-muted-foreground"}>
                      One number (0-9)
                    </div>
                    <div className={passwordRules.symbol ? "text-green-500" : "text-muted-foreground"}>
                      One symbol (!@#$...)
                    </div>
                  </div>
                </div>
              )}
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="bg-background pr-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            {success && (
              <p className="text-sm text-green-500">{success}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? isLogin
                  ? "Signing in..."
                  : "Creating account..."
                : isLogin
                  ? "Sign In"
                  : "Sign Up"}
            </Button>

            {isLogin && (
              <div className="text-right">
                <Link
                  to={`/forgot-password?email=${encodeURIComponent(email || "")}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            <div className="mt-4 flex items-center justify-center">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-[#00ffc8]/60 text-sm font-medium text-[#00ffc8] hover:bg-[#00ffc8]/10 transition-colors py-2"
              >
                <span>Continue with Google</span>
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Auth;
