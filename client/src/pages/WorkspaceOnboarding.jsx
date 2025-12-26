import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";

const COLORS = [
  { key: "blue", class: "bg-blue-500" },
  { key: "green", class: "bg-green-500" },
  { key: "purple", class: "bg-purple-500" },
  { key: "orange", class: "bg-orange-500" },
  { key: "pink", class: "bg-pink-500" },
  { key: "teal", class: "bg-teal-500" },
];

export default function WorkspaceOnboarding() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [color, setColor] = useState("blue");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------- AUTH GUARD ---------- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  const handleCreate = async () => {
    if (!name.trim()) {
      setError("Workspace name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await apiRequest("/workspace", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          color,
        }),
      });

      navigate("/app");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <Card className="w-full max-w-xl bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white text-2xl">
            Create your first workspace
          </CardTitle>
          <p className="text-zinc-400 mt-1">
            This is where all your outreach will live.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* NAME */}
          <div className="space-y-2">
            <label className="text-sm text-zinc-300">Workspace name</label>
            <Input
              placeholder="e.g. Hiring Outreach"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
            />
          </div>

          {/* COLOR PICKER */}
          <div className="space-y-2">
            <label className="text-sm text-zinc-300">Workspace color</label>

            <div className="flex gap-3">
              {COLORS.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setColor(c.key)}
                  className={`w-7 h-7 rounded-full transition
                    ${c.class}
                    ${
                      color === c.key
                        ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-900"
                        : "opacity-70 hover:opacity-100"
                    }`}
                />
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          {/* CTA */}
          <Button
            onClick={handleCreate}
            disabled={loading}
            className="
              w-full
              bg-linear-to-r from-blue-600 to-blue-500
              hover:from-blue-500 hover:to-blue-400
              hover:cursor-pointer
              transition-all duration-200
              shadow-md hover:shadow-lg
              active:scale-[0.98]
              disabled:opacity-60
            "
          >
            {loading ? "Creating workspace..." : "Create workspace"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
