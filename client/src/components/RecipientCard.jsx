import { Clock } from "lucide-react";

/**
 * RecipientCard
 * Displays a saved recipient + email preview inside a workspace
 */
export default function RecipientCard({ recipient, onClick }) {
  const { xHandle, email, createdAt } = recipient;

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2 hover:border-zinc-700 transition"
    >
      <div className="text-sm font-medium">@{xHandle}</div>

      <div className="text-xs text-zinc-400 line-clamp-2">
        {email?.subject || "Draft"}
      </div>

      <div className="flex items-center gap-1 text-[10px] text-zinc-500">
        <Clock size={12} />
        {new Date(createdAt).toLocaleString()}
      </div>
    </button>
  );
}
