import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";
import { Sparkles, Mail, TrendingUp } from "lucide-react";
import { useEffect } from "react";

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && location.pathname !== "/onboarding/workspace") {
      navigate("/app", { replace: true });
    }
  }, [navigate, location.pathname]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await apiRequest("/user/signup", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          email,
          password,
        }),
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
          {/* LEFT — VALUE PROP */}
          <div className="p-8 border-b md:border-b-0 md:border-r border-zinc-800">
            <h1 className="text-3xl font-semibold text-white mb-4">
              Create your Mailto workspace
            </h1>

            <p className="text-zinc-400 mb-6">
              Generate personalized cold emails, send them at scale, and track
              engagement — all powered by AI.
            </p>

            <ul className="space-y-3 text-sm text-zinc-300">
              <li className="flex items-center gap-2">
                <Sparkles size={16} />
                AI-personalized outreach
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} />
                Send & track email status
              </li>
              <li className="flex items-center gap-2">
                <TrendingUp size={16} />
                Improve conversions with analytics
              </li>
            </ul>
          </div>

          {/* RIGHT — FORM */}
          <div className="p-8">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-white">Sign up</CardTitle>
              <p className="text-sm text-zinc-400 mt-1">
                Create your account to get started
              </p>
            </CardHeader>

            <CardContent className="px-0 space-y-4">
              <Input
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
              />

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

              <Button
                onClick={handleSignup}
                disabled={loading}
                className="
                        w-full bg-linear-to-r from-blue-600 to-blue-500
                        text-white hover:from-blue-500 hover:to-blue-400 hover:cursor-pointer
                        transition-all duration-200 shadow-md
                        hover:shadow-lg active:scale-[0.98]
                        disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Creating account..." : "Create account"}
              </Button>

              <p className="text-sm text-zinc-400 text-center">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-white underline hover:opacity-80"
                >
                  Log in
                </Link>
              </p>
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  );
}
