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

import CreateWorkspaceDialog from "./CreateWorkspaceDialog";

/* ---------- COLOR MAP ---------- */
const WORKSPACE_COLORS = {
  blue: "bg-blue-500",
  green: "bg-green-500",
  purple: "bg-purple-500",
  orange: "bg-orange-500",
  pink: "bg-pink-500",
  teal: "bg-teal-500",
};

export default function Sidebar({
  workspaces,
  activeWorkspaceId,
  onSwitchWorkspace,
  onCreateWorkspace,
  onAddContext,
  onAddRecipient,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState("workspace");
  const [createOpen, setCreateOpen] = useState(false);

  const activeWorkspace = workspaces[activeWorkspaceId];
  const colorClass =
    WORKSPACE_COLORS[activeWorkspace?.workspace.color] || "bg-blue-500";

  return (
    <>
      <aside
        className={`h-screen bg-zinc-950 border-r border-zinc-800
        flex flex-col px-2 py-4 transition-all duration-200
        ${collapsed ? "w-16" : "w-64"}`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-4 px-2">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${colorClass}`} />
              <h1 className="text-lg font-semibold text-white">Mailto</h1>
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
                <div className="flex items-center gap-2 truncate">
                  <div className={`w-2 h-2 rounded-full ${colorClass}`} />
                  <span className="truncate">
                    {activeWorkspace?.workspace.name}
                  </span>
                </div>
                <ChevronDown size={14} />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="start"
              className="w-56 bg-zinc-900 border border-zinc-800"
            >
              {Object.values(workspaces).map((w) => {
                const isActive = w.workspace.id === activeWorkspaceId;
                const dot =
                  WORKSPACE_COLORS[w.workspace.color] || "bg-blue-500";

                return (
                  <DropdownMenuItem
                    key={w.workspace.id}
                    onClick={() => onSwitchWorkspace(w.workspace.id)}
                    className="flex items-center justify-between text-zinc-100 hover:bg-zinc-800 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${dot}`} />
                      {w.workspace.name}
                    </div>
                    {isActive && <Check size={14} />}
                  </DropdownMenuItem>
                );
              })}

              <Separator className="my-1 bg-zinc-800" />

              <DropdownMenuItem
                onClick={() => setCreateOpen(true)}
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
              <div
                className={`mx-auto w-8 h-8 rounded-md flex items-center justify-center text-sm font-medium text-white ${colorClass}`}
              >
                {activeWorkspace?.workspace.name?.[0]}
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
          <NavItem
            icon={Mail}
            label="Workspace"
            active={activeNav === "workspace"}
            collapsed={collapsed}
            onClick={() => setActiveNav("workspace")}
          />
          <NavItem
            icon={Users}
            label="Recipients"
            active={activeNav === "recipients"}
            collapsed={collapsed}
            onClick={() => setActiveNav("recipients")}
          />
          <NavItem
            icon={BarChart3}
            label="Analytics"
            active={activeNav === "analytics"}
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

        <div className="mt-auto px-1">
          <NavItem icon={Settings} label="Settings" collapsed={collapsed} />
        </div>
      </aside>

      {/* CREATE WORKSPACE DIALOG */}
      <CreateWorkspaceDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={onCreateWorkspace}
      />
    </>
  );
}

/* ---------- SUB COMPONENTS ---------- */

function NavItem({ icon: Icon, label, active, collapsed, disabled, onClick }) {
  const base =
    "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition";

  const styles = active
    ? "bg-zinc-800 text-white"
    : "text-zinc-200 hover:bg-zinc-800";

  const content = (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles} ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
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
