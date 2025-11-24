import React from 'react';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrDataUrl: string | null;
  title: string;
  description?: string;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({ isOpen, onClose, qrDataUrl, title, description }) => {
  if (!isOpen) return null;

  const defaultDescription = "Escaneie o código com a câmera do seu celular para visualizar o conteúdo.";

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
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {qrDataUrl ? (
          <img src={qrDataUrl} alt="QR Code" className="w-64 h-64 rounded-lg bg-white p-2" />
        ) : (
          <div className="w-64 h-64 flex items-center justify-center bg-gray-700 rounded-lg">
            <p>Gerando QR Code...</p>
          </div>
        )}
        <p className="text-sm text-white/70 mt-4 text-center">
          {description || defaultDescription}
        </p>
        <button
          onClick={onClose}
          className="mt-6 px-8 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};