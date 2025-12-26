import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "@/lib/api";

/**
 * SenderContextModal
 * Backend-wired version (UI unchanged)
 */
export default function SenderContextModal({
  isOpen,
  onClose,
  workspaceId,
  onSaved,
}) {
  const [intent, setIntent] = useState("sell");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [sellData, setSellData] = useState({
    product: "",
    target: "",
    value: "",
    proof: "",
  });

  const [jobData, setJobData] = useState({
    role: "",
    skills: "",
    experience: "",
    motivation: "",
  });

  const [collabData, setCollabData] = useState({
    idea: "",
    whyThem: "",
    contribution: "",
  });

  const handleSave = async () => {
    setError("");

    let intentData;
    if (intent === "sell") intentData = sellData;
    if (intent === "job") intentData = jobData;
    if (intent === "collab") intentData = collabData;

    try {
      setLoading(true);

      await apiRequest("/context", {
        method: "POST",
        body: JSON.stringify({
          workspaceId,
          intent,
          ...intentData,
        }),
      });

      onSaved?.();
      onClose?.();
    } catch (err) {
      setError(err.message || "Failed to save context");
    } finally {
      setLoading(false);
    }
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
            initial={{ scale: 0.9, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 30 }}
            transition={{ type: "spring", stiffness: 520, damping: 15 }}
            className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold">Your Context</h2>
                <p className="text-sm text-zinc-400">
                  Define your story once. We personalize it for every recipient.
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-zinc-400 hover:text-zinc-200"
              >
                ✕
              </button>
            </div>

            {/* Intent Selector */}
            <div className="flex gap-2">
              {[
                { key: "sell", label: "Sell / Pitch" },
                { key: "job", label: "Job Outreach" },
                { key: "collab", label: "Collaboration" },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setIntent(item.key)}
                  className={`px-4 py-2 rounded-xl text-sm transition ${
                    intent === item.key
                      ? "bg-zinc-100 text-zinc-900"
                      : "bg-zinc-800 text-zinc-300"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Dynamic Forms */}
            <AnimatePresence mode="wait">
              {intent === "sell" && (
                <motion.div
                  key="sell"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-3"
                >
                  <Input
                    label="What are you selling?"
                    value={sellData.product}
                    onChange={(v) => setSellData({ ...sellData, product: v })}
                  />
                  <Input
                    label="Who is it for?"
                    value={sellData.target}
                    onChange={(v) => setSellData({ ...sellData, target: v })}
                  />
                  <Textarea
                    label="Core value proposition"
                    value={sellData.value}
                    onChange={(v) => setSellData({ ...sellData, value: v })}
                  />
                  <Textarea
                    label="Proof (clients, metrics, traction)"
                    value={sellData.proof}
                    onChange={(v) => setSellData({ ...sellData, proof: v })}
                  />
                </motion.div>
              )}

              {intent === "job" && (
                <motion.div
                  key="job"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-3"
                >
                  <Input
                    label="Role you are seeking"
                    value={jobData.role}
                    onChange={(v) => setJobData({ ...jobData, role: v })}
                  />
                  <Textarea
                    label="Key skills / stack"
                    value={jobData.skills}
                    onChange={(v) => setJobData({ ...jobData, skills: v })}
                  />
                  <Textarea
                    label="Relevant experience"
                    value={jobData.experience}
                    onChange={(v) => setJobData({ ...jobData, experience: v })}
                  />
                  <Textarea
                    label="Why are you reaching out?"
                    value={jobData.motivation}
                    onChange={(v) => setJobData({ ...jobData, motivation: v })}
                  />
                </motion.div>
              )}

              {intent === "collab" && (
                <motion.div
                  key="collab"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-3"
                >
                  <Textarea
                    label="Collaboration idea"
                    value={collabData.idea}
                    onChange={(v) => setCollabData({ ...collabData, idea: v })}
                  />
                  <Textarea
                    label="Why this person/company?"
                    value={collabData.whyThem}
                    onChange={(v) =>
                      setCollabData({ ...collabData, whyThem: v })
                    }
                  />
                  <Textarea
                    label="What do you bring to the table?"
                    value={collabData.contribution}
                    onChange={(v) =>
                      setCollabData({
                        ...collabData,
                        contribution: v,
                      })
                    }
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full bg-zinc-100 text-zinc-900 py-3 rounded-xl font-medium hover:cursor-pointer disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Context"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- INPUTS (UNCHANGED) ---------- */

function Input({ label, value, onChange }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-zinc-400">{label}</label>
      <input
        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Textarea({ label, value, onChange }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-zinc-400">{label}</label>
      <textarea
        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-sm h-24 resize-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
