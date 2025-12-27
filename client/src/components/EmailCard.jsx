import { Badge } from "@/components/ui/badge";
import { Mail, X } from "lucide-react";

const STATUS_STYLES = {
  draft: "bg-zinc-700 text-zinc-200",
  sent: "bg-blue-600/20 text-blue-400 border-blue-600/40",
  opened: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
  replied: "bg-green-600/20 text-green-400 border-green-600/40",
};

export default function EmailCard({ email }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex justify-between items-center hover:border-zinc-700 transition">
      {/* LEFT */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-sm text-white">
          <X size={14} className="text-sky-400" />
          <span className="font-medium">{email.xHandle}</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Mail size={12} />
          {email.email || "No email provided"}
        </div>

        <p className="text-xs text-zinc-500">
          {new Date(email.timestamp).toLocaleString()}
        </p>
      </div>

      {/* RIGHT */}
      <Badge
        variant="outline"
        className={`capitalize ${STATUS_STYLES[email.status]}`}
      >
        {email.status}
      </Badge>
    </div>
  );
}
