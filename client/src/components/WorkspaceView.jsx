import { useEffect, useState } from "react";
import RecipientCard from "@/components/RecipientCard";
import ReceiverEmailComposer from "@/components/ReceiverEmailComposer";
import { apiRequest } from "@/lib/api";

export default function WorkspaceView({ workspaceId }) {
  const [recipients, setRecipients] = useState([]);
  const [composerOpen, setComposerOpen] = useState(false);

  /* ---------- Fetch workspace recipients ---------- */
  const fetchRecipients = async () => {
    const res = await apiRequest(`/workspace/${workspaceId}/recipients`);
    setRecipients(res.recipients);
  };

  useEffect(() => {
    fetchRecipients();
  }, [workspaceId]);

  /* ---------- Draft saved callback ---------- */
  const handleDraftSaved = (email) => {
    setRecipients((prev) => {
      const index = prev.findIndex((r) => r._id === email.recipientId);

      // New recipient → add card
      if (index === -1) {
        return [
          {
            _id: email.recipientId,
            email,
          },
          ...prev,
        ];
      }

      // Existing recipient → update card
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        email,
      };
      return updated;
    });
  };

  return (
    <div className="flex h-full">
      {/* LEFT: Recipient Cards */}
      <div className="w-[360px] border-r border-zinc-800 p-3 space-y-2">
        {recipients.map((r) => (
          <RecipientCard
            key={r._id}
            recipient={r}
            email={r.email}
            onClick={() => setComposerOpen(true)}
          />
        ))}
      </div>

      {/* RIGHT: Composer */}
      <ReceiverEmailComposer
        isOpen={composerOpen}
        onClose={() => setComposerOpen(false)}
        workspaceId={workspaceId}
        senderContext={true}
        onDraftSaved={handleDraftSaved} // 🔑 critical
      />
    </div>
  );
}
