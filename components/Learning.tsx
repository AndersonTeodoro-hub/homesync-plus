
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { LearnIcon, BrainIcon, LightBulbIcon, LoadingSpinnerIcon } from './Icons';

interface Flashcard {
  front: string;
  back: string;
}

export const Learning: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [studyPlan, setStudyPlan] = useState<string | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [activeTab, setActiveTab] = useState<'plan' | 'flashcards'>('plan');
  const [flippedCardIndex, setFlippedCardIndex] = useState<number | null>(null);

  const generateContent = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setStudyPlan(null);
    setFlashcards([]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      
      // 1. Gerar Plano de Estudos
      const planPrompt = `
        Crie um plano de estudos prático e intensivo sobre: "${topic}".
        Se o tópico for um idioma (ex: Inglês, Espanhol), foque EXCLUSIVAMENTE em conversação, frases úteis e imersão.
        Se for outro tema, foque nos conceitos chave.
        Use formatação Markdown bonita (listas, negrito). Seja direto.
      `;

      const planResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ parts: [{ text: planPrompt }] }]
      });
      
      setStudyPlan(planResponse.text || "Erro ao gerar plano.");

      // 2. Gerar Flashcards
      const cardsPrompt = `
        Crie 6 flashcards de estudo sobre: "${topic}".
        Retorne APENAS um array JSON puro. Sem markdown, sem "json", sem crases.
        Formato: [{"front": "Pergunta/Termo", "back": "Resposta/Definição"}]
        Se for idioma, coloque a frase na língua alvo na frente e a tradução/uso atrás.
      `;

      const cardsResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ parts: [{ text: cardsPrompt }] }]
      });

      const cleanJson = cardsResponse.text?.replace(/```json|```/g, '').trim() || '[]';
      setFlashcards(JSON.parse(cleanJson));

    } catch (error) {
      console.error("Erro na IA:", error);
      setStudyPlan("Desculpe, tive um problema ao criar seu conteúdo. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-sky-600 to-indigo-900 p-8 font-sans text-white">
      <header className="flex items-center space-x-3 mb-8">
        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-sky-400/20 text-sky-300">
          <LearnIcon />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Centro de Aprendizado</h1>
          <p className="text-md text-white/80">Domine qualquer assunto com a Async+</p>
        </div>
      </header>

      {/* Input Area */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="bg-black/20 backdrop-blur-md p-6 rounded-2xl border border-white/10">
          <label className="block text-sm font-medium text-white/80 mb-2">O que você quer aprender hoje?</label>
          <div className="flex gap-3">
            <input 
              type="text" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ex: Inglês para Viagem, Python Básico, História da Arte..."
              className="flex-1 p-3 rounded-xl bg-black/30 border border-white/20 text-white focus:outline-none focus:border-sky-400 placeholder-white/40"
            />
            <button 
              onClick={generateContent}
              disabled={isGenerating || !topic.trim()}
              className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isGenerating ? <LoadingSpinnerIcon /> : <BrainIcon />}
              {isGenerating ? "Criando..." : "Gerar Aula"}
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {(studyPlan || flashcards.length > 0) && (
        <div className="max-w-4xl mx-auto">
          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-white/10 pb-1">
            <button 
              onClick={() => setActiveTab('plan')}
              className={`pb-3 px-4 font-semibold transition-colors ${activeTab === 'plan' ? 'text-sky-300 border-b-2 border-sky-300' : 'text-white/50 hover:text-white'}`}
            >
              Plano de Estudos
            </button>
            <button 
              onClick={() => setActiveTab('flashcards')}
              className={`pb-3 px-4 font-semibold transition-colors ${activeTab === 'flashcards' ? 'text-sky-300 border-b-2 border-sky-300' : 'text-white/50 hover:text-white'}`}
            >
              Flashcards ({flashcards.length})
            </button>
          </div>

          {activeTab === 'plan' && (
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/10 animate-fade-in shadow-xl">
              <div className="prose prose-invert max-w-none prose-headings:text-sky-200 prose-a:text-sky-300">
                <div dangerouslySetInnerHTML={{ 
                  __html: studyPlan?.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') || '' 
                }} />
              </div>
            </div>
          )}

          {activeTab === 'flashcards' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              {flashcards.map((card, idx) => (
                <div 
                  key={idx}
                  onClick={() => setFlippedCardIndex(flippedCardIndex === idx ? null : idx)}
                  className="group h-64 cursor-pointer perspective-1000"
                >
                  <div className={`relative w-full h-full transition-all duration-500 transform-style-3d ${flippedCardIndex === idx ? 'rotate-y-180' : ''}`}>
                    
                    {/* Front */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center backface-hidden shadow-lg group-hover:border-sky-400/50 transition-colors">
                      <LightBulbIcon />
                      <h3 className="text-xl font-bold mt-4 text-white">{card.front}</h3>
                      <p className="text-xs text-white/40 mt-auto">Toque para ver a resposta</p>
                    </div>

                    {/* Back */}
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-700 to-blue-800 p-6 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center backface-hidden rotate-y-180 shadow-lg">
                      <p className="text-lg font-medium text-white">{card.back}</p>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
