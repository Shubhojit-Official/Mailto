import { useState } from "react";
import SenderContextModal from "./components/SenderContextModal";
import ReceiverEmailComposer from "./components/ReceiverEmailComposer";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [senderContext, setSenderContext] = useState(null);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-10 space-y-6">
      {/* Open Sender Context */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-6 py-3 bg-zinc-100 text-zinc-900 rounded-xl font-medium"
      >
        Define Sender Context
      </button>

      {/* Sender Context Modal */}
      <SenderContextModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(data) => {
          console.log("Sender Context Saved:", data);
          setSenderContext(data);
        }}
      />

      {/* Receiver + Email Composer */}
      <ReceiverEmailComposer senderContext={senderContext} />
    </div>
  );
}
