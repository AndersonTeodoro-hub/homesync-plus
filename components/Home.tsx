
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
            {/* Background Effects - Darker Navy */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#1e293b] to-[#0f172a] pointer-events-none" />
            
            {/* Soft Ambient Light */}
            <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[60%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
            
            {/* Beta Badge */}
            <div className="absolute top-4 right-4 z-20">
                <span className="bg-white/5 backdrop-blur-md border border-white/10 text-[10px] md:text-xs font-bold px-3 py-1 rounded-full text-blue-200 shadow-lg flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                    BETA VIP
                </span>
            </div>
            
            {/* Header */}
            <header className="relative z-10 pt-8 pb-2 text-center">
                <h1 className="text-3xl font-bold tracking-tight mb-1 flex items-center justify-center gap-2 text-white">
                    <span className="text-pink-500">★</span> Async <span className="text-pink-500 font-light">+</span>
                </h1>
                <p className="text-slate-400 text-xs font-medium tracking-wide uppercase opacity-80">Sua companhia inteligente</p>
            </header>

            {/* Main Content (Avatar) */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center -mt-4">
                
                {/* Avatar Container - Otimizado para PNG */}
                <div className="relative z-20 w-full max-w-xs h-[50vh] max-h-[500px] transition-transform duration-500 flex items-center justify-center p-6">
                    <Avatar role="model" isSleeping={appState === 'sleeping'} voiceState={voiceState} />
                </div>
                
                {/* Status Pill */}
                <div className="mt-4 px-6 py-2 bg-white/5 border border-white/10 rounded-full flex items-center gap-3 shadow-xl z-20 backdrop-blur-md">
                    <span className="text-lg animate-pulse">{getStatusEmoji()}</span>
                    <span className="text-sm font-semibold text-gray-200 uppercase tracking-wider">{getStatusText()}</span>
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
                            className="w-12 h-12 rounded-full bg-[#1e293b] text-slate-400 hover:text-white hover:bg-[#334155] transition-all duration-200 border border-white/5 shadow-lg flex items-center justify-center"
                            aria-label="Abrir Chat de Texto"
                        >
                            <KeyboardIcon /> 
                        </button>
                        
                        {/* Main Mic Button */}
                        <button 
                            onClick={startVoiceSession}
                            className="relative group focus:outline-none"
                            aria-label="Ativar Voz"
                        >
                            <div className="absolute inset-0 bg-pink-600 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 animate-pulse"></div>
                            <div className="relative w-20 h-20 bg-gradient-to-br from-[#ec4899] to-[#be185d] rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-105 transition-transform duration-200 border-[4px] border-[#0f172a]">
                                <MicIcon className="w-8 h-8 text-white drop-shadow-sm" />
                            </div>
                        </button>

                        <button 
                            onClick={onShareApp}
                            className="w-12 h-12 rounded-full bg-[#1e293b] text-slate-400 hover:text-white hover:bg-[#334155] transition-all duration-200 border border-white/5 shadow-lg flex items-center justify-center"
                            aria-label="Compartilhar"
                        >
                             <PlayCircleIcon />
                        </button>
                    </div>
                )}

                {/* Bottom Dock Shortcuts - Glassmorphism */}
                <div className="w-full max-w-lg bg-[#0f172a]/80 backdrop-blur-xl border-t border-white/5 rounded-t-3xl rounded-b-xl p-4 flex justify-between items-center shadow-2xl">
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
