import React, { useState } from 'react';
import type { Contact } from '../types';

interface SmsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (message: string) => void;
  contact: Contact;
}

export const SmsModal: React.FC<SmsModalProps> = ({ isOpen, onClose, onSend, contact }) => {
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
        alert('Por favor, digite uma mensagem.');
        return;
    }
    onSend(message);
    setMessage('');
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-2xl shadow-2xl p-8 w-full max-w-md m-4 border border-white/20">
        <h2 className="text-2xl font-bold mb-2">Enviar SMS</h2>
        <p className="text-white/70 mb-6">Para: <span className="font-semibold">{contact.name}</span></p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-1">
              Mensagem
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite sua mensagem aqui..."
              rows={4}
              className="w-full p-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-black/30 text-white placeholder-white/40"
              required
            ></textarea>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors shadow-md"
            >
              Enviar SMS
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};