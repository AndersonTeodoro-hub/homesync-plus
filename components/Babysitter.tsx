
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { BabyIcon, BookIcon, MoonIcon, BottleIcon, DiaperIcon, LoadingSpinnerIcon, PlayCircleIcon, StopIcon } from './Icons';

interface BabyLog {
  id: number;
  type: 'feed' | 'diaper' | 'sleep';
  time: string;
  note?: string;
}

export const Babysitter: React.FC = () => {
  // Estado para abas
  const [activeTab, setActiveTab] = useState<'story' | 'tracker' | 'sound'>('story');

  // --- STORY MODE STATE ---
  const [childName, setChildName] = useState('');
  const [storyTheme, setStoryTheme] = useState('');
  const [generatedStory, setGeneratedStory] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // --- TRACKER STATE ---
  const [logs, setLogs] = useState<BabyLog[]>(() => {
    try {
      const saved = localStorage.getItem('babyLogs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // --- SOUND STATE ---
  const [isPlayingSound, setIsPlayingSound] = useState(false);

  // Persist logs
  useEffect(() => {
    localStorage.setItem('babyLogs', JSON.stringify(logs));
  }, [logs]);

  // --- HANDLERS ---

  const handleGenerateStory = async () => {
    if (!childName.trim() || !storyTheme.trim()) return;
    setIsGenerating(true);
    setGeneratedStory(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const prompt = `
        Crie uma história curta de ninar para uma criança chamada ${childName}.
        Tema: ${storyTheme}.
        Tom: Calmo, lúdico, educativo e relaxante.
        Tamanho: Curto (aprox 3-4 parágrafos).
        Comece com um título.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ parts: [{ text: prompt }] }]
      });

      setGeneratedStory(response.text || "Não consegui criar a história agora.");
    } catch (error) {
      console.error(error);
      setGeneratedStory("Erro ao conectar com a criatividade da IA.");
    } finally {
      setIsGenerating(false);
    }
  };

  const addLog = (type: 'feed' | 'diaper' | 'sleep') => {
    const now = new Date();
    const newLog: BabyLog = {
      id: Date.now(),
      type,
      time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };
    setLogs([newLog, ...logs]);
  };

  const getLogIcon = (type: string) => {
    switch(type) {
      case 'feed': return <BottleIcon />;
      case 'diaper': return <DiaperIcon />;
      case 'sleep': return <MoonIcon />;
      default: return <BabyIcon />;
    }
  };

  const getLogLabel = (type: string) => {
    switch(type) {
      case 'feed': return 'Mamou';
      case 'diaper': return 'Troca';
      case 'sleep': return 'Dormiu';
      default: return '';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-pink-300 to-purple-400 p-8 font-sans text-white">
      <header className="flex items-center space-x-3 mb-8">
        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-white/30 text-white">
          <BabyIcon />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Modo Babá</h1>
          <p className="text-md text-white/90">Histórias e cuidados para seu bebê</p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="flex justify-center mb-8 space-x-4">
        <button 
          onClick={() => setActiveTab('story')}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${activeTab === 'story' ? 'bg-white text-purple-500 shadow-lg' : 'bg-white/20 text-white hover:bg-white/30'}`}
        >
          <BookIcon /> Histórias
        </button>
        <button 
          onClick={() => setActiveTab('tracker')}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${activeTab === 'tracker' ? 'bg-white text-purple-500 shadow-lg' : 'bg-white/20 text-white hover:bg-white/30'}`}
        >
          <DiaperIcon /> Rotina
        </button>
        <button 
          onClick={() => setActiveTab('sound')}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${activeTab === 'sound' ? 'bg-white text-purple-500 shadow-lg' : 'bg-white/20 text-white hover:bg-white/30'}`}
        >
          <MoonIcon /> Ninar
        </button>
      </div>

      <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-xl min-h-[400px]">
        
        {/* --- STORY CONTENT --- */}
        {activeTab === 'story' && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 ml-1">Nome da Criança</label>
                <input 
                  type="text" 
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-black/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:bg-black/20"
                  placeholder="Ex: Lucas, Sofia..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 ml-1">Tema da História</label>
                <input 
                  type="text" 
                  value={storyTheme}
                  onChange={(e) => setStoryTheme(e.target.value)}
                  className="w-full p-3 rounded-xl bg-black/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:bg-black/20"
                  placeholder="Ex: Dinossauros no espaço, Fada da floresta..."
                />
              </div>
              <button 
                onClick={handleGenerateStory}
                disabled={isGenerating || !childName || !storyTheme}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {isGenerating ? <LoadingSpinnerIcon /> : <BookIcon />}
                {isGenerating ? "Criando magia..." : "Contar História"}
              </button>
            </div>

            {generatedStory && (
              <div className="bg-white/80 text-purple-900 p-6 rounded-2xl shadow-inner prose prose-purple max-w-none">
                <div dangerouslySetInnerHTML={{ __html: generatedStory.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
              </div>
            )}
          </div>
        )}

        {/* --- TRACKER CONTENT --- */}
        {activeTab === 'tracker' && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-3 gap-4 mb-8">
              <button onClick={() => addLog('feed')} className="flex flex-col items-center gap-2 p-4 bg-blue-400/40 hover:bg-blue-400/60 rounded-2xl transition-colors border border-white/20">
                <BottleIcon />
                <span className="font-bold">Mamou</span>
              </button>
              <button onClick={() => addLog('diaper')} className="flex flex-col items-center gap-2 p-4 bg-green-400/40 hover:bg-green-400/60 rounded-2xl transition-colors border border-white/20">
                <DiaperIcon />
                <span className="font-bold">Troca</span>
              </button>
              <button onClick={() => addLog('sleep')} className="flex flex-col items-center gap-2 p-4 bg-indigo-400/40 hover:bg-indigo-400/60 rounded-2xl transition-colors border border-white/20">
                <MoonIcon />
                <span className="font-bold">Dormiu</span>
              </button>
            </div>

            <h3 className="font-semibold mb-4 ml-1">Histórico de Hoje</h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
              {logs.length === 0 ? (
                <p className="text-center text-white/50 py-8">Nenhum registro hoje.</p>
              ) : (
                logs.map(log => (
                  <div key={log.id} className="flex items-center justify-between p-3 bg-black/10 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="p-2 bg-white/20 rounded-lg">{getLogIcon(log.type)}</span>
                      <span className="font-medium">{getLogLabel(log.type)}</span>
                    </div>
                    <span className="font-mono text-sm opacity-80">{log.time}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* --- SOUND CONTENT --- */}
        {activeTab === 'sound' && (
          <div className="flex flex-col items-center justify-center py-12 animate-fade-in text-center">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 transition-all duration-1000 ${isPlayingSound ? 'bg-blue-300/30 shadow-[0_0_50px_rgba(255,255,255,0.3)] scale-110' : 'bg-black/10'}`}>
              <MoonIcon />
            </div>
            
            <h3 className="text-2xl font-bold mb-2">Ruído Branco</h3>
            <p className="text-white/70 mb-8 max-w-xs">Som suave e constante para acalmar e ajudar o bebê a dormir.</p>

            <button 
              onClick={() => setIsPlayingSound(!isPlayingSound)}
              className={`px-10 py-4 rounded-full font-bold text-lg shadow-lg transition-all flex items-center gap-3 ${isPlayingSound ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}
            >
              {isPlayingSound ? <StopIcon /> : <PlayCircleIcon />}
              {isPlayingSound ? "Parar Som" : "Tocar Som"}
            </button>
            
            {isPlayingSound && <p className="mt-4 text-xs animate-pulse">🎶 Tocando som de chuva suave...</p>}
          </div>
        )}

      </div>
    </div>
  );
};
