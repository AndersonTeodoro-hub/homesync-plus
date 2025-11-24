import React from 'react';
import { ShareAppIcon } from './Icons';

interface ShareInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareInfoModal: React.FC<ShareInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-2xl shadow-2xl p-8 w-full max-w-lg m-4 border border-white/20 flex flex-col items-center text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 border border-blue-400">
            <div className="w-8 h-8">
                <ShareAppIcon />
            </div>
        </div>
        <h2 className="text-2xl font-bold mb-3">Como Compartilhar seu App Publicamente</h2>
        <p className="text-md text-white/70 mb-6 max-w-md">
          Entendemos sua frustração! O link desta tela de pré-visualização é para **desenvolvedores** e não deve ser compartilhado publicamente.
        </p>
        
        <div className="bg-black/30 p-6 rounded-lg w-full border border-white/10 text-left space-y-4">
            <h3 className="text-lg font-semibold text-cyan-300">Para obter o link público correto, siga estes passos:</h3>
            <ol className="list-decimal list-inside space-y-2 text-white/80">
                <li><strong>Saia da pré-visualização</strong> e volte para a tela de edição principal.</li>
                <li>No menu superior da plataforma, procure e clique no botão <strong>"Publish"</strong> (Publicar) ou <strong>"Implantar aplicativo"</strong>.</li>
                <li>Siga as instruções para gerar a versão publicada do seu aplicativo.</li>
                <li>A plataforma irá fornecer um <strong>novo link público</strong>. É esse link que você deve compartilhar!</li>
            </ol>
        </div>

        <button
          onClick={onClose}
          className="mt-8 px-8 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
        >
          Entendi
        </button>
      </div>
    </div>
  );
};
