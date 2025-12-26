import { useState } from "react";
import { Plus, Pencil } from "lucide-react";

import SenderContextModal from "./SenderContextModal";
import ReceiverEmailComposer from "./ReceiverEmailComposer";
import RecipientCard from "./RecipientCard";

export default function WorkspaceView() {
  const [senderContext, setSenderContext] = useState(null);
  const [recipients, setRecipients] = useState([]);

  const [isContextOpen, setContextOpen] = useState(false);
  const [isAddingRecipient, setAddingRecipient] = useState(false);
  const [activeRecipient, setActiveRecipient] = useState(null);

  const handleSaveRecipient = ({ receiverHandle, email, notes }) => {
    setRecipients((prev) => [
      {
        id: crypto.randomUUID(),
        xHandle: receiverHandle,
        email,
        notes,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-semibold">My Outreach Workspace</h1>
          <p className="text-sm text-zinc-400">One context, many recipients</p>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Add / Edit Context */}
          <button
            onClick={() => setContextOpen(true)}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-800 text-[14px] text-zinc-200 hover:bg-zinc-700 transition"
          >
            <Pencil size={14} />
            {senderContext ? "Edit" : "Add"} Context
          </button>

          {/* Add Recipient */}
          <button
            onClick={() => setAddingRecipient(true)}
            disabled={!senderContext}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-100 text-zinc-900 text-[14px] font-medium hover:bg-zinc-200 transition disabled:opacity-50"
          >
            <Plus size={14} />
            Add Recipient
          </button>
        </div>
      </div>

      {/* Empty State */}
      {!recipients.length && (
        <div className="border border-dashed border-zinc-800 rounded-2xl p-10 text-center text-zinc-400">
          {senderContext
            ? "Add your first recipient"
            : "Define sender context to begin"}
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipients.map((r) => (
          <RecipientCard
            key={r.id}
            recipient={r}
            onClick={() => setActiveRecipient(r)}
          />
        ))}
      </div>

      {/* Composer Modal */}
      <ReceiverEmailComposer
        mode="compose"
        senderContext={senderContext}
        isOpen={isAddingRecipient}
        onClose={() => setAddingRecipient(false)}
        onSave={handleSaveRecipient}
      />

      {/* Viewer Modal */}
      <ReceiverEmailComposer
        mode="view"
        senderContext={senderContext}
        isOpen={!!activeRecipient}
        initialData={activeRecipient}
        onClose={() => setActiveRecipient(null)}
      />

      {/* Context Modal */}
      <SenderContextModal
        isOpen={isContextOpen}
        onClose={() => setContextOpen(false)}
        onSave={(ctx) => {
          setSenderContext(ctx);
          setContextOpen(false);
        }}
      />
    </div>
  );
}
