import { useEffect, useState } from "react";
import { Copy, Pencil, Check, X } from "lucide-react";
import ToneSliders from "./ToneSliders";

export default function ReceiverEmailComposer({
  isOpen,
  mode,
  senderContext,
  recipient,
  onClose,
  onSaveDraft,
  onSend,
}) {
  const [xHandle, setXHandle] = useState("");
  const [notes, setNotes] = useState("");
  const [email, setEmail] = useState(null);
  const [generated, setGenerated] = useState(false);
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const [tone, setTone] = useState({
    personalization: 70,
    formality: 50,
    persuasiveness: 60,
  });

  /* Populate when opening */
  useEffect(() => {
    if (!recipient) {
      setXHandle("");
      setNotes("");
      setEmail(null);
      setGenerated(false);
      setEditing(false);
      return;
    }

    setXHandle(recipient.xHandle);
    setNotes(recipient.notes || "");
    setEmail(recipient.email);
    setGenerated(true);
    setEditing(false);
  }, [recipient]);

  if (!isOpen) return null;

  const generate = () => {
    if (!xHandle || !senderContext) return;

    setEmail({
      to: email?.to || "",
      subject: "Quick thought on something you shared",
      body: `Hi @${xHandle},\n\n${senderContext.value}\n\nBest wishes,\nShubhojit`,
      status: "draft",
      createdAt: new Date().toISOString(),
    });

    setGenerated(true);
  };

  const handleCopy = async () => {
    if (!email) return;
    await navigator.clipboard.writeText(`${email.subject}\n\n${email.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  /* ---------- STATUS HELPERS ---------- */

  const statusColor = {
    draft: "bg-zinc-700 text-zinc-200",
    sent: "bg-blue-600/20 text-blue-400",
    opened: "bg-green-600/20 text-green-400",
    replied: "bg-purple-600/20 text-purple-400",
  };

  const renderTimelineItem = (label, value) => (
    <div className="flex justify-between text-xs">
      <span className="text-zinc-500">{label}</span>
      <span className={value ? "text-zinc-300" : "text-zinc-600"}>
        {value ? new Date(value).toLocaleString() : "—"}
      </span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-zinc-900 w-full max-w-7xl rounded-2xl p-6 relative">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-semibold">
            {mode === "compose" ? "Compose Email" : "View Email"}
          </h2>

          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-zinc-800 hover:cursor-pointer transition"
          >
            <X size={16} />
          </button>
        </div>

        <div className="grid grid-cols-[380px_1fr_320px] gap-6">
          {/* LEFT PANEL — COMPOSE ONLY */}
          {mode === "compose" && (
            <div className="space-y-5">
              <div>
                <label className="text-xs text-zinc-400">X Handle</label>
                <input
                  value={xHandle}
                  onChange={(e) => setXHandle(e.target.value)}
                  className="w-full bg-zinc-800 p-2 rounded mt-1"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400">Recipient Email</label>
                <input
                  value={email?.to || ""}
                  onChange={(e) =>
                    setEmail((p) => ({ ...(p || {}), to: e.target.value }))
                  }
                  className="w-full bg-zinc-800 p-2 rounded mt-1"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-zinc-800 p-2 rounded mt-1 min-h-30 resize-none"
                />
              </div>

              <div className="border border-zinc-800 rounded-xl p-4">
                <h4 className="text-xs text-zinc-400 mb-3">Tone Controls</h4>
                <ToneSliders values={tone} onChange={setTone} />
              </div>

              <button
                onClick={generate}
                className="w-full bg-white text-black py-2 rounded
                           hover:bg-zinc-200 hover:cursor-pointer
                           active:scale-[0.98]
                           transition-all duration-150"
              >
                {generated ? "Regenerate" : "Generate"}
              </button>
            </div>
          )}

          {/* CENTER PANEL — EMAIL CONTENT */}
          {generated && email && (
            <div className="space-y-6">
              {/* TOOLBAR (compose only) */}
              {mode === "compose" && (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setEditing((v) => !v)}
                    className={`text-xs flex items-center gap-1 hover:cursor-pointer transition ${
                      editing
                        ? "text-green-400"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <Pencil size={14} />
                    {editing ? "Editing" : "Edit"}
                  </button>

                  <button
                    onClick={handleCopy}
                    className="text-zinc-400 hover:text-zinc-200
                               hover:cursor-pointer flex items-center gap-1"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied && <span className="text-xs">Copied</span>}
                  </button>
                </div>
              )}

              {/* SUBJECT */}
              <div>
                <div className="text-xs uppercase text-zinc-500 mb-1">
                  Subject
                </div>
                <input
                  value={email.subject}
                  readOnly={!editing || mode === "view"}
                  onChange={(e) =>
                    setEmail({ ...email, subject: e.target.value })
                  }
                  className="w-full bg-transparent text-base font-medium outline-none"
                />
              </div>

              {/* BODY */}
              <div>
                <div className="text-xs uppercase text-zinc-500 mb-1">Body</div>
                <textarea
                  value={email.body}
                  readOnly={!editing || mode === "view"}
                  onChange={(e) => setEmail({ ...email, body: e.target.value })}
                  className="w-full h-80 bg-transparent outline-none resize-none leading-relaxed"
                />
              </div>

              {/* ACTIONS */}
              {mode === "compose" && (
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      onSaveDraft({
                        recipient,
                        xHandle,
                        notes,
                        tone,
                        email: { ...email, status: "draft" },
                      })
                    }
                    className="flex-1 bg-zinc-800 py-2 rounded
                               hover:bg-zinc-700 hover:cursor-pointer
                               active:scale-[0.98]
                               transition-all duration-150"
                  >
                    Save Draft
                  </button>

                  <button
                    onClick={() =>
                      onSend({
                        recipient,
                        xHandle,
                        notes,
                        tone,
                        email: {
                          ...email,
                          status: "sent",
                          sentAt: new Date().toISOString(),
                        },
                      })
                    }
                    className="flex-1 bg-white text-black py-2 rounded
                               hover:bg-zinc-200 hover:cursor-pointer
                               active:scale-[0.98]
                               transition-all duration-150"
                  >
                    Send Email
                  </button>
                </div>
              )}
            </div>
          )}

          {/* RIGHT PANEL — STATUS (VIEW MODE ONLY) */}
          {mode === "view" && email && (
            <div className="border-l border-zinc-800 pl-6 space-y-6">
              <div>
                <div className="text-xs text-zinc-500 mb-1">Status</div>
                <span
                  className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${
                    statusColor[email.status]
                  }`}
                >
                  {email.status.toUpperCase()}
                </span>
              </div>

              <div className="space-y-2">
                {renderTimelineItem("Created", email.createdAt)}
                {renderTimelineItem("Sent", email.sentAt)}
                {renderTimelineItem("Opened", email.openedAt)}
                {renderTimelineItem("Replied", email.repliedAt)}
              </div>

              <div className="pt-4 border-t border-zinc-800 space-y-2 text-xs">
                <div>
                  <span className="text-zinc-500">To:</span>{" "}
                  <span className="text-zinc-300">{email.to}</span>
                </div>
                <div>
                  <span className="text-zinc-500">From:</span>{" "}
                  <span className="text-zinc-300">you@example.com</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
