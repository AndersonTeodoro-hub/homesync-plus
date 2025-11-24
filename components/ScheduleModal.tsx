import React, { useState, useEffect } from 'react';
import type { Contact } from '../types';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (details: {
    contactName: string;
    actionType: 'call' | 'reminder';
    date: string;
    time: string;
    message: string;
  }) => void;
  contact: Contact;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({ isOpen, onClose, onSchedule, contact }) => {
  const [actionType, setActionType] = useState<'call' | 'reminder'>('call');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Reset form when modal opens for a new contact
    if (isOpen) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        setActionType('call');
        setDate(`${year}-${month}-${day}`);
        setTime(`${hours}:${minutes}`);
        setMessage('');
    }
  }, [isOpen, contact]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time || !message.trim()) {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    onSchedule({ contactName: contact.name, actionType, date, time, message });
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-2xl shadow-2xl p-8 w-full max-w-md m-4 border border-white/20">
        <h2 className="text-2xl font-bold mb-2">Agendar Ação</h2>
        <p className="text-white/70 mb-6">Para: <span className="font-semibold">{contact.name}</span></p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Tipo de Ação</label>
            <div className="flex gap-4 bg-black/20 p-1 rounded-lg">
              <button type="button" onClick={() => setActionType('call')} className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors ${actionType === 'call' ? 'bg-purple-600' : 'hover:bg-white/10'}`}>
                Agendar Chamada
              </button>
              <button type="button" onClick={() => setActionType('reminder')} className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors ${actionType === 'reminder' ? 'bg-purple-600' : 'hover:bg-white/10'}`}>
                Lembrar Compromisso
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label htmlFor="date" className="block text-sm font-medium text-white/80 mb-1">Data</label>
                <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 bg-black/30 text-white"
                    required
                />
            </div>
            <div>
                <label htmlFor="time" className="block text-sm font-medium text-white/80 mb-1">Hora</label>
                <input
                    type="time"
                    id="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full p-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 bg-black/30 text-white"
                    required
                />
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-1">
              {actionType === 'call' ? 'Motivo da Chamada' : 'Detalhes do Compromisso'}
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ex: Discutir planos para o fim de semana..."
              rows={3}
              className="w-full p-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 bg-black/30 text-white placeholder-white/40"
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
              Confirmar Agendamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};