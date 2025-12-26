import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const COLORS = [
  { key: "blue", class: "bg-blue-500" },
  { key: "green", class: "bg-green-500" },
  { key: "purple", class: "bg-purple-500" },
  { key: "orange", class: "bg-orange-500" },
  { key: "pink", class: "bg-pink-500" },
  { key: "teal", class: "bg-teal-500" },
];

export default function CreateWorkspaceDialog({ open, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("blue");

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreate({ name: name.trim(), color });
    setName("");
    setColor("blue");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-white">Create Workspace</DialogTitle>
        </DialogHeader>

        {/* NAME */}
        <div className="space-y-2">
          <label className="text-sm text-zinc-400">Workspace name</label>
          <Input
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Hiring Outreach"
          />
        </div>

        {/* COLOR PICKER */}
        <div className="space-y-2">
          <label className="text-sm text-zinc-400">Workspace color</label>

          <div className="flex gap-2">
            {COLORS.map((c) => (
              <button
                key={c.key}
                onClick={() => setColor(c.key)}
                className={`w-6 h-6 rounded-full transition
                  ${c.class}
                  ${
                    color === c.key
                      ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-900"
                      : "opacity-70 hover:opacity-100"
                  }`}
              />
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>Create Workspace</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
