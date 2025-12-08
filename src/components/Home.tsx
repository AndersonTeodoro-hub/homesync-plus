import React, { useState } from "react";
import { Avatar } from "./Avatar";
import type { View } from "../types";

import { 
    MicIcon,
    CameraIcon,
    SparklesIcon,
    FamilyIcon,
    EnglishIcon,
    BabyIcon,
    NutritionistIcon,
    PersonalTrainerIcon,
    HeartIcon,
    BalloonIcon
} from "./Icons";

type AppState = "sleeping" | "active";
type VoiceState = "idle" | "listening" | "speaking" | "thinking";

interface HomeProps {
    appState: AppState;
    voiceState: VoiceState;
    error: string | null;
    setView: (view: View) => void;
    startVoiceSession: () => void;
    onShareApp: () => void;
}

export const Home: React.FC<HomeProps> = ({
    appState,
    voiceState,
    error,
    setView,
    startVoiceSession,
    onShareApp
}) => {

    const [open, setOpen] = useState(false);

    const mainModules = [
        { id: "english-course", label: "Inglês", icon: <EnglishIcon />, view: "english-course" as View },
        { id: "babysitter", label: "Babá", icon: <BabyIcon />, view: "babysitter" as View },
        { id: "sync-kids", label: "Kids", icon: <BalloonIcon />, view: "sync-kids" as View },
        { id: "nutritionist", label: "Nutri", icon: <NutritionistIcon />, view: "nutritionist" as View },
        { id: "personal-trainer", label: "Treino", icon: <PersonalTrainerIcon />, view: "personal-trainer" as View },
        { id: "essence", label: "Essência", icon: <HeartIcon />, view: "essence" as View },
    ];

    const getStatusText = () => {
        if (appState === "sleeping") return "Dormindo";
        if (voiceState === "listening") return "Ouvindo...";
        if (voiceState === "speaking") return "Falando...";
        if (voiceState === "thinking") return "Pensando...";
        return "Olá! Como posso ajudar?";
    };

    return (
        <div className="flex flex-col h-full bg-[#0a0e17] text-white relative overflow-hidden">
            
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#1e293b] to-[#0f172a]" />

            {/* Header */}
            <header className="relative z-20 text-center py-4">
                <h1 className="text-2xl font-bold tracking-tight flex items-center justify-center gap-2">
                    <span className="text-pink-500">★</span> Async <span className="text-pink-500">+</span>
                </h1>
            </header>

            {/* Avatar */}
            <div className="relative z-20 flex justify-center mt-4">
                <Avatar 
                    isSleeping={appState === "sleeping"} 
                    voiceState={voiceState} 
                />
            </div>

            {/* Status text */}
            <div className="relative z-20 flex justify-center mt-4">
                <div className="px-4 py-2 bg-white/10 rounded-full border border-white/20 text-sm">
                    {getStatusText()}
                </div>
            </div>

            {/* Modules */}
            <div className="relative z-20 grid grid-cols-3 gap-3 px-6 mt-10">
                {mainModules.map(m => (
                    <button
                        key={m.id}
                        onClick={() => setView(m.view)}
                        className="bg-white/10 backdrop-blur rounded-xl p-3 flex flex-col items-center border border-white/10 hover:bg-white/20 hover:scale-105 transition-all"
                    >
                        <div className="w-6 h-6 mb-1">{m.icon}</div>
                        <span className="text-[11px]">{m.label}</span>
                    </button>
                ))}
            </div>

            {/* Microphone Floating Button */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center z-30">
                <button 
                    onClick={startVoiceSession}
                    className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-pink-600 to-pink-800 shadow-xl active:scale-95 transition-transform"
                >
                    <MicIcon className="w-7 h-7 text-white" />
                </button>
            </div>

            {error && (
                <div className="mt-4 px-4 text-center text-red-300 text-sm">
                    {error}
                </div>
            )}
        </div>
    );
};
