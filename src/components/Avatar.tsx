import React, { useEffect, useRef } from "react";

interface AvatarProps {
    isSleeping: boolean;
    voiceState: "idle" | "listening" | "speaking" | "thinking";
}

export const Avatar: React.FC<AvatarProps> = ({ isSleeping, voiceState }) => {
    const blinkRef = useRef<HTMLDivElement>(null);

    // Automatic blinking animation
    useEffect(() => {
        const blink = () => {
            if (!blinkRef.current) return;
            blinkRef.current.classList.add("blink");
            setTimeout(() => blinkRef.current?.classList.remove("blink"), 120);
        };

        const interval = setInterval(() => {
            if (Math.random() > 0.65) blink();
        }, 2300);

        return () => clearInterval(interval);
    }, []);

    const speaking = voiceState === "speaking";
    const listening = voiceState === "listening";
    const thinking = voiceState === "thinking";

    return (
        <div className="relative w-[260px] h-[260px] flex items-center justify-center select-none">
            
            {/* Avatar Image */}
            <img
                src="/avatar.jpeg"
                alt="Sync Human Avatar"
                className={`rounded-2xl w-full h-full object-cover shadow-xl transition-all duration-500
                    ${speaking ? "scale-[1.03] saturate-150" : ""}
                    ${isSleeping ? "opacity-50 brightness-75" : "opacity-100"}
                `}
            />

            {/* Blink layer */}
            <div ref={blinkRef} className="absolute inset-0 bg-black/0 rounded-2xl pointer-events-none"></div>

            {/* Speaking pulse outline */}
            {speaking && (
                <div className="absolute inset-0 rounded-2xl border-4 border-pink-400/50 animate-pulse"></div>
            )}

            {/* Listening glow */}
            {listening && (
                <div className="absolute inset-0 rounded-2xl border-4 border-blue-400/40 animate-pulse"></div>
            )}

            {/* Thinking ping */}
            {thinking && (
                <div className="absolute inset-0 rounded-2xl border-4 border-purple-400/40 animate-ping"></div>
            )}

            <style>
                {`
                .blink {
                    animation: blinkAnim 0.12s ease-in-out;
                }
                @keyframes blinkAnim {
                    0% { background-color: rgba(0,0,0,0); }
                    50% { background-color: rgba(0,0,0,0.65); }
                    100% { background-color: rgba(0,0,0,0); }
                }
                @keyframes sleepBreath {
                    0%, 100% { transform: scale(1); filter: brightness(70%); }
                    50% { transform: scale(0.96); filter: brightness(55%); }
                }
                `}
            </style>
        </div>
    );
};
