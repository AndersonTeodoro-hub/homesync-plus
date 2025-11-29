
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { BalloonIcon, PlayCircleIcon, BookIcon, HeartIcon, LoadingSpinnerIcon } from './Icons';

export const SyncKids: React.FC = () => {
  const [mode, setMode] = useState<'menu' | 'story' | 'game' | 'values'>('menu');
  const [content, setContent] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateKidsContent = async (type: 'story' | 'game' | 'values') => {
    setIsGenerating(true);
    setContent(null);
    setMode(type);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      
      let prompt = "";
      if (type === 'story') {
        prompt = `
          Você é a Sync Kids, uma amiguinha virtual muito alegre e entusiasta para crianças de 4 a 6 anos.
          Crie uma história bíblica curta e emocionante (ex: Davi e Golias, Arca de Noé, Daniel na Cova dos Leões) adaptada para linguagem infantil.
          Enfatize a coragem, a fé e o amor.
          Use emojis e linguagem muito simples e divertida.
        `;
      } else if (type === 'game') {
        prompt = `
          Você é a Sync Kids. Crie uma brincadeira ou desafio rápido para a criança fazer agora na sala de casa.
          Exemplo: "O chão é lava", "Encontre algo azul", "Imite um animal".
          O objetivo é gastar energia e rir.
          Seja muito animada!
        `;
      } else if (type === 'values') {
        prompt = `
          Você é a Sync Kids. Ensine uma lição valiosa sobre RESPEITO AOS PAIS ou GRATIDÃO ou AJUDAR EM CASA.
          Faça isso através de uma mini-história ou exemplo do dia a dia da criança.
          Incentive ela a ir dar um abraço nos pais agora ou ajudar a guardar os brinquedos.
          Seja doce e convincente.
        `;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ parts: [{ text: prompt }] }]
      });

      setContent(response.text || "Ops! Me perdi no caminho. Vamos tentar de novo?");

    } catch (error) {
      console.error(error);
      setContent("A Sync Kids está tirando uma soneca. Tente já já!");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-orange-300 via-pink-300 to-purple-400 p-6 font-sans text-white h-full relative">
      
      {/* Header Lúdico */}
      <header className="flex items-center justify-center mb-8 pt-4">
        <div className="bg-white/30 backdrop-blur-md p-4 rounded-full shadow-xl border-4 border-white/50 flex items-center gap-3 animate-bounce-slow">
            <div className="text-pink-600">
                <BalloonIcon />
            </div>
            <h1 className="text-3xl font-black text-white tracking-wide drop-shadow-md">Sync Kids</h1>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-2xl mx-auto">
        
        {/* MENU PRINCIPAL */}
        {mode === 'menu' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button 
                    onClick={() => generateKidsContent('story')}
                    className="aspect-square bg-blue-400/90 rounded-3xl shadow-xl border-b-8 border-blue-600 active:border-b-0 active:translate-y-2 transition-all flex flex-col items-center justify-center gap-4 group"
                >
                    <div className="bg-white/20 p-6 rounded-full group-hover:scale-110 transition-transform">
                        <BookIcon />
                    </div>
                    <span className="text-2xl font-bold">História</span>
                </button>

                <button 
                    onClick={() => generateKidsContent('game')}
                    className="aspect-square bg-green-400/90 rounded-3xl shadow-xl border-b-8 border-green-600 active:border-b-0 active:translate-y-2 transition-all flex flex-col items-center justify-center gap-4 group"
                >
                    <div className="bg-white/20 p-6 rounded-full group-hover:scale-110 transition-transform">
                        <PlayCircleIcon />
                    </div>
                    <span className="text-2xl font-bold">Brincar</span>
                </button>

                <button 
                    onClick={() => generateKidsContent('values')}
                    className="aspect-square bg-yellow-400/90 rounded-3xl shadow-xl border-b-8 border-yellow-600 active:border-b-0 active:translate-y-2 transition-all flex flex-col items-center justify-center gap-4 group"
                >
                    <div className="bg-white/20 p-6 rounded-full group-hover:scale-110 transition-transform">
                        <HeartIcon />
                    </div>
                    <span className="text-2xl font-bold">Aprender</span>
                </button>
            </div>
        )}

        {/* AREA DE CONTEÚDO (HISTÓRIA/JOGO) */}
        {mode !== 'menu' && (
            <div className="bg-white/90 text-purple-900 rounded-3xl p-8 shadow-2xl relative border-4 border-white">
                <button 
                    onClick={() => setMode('menu')}
                    className="absolute top-4 right-4 bg-red-400 text-white px-4 py-2 rounded-full font-bold shadow hover:bg-red-500 transition-colors"
                >
                    X Voltar
                </button>

                {isGenerating ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="text-purple-500 w-16 h-16">
                            <LoadingSpinnerIcon />
                        </div>
                        <p className="mt-4 text-xl font-bold text-purple-400 animate-pulse">Chamando a Sync...</p>
                    </div>
                ) : (
                    <div className="mt-8 prose prose-xl prose-purple max-w-none font-medium">
                        {/* Renderização do texto com quebras de linha */}
                        {content?.split('\n').map((line, i) => (
                            <p key={i} className="mb-4">{line}</p>
                        ))}
                    </div>
                )}
            </div>
        )}

      </div>
    </div>
  );
};
