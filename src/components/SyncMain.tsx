import useWakeWord from "../hooks/useWakeWord";
import { useState } from "react";

export default function SyncMain() {
  const [active, setActive] = useState(false);

  // ativa a Sync quando ouvir "Hey Sync"
  useWakeWord(() => {
    setActive(true);
    const audio = new Audio("/activate.mp3");
    audio.play();
  });

  return (
    <div className="flex flex-col items-center justify-center h-screen text-white text-center px-6">

      {/* Avatar com animação quando acorda */}
      <div
        className={`w-40 h-40 rounded-full overflow-hidden shadow-xl mb-6 transition-all ${
          active ? "ring-4 ring-blue-500 scale-110" : ""
        }`}
      >
        <img
          src="/sync-avatar.png"
          alt="Sync Avatar"
          className="w-full h-full object-cover"
        />
      </div>

      <h1 className="text-3xl font-semibold mb-4">
        {active ? "Estou ouvindo..." : "Olá, eu sou a Sync. Como posso ajudar?"}
      </h1>

      {/* campo e botões permanecem iguais */}
