import { useEffect, useState } from "react";

import WorkspacePage from "./pages/WorkspacePage";
import Sidebar from "./components/Sidebar";

import { loadAppState, saveAppState } from "./lib/storage";

export default function App() {
  /* ---------------- APP STATE ---------------- */

  const [appState, setAppState] = useState(() => loadAppState());

  /* ---------------- PERSIST ---------------- */

  useEffect(() => {
    saveAppState(appState);
  }, [appState]);

  /* ---------------- HELPERS ---------------- */

  const activeWorkspaceId = appState.activeWorkspaceId;
  const activeWorkspace = appState.workspaces[activeWorkspaceId];

  /* ---------------- ACTIONS ---------------- */

  const createWorkspace = (name) => {
    const id = crypto.randomUUID();

    setAppState((prev) => ({
      ...prev,
      activeWorkspaceId: id,
      workspaces: {
        ...prev.workspaces,
        [id]: {
          workspace: { id, name },
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

  /* ---------------- EMPTY BOOTSTRAP ---------------- */

  if (!activeWorkspace) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <button
          onClick={() => {
            const name = prompt("Workspace name?");
            if (name) createWorkspace(name);
          }}
          className="px-4 py-2 bg-white text-black rounded hover:bg-zinc-200 hover:cursor-pointer"
        >
          Create your first workspace
        </button>
      </div>
    );
  }

  /* ---------------- RENDER ---------------- */

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100">
      {/* SIDEBAR */}
      <Sidebar
        workspaces={appState.workspaces}
        activeWorkspaceId={activeWorkspaceId}
        onSwitchWorkspace={switchWorkspace}
        onCreateWorkspace={createWorkspace}
        onAddContext={() => {
          // forwarded to WorkspacePage via state
          updateWorkspaceData(activeWorkspaceId, {
            ...activeWorkspace,
            _openContext: true,
          });
        }}
        onAddRecipient={() => {
          updateWorkspaceData(activeWorkspaceId, {
            ...activeWorkspace,
            _openComposer: true,
          });
        }}
      />

      {/* MAIN WORKSPACE */}
      <main className="flex-1 overflow-y-auto">
        <WorkspacePage
          data={activeWorkspace}
          onChange={(data) => updateWorkspaceData(activeWorkspaceId, data)}
        />
      </main>
    </div>
  );
}
