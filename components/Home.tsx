
import React, { useMemo, useState } from 'react';
import type { View } from '../types';
import { Avatar } from './Avatar';
import { CapabilitiesModal } from './CapabilitiesModal'; // Importação do Modal
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
    HeartIcon,
    CameraIcon,
    SparklesIcon,
    FamilyIcon // Importando ícone de Família
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
            <header className="relative z-10 pt-6 pb-1 text-center">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1 flex items-center justify-center gap-2 text-white">
                    <span className="text-pink-500">★</span> Async <span className="text-pink-500 font-light">+</span>
                </h1>
                <p className="text-slate-400 text-[10px] md:text-xs font-medium tracking-wide uppercase opacity-80">Sua companhia inteligente</p>
            </header>

            {/* Main Content (Avatar) */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center -mt-2">
                
                {/* Avatar Container - SUPER AUMENTADO */}
                {/* Agora ocupa até 75% da altura da tela e é muito mais largo */}
                <div className="relative z-20 w-full max-w-lg md:max-w-2xl h-[65vh] md:h-[75vh] max-h-[900px] transition-transform duration-500 flex items-center justify-center p-0">
                    <Avatar role="model" isSleeping={appState === 'sleeping'} voiceState={voiceState} />
                </div>
                
                {/* Status Pill */}
                <div className="mt-2 px-5 py-1.5 bg-white/5 border border-white/10 rounded-full flex items-center gap-2 shadow-xl z-20 backdrop-blur-md">
                    <span className="text-base animate-pulse">{getStatusEmoji()}</span>
                    <span className="text-xs md:text-sm font-semibold text-gray-200 uppercase tracking-wider">{getStatusText()}</span>
                </div>

                {/* Botão Descubra meus poderes (SHOWCASE) */}
                <button 
                    onClick={() => setIsCapabilitiesOpen(true)}
                    className="mt-3 flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 hover:border-indigo-400/50 hover:bg-indigo-500/30 transition-all text-[10px] md:text-xs font-medium text-indigo-200 z-20"
                >
                    <SparklesIcon />
                    Descubra meus poderes
                </button>
                
                {error && <div className="mt-4 bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg text-sm z-20 max-w-xs text-center">{error}</div>}
            </main>

            {/* Bottom Controls Area */}
            <footer className="relative z-10 pb-6 px-6 flex flex-col items-center gap-6 w-full">
                
                {/* Primary Actions (Mic & Chat & Vision) */}
                {appState === 'sleeping' && (
                    <div className="flex items-center justify-center gap-6 w-full">
                        
                        {/* Botão de Família (Contatos) - Substituiu o Texto */}
                        <button 
                            onClick={() => setView('family')} 
                            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#1e293b] text-slate-400 hover:text-white hover:bg-[#334155] transition-all duration-200 border border-white/5 shadow-lg flex items-center justify-center"
                            aria-label="Gerenciar Contatos da Família"
                        >
                            <FamilyIcon /> 
                        </button>
                        
                        {/* Main Mic Button */}
                        <button 
                            onClick={startVoiceSession}
                            className="relative group focus:outline-none"
                            aria-label="Ativar Voz"
                        >
                            <div className="absolute inset-0 bg-pink-600 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 animate-pulse"></div>
                            <div className="relative w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#ec4899] to-[#be185d] rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-105 transition-transform duration-200 border-[4px] border-[#0f172a]">
                                <MicIcon className="w-6 h-6 md:w-8 md:h-8 text-white drop-shadow-sm" />
                            </div>
                        </button>

                        {/* Câmera / Visão */}
                        <button 
                            onClick={() => setView('inventory')}
                            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#1e293b] text-slate-400 hover:text-white hover:bg-[#334155] transition-all duration-200 border border-white/5 shadow-lg flex items-center justify-center"
                            aria-label="Abrir Visão Computacional"
                        >
                             <CameraIcon />
                        </button>
                    </div>
                )}

                {/* Bottom Dock Shortcuts */}
                <div className="w-full max-w-lg bg-[#0f172a]/80 backdrop-blur-xl border-t border-white/5 rounded-t-3xl rounded-b-xl p-3 md:p-4 flex justify-between items-center shadow-2xl">
                    {bottomShortcuts.map((shortcut) => (
                        <button 
                            key={shortcut.id}
                            onClick={() => setView(shortcut.view)}
                            className={`p-1.5 md:p-2 rounded-xl hover:bg-white/5 transition-all duration-200 relative group flex flex-col items-center gap-1 ${shortcut.color}`}
                            aria-label={shortcut.id}
                        >
                            <div className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center opacity-80 group-hover:opacity-100 transform group-hover:scale-110 transition-transform">
                                {shortcut.icon}
                            </div>
                        </button>
                    ))}
                </div>
            </footer>

            {/* Modal de Habilidades */}
            <CapabilitiesModal isOpen={isCapabilitiesOpen} onClose={() => setIsCapabilitiesOpen(false)} />
        </div>
    );
};
