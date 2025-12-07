import { useState } from "react";
import useWakeWord from "../hooks/useWakeWord";
import useContinuousVoice from "../hooks/useContinuousVoice";
import { SyncSounds } from "../hooks/useSyncSounds";

export default function SyncMain() {
  const [active, setActive] = useState(false);       // Sync acordada
  const [speaking, setSpeaking] = useState(false);   // falando
  const [thinking, setThinking] = useState(false);   // processando IA
  const [statusMessage, setStatusMessage] = useState("Diga 'Hey Sync' para começar.");

  // Voz contínua (JARVIS MODE)
  const { listening, start, stop } = useContinuousVoice(async (text) => {
    SyncSounds.message();
    setStatusMessage(`Você disse: "${text}"`);
    setThinking(true);

    // ====== CHAMANDO A IA (GEMINI 3 FLASH) ======
    const aiResponse = await fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });

    const data = await aiResponse.json();
    const reply = data.reply;

    // ====== PROCESSAMENTO RECEBIDO → FALA DA SYNC ======
    setThinking(false);
    setSpeaking(true);
    setStatusMessage(reply);

    // ====== CHAMA A API DE VOZ (RACHEL) ======
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

  // ====== WAKE WORD (“HEY SYNC”) ======
  useWakeWord(() => {
    if (!active) {
      setActive(true);
      SyncSounds.activate();
      setStatusMessage("Estou ouvindo você...");
      start(); // ativa voz contínua automaticamente
    }
  });

  // ====== MODO SLEEP ======
  function sleepSync() {
    stop();
    SyncSounds.sleep();
    setActive(false);
    setSpeaking(false);
    setThinking(false);
    setStatusMessage("Modo sleep ativado. Diga 'Hey Sync' para acordar.");
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen text-white text-center px-6">

      {/* ===== AVATAR ANIMADO ===== */}
      <div
        className={`
          w-40 h-40 rounded-full overflow-hidden shadow-xl mb-6 
          transition-all duration-500 ease-out relative

          ${active ? "scale-110 ring-4 ring-blue-500" : "scale-100"}
          ${listening ? "animate-sync-listen" : ""}
          ${speaking ? "animate-sync-talk" : ""}
          ${thinking ? "opacity-70 scale-105" : ""}
        `}
      >
        <img
          src="/sync-avatar.png"
          alt="Sync Avatar"
          className="w-full h-full object-cover"
        />
      </div>

      {/* ===== STATUS ===== */}
      <h1 className="text-2xl font-semibold mb-4">{statusMessage}</h1>

      {/* ===== BOTÃO SLEEP ===== */}
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
