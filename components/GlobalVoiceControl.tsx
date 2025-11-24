import React from 'react';
import { MicIcon, LoadingSpinnerIcon, SpeakingIcon, StopIcon } from './Icons';

interface GlobalVoiceControlProps {
  voiceState: 'idle' | 'listening' | 'speaking' | 'thinking';
  stopVoiceSession: () => void;
}

export const GlobalVoiceControl: React.FC<GlobalVoiceControlProps> = ({ voiceState, stopVoiceSession }) => {
    
    const baseClasses = "fixed bottom-8 right-8 z-50 w-20 h-20 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-4 text-white";
    
    let icon;
    let bgColor = 'bg-red-500 hover:bg-red-600 focus:ring-red-300';
    let label = 'Parar';

    switch (voiceState) {
        case 'listening':
            icon = <MicIcon />;
            bgColor = 'bg-cyan-500 animate-pulse focus:ring-cyan-300';
            label = 'Ouvindo... Clique para parar';
            break;
        case 'thinking':
            icon = <LoadingSpinnerIcon />;
            bgColor = 'bg-purple-500 focus:ring-purple-300';
            label = 'Processando...';
            break;
        case 'speaking':
            icon = <SpeakingIcon />;
            bgColor = 'bg-blue-500 focus:ring-blue-300';
            label = 'Falando...';
            break;
        default: // idle
            icon = <StopIcon />;
            label = 'Parar sessão de voz';
            break;
    }

    return (
        <button
            onClick={stopVoiceSession}
            className={`${baseClasses} ${bgColor}`}
            aria-label={label}
        >
            {icon}
        </button>
    );
};
