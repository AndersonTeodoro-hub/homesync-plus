import { useEffect, useRef } from "react";

interface Props {
  active: boolean;
  listening: boolean;
  speaking: boolean;
  thinking: boolean;
}

export default function SyncAvatar({ active, listening, speaking, thinking }: Props) {

  // Referência da boca (lip sync)
  const mouthRef = useRef<HTMLDivElement>(null);

  // Piscadas automáticas
  useEffect(() => {
    const eyes = document.getElementById("sync-eyes");

    function blink() {
      if (!eyes) return;
      eyes.classList.add("blink");
      setTimeout(() => eyes.classList.remove("blink"), 150);
    }

    const interval = setInterval(() => {
      if (Math.random() > 0.7) blink();
    }, 2700);

    return () => clearInterval(interval);
  }, []);

  // Lip-sync simples baseado no estado speaking
  useEffect(() => {
    const mouth = mouthRef.current;
    if (!mouth) return;

    if (speaking) {
      mouth.classList.add("talking");
    } else {
      mouth.classList.remove("talking");
    }
  }, [speaking]);

  return (
    <div
      className={`
        relative w-48 h-48 rounded-full overflow-hidden shadow-xl 
        transition-all duration-500 ease-out

        ${active ? "scale-110 ring-4 ring-blue-500" : "scale-100"}
        ${listening ? "animate-sync-listen" : ""}
        ${speaking ? "animate-sync-talk" : ""}
        ${thinking ? "opacity-75 saturate-50" : ""}
      `}
    >

      {/* === IMAGEM BASE DO AVATAR === */}
      <img
        src="/sync-avatar.png"
        className="w-full h-full object-cover"
        alt="Sync Avatar"
      />

      {/* === OLHOS (ANIMAÇÃO DE PISCAR + MICRO MOVIMENTO) === */}
      <div
        id="sync-eyes"
        className="absolute top-[34%] left-[28%] w-[45%] h-[18%] pointer-events-none"
      >
        <div className="eye left-eye"></div>
        <div className="eye right-eye"></div>
      </div>

      {/* === BOCA (LIP SYNC) === */}
      <div
        ref={mouthRef}
        className="absolute bottom-[22%] left-[38%] w-[24%] h-[12%] mouth"
      ></div>

      {/* === AURA HOLOGRÁFICA === */}
      <div
        className={`
          absolute inset-0 rounded-full pointer-events-none transition-all duration-500
          ${speaking ? "aura-speaking" : ""}
          ${thinking ? "aura-thinking" : ""}
        `}
      ></div>

    </div>
  );
}
