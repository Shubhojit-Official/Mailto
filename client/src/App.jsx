import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/routes/ProtectedRoute";

import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import WorkspaceOnboarding from "@/pages/WorkspaceOnboarding";
import AppShell from "@/pages/AppShell";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/onboarding/workspace"
          element={
            <ProtectedRoute>
              <WorkspaceOnboarding />
            </ProtectedRoute>
          }
        />

        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
