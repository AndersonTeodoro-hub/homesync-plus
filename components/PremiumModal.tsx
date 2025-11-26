
import React from 'react';
import { AsyncLogoIcon, CheckCircleIcon } from './Icons';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose, featureName }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-md p-4"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl shadow-2xl w-full max-w-md border border-yellow-500/30 flex flex-col items-center overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Shine Effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/20 blur-[50px] rounded-full pointer-events-none"></div>

        {/* Header */}
        <div className="p-8 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-600 p-[2px] mb-6 shadow-lg shadow-orange-500/20">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                    <AsyncLogoIcon className="w-12 h-12" />
                </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">Recurso Premium</h2>
            <p className="text-slate-400 text-sm mb-6">
                A funcionalidade <strong className="text-yellow-400">{featureName}</strong> é exclusiva para assinantes Async+ Pro.
            </p>

            <div className="bg-white/5 rounded-xl p-6 w-full text-left space-y-3 border border-white/5">
                <div className="flex items-center gap-3">
                    <CheckCircleIcon /> <span className="text-sm">Ligações Autônomas de IA</span>
                </div>
                <div className="flex items-center gap-3">
                    <CheckCircleIcon /> <span className="text-sm">Integração Total WhatsApp</span>
                </div>
                <div className="flex items-center gap-3">
                    <CheckCircleIcon /> <span className="text-sm">Voz Ultra-Realista</span>
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="w-full p-6 bg-black/20 border-t border-white/10 flex flex-col gap-3">
            <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-white font-bold shadow-lg transition-all transform hover:scale-[1.02]">
                Desbloquear Agora (R$ 29,90/mês)
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 text-sm text-slate-400 hover:text-white transition-colors"
            >
              Agora não
            </button>
        </div>
      </div>
    </div>
  );
};
