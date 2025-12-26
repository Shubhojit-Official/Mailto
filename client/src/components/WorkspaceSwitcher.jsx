import { Plus, ChevronDown, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../components/ui/dropdown-menu";

export default function WorkspaceSwitcher({
  workspaces,
  activeId,
  onCreate,
  onSwitch,
}) {
  const activeWorkspace = workspaces[activeId];

  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-800">
      {/* WORKSPACE DROPDOWN */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="flex items-center gap-2 px-3 py-1.5
                       bg-zinc-900 border border-zinc-700 rounded-md
                       text-sm hover:bg-zinc-800 hover:cursor-pointer
                       transition focus:outline-none"
          >
            <span className="font-medium">
              {activeWorkspace?.workspace.name || "Select Workspace"}
            </span>
            <ChevronDown size={14} />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          className="w-56 bg-zinc-900 border border-zinc-800"
        >
          {Object.values(workspaces).map((w) => {
            const isActive = w.workspace.id === activeId;

            return (
              <DropdownMenuItem
                key={w.workspace.id}
                onClick={() => onSwitch(w.workspace.id)}
                className="flex items-center justify-between
             cursor-pointer text-sm
             text-zinc-100 focus:bg-zinc-800
             hover:bg-zinc-800"
              >
                <span>{w.workspace.name}</span>
                {isActive && <Check size={14} className="text-zinc-300" />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* CREATE WORKSPACE */}
      <button
        onClick={() => {
          const name = prompt("Workspace name?");
          if (name) onCreate(name);
        }}
        className="flex items-center gap-1.5 px-3 py-1.5
                   bg-zinc-800 rounded-md text-xs
                   hover:bg-zinc-700 hover:cursor-pointer
                   transition"
      >
        <Plus size={12} />
        New Workspace
      </button>
    </div>
  );
}
