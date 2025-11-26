
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { InventoryIcon, CameraIcon, UploadIcon, TrashIcon, ChefIcon, LoadingSpinnerIcon } from './Icons';

interface InventoryItem {
  id: number;
  name: string;
  category: string;
}

export const Inventory: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('inventoryItems');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [recipeSuggestion, setRecipeSuggestion] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('inventoryItems', JSON.stringify(items));
    window.dispatchEvent(new Event('storage')); // Atualiza Dashboard se necessário
  }, [items]);

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    addItem(newItemName.trim(), 'Manual');
    setNewItemName('');
  };

  const addItem = (name: string, category: string = 'Geral') => {
    const newItem: InventoryItem = {
      id: Date.now() + Math.random(),
      name,
      category
    };
    setItems(prev => [...prev, newItem]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter(i => i.id !== id));
  };

  // --- AI VISION LOGIC ---
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setRecipeSuggestion(null);

    try {
      // Converte arquivo para Base64
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Chama a API do Gemini
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const model = 'gemini-2.5-flash'; // Modelo capaz de visão
      
      const prompt = `
        Analise esta imagem de uma geladeira ou despensa. 
        Liste os alimentos identificados.
        Retorne APENAS um array JSON simples de strings, exemplo: ["Leite", "Ovos", "Maçã"].
        Não use markdown, não explique nada. Apenas o JSON.
      `;

      const response = await ai.models.generateContent({
        model: model,
        contents: [
          {
            parts: [
              { text: prompt },
              { inlineData: { mimeType: file.type, data: base64Data } }
            ]
          }
        ]
      });

      const textResponse = response.text;
      
      // Tenta limpar e parsear o JSON
      try {
        const cleanedText = textResponse?.replace(/```json|```/g, '').trim();
        const detectedItems: string[] = JSON.parse(cleanedText || '[]');
        
        detectedItems.forEach(item => addItem(item, 'Detectado por IA'));
      } catch (parseError) {
        console.error("Erro ao ler resposta da IA:", textResponse);
        alert("A IA viu a imagem, mas não consegui ler a lista. Tente novamente.");
      }

    } catch (error) {
      console.error("Erro na análise de imagem:", error);
      alert("Erro ao analisar imagem. Verifique sua conexão ou a API Key.");
    } finally {
      setIsAnalyzing(false);
      // Limpa o input para permitir re-upload do mesmo arquivo
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // --- CHEF MODE LOGIC ---
  const generateRecipe = async () => {
    if (items.length === 0) {
      alert("Adicione itens ao inventário primeiro!");
      return;
    }

    setIsAnalyzing(true);
    const ingredientsList = items.map(i => i.name).join(', ');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            parts: [
              { text: `Atue como um Chef de Cozinha criativo. Tenho estes ingredientes: ${ingredientsList}. Crie uma receita deliciosa e saudável usando o máximo possível desses itens. Seja breve e direto.` }
            ]
          }
        ]
      });
      
      setRecipeSuggestion(response.text || "Não foi possível gerar a receita.");
    } catch (error) {
      console.error("Erro ao gerar receita:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-orange-600 to-red-900 p-8 font-sans text-white">
      <header className="flex items-center space-x-3 mb-8">
        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-orange-400/20 text-orange-300">
          <InventoryIcon />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Inventário Inteligente</h1>
          <p className="text-md text-white/80">Controle sua despensa com Visão Computacional</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CONTROLES */}
        <div className="space-y-6">
          {/* Card de Visão */}
          <div className="bg-black/30 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CameraIcon /> Escanear Geladeira
            </h3>
            <p className="text-sm text-white/60 mb-4">
              Tire uma foto da sua geladeira ou despensa e deixe a IA listar o que tem dentro.
            </p>
            
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileUpload}
            />
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isAnalyzing}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? <LoadingSpinnerIcon /> : <UploadIcon />}
              {isAnalyzing ? "Analisando..." : "Enviar Foto"}
            </button>
          </div>

          {/* Card Manual */}
          <div className="bg-white/5 border border-white/5 p-6 rounded-2xl">
            <form onSubmit={handleManualAdd}>
              <label className="block text-sm text-white/60 mb-2">Adicionar Manualmente</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="Ex: Arroz, Feijão..."
                  className="flex-1 p-2 rounded-lg bg-black/30 border border-white/10 text-white focus:outline-none focus:border-orange-400"
                />
                <button 
                  type="submit"
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-colors"
                >
                  +
                </button>
              </div>
            </form>
          </div>

          {/* Botão Chef */}
          <button 
            onClick={generateRecipe}
            disabled={isAnalyzing || items.length === 0}
            className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-2xl shadow-xl hover:scale-105 transition-transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100"
          >
            <ChefIcon />
            {isAnalyzing ? "Cozinhando ideia..." : "Sugerir Receita com IA"}
          </button>
        </div>

        {/* LISTA & RECEITA */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Sugestão de Receita */}
          {recipeSuggestion && (
            <div className="bg-white/10 border border-yellow-500/30 p-6 rounded-2xl animate-fade-in">
              <h3 className="text-xl font-bold text-yellow-300 mb-3 flex items-center gap-2">
                <ChefIcon /> Sugestão do Chef
              </h3>
              <div className="prose prose-invert max-w-none">
                <p className="whitespace-pre-line text-white/90 leading-relaxed">
                  {recipeSuggestion}
                </p>
              </div>
            </div>
          )}

          {/* Lista de Itens */}
          <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <h3 className="font-semibold">Despensa ({items.length})</h3>
              <button 
                onClick={() => setItems([])} 
                className="text-xs text-red-300 hover:text-red-200"
              >
                Limpar Tudo
              </button>
            </div>
            
            <div className="p-2 max-h-[400px] overflow-y-auto custom-scrollbar grid grid-cols-2 md:grid-cols-3 gap-2">
              {items.length === 0 ? (
                <div className="col-span-full text-center py-10 text-white/30">
                  <p>Sua despensa está vazia.</p>
                  <p className="text-sm">Use a câmera ou adicione itens.</p>
                </div>
              ) : (
                items.map(item => (
                  <div key={item.id} className="bg-white/5 hover:bg-white/10 p-3 rounded-lg flex items-center justify-between group transition-colors">
                    <span className="truncate pr-2">{item.name}</span>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
