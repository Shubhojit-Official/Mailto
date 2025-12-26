import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-white">Mailto</h1>

        <p className="text-zinc-400 max-w-md mx-auto">
          Personalized cold outreach powered by AI. Generate, send, and track
          emails — all in one workspace.
        </p>

        <div className="flex justify-center gap-4">
          <Link to="/signup">
            <Button size="lg">Sign up</Button>
          </Link>

          <Link to="/login">
            <Button variant="secondary" size="lg">
              Log in
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
