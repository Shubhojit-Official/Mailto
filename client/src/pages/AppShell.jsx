import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import WorkspacePage from "@/pages/WorkspacePage";
import SenderContextModal from "@/components/SenderContextModal";
import { apiRequest } from "@/lib/api";

export default function AppShell() {
  const navigate = useNavigate();

  const [workspaces, setWorkspaces] = useState([]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(null);
  const [showContextModal, setShowContextModal] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ---------- LOAD WORKSPACES ---------- */
  useEffect(() => {
    async function load() {
      try {
        const res = await apiRequest("/workspace");
        const list = Array.isArray(res) ? res : res.workspaces || [];

        if (!list.length) {
          navigate("/onboarding/workspace", { replace: true });
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

  /* ---------- CLOSE MODALS ON WORKSPACE SWITCH ---------- */
  useEffect(() => {
    setShowContextModal(false);
  }, [activeWorkspaceId]);

  /* ---------- LOGOUT ---------- */
  const handleLogout = () => {
    localStorage.removeItem("token");
    setWorkspaces([]);
    setActiveWorkspaceId(null);
    navigate("/login", { replace: true });
  };

  /* ---------- LOADING STATE ---------- */
  if (loading) {
    return (
      <div className="h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">
        Loading…
      </div>
    );
  }

  /* ---------- ACTIVE WORKSPACE GUARD ---------- */
  const activeWorkspace = workspaces.find((w) => w._id === activeWorkspaceId);

  if (!activeWorkspace) return null;

  /* ---------- RENDER ---------- */
  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100">
      <Sidebar
        workspaces={workspaces}
        activeWorkspaceId={activeWorkspaceId}
        onSwitchWorkspace={setActiveWorkspaceId}
        onAddContext={() => setShowContextModal(true)}
        onAddRecipient={() => {}}
        onLogout={handleLogout}
      />

      <SenderContextModal
        isOpen={showContextModal}
        workspaceId={activeWorkspaceId}
        onClose={() => setShowContextModal(false)}
        onSaved={() => setShowContextModal(false)}
      />

      <main className="flex-1 overflow-y-auto">
        <WorkspacePage workspace={activeWorkspace} />
      </main>
    </div>
  );
}
