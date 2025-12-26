import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";
import { Mail, Lock } from "lucide-react";
import { useEffect } from "react";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/app", { replace: true });
  }, [navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest("/user/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem("token", data.token);
      navigate("/app");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <Card className="w-full max-w-3xl bg-zinc-900 border-zinc-800">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* LEFT — COPY */}
          <div className="p-8 border-b md:border-b-0 md:border-r border-zinc-800">
            <h1 className="text-3xl font-semibold text-white mb-4">
              Welcome back to Mailto
            </h1>

            <p className="text-zinc-400 mb-6">
              Continue managing your outreach campaigns, tracking replies, and
              optimizing conversions.
            </p>

            <ul className="space-y-3 text-sm text-zinc-300">
              <li className="flex items-center gap-2">
                <Mail size={16} />
                View sent & drafted emails
              </li>
              <li className="flex items-center gap-2">
                <Lock size={16} />
                Secure access to your workspaces
              </li>
            </ul>
          </div>

          {/* RIGHT — FORM */}
          <div className="p-8">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-white">Log in</CardTitle>
              <p className="text-sm text-zinc-400 mt-1">
                Enter your credentials to continue
              </p>
            </CardHeader>

            <CardContent className="px-0 space-y-4">
              <Input
                placeholder="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
              />

              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
              />

              {error && <p className="text-sm text-red-400">{error}</p>}

              {/* PRIMARY CTA */}
              <Button
                onClick={handleLogin}
                disabled={loading}
                className="
                  w-full
                  bg-gradient-to-r from-blue-600 to-blue-500
                  text-white
                  hover:from-blue-500 hover:to-blue-400
                  hover:cursor-pointer
                  transition-all duration-200
                  shadow-md
                  hover:shadow-lg
                  active:scale-[0.98]
                  disabled:opacity-60 disabled:cursor-not-allowed
                "
              >
                {loading ? "Logging in..." : "Log in"}
              </Button>

              {/* LINK TO SIGNUP */}
              <p className="text-sm text-zinc-400 text-center">
                Don’t have an account?{" "}
                <Link
                  to="/signup"
                  className="text-white underline hover:opacity-80"
                >
                  Sign up
                </Link>
              </p>
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  );
}
