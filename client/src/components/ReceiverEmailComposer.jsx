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
      body: `Hi @${xHandle},\n\n${senderContext.value}\n\nBest,\nShubhojit`,
      status: "draft",
    });

    setGenerated(true);
  };

  const handleCopy = async () => {
    if (!email) return;
    await navigator.clipboard.writeText(`${email.subject}\n\n${email.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-zinc-900 w-full max-w-6xl rounded-2xl p-6 relative">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
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

        <div className="grid grid-cols-[360px_1fr] gap-6">
          {/* LEFT PANEL */}
          {mode === "compose" && (
            <div className="space-y-5">
              {/* X HANDLE */}
              <div>
                <label className="text-xs text-zinc-400">X Handle</label>
                <input
                  value={xHandle}
                  onChange={(e) => setXHandle(e.target.value)}
                  className="w-full bg-zinc-800 p-2 rounded mt-1"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="text-xs text-zinc-400">Recipient Email</label>
                <input
                  value={email?.to || ""}
                  onChange={(e) =>
                    setEmail((p) => ({
                      ...(p || {}),
                      to: e.target.value,
                    }))
                  }
                  className="w-full bg-zinc-800 p-2 rounded mt-1"
                />
              </div>

              {/* NOTES */}
              <div>
                <label className="text-xs text-zinc-400">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-zinc-800 p-2 rounded mt-1 min-h-30 resize-none"
                />
              </div>

              {/* TONE SLIDERS */}
              <div className="border border-zinc-800 rounded-xl p-4">
                <h4 className="text-xs text-zinc-400 mb-3">Tone Controls</h4>
                <ToneSliders values={tone} onChange={setTone} />
              </div>

              {/* GENERATE */}
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

          {/* RIGHT PANEL */}
          {generated && email && (
            <div className="space-y-4">
              {/* TOOLBAR */}
              <div className="flex justify-end items-center gap-4">
                {mode === "compose" && (
                  <button
                    onClick={() => setEditing((v) => !v)}
                    className={`text-xs flex items-center gap-1
                      hover:cursor-pointer transition
                      ${
                        editing
                          ? "text-green-400"
                          : "text-zinc-400 hover:text-zinc-200"
                      }`}
                  >
                    <Pencil size={14} />
                    {editing ? "Editing" : "Edit"}
                  </button>
                )}

                <button
                  onClick={handleCopy}
                  className="text-zinc-400 hover:text-zinc-200
                             hover:cursor-pointer
                             flex items-center gap-1 transition"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied && <span className="text-xs">Copied</span>}
                </button>
              </div>

              {/* SUBJECT */}
              <input
                value={email.subject}
                readOnly={!editing || mode === "view"}
                onChange={(e) =>
                  setEmail({ ...email, subject: e.target.value })
                }
                className={`w-full bg-transparent text-sm font-medium outline-none ${
                  editing ? "border-b border-zinc-600 pb-1" : ""
                }`}
              />

              {/* BODY */}
              <textarea
                value={email.body}
                readOnly={!editing || mode === "view"}
                onChange={(e) => setEmail({ ...email, body: e.target.value })}
                className={`w-full h-72 bg-transparent outline-none resize-none ${
                  editing ? "border border-zinc-700 rounded-lg p-2" : ""
                }`}
              />

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

              {mode === "view" && (
                <div className="text-xs text-zinc-400">To: {email.to}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
