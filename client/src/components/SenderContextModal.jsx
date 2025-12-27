import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "@/lib/api";

/* ---------- INTENT MAPS ---------- */

const UI_TO_BACKEND_INTENT = {
  sell: "pitch",
  job: "job",
  collab: "collaboration",
};

const BACKEND_TO_UI_INTENT = {
  pitch: "sell",
  job: "job",
  collaboration: "collab",
};

/* ---------- DEFAULTS ---------- */

const EMPTY_SELL = {
  product: "",
  target: "",
  value: "",
  proof: "",
};

const EMPTY_JOB = {
  role: "",
  skills: "",
  experience: "",
  motivation: "",
};

const EMPTY_COLLAB = {
  idea: "",
  whyThem: "",
  contribution: "",
};

/* ---------- COMPONENT ---------- */

export default function SenderContextModal({
  isOpen,
  onClose,
  workspaceId,
  onSaved,
}) {
  const [intent, setIntent] = useState("sell");
  const [intentLocked, setIntentLocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [sellData, setSellData] = useState(EMPTY_SELL);
  const [jobData, setJobData] = useState(EMPTY_JOB);
  const [collabData, setCollabData] = useState(EMPTY_COLLAB);

  /* ---------- PREFILL + LOCK ---------- */

  useEffect(() => {
    if (!isOpen || !workspaceId) return;

    async function loadContext() {
      try {
        const res = await apiRequest(`/context/${workspaceId}`);
        if (!res || !res.intent) return;

        // ✅ FIX: unwrap nested payload safely
        const payload = res.data?.data || res.data;
        if (!payload) return;

        const uiIntent = BACKEND_TO_UI_INTENT[res.intent];
        if (!uiIntent) return;

        setIntent(uiIntent);
        setIntentLocked(true);

        if (res.intent === "pitch") {
          setSellData({ ...EMPTY_SELL, ...payload });
        }

        if (res.intent === "job") {
          setJobData({ ...EMPTY_JOB, ...payload });
        }

        if (res.intent === "collaboration") {
          setCollabData({ ...EMPTY_COLLAB, ...payload });
        }
      } catch {
        // no context yet → do nothing
      }
    }

    loadContext();
  }, [isOpen, workspaceId]);

  /* ---------- RESET ON CLOSE ---------- */

  useEffect(() => {
    if (!isOpen) {
      setIntent("sell");
      setIntentLocked(false);
      setError("");
      setLoading(false);

      setSellData(EMPTY_SELL);
      setJobData(EMPTY_JOB);
      setCollabData(EMPTY_COLLAB);
    }
  }, [isOpen]);

  /* ---------- SAVE ---------- */

  const handleSave = async () => {
    setError("");

    let intentData;
    if (intent === "sell") intentData = sellData;
    if (intent === "job") intentData = jobData;
    if (intent === "collab") intentData = collabData;

    const backendIntent = UI_TO_BACKEND_INTENT[intent];
    if (!backendIntent) {
      setError("Invalid intent selected");
      return;
    }

    try {
      setLoading(true);

      await apiRequest("/context", {
        method: "POST",
        body: JSON.stringify({
          workspaceId,
          intent: backendIntent,
          data: intentData,
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

  /* ---------- RENDER ---------- */

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />

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
                  disabled={intentLocked}
                  onClick={() => !intentLocked && setIntent(item.key)}
                  className={`px-4 py-2 rounded-xl text-sm transition ${
                    intent === item.key
                      ? "bg-zinc-100 text-zinc-900"
                      : "bg-zinc-800 text-zinc-300"
                  } ${intentLocked ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Forms (unchanged UI) */}
            <AnimatePresence mode="wait">
              {intent === "sell" && (
                <motion.div key="sell" className="space-y-3">
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
                <motion.div key="job" className="space-y-3">
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
                <motion.div key="collab" className="space-y-3">
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
                      setCollabData({ ...collabData, contribution: v })
                    }
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full bg-zinc-100 text-zinc-900 py-3 rounded-xl font-medium disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Context"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- INPUTS ---------- */

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
