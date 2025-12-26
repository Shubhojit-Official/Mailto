import { useState } from "react";
import SenderContextModal from "./components/SenderContextModal";
import ReceiverEmailComposer from "./components/ReceiverEmailComposer";
import WorkspaceView from "./components/WorkspaceView";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [senderContext, setSenderContext] = useState(null);

  return <WorkspaceView />;
}
