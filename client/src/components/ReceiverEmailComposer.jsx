import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Pencil } from "lucide-react";
import ToneSliders from "@/components/ToneSliders";
import { apiRequest } from "@/lib/api";

export default function ReceiverEmailComposer({
  isOpen,
  onClose,
  workspaceId,
  senderContext,
  onAddEmail,
}) {
  const [xHandle, setXHandle] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [tone, setTone] = useState({
    personalization: 50,
    formality: 50,
    persuasiveness: 50,
  });

  const [recipient, setRecipient] = useState(null);
  const [generatedEmail, setGeneratedEmail] = useState(null);
  const [streamText, setStreamText] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const typingTimerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const showPreview = Boolean(generatedEmail || streaming);

  const simulateTyping = (fullText) => {
    clearInterval(typingTimerRef.current);
    let index = 0;
    setStreaming(true);
    setStreamText("");
    typingTimerRef.current = setInterval(() => {
      index += 3;
      setStreamText(fullText.slice(0, index));
      if (index >= fullText.length) {
        clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
        setStreaming(false);
      }
    }, 20);
  };

  const handleGenerate = async () => {
    if (!xHandle.trim()) {
      setError("X / Twitter handle is required");
      return;
    }
    setError("");
    setLoading(true);
    setGeneratedEmail(null);
    setStreamText("");
    setEditing(false);

    try {
      let recipientId = recipient?._id;
      if (!recipientId) {
        const res = await apiRequest("/client", {
          method: "POST",
          body: JSON.stringify({
            xHandle,
            email: recipientEmail || undefined,
            workspaceId,
          }),
        });
        recipientId = res.recipient._id;
        setRecipient(res.recipient);
      }

      const res = await apiRequest("/mail/generate", {
        method: "POST",
        body: JSON.stringify({
          recipientId,
          workspaceId,
          personalization: tone.personalization,
          formality: tone.formality,
          persuasiveness: tone.persuasiveness,
          notes,
        }),
      });

      const combined = `Subject: ${res.subject}\n${res.body}`;
      simulateTyping(combined);
      setGeneratedEmail({ subject: res.subject, body: res.body });
    } catch (err) {
      setError("Failed to generate email");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedEmail) return;
    await navigator.clipboard.writeText(
      `${generatedEmail.subject}\n\n${generatedEmail.body}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Triggers state update in parent
  const handleSaveDraft = () => {
    onAddEmail?.({
      id: crypto.randomUUID(),
      xHandle: xHandle,
      email: recipientEmail,
      timestamp: Date.now(),
      status: "draft",
      subject: generatedEmail?.subject,
      body: generatedEmail?.body,
    });
    onClose();
  };

  // Triggers state update in parent
  const handleSendEmail = () => {
    onAddEmail?.({
      id: crypto.randomUUID(),
      xHandle: xHandle,
      email: recipientEmail,
      timestamp: Date.now(),
      status: "sent",
      subject: generatedEmail?.subject,
      body: generatedEmail?.body,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-40 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 z-40"
            onClick={onClose}
          />
          <motion.div
            layout
            initial={{ scale: 0.96, y: 24 }}
            animate={{ scale: 1, y: 0, width: showPreview ? "74rem" : "30rem" }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="relative z-50 bg-zinc-900 border border-zinc-800 rounded-2xl p-7 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between mb-5">
              <div>
                <h2 className="text-xl font-semibold">Compose Outreach</h2>
                <p className="text-sm text-zinc-400">
                  Generate a personalized email using AI.
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-zinc-400 hover:text-zinc-200"
              >
                ✕
              </button>
            </div>

            <div className="flex gap-6">
              <div className="w-[440px] space-y-4">
                <Input
                  label="X / Twitter Handle"
                  value={xHandle}
                  onChange={setXHandle}
                />
                <Input
                  label="Recipient Email (optional)"
                  value={recipientEmail}
                  onChange={setRecipientEmail}
                />
                <Textarea
                  label="Extra Notes (optional)"
                  value={notes}
                  onChange={setNotes}
                />
                <ToneSliders values={tone} onChange={setTone} />
                {error && <p className="text-sm text-red-400">{error}</p>}
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full bg-zinc-100 text-zinc-900 py-3 rounded-xl font-medium disabled:opacity-60"
                >
                  {loading ? "Generating..." : "Generate Email"}
                </button>
              </div>

              {showPreview && generatedEmail && (
                <div className="flex-1 flex flex-col bg-zinc-950 border border-zinc-800 rounded-xl p-4 max-h-[70vh]">
                  {/* ... Preview Header ... */}
                  <div className="flex justify-between mb-2">
                    <span className="text-xs text-zinc-400">Preview</span>
                    <div className="flex gap-3">
                      <button
                        onClick={handleCopy}
                        className="text-xs flex gap-1"
                      >
                        <Copy size={14} /> {copied ? "Copied ✓" : "Copy"}
                      </button>
                      <button
                        onClick={() => setEditing((v) => !v)}
                        className="text-xs flex gap-1"
                      >
                        <Pencil size={14} /> {editing ? "Done" : "Edit"}
                      </button>
                    </div>
                  </div>

                  {/* ... Content Area ... */}
                  <div className="overflow-y-auto pr-2 flex-1">
                    <p className="text-xs text-zinc-400 mb-1">Subject</p>
                    {editing ? (
                      <input
                        value={generatedEmail.subject}
                        onChange={(e) =>
                          setGeneratedEmail((prev) => ({
                            ...prev,
                            subject: e.target.value,
                          }))
                        }
                        className="w-full bg-zinc-800 rounded p-2 text-sm mb-3 border border-zinc-700 text-white"
                      />
                    ) : (
                      <div className="bg-zinc-800 rounded p-2 text-sm mb-3 text-white">
                        {streaming
                          ? streamText.split("\n")[0]?.replace(/^Subject:/i, "")
                          : generatedEmail.subject}
                      </div>
                    )}

                    <p className="text-xs text-zinc-400 mb-1">Body</p>
                    {editing ? (
                      <textarea
                        value={generatedEmail.body}
                        onChange={(e) =>
                          setGeneratedEmail((prev) => ({
                            ...prev,
                            body: e.target.value,
                          }))
                        }
                        className="w-full bg-zinc-800 rounded p-2 text-sm border border-zinc-700 min-h-[200px] resize-none text-white"
                      />
                    ) : (
                      <div className="bg-zinc-800 rounded p-2 text-sm whitespace-pre-wrap text-white">
                        {streaming
                          ? streamText.replace(/^Subject:.*\n?/, "")
                          : generatedEmail.body}
                        {streaming && (
                          <span className="inline-block w-2 h-4 bg-zinc-400 animate-pulse ml-1" />
                        )}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      onClick={handleSaveDraft}
                      className="flex-1 bg-zinc-800 rounded py-2 text-zinc-200"
                    >
                      Save as Draft
                    </button>
                    <button
                      onClick={handleSendEmail}
                      className="flex-1 bg-blue-600 rounded py-2 text-white"
                    >
                      Send Email
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-zinc-400">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-sm text-white"
      />
    </div>
  );
}

function Textarea({ label, value, onChange }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-zinc-400">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-sm h-24 resize-none text-white"
      />
    </div>
  );
}
