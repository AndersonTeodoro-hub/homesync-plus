
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { HeartIcon, SmileIcon, SadIcon, NeutralIcon, ThunderIcon, LoadingSpinnerIcon } from './Icons';

export const Essence: React.FC = () => {
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleMoodSelect = async (mood: string) => {
    setCurrentMood(mood);
    setIsGenerating(true);
    setMessage(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      
      const prompt = `
        Eu estou me sentindo: ${mood}.
        Aja como um amigo sábio, estoico e empático.
        Me dê um conselho curto, uma frase motivacional poderosa e uma pequena ação prática para eu me sentir melhor ou manter esse estado.
        Seja caloroso mas objetivo. Use emojis.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ parts: [{ text: prompt }] }]
      });

      setMessage(response.text || "Não consegui conectar com sua essência agora.");

    } catch (error) {
      console.error("Erro Essence:", error);
      setMessage("Erro ao gerar reflexão.");
    } finally {
      setIsGenerating(false);
    }
  };

  const moods = [
    { id: 'feliz', label: 'Feliz / Grato', icon: <SmileIcon />, color: 'bg-emerald-500' },
    { id: 'ansioso', label: 'Ansioso', icon: <ThunderIcon />, color: 'bg-yellow-500' },
    { id: 'triste', label: 'Triste / Desanimado', icon: <SadIcon />, color: 'bg-blue-500' },
    { id: 'neutro', label: 'Cansado / Neutro', icon: <NeutralIcon />, color: 'bg-gray-500' },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-rose-500 to-purple-900 p-8 font-sans text-white">
      <header className="flex items-center space-x-3 mb-10">
        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-rose-400/20 text-rose-200">
          <HeartIcon />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Essência</h1>
          <p className="text-md text-white/80">Cuidando da sua mente e alma</p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-semibold mb-8">Como você está se sentindo agora?</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {moods.map((m) => (
            <button
              key={m.id}
              onClick={() => handleMoodSelect(m.id)}
              className={`p-6 rounded-2xl border border-white/10 flex flex-col items-center gap-3 transition-all duration-300 hover:scale-105 ${currentMood === m.id ? 'bg-white/20 ring-2 ring-white' : 'bg-black/20 hover:bg-black/30'}`}
            >
              <div className={`p-3 rounded-full text-white shadow-lg ${m.color}`}>
                {m.icon}
              </div>
              <span className="font-medium text-sm">{m.label}</span>
            </button>
          ))}
        </div>

        {isGenerating && (
          <div className="flex justify-center py-12">
            <LoadingSpinnerIcon />
          </div>
        )}

        {message && !isGenerating && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl animate-fade-in text-left relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-400 to-purple-500"></div>
            <h3 className="text-xl font-bold text-rose-200 mb-4">Reflexão para você</h3>
            <div className="prose prose-invert prose-lg max-w-none">
              <p className="whitespace-pre-line leading-relaxed">{message}</p>
            </div>
            <div className="mt-6 flex justify-end">
               <span className="text-xs text-white/40 italic">Async+ Emotional Support</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
