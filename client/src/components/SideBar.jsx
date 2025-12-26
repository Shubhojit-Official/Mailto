import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

import {
  ChevronDown,
  Plus,
  Mail,
  Users,
  BarChart3,
  Settings,
  Check,
  PanelLeft,
} from "lucide-react";

export default function Sidebar({
  workspaces,
  activeWorkspaceId,
  onSwitchWorkspace,
  onCreateWorkspace,
  onAddContext,
  onAddRecipient,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const activeWorkspace = workspaces[activeWorkspaceId];

  return (
    <aside
      className={`h-screen bg-zinc-950 border-r border-zinc-800
        flex flex-col px-2 py-4 transition-all duration-200
        ${collapsed ? "w-16" : "w-64"}`}
    >
      {/* TOP */}
      <div className="flex items-center justify-between mb-4 px-2">
        {!collapsed && (
          <div>
            <h1 className="text-lg font-semibold text-white">Mailto</h1>
            <p className="text-xs text-zinc-400">Outreach</p>
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed((v) => !v)}
          className="hover:bg-zinc-800"
        >
          <PanelLeft size={18} />
        </Button>
      </div>

      {/* WORKSPACE SWITCHER */}
      {!collapsed ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center justify-between w-full px-3 py-2
                         bg-zinc-900 border border-zinc-700 rounded-md
                         text-sm text-zinc-100 hover:bg-zinc-800"
            >
              <span className="truncate">
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
              const isActive = w.workspace.id === activeWorkspaceId;
              return (
                <DropdownMenuItem
                  key={w.workspace.id}
                  onClick={() => onSwitchWorkspace(w.workspace.id)}
                  className="flex items-center justify-between text-zinc-100 hover:bg-zinc-800 cursor-pointer"
                >
                  {w.workspace.name}
                  {isActive && <Check size={14} />}
                </DropdownMenuItem>
              );
            })}

            <Separator className="my-1 bg-zinc-800" />

            <DropdownMenuItem
              onClick={() => {
                const name = prompt("Workspace name?");
                if (name) onCreateWorkspace(name);
              }}
              className="flex items-center gap-2 text-zinc-100 hover:bg-zinc-800 cursor-pointer"
            >
              <Plus size={14} />
              New Workspace
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="mx-auto w-8 h-8 rounded-md bg-zinc-800 flex items-center justify-center text-sm font-medium">
              {activeWorkspace?.workspace.name?.[0] || "W"}
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">
            {activeWorkspace?.workspace.name}
          </TooltipContent>
        </Tooltip>
      )}

      <Separator className="my-4 bg-zinc-800" />

      {/* NAV */}
      <nav className="flex flex-col gap-1">
        <NavItem icon={Mail} label="Workspace" collapsed={collapsed} />
        <NavItem icon={Users} label="Recipients" collapsed={collapsed} />
        <NavItem
          icon={BarChart3}
          label="Analytics"
          collapsed={collapsed}
          disabled
        />
      </nav>

      <Separator className="my-4 bg-zinc-800" />

      {/* ACTIONS */}
      <div className="flex flex-col gap-2 px-1">
        <SidebarAction
          icon={Plus}
          label="Add / Edit Context"
          collapsed={collapsed}
          onClick={onAddContext}
        />
        <SidebarAction
          icon={Plus}
          label="Add Recipient"
          collapsed={collapsed}
          onClick={onAddRecipient}
        />
      </div>

      {/* FOOTER */}
      <div className="mt-auto px-1">
        <NavItem icon={Settings} label="Settings" collapsed={collapsed} />
      </div>
    </aside>
  );
}

/* ---------- SUB COMPONENTS ---------- */

function NavItem({ icon: Icon, label, collapsed, disabled }) {
  const content = (
    <button
      disabled={disabled}
      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm
        ${
          disabled
            ? "text-zinc-500 cursor-not-allowed"
            : "text-zinc-200 hover:bg-zinc-800 hover:cursor-pointer"
        }`}
    >
      <Icon size={16} />
      {!collapsed && label}
    </button>
  );

  return collapsed ? (
    <Tooltip>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  ) : (
    content
  );
}

function SidebarAction({ icon: Icon, label, collapsed, onClick }) {
  const btn = (
    <Button
      variant="secondary"
      className="justify-start w-full"
      onClick={onClick}
    >
      <Icon size={14} className="mr-2" />
      {!collapsed && label}
    </Button>
  );

  return collapsed ? (
    <Tooltip>
      <TooltipTrigger asChild>{btn}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  ) : (
    btn
  );
}
