import { useState } from "react";
import { Plus, Pencil } from "lucide-react";

import RecipientCard from "../components/RecipientCard";
import ReceiverEmailComposer from "../components/ReceiverEmailComposer";
import SenderContextModal from "../components/SenderContextModal";

export default function WorkspacePage({ data, onChange }) {
  const { workspace, senderContext, recipients, emails } = data;

  /* ---------- UI STATE ---------- */
  const [isComposerOpen, setComposerOpen] = useState(false);
  const [composerMode, setComposerMode] = useState("compose");
  const [activeRecipient, setActiveRecipient] = useState(null);
  const [isContextOpen, setContextOpen] = useState(false);

  /* ---------- HELPERS ---------- */
  const getEmailForRecipient = (recipientId) =>
    emails.find((e) => e.recipientId === recipientId);

  const updateWorkspace = (patch) => {
    onChange({
      workspace,
      senderContext,
      recipients,
      emails,
      ...patch,
    });
  };

  /* ---------- ACTIONS ---------- */

  const openNewComposer = () => {
    setActiveRecipient(null);
    setComposerMode("compose");
    setComposerOpen(true);
  };

  const openExisting = (recipient) => {
    setActiveRecipient(recipient);
    const email = getEmailForRecipient(recipient.id);
    setComposerMode(email?.status === "draft" ? "compose" : "view");
    setComposerOpen(true);
  };

  const closeComposer = () => {
    setComposerOpen(false);
    setActiveRecipient(null);
  };

  const saveDraft = ({ recipient, xHandle, notes, tone, email }) => {
    let recipientId = recipient?.id;
    let nextRecipients = recipients;

    if (!recipientId) {
      recipientId = crypto.randomUUID();
      nextRecipients = [
        {
          id: recipientId,
          xHandle,
          emailAddress: email.to,
          notes,
          createdAt: new Date().toISOString(),
        },
        ...recipients,
      ];
    }

    let nextEmails;
    const existingEmail = emails.find((e) => e.recipientId === recipientId);

    if (existingEmail) {
      nextEmails = emails.map((e) =>
        e.recipientId === recipientId ? { ...e, ...email, tone } : e
      );
    } else {
      nextEmails = [
        {
          id: crypto.randomUUID(),
          recipientId,
          ...email,
          tone,
          createdAt: new Date().toISOString(),
        },
        ...emails,
      ];
    }

    updateWorkspace({
      recipients: nextRecipients,
      emails: nextEmails,
    });

    closeComposer();
  };

  const sendEmail = (payload) => {
    saveDraft({
      ...payload,
      email: {
        ...payload.email,
        status: "sent",
        sentAt: new Date().toISOString(),
      },
    });
  };

  /* ---------- RENDER ---------- */

  return (
    <div className="p-8">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold">{workspace.name}</h1>
          <p className="text-xs text-zinc-400">One context, many recipients</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setContextOpen(true)}
            className="flex items-center gap-1 px-2 py-1 text-xs
                       bg-zinc-800 rounded
                       hover:bg-zinc-700 hover:cursor-pointer"
          >
            <Pencil size={12} />
            {senderContext ? "Edit Context" : "Add Context"}
          </button>

          <button
            disabled={!senderContext}
            onClick={openNewComposer}
            className="flex items-center gap-1 px-2 py-1 text-xs
                       bg-white text-black rounded
                       hover:bg-zinc-200 hover:cursor-pointer
                       disabled:opacity-50"
          >
            <Plus size={12} />
            Add Recipient
          </button>
        </div>
      </div>

      {/* EMPTY STATE */}
      {!recipients.length && (
        <div
          className="border border-dashed border-zinc-800 rounded-xl
                        p-10 text-center text-sm text-zinc-500"
        >
          {senderContext
            ? "Add a recipient to generate an email"
            : "Add a sender context to get started"}
        </div>
      )}

      {/* RECIPIENT GRID */}
      {recipients.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipients.map((r) => (
            <RecipientCard
              key={r.id}
              recipient={{
                ...r,
                email: getEmailForRecipient(r.id),
              }}
              onClick={() => openExisting(r)}
            />
          ))}
        </div>
      )}

      {/* EMAIL COMPOSER */}
      {isComposerOpen && (
        <ReceiverEmailComposer
          isOpen
          mode={composerMode}
          senderContext={senderContext}
          recipient={
            activeRecipient && {
              ...activeRecipient,
              email: getEmailForRecipient(activeRecipient.id),
            }
          }
          onClose={closeComposer}
          onSaveDraft={saveDraft}
          onSend={sendEmail}
        />
      )}

      {/* CONTEXT MODAL */}
      <SenderContextModal
        isOpen={isContextOpen}
        onClose={() => setContextOpen(false)}
        onSave={(ctx) => {
          updateWorkspace({ senderContext: ctx });
          setContextOpen(false);
        }}
      />
    </div>
  );
}
