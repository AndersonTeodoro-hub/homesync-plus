import { useState } from "react";
import useWakeWord from "../hooks/useWakeWord";
import useContinuousVoice from "../hooks/useContinuousVoice";
import { SyncSounds } from "../hooks/useSyncSounds";

export default function SyncMain() {
  const [active, setActive] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Diga 'Hey Sync' para começar.");

  const { listening, start, stop } = useContinuousVoice(async (text) => {
    console.log("Usuário disse:", text);

    SyncSounds.message();
    setSpeaking(true);
    setStatusMessage(`Você disse: "${text}"`);

    // Aqui você chama a IA para gerar resposta
    // Exemplo simples:
    setTimeout(() => {
      setSpeaking(false);
      setStatusMessage("Pronta.");
    }, 1200);
  });

  // Wake Word → ativa Sync + voz contínua
  useWakeWord(() => {
    if (!active) {
      setActive(true);
      SyncSounds.activate();
      setStatusMessage("Estou ouvindo você...");
      start(); // ← ativa voz contínua automaticamente
    }
  });

  function sleepSync() {
    stop();
    SyncSounds.sleep();
    setActive(false);
    setSpeaking(false);
    setStatusMessage("Modo sleep ativado. Diga 'Hey Sync' para acordar.");
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen text-white text-center px-6">

      {/* AVATAR ANIMADO */}
      <div
        className={`
          w-40 h-40 rounded-full overflow-hidden shadow-xl mb-6 
          transition-all duration-500 ease-out relative
          ${active ? "scale-110 ring-4 ring-blue-500" : "scale-100 ring-0"}
          ${listening ? "animate-sync-listen" : ""}
          ${speaking ? "animate-sync-talk" : ""}
        `}
      >
        <img
          src="/sync-avatar.png"
          alt="Sync Avatar"
          className="w-full h-full object-cover"
        />
      </div>

      <h1 className="text-2xl font-semibold mb-4">{statusMessage}</h1>

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
