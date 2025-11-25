import React, { useMemo } from 'react';
import type { View } from '../types';
import { Avatar } from './Avatar';
import { 
    MicIcon, 
    KeyboardIcon, 
    PlayCircleIcon, 
    NutritionistIcon, 
    MoneyIcon,
    CheckCircleIcon,
    ShoppingCartIcon,
    DashboardIcon,
    LearnIcon,
    HeartIcon
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

  const bottomShortcuts = [
      { id: 'nutritionist', icon: <NutritionistIcon />, view: 'nutritionist' as View, color: 'text-yellow-400' },
      { id: 'essence', icon: <HeartIcon />, view: 'essence' as View, color: 'text-pink-400' },
      { id: 'learning', icon: <LearnIcon />, view: 'learning' as View, color: 'text-blue-300' },
      { id: 'dashboard', icon: <DashboardIcon />, view: 'dashboard' as View, color: 'text-purple-400' },
      { id: 'tasks', icon: <CheckCircleIcon />, view: 'tasks' as View, color: 'text-green-400' },
      { id: 'shopping', icon: <ShoppingCartIcon />, view: 'shopping' as View, color: 'text-sky-400' },
      { id: 'finances', icon: <MoneyIcon />, view: 'finances' as View, color: 'text-indigo-400' },
  ];

    return (
        <div className="flex flex-col h-full relative overflow-hidden bg-[#0a0e17] text-white font-sans selection:bg-pink-500 selection:text-white">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#111625] to-[#020202] pointer-events-none" />
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-900/10 blur-[150px] rounded-full pointer-events-none" />
            
            {/* Beta Badge */}
            <div className="absolute top-4 right-4 z-20">
                <span className="bg-amber-500/10 backdrop-blur-md border border-amber-500/30 text-xs font-bold px-3 py-1 rounded-full text-amber-300 shadow-lg flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                    ACESSO BETA VIP
                </span>
            </div>
            
            {/* Header */}
            <header className="relative z-10 pt-12 pb-2 text-center">
                <h1 className="text-3xl font-bold tracking-tight mb-1 flex items-center justify-center gap-2 text-white">
                    <span className="text-pink-500">★</span> Async <span className="text-pink-500 font-light">+</span>
                </h1>
                <p className="text-slate-400 text-xs font-medium tracking-wide uppercase opacity-80">Sua companhia inteligente</p>
            </header>

            {/* Main Content (Avatar) */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center -mt-4">
                {/* Glow behind avatar */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full transition-all duration-1000 ${appState === 'active' ? 'opacity-100 scale-125' : 'opacity-50 scale-100'}`} />
                
                {/* Avatar Container - Slightly larger to match reference */}
                <div className="relative z-20 w-64 h-[340px] transition-transform duration-500">
                    <Avatar role="model" isSleeping={appState === 'sleeping'} voiceState={voiceState} />
                </div>
                
                {/* Status Pill - Matches reference "Dormindo" button style */}
                <div className="mt-6 px-6 py-3 bg-[#1e2536] border border-white/5 rounded-full flex items-center gap-3 shadow-xl z-20">
                    <span className="text-lg animate-pulse">{getStatusEmoji()}</span>
                    <span className="text-base font-semibold text-gray-200">{getStatusText()}</span>
                </div>
                
                {error && <div className="mt-4 bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg text-sm z-20 max-w-xs text-center">{error}</div>}
            </main>

            {/* Bottom Controls Area */}
            <footer className="relative z-10 pb-8 px-6 flex flex-col items-center gap-8 w-full">
                
                {/* Primary Actions (Mic & Chat) - Centered and clean */}
                {appState === 'sleeping' && (
                    <div className="flex items-center justify-center gap-10 w-full">
                        <button 
                            onClick={() => setView('text-chat')} 
                            className="w-12 h-12 rounded-full bg-[#1e2436] text-slate-400 hover:text-white hover:bg-[#2a324a] transition-all duration-200 border border-white/5 shadow-lg flex items-center justify-center"
                            aria-label="Abrir Chat de Texto"
                        >
                            <KeyboardIcon /> 
                        </button>
                        
                        {/* Main Mic Button - Pink/Red Gradient with Glow */}
                        <button 
                            onClick={startVoiceSession}
                            className="relative group focus:outline-none"
                            aria-label="Ativar Voz"
                        >
                            <div className="absolute inset-0 bg-pink-600 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse"></div>
                            <div className="relative w-20 h-20 bg-gradient-to-br from-[#ff2d6c] to-[#d90d4c] rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-105 transition-transform duration-200 border-[6px] border-[#0a0e17]/50">
                                <MicIcon className="w-8 h-8 text-white drop-shadow-sm" />
                            </div>
                        </button>

                        <button 
                            onClick={onShareApp}
                            className="w-12 h-12 rounded-full bg-[#1e2436] text-slate-400 hover:text-white hover:bg-[#2a324a] transition-all duration-200 border border-white/5 shadow-lg flex items-center justify-center"
                            aria-label="Compartilhar"
                        >
                             <PlayCircleIcon />
                        </button>
                    </div>
                )}

                {/* Bottom Dock Shortcuts - Glassmorphism */}
                <div className="w-full max-w-lg bg-[#0f1320]/60 backdrop-blur-xl border-t border-white/5 rounded-t-3xl rounded-b-xl p-4 flex justify-between items-center shadow-2xl">
                    {bottomShortcuts.map((shortcut) => (
                        <button 
                            key={shortcut.id}
                            onClick={() => setView(shortcut.view)}
                            className={`p-2 rounded-xl hover:bg-white/5 transition-all duration-200 relative group flex flex-col items-center gap-1 ${shortcut.color}`}
                            aria-label={shortcut.id}
                        >
                            <div className="w-6 h-6 flex items-center justify-center opacity-80 group-hover:opacity-100 transform group-hover:scale-110 transition-transform">
                                {shortcut.icon}
                            </div>
                        </button>
                    ))}
                </div>
            </footer>
        </div>
    );
};