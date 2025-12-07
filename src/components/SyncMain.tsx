import { useState } from "react";
import useWakeWord from "../hooks/useWakeWord";
import useContinuousVoice from "../hooks/useContinuousVoice";
import { SyncSounds } from "../hooks/useSyncSounds";
import SyncAvatar from "./SyncAvatar";

export default function SyncMain() {
  const [active, setActive] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Diga 'Hey Sync' para começar.");

  const { listening, start, stop } = useContinuousVoice(async (text) => {
    SyncSounds.message();
    setStatusMessage(`Você disse: "${text}"`);
    setThinking(true);

    const aiResponse = await fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });

    const data = await aiResponse.json();
    const reply = data.reply;

    setThinking(false);
    setSpeaking(true);
    setStatusMessage(reply);

    const audioResponse = await fetch("/api/voice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: reply }),
    });

    const audioBlob = await audioResponse.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    const audio = new Audio(audioUrl);
    audio.play();

    audio.onended = () => {
      setSpeaking(false);
      setStatusMessage("Pronta.");
    };
  });

  useWakeWord(() => {
    if (!active) {
      setActive(true);
      SyncSounds.activate();
      setStatusMessage("Estou ouvindo...");
      start();
    }
  });

  function sleepSync() {
    stop();
    SyncSounds.sleep();
    setActive(false);
    setSpeaking(false);
    setThinking(false);
    setStatusMessage("Modo sleep. Diga 'Hey Sync' para acordar.");
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen text-white text-center px-6">

      <SyncAvatar 
        active={active}
        listening={listening}
        speaking={speaking}
        thinking={thinking}
      />

      <h1 className="text-2xl font-semibold mt-6 mb-4">{statusMessage}</h1>

      {active && (
        <button
          onClick={sleepSync}
          className="px-5 py-3 bg-red-600 hover:bg-red-700 rounded-xl text-white shadow-lg transition"
        >
          Sleep Sync
        </button>
      )}
    </div>
  );
}
