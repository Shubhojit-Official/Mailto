import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import EmailCard from "@/components/EmailCard";
import ReceiverEmailComposer from "@/components/ReceiverEmailComposer";

export default function WorkspacePage({ workspace }) {
  const [emails, setEmails] = useState([]);
  const [composerOpen, setComposerOpen] = useState(false);

  if (!workspace) {
    return (
      <div className="h-full flex items-center justify-center text-zinc-400">
        Loading workspace...
      </div>
    );
  }

  // This function receives the email object from the composer
  const handleAddEmail = (newEmail) => {
    setEmails((prev) => [newEmail, ...prev]);
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            {workspace.name}
          </h1>
          <p className="text-sm text-zinc-400">Workspace</p>
        </div>

        <Button size="sm" onClick={() => setComposerOpen(true)}>
          <Plus size={16} />
          Compose Email
        </Button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Recipients" value={emails.length} />
        <StatCard
          label="Emails Sent"
          value={emails.filter((e) => e.status === "sent").length}
        />
        <StatCard label="Open Rate" value="—" />
      </div>

      {/* EMAIL LIST */}
      <div className="space-y-3">
        {emails.length === 0 ? (
          <div className="border border-dashed border-zinc-700 rounded-xl p-12 text-center text-zinc-400">
            No emails yet
          </div>
        ) : (
          emails.map((email) => <EmailCard key={email.id} email={email} />)
        )}
      </div>

      {/* COMPOSER */}
      <ReceiverEmailComposer
        isOpen={composerOpen}
        onClose={() => setComposerOpen(false)}
        workspaceId={workspace._id}
        onAddEmail={handleAddEmail} // Correctly passed
      />
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <p className="text-sm text-zinc-400">{label}</p>
      <p className="text-xl font-semibold text-white mt-1">{value}</p>
    </div>
  );
}
