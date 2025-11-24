import React, { useState } from 'react';
import { ShareIcon } from './Icons';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrDataUrl: string | null;
  shareUrl: string;
  title: string;
  description?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, qrDataUrl, shareUrl, title, description }) => {
  const [copyButtonText, setCopyButtonText] = useState('Copiar Link');

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopyButtonText('Copiado!');
      setTimeout(() => setCopyButtonText('Copiar Link'), 2000);
    }).catch(err => {
      console.error('Failed to copy link: ', err);
      setCopyButtonText('Falhou!');
       setTimeout(() => setCopyButtonText('Copiar Link'), 2000);
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-2xl shadow-2xl p-8 w-full max-w-sm m-4 border border-white/20 flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center mb-4 border border-cyan-400">
             <ShareIcon />
        </div>
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        
        {qrDataUrl ? (
          <div className="bg-white p-3 rounded-xl shadow-inner my-4">
             <img src={qrDataUrl} alt="QR Code" className="w-56 h-56 rounded" />
          </div>
        ) : (
          <div className="w-56 h-56 my-4 flex items-center justify-center bg-white/10 rounded-xl animate-pulse">
            <p className="text-sm">Gerando QR Code...</p>
          </div>
        )}
        
        <p className="text-sm text-white/70 text-center mb-4">
          {description}
        </p>
        
        <div className="w-full bg-black/40 rounded-lg p-2 flex items-center border border-white/10 mb-2">
            <input 
                type="text" 
                readOnly 
                value={shareUrl} 
                className="flex-1 bg-transparent text-white/80 text-xs focus:outline-none px-2 truncate font-mono" 
            />
            <button
                onClick={handleCopyLink}
                className="ml-2 px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors whitespace-nowrap"
            >
                {copyButtonText}
            </button>
        </div>

        <p className="text-[10px] text-white/40 text-center leading-tight mt-2">
          Nota: Se estiver em modo de pré-visualização, este link pode expirar ou exigir login. Para um link público permanente, utilize a opção "Publish" na plataforma.
        </p>

        <button
          onClick={onClose}
          className="mt-6 w-full py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors border border-white/5"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};