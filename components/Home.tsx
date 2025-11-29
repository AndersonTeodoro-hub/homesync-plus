
import React, { useState } from 'react';
import type { View } from '../types';
import { Avatar } from './Avatar';
import { CapabilitiesModal } from './CapabilitiesModal';
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
} from './Icons';

type AppState = 'sleeping' | 'active';
type VoiceState = 'idle' | 'listening' | 'speaking' | 'thinking';

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
    onShareApp,
}) => {
  const [isCapabilitiesOpen, setIsCapabilitiesOpen] = useState(false);

  const getStatusText = () => {
      if (appState === 'sleeping') return "Dormindo";
      switch (voiceState) {
          case 'listening': return "Ouvindo...";
          case 'speaking': return "Falando...";
          case 'thinking': return "Pensando...";
          default: return "Olá! Como posso ajudar?";
      }
  };

  const getStatusEmoji = () => {
      if (appState === 'sleeping') return "😴";
      switch (voiceState) {
          case 'listening': return "👂";
          case 'speaking': return "✨";
          case 'thinking': return "⚡";
          default: return "👋";
      }
  };

  // Módulos Principais (CTA)
  const mainModules = [
      { id: 'english-course', label: 'Inglês', icon: <EnglishIcon />, view: 'english-course' as View, color: 'bg-blue-600/20 text-blue-300 border-blue-500/30' },
      { id: 'babysitter', label: 'Modo Babá', icon: <BabyIcon />, view: 'babysitter' as View, color: 'bg-pink-600/20 text-pink-300 border-pink-500/30' },
      { id: 'sync-kids', label: 'Kids', icon: <BalloonIcon />, view: 'sync-kids' as View, color: 'bg-yellow-600/20 text-yellow-300 border-yellow-500/30' },
      { id: 'nutritionist', label: 'Nutri', icon: <NutritionistIcon />, view: 'nutritionist' as View, color: 'bg-green-600/20 text-green-300 border-green-500/30' },
      { id: 'personal-trainer', label: 'Treino', icon: <PersonalTrainerIcon />, view: 'personal-trainer' as View, color: 'bg-orange-600/20 text-orange-300 border-orange-500/30' },
      { id: 'essence', label: 'Essência', icon: <HeartIcon />, view: 'essence' as View, color: 'bg-purple-600/20 text-purple-300 border-purple-500/30' },
  ];

    return (
        <div className="flex flex-col h-full relative overflow-hidden bg-[#0a0e17] text-white font-sans selection:bg-pink-500 selection:text-white">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#1e293b] to-[#0f172a] pointer-events-none" />
            <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[60%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
            
            {/* Beta Badge */}
            <div className="absolute top-4 right-4 z-20">
                <span className="bg-white/5 backdrop-blur-md border border-white/10 text-[10px] md:text-xs font-bold px-3 py-1 rounded-full text-blue-200 shadow-lg flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                    BETA VIP
                </span>
            </div>
            
            {/* Header */}
            <header className="relative z-10 pt-4 pb-1 text-center">
                <h1 className="text-2xl font-bold tracking-tight flex items-center justify-center gap-2 text-white">
                    <span className="text-pink-500">★</span> Async <span className="text-pink-500 font-light">+</span>
                </h1>
            </header>

            {/* Main Content Area */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-start pt-4 px-4 overflow-y-auto custom-scrollbar">
                
                {/* Avatar Area */}
                <div className="relative z-20 w-full max-w-[280px] h-[320px] flex-shrink-0 flex items-center justify-center mb-2">
                    <Avatar role="model" isSleeping={appState === 'sleeping'} voiceState={voiceState} />
                </div>
                
                {/* Status & Powers */}
                <div className="flex flex-col items-center gap-2 mb-6">
                    <div className="px-4 py-1 bg-white/5 border border-white/10 rounded-full flex items-center gap-2 shadow-sm backdrop-blur-md">
                        <span className="text-sm animate-pulse">{getStatusEmoji()}</span>
                        <span className="text-xs font-semibold text-gray-300 uppercase tracking-wide">{getStatusText()}</span>
                    </div>
                    <button 
                        onClick={() => setIsCapabilitiesOpen(true)}
                        className="flex items-center gap-1.5 text-[10px] text-indigo-300 hover:text-white transition-colors"
                    >
                        <SparklesIcon />
                        <span>Ver poderes</span>
                    </button>
                </div>

                {/* --- GRID DE MÓDULOS (CTA) --- */}
                <div className="w-full max-w-md grid grid-cols-3 gap-3 mb-20">
                    {mainModules.map((mod) => (
                        <button
                            key={mod.id}
                            onClick={() => setView(mod.view)}
                            className={`flex flex-col items-center justify-center p-3 rounded-2xl border backdrop-blur-sm transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg ${mod.color}`}
                        >
                            <div className="w-8 h-8 mb-1">
                                {mod.icon}
                            </div>
                            <span className="text-xs font-bold text-white/90">{mod.label}</span>
                        </button>
                    ))}
                </div>
                
                {error && <div className="mt-2 bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg text-xs text-center">{error}</div>}
            </main>

            {/* Floating Action Bar (Mic & Family & Cam) */}
            <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center items-center gap-6 pointer-events-none">
                {appState === 'sleeping' && (
                    <div className="flex items-center gap-6 pointer-events-auto">
                        <button 
                            onClick={() => setView('family')} 
                            className="w-12 h-12 rounded-full bg-[#1e293b]/90 backdrop-blur text-slate-400 hover:text-white hover:bg-[#334155] border border-white/10 shadow-xl flex items-center justify-center transition-all"
                        >
                            <FamilyIcon /> 
                        </button>
                        
                        <button 
                            onClick={startVoiceSession}
                            className="relative group focus:outline-none"
                        >
                            <div className="absolute inset-0 bg-pink-600 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity animate-pulse"></div>
                            <div className="relative w-16 h-16 bg-gradient-to-br from-[#ec4899] to-[#be185d] rounded-full flex items-center justify-center shadow-2xl border-[3px] border-[#0f172a] transform group-hover:scale-105 transition-transform">
                                <MicIcon className="w-7 h-7 text-white" />
                            </div>
                        </button>

                        <button 
                            onClick={() => setView('inventory')}
                            className="w-12 h-12 rounded-full bg-[#1e293b]/90 backdrop-blur text-slate-400 hover:text-white hover:bg-[#334155] border border-white/10 shadow-xl flex items-center justify-center transition-all"
                        >
                             <CameraIcon />
                        </button>
                    </div>
                )}
            </div>

            <CapabilitiesModal isOpen={isCapabilitiesOpen} onClose={() => setIsCapabilitiesOpen(false)} />
        </div>
    );
};
