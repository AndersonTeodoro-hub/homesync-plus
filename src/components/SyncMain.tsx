import { useState, useEffect } from "react";
import useWakeWord from "../hooks/useWakeWord";
import { SyncSounds } from "../hooks/useSyncSounds";

export default function SyncMain() {
  const [active, setActive] = useState(false);      // Sync acordada
  const [listening, setListening] = useState(false); // ouvindo usuário
  const [speaking, setSpeaking] = useState(false);   // respondendo

  // Ativada pelo wake word "Hey Sync"
  useWakeWord(() => {
    setActive(true);
    setListening(true);
    SyncSounds.activate();

    // listening ativo por 3 segundos
    setTimeout(() => setListening(false), 3000);
  });

  // Exemplo de fala da Sync (você vai integrar isso depois com IA)
  function simulateSyncResponse() {
    setSpeaking(true);
    SyncSounds.message();

    setTimeout(() => {
      setSpeaking(false);
    }, 1200);
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen text-white text-center px-6">

      {/* AVATAR ANIMADO PREMIUM */}
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

      {/* ESTADOS VISUAIS */}
      <h1 className="text-3xl font-semibold mb-4">
        {active
          ? listening
            ? "Estou ouvindo você..."
            : speaking
            ? "Estou respondendo..."
            : "Pronta!"
          : "Olá, eu sou a Sync. Diga 'Hey Sync' para começar."}
      </h1>

      {/* BOTÃO TEMPORÁRIO PARA TESTE */}
      <button
        onClick={simulateSyncResponse}
        className="px-5 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white shadow-lg transition"
      >
        Simular Resposta da Sync
      </button>

    </div>
  );
}
