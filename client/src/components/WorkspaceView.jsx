import { useState } from "react";
import { Plus, Pencil } from "lucide-react";

import ReceiverEmailComposer from "./ReceiverEmailComposer";
import RecipientCard from "./RecipientCard";
import SenderContextModal from "./SenderContextModal";

export default function WorkspaceView() {
  /* ---------- DATA ---------- */
  const [senderContext, setSenderContext] = useState(null);
  const [recipients, setRecipients] = useState([]);

  /* ---------- CONTEXT MODAL ---------- */
  const [isContextOpen, setContextOpen] = useState(false);

  /* ---------- COMPOSER ---------- */
  const [isComposerOpen, setComposerOpen] = useState(false);
  const [composerMode, setComposerMode] = useState("compose"); // compose | view
  const [editingRecipient, setEditingRecipient] = useState(null);

  /* ---------- ACTIONS ---------- */
  const openNewComposer = () => {
    setEditingRecipient(null);
    setComposerMode("compose");
    setComposerOpen(true);
  };

  const openExistingRecipient = (recipient) => {
    setEditingRecipient(recipient);
    setComposerMode(recipient.email.status === "draft" ? "compose" : "view");
    setComposerOpen(true);
  };

  const closeComposer = () => {
    setComposerOpen(false);
    setEditingRecipient(null);
    setComposerMode("compose");
  };

  const upsertRecipient = ({ recipient, xHandle, notes, email }) => {
    setRecipients((prev) => {
      if (recipient) {
        return prev.map((r) =>
          r.id === recipient.id ? { ...r, xHandle, notes, email } : r
        );
      }

      return [
        {
          id: crypto.randomUUID(),
          xHandle,
          notes,
          email,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ];
    });

    closeComposer();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      {/* ---------- HEADER ---------- */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold">Workspace</h1>
          <p className="text-xs text-zinc-400">
            One context, multiple recipients
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* CONTEXT BUTTON */}
          <button
            onClick={() => setContextOpen(true)}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-800 text-[11px] hover:bg-zinc-700"
          >
            <Pencil size={12} />
            {senderContext ? "Edit Context" : "Add Context"}
          </button>

          {/* ADD RECIPIENT */}
          <button
            onClick={openNewComposer}
            disabled={!senderContext}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-100 text-zinc-900 text-[11px] font-medium hover:bg-zinc-200 disabled:opacity-50"
          >
            <Plus size={12} />
            Add Recipient
          </button>
        </div>
      </div>

      {/* ---------- EMPTY STATE ---------- */}
      {!recipients.length && (
        <div className="border border-dashed border-zinc-800 rounded-xl p-10 text-center text-sm text-zinc-500">
          {senderContext
            ? "Add a recipient to generate an email"
            : "Add a sender context to get started"}
        </div>
      )}

      {/* ---------- RECIPIENT GRID ---------- */}
      {recipients.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipients.map((r) => (
            <RecipientCard
              key={r.id}
              recipient={r}
              onClick={() => openExistingRecipient(r)}
            />
          ))}
        </div>
      )}

      {/* ---------- EMAIL COMPOSER MODAL ---------- */}
      {isComposerOpen && (
        <ReceiverEmailComposer
          isOpen={isComposerOpen}
          mode={composerMode}
          senderContext={senderContext}
          recipient={editingRecipient}
          onClose={closeComposer}
          onSaveDraft={upsertRecipient}
          onSend={upsertRecipient}
        />
      )}

      {/* ---------- CONTEXT MODAL ---------- */}
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
