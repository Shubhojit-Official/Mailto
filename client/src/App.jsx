import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import WorkspacePage from "./pages/WorkspacePage";
import { loadAppState, saveAppState } from "./lib/storage";

const DEFAULT_COLORS = ["blue", "green", "purple", "orange", "pink", "teal"];

export default function App() {
  const [appState, setAppState] = useState(() => {
    const stored = loadAppState();

    // FIRST BOOT: no workspace → create one
    if (
      !stored ||
      !stored.workspaces ||
      Object.keys(stored.workspaces).length === 0
    ) {
      const id = crypto.randomUUID();
      const color =
        DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)];

      return {
        activeWorkspaceId: id,
        workspaces: {
          [id]: {
            workspace: {
              id,
              name: "My First Workspace",
              color,
            },
            senderContext: null,
            recipients: [],
            emails: [],
          },
        },
      };
    }

    return stored;
  });

  useEffect(() => {
    saveAppState(appState);
  }, [appState]);

  const { workspaces, activeWorkspaceId } = appState;
  const activeWorkspace = workspaces[activeWorkspaceId];

  /* ---------------- ACTIONS ---------------- */

  const createWorkspace = ({ name, color }) => {
    const id = crypto.randomUUID();

    setAppState((prev) => ({
      ...prev,
      activeWorkspaceId: id,
      workspaces: {
        ...prev.workspaces,
        [id]: {
          workspace: {
            id,
            name,
            color,
          },
          senderContext: null,
          recipients: [],
          emails: [],
        },
      },
    }));
  };

  const switchWorkspace = (id) => {
    setAppState((prev) => ({
      ...prev,
      activeWorkspaceId: id,
    }));
  };

  const updateWorkspaceData = (id, data) => {
    setAppState((prev) => ({
      ...prev,
      workspaces: {
        ...prev.workspaces,
        [id]: data,
      },
    }));
  };

  /* ---------------- RENDER ---------------- */

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100">
      <Sidebar
        workspaces={workspaces}
        activeWorkspaceId={activeWorkspaceId}
        onSwitchWorkspace={switchWorkspace}
        onCreateWorkspace={createWorkspace}
        onAddContext={() => {}}
        onAddRecipient={() => {}}
      />

      <main className="flex-1 overflow-y-auto">
        <WorkspacePage
          data={activeWorkspace}
          onChange={(data) => updateWorkspaceData(activeWorkspaceId, data)}
        />
      </main>
    </div>
  );
}
