import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import WorkspacePage from "@/pages/WorkspacePage";
import { apiRequest } from "@/lib/api";

export default function AppShell() {
  const navigate = useNavigate();

  const [workspaces, setWorkspaces] = useState([]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(null);
  const [showContextModal, setShowContextModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await apiRequest("/workspace");
        const list = Array.isArray(res) ? res : res.workspaces || [];

        if (!list.length) {
          navigate("/onboarding/workspace");
          return;
        }

        setWorkspaces(list);
        setActiveWorkspaceId(list[0]._id);
      } catch (err) {
        console.error(err);
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setWorkspaces([]);
    setActiveWorkspaceId(null);
    navigate("/login", { replace: true });
  };

  if (loading) {
    return (
      <div className="h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">
        Loading…
      </div>
    );
  }

  const activeWorkspace = workspaces.find((w) => w._id === activeWorkspaceId);

  if (!activeWorkspace) return null;

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100">
      <Sidebar
        workspaces={workspaces}
        activeWorkspaceId={activeWorkspaceId}
        onSwitchWorkspace={setActiveWorkspaceId}
        onAddContext={() => {}}
        onAddRecipient={() => {}}
        onLogout={handleLogout}
      />

      <main className="flex-1 overflow-y-auto">
        <WorkspacePage workspace={activeWorkspace} />
      </main>
    </div>
  );
}
