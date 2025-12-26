import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function WorkspacePage({ workspace }) {
  // HARD GUARD — prevents white screen
  if (!workspace) {
    return (
      <div className="h-full flex items-center justify-center text-zinc-400">
        Loading workspace...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            {workspace.name}
          </h1>
          <p className="text-sm text-zinc-400">Workspace</p>
        </div>

        <Button
          size="sm"
          className="
            flex items-center gap-2
            hover:cursor-pointer
          "
        >
          <Plus size={16} />
          Add Recipient
        </Button>
      </div>

      {/* ================= STATS / PLACEHOLDER ================= */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Recipients" value="0" />
        <StatCard label="Emails Sent" value="0" />
        <StatCard label="Open Rate" value="—" />
      </div>

      {/* ================= EMPTY STATE ================= */}
      <div className="border border-dashed border-zinc-700 rounded-xl p-12 text-center text-zinc-400">
        <p className="text-lg mb-2">No recipients yet</p>
        <p className="text-sm mb-4">
          Add a recipient to generate and send personalized emails.
        </p>

        <Button variant="secondary" className="hover:cursor-pointer">
          <Plus size={16} />
          Add your first recipient
        </Button>
      </div>
    </div>
  );
}

/* ================= SMALL COMPONENT ================= */

function StatCard({ label, value }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <p className="text-sm text-zinc-400">{label}</p>
      <p className="text-xl font-semibold text-white mt-1">{value}</p>
    </div>
  );
}
