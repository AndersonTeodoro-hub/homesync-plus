
import React from 'react';
import { 
    InventoryIcon, 
    FinanceIcon, 
    BabyIcon, 
    LearnIcon, 
    HeartIcon, 
    NutritionistIcon, 
    PersonalTrainerIcon,
    CheckCircleIcon,
    AsyncLogoIcon
} from './Icons';

interface CapabilitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CapabilitiesModal: React.FC<CapabilitiesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const capabilities = [
    { icon: <InventoryIcon />, title: "Visão Computacional", desc: "Escaneio sua geladeira e crio receitas." },
    { icon: <BabyIcon />, title: "Modo Babá", desc: "Conto histórias de ninar e registro a rotina do bebê." },
    { icon: <FinanceIcon />, title: "Gestão Financeira", desc: "Controlo seu orçamento, receitas e despesas." },
    { icon: <LearnIcon />, title: "Centro de Estudos", desc: "Crio planos de estudo e flashcards para você aprender." },
    { icon: <HeartIcon />, title: "Apoio Emocional", desc: "Ofereço conselhos estoicos e suporte para sua mente." },
    { icon: <NutritionistIcon />, title: "Nutricionista IA", desc: "Monto dietas personalizadas e saudáveis." },
    { icon: <PersonalTrainerIcon />, title: "Personal Trainer", desc: "Sugiro treinos baseados nos seus objetivos." },
    { icon: <CheckCircleIcon />, title: "Produtividade", desc: "Organizo suas tarefas e prioridades do dia." },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm p-4"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl shadow-2xl w-full max-w-2xl border border-white/10 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center gap-4 bg-black/20">
            <AsyncLogoIcon className="w-12 h-12 drop-shadow-lg" />
            <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
                    Meus Super Poderes
                </h2>
                <p className="text-sm text-slate-400">Tudo o que eu posso fazer por você.</p>
            </div>
        </div>

        {/* Grid de Habilidades */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {capabilities.map((cap, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="p-3 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-300">
                            {cap.icon}
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">{cap.title}</h3>
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{cap.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-black/20 flex justify-end">
            <button
              onClick={onClose}
              className="px-8 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors border border-white/5"
            >
              Legal, entendi!
            </button>
        </div>
      </div>
    </div>
  );
};
