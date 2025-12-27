import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import WorkspacePage from "./pages/WorkspacePage";
import { loadAppState, saveAppState } from "./lib/storage";
import { LandingPage } from "./pages/LandingPage";

export default function App() {
  const [appState, setAppState] = useState(() => loadAppState());

  useEffect(() => {
    saveAppState(appState);
  }, [appState]);

  const { workspaces, activeWorkspaceId } = appState;
  const activeWorkspace = workspaces[activeWorkspaceId];

  const createWorkspace = ({ name, color }) => {
    const id = crypto.randomUUID();

    setAppState((prev) => ({
      ...prev,
      activeWorkspaceId: id,
      workspaces: {
        ...prev.workspaces,
        [id]: {
          workspace: { id, name, color },
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

  {/*if (!activeWorkspace) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <button
          onClick={() =>
            setAppState({ workspaces: {}, activeWorkspaceId: null })
          }
          className="px-4 py-2 bg-white text-black rounded"
        >
          Create your first workspace
        </button>
      </div>
    );
  }*/}

  return (
    /*<div className="flex h-screen bg-zinc-950 text-zinc-100">
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
    </div>*/
    <>
      <LandingPage />
    </>
  );
}
