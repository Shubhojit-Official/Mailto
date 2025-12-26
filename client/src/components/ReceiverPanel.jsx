import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Copy, Check, Save } from "lucide-react";

export default function ReceiverEmailComposer({
  senderContext,
  isOpen,
  onClose,
  onSave,
}) {
  const [handle, setHandle] = useState("");
  const [notes, setNotes] = useState("");
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateEmail = async () => {
    if (!handle || !senderContext) return;

    setLoading(true);
    setIsEditing(false);

    // Mock Gemini call
    setTimeout(() => {
      setEmail({
        subject: "Quick thought on something you shared recently",
        body: `Hi @${handle},\n\nI came across your recent thoughts and felt it was worth reaching out.\n\n${
          senderContext.value || ""
        }\n\n${notes ? `(${notes})\n\n` : ""}Best,\nShubhojit`,
      });
      setLoading(false);
    }, 1200);
  };

  const handleCopy = async () => {
    if (!email) return;
    await navigator.clipboard.writeText(`${email.subject}\n\n${email.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleSave = () => {
    if (!email) return;

    onSave({
      receiverHandle: handle,
      email,
      notes,
    });

    // Reset state
    setHandle("");
    setNotes("");
    setEmail(null);
    setIsEditing(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.92, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 30 }}
            transition={{ type: "spring", stiffness: 500, damping: 32 }}
            className="relative w-full max-w-5xl bg-zinc-900 border border-zinc-800 rounded-2xl p-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Compose Email</h2>
              <button
                onClick={onClose}
                className="text-zinc-400 hover:text-zinc-200"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-[360px_1fr] gap-6 items-start">
              {/* LEFT PANEL */}
              <div className={loading ? "opacity-50 pointer-events-none" : ""}>
                <label className="text-xs text-zinc-400">X Handle</label>
                <div className="flex items-center bg-zinc-800 border border-zinc-700 rounded-xl mt-1">
                  <span className="px-3 text-zinc-500">@</span>
                  <input
                    className="flex-1 bg-transparent p-3 text-sm outline-none"
                    value={handle}
                    onChange={(e) =>
                      setHandle(e.target.value.replace(/^@/, ""))
                    }
                  />
                </div>

                <label className="text-xs text-zinc-400 mt-4 block">
                  Additional notes (optional)
                </label>
                <textarea
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-sm h-24 resize-none mt-1"
                  placeholder="Anything specific to mention?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />

                <button
                  onClick={generateEmail}
                  className="mt-4 w-full bg-zinc-100 text-zinc-900 py-3 rounded-xl font-medium"
                >
                  {loading ? "Generating…" : email ? "Regenerate" : "Generate"}
                </button>
              </div>

              {/* RIGHT PANEL */}
              {email && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-300">Draft</span>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setIsEditing((v) => !v)}
                        className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1"
                      >
                        <Pencil size={14} />
                        {isEditing ? "Done" : "Edit"}
                      </button>

                      <button
                        onClick={handleCopy}
                        className="text-zinc-400 hover:text-zinc-200"
                      >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>

                  <input
                    value={email.subject}
                    readOnly={!isEditing}
                    onBlur={() => setIsEditing(false)}
                    onChange={(e) =>
                      setEmail({ ...email, subject: e.target.value })
                    }
                    className={`w-full rounded-xl p-3 text-sm ${
                      isEditing
                        ? "bg-zinc-800 border border-zinc-700"
                        : "bg-transparent"
                    }`}
                  />

                  <textarea
                    value={email.body}
                    readOnly={!isEditing}
                    onBlur={() => setIsEditing(false)}
                    onChange={(e) =>
                      setEmail({ ...email, body: e.target.value })
                    }
                    className={`w-full h-80 rounded-xl p-3 text-sm resize-none ${
                      isEditing
                        ? "bg-zinc-800 border border-zinc-700"
                        : "bg-transparent"
                    }`}
                  />

                  <button
                    onClick={handleSave}
                    className="w-full bg-zinc-100 text-zinc-900 py-3 rounded-xl font-medium flex items-center justify-center gap-2"
                  >
                    <Save size={16} />
                    Save to Workspace
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
