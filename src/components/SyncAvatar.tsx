import React, { useEffect, useRef } from "react";

interface AvatarProps {
    isSleeping: boolean;
    voiceState: "idle" | "listening" | "speaking" | "thinking";
}

export const Avatar: React.FC<AvatarProps> = ({ isSleeping, voiceState }) => {
    const eyesRef = useRef<HTMLDivElement>(null);

    // Blink animation
    useEffect(() => {
        const blink = () => {
            if (!eyesRef.current) return;
            eyesRef.current.classList.add("blink");
            setTimeout(() => eyesRef.current?.classList.remove("blink"), 150);
        };

        const interval = setInterval(() => {
            if (Math.random() > 0.75) blink();
        }, 2800);

        return () => clearInterval(interval);
    }, []);

    // Speaking pulse
    const speaking = voiceState === "speaking";

    return (
        <div className="relative w-[260px] h-[260px] flex items-center justify-center">
            {/* Avatar Image */}
            <img
                src="/avatar.jpeg"
                alt="Sync Human Avatar"
                className={`rounded-2xl w-full h-full object-cover shadow-xl transition-transform duration-500
                    ${speaking ? "scale-[1.03]" : ""}
                    ${isSleeping ? "opacity-60" : "opacity-100"}
                `}
            />

            {/* Eyes overlay for blink */}
            <div
                ref={eyesRef}
                className="absolute inset-0 pointer-events-none"
                style={{
                    animation: isSleeping ? "sleep-breath 4s ease-in-out infinite" : undefined,
                }}
            />

            {/* Listening glow */}
            {voiceState === "listening" && (
                <div className="absolute inset-0 rounded-2xl border-4 border-blue-400/40 animate-pulse"></div>
            )}

            {/* Thinking pulse */}
            {voiceState === "thinking" && (
                <div className="absolute inset-0 rounded-2xl border-4 border-purple-400/40 animate-ping"></div>
            )}

            <style>
                {`
                    @keyframes sleep-breath {
                        0%, 100% { transform: scale(1); filter: brightness(70%); }
                        50% { transform: scale(0.97); filter: brightness(50%); }
                    }
                    .blink {
                        animation: blinkAnim 0.15s ease-in-out;
                    }
                    @keyframes blinkAnim {
                        0% { opacity: 1; }
                        50% { opacity: 0; }
                        100% { opacity: 1; }
                    }
                `}
            </style>
        </div>
    );
};
