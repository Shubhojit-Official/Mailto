import { Clock, MailOpen } from "lucide-react";

export default function RecipientCard({ recipient, onClick }) {
  const { xHandle, email, createdAt } = recipient;

  const statusStyles = {
    draft: {
      badge: "bg-zinc-700/40 text-zinc-300",
      accent: "bg-zinc-500",
    },
    sent: {
      badge: "bg-blue-600/20 text-blue-400",
      accent: "bg-blue-500",
    },
    opened: {
      badge: "bg-green-600/20 text-green-400",
      accent: "bg-green-500",
    },
    replied: {
      badge: "bg-purple-600/20 text-purple-400",
      accent: "bg-purple-500",
    },
  };

  const status = email.status || "draft";

  const getTimelineText = () => {
    if (email.repliedAt) return "Replied";
    if (email.openedAt) return "Opened";
    if (email.sentAt) return "Sent";
    return "Draft";
  };

  const getTimelineTime = () => {
    if (email.repliedAt) return email.repliedAt;
    if (email.openedAt) return email.openedAt;
    if (email.sentAt) return email.sentAt;
    return createdAt;
  };

  return (
    <button
      onClick={onClick}
      className="relative w-full max-w-105 text-left
                 bg-zinc-900 border border-zinc-800 rounded-xl
                 p-4 space-y-3
                 hover:border-zinc-700 hover:bg-zinc-800/40
                 hover:cursor-pointer
                 transition-all duration-150"
    >
      {/* LEFT ACCENT BAR */}
      <div
        className={`absolute left-0 top-0 h-full w-0.75 rounded-l-xl ${statusStyles[status].accent}`}
      />

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="font-medium text-sm">@{xHandle}</div>

        <span
          className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${statusStyles[status].badge}`}
        >
          {status.toUpperCase()}
        </span>
      </div>

      {/* SUBJECT */}
      <div className="text-sm text-zinc-200 line-clamp-2 leading-snug">
        {email.subject || "No subject"}
      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-center text-xs text-zinc-500">
        <div className="flex items-center gap-1 truncate max-w-[55%]">
          <MailOpen size={12} />
          <span className="truncate">{email.to}</span>
        </div>

        <div className="flex items-center gap-1 whitespace-nowrap">
          <Clock size={12} />
          {getTimelineText()} •{" "}
          {new Date(getTimelineTime()).toLocaleDateString()}
        </div>
      </div>
    </button>
  );
}
