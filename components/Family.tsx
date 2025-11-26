
import React, { useState, useEffect } from 'react';
import type { Contact } from '../types';
import { FamilyIcon, PhoneIcon, MessageIcon, CalendarIcon } from './Icons';
import { ScheduleModal } from './ScheduleModal';
import { SmsModal } from './SmsModal';

const mainUser: Contact = {
    id: 0,
    name: 'Anderson Teodoro',
    relationship: 'Eu',
    phone: '+55 11 98765-4321',
    whatsapp: '+55 11 98765-4321',
    email: 'anderson.teodoro@gmail.com'
};

// Contatos iniciais padrão
const initialContacts: Contact[] = [
  { id: 1, name: 'Cris', relationship: 'Esposa', phone: '5511999999999', whatsapp: '5511999999999', email: 'cris@email.com' },
  { id: 2, name: 'Filho', relationship: 'Filho', phone: '5511988888888', whatsapp: '5511988888888', email: '' },
];

export const Family: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>(() => {
      try {
          const saved = localStorage.getItem('familyContacts');
          return saved ? JSON.parse(saved) : initialContacts;
      } catch {
          return initialContacts;
      }
  });

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Contact>>({});

  useEffect(() => {
      localStorage.setItem('familyContacts', JSON.stringify(contacts));
  }, [contacts]);

  const handleSimulateCall = (contactName: string) => {
    alert(`Simulando chamada para ${contactName}... (Recurso Premium para automação real)`);
  };

  const handleOpenSmsModal = (contact: Contact) => {
    setSelectedContact(contact);
    setIsSmsModalOpen(true);
  };
  
  const handleCloseSmsModal = () => {
    setIsSmsModalOpen(false);
    setSelectedContact(null);
  };

  const handleSendSms = (message: string) => {
    if (!selectedContact) return;
    alert(`Enviando SMS para ${selectedContact.name}:\n"${message}"`);
    handleCloseSmsModal();
  };
  
  const handleSimulateWhatsApp = (contact: Contact) => {
    const message = prompt(`Digite a mensagem de WhatsApp para ${contact.name}:`);
     if (message) {
      // Remove caracteres não numéricos para o link
      const cleanNumber = contact.whatsapp.replace(/\D/g, '');
      const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    }
  };

  const handleOpenScheduleModal = (contact: Contact) => {
    setSelectedContact(contact);
    setIsScheduleModalOpen(true);
  };

  const handleCloseScheduleModal = () => {
    setSelectedContact(null);
    setIsScheduleModalOpen(false);
  };

  const handleScheduleAction = (details: {
    contactName: string;
    actionType: 'call' | 'reminder';
    date: string;
    time: string;
    message: string;
  }) => {
    alert(`Agendado: ${details.actionType} para ${details.contactName} em ${details.date} às ${details.time}.`);
    handleCloseScheduleModal();
  };

  // --- EDIT LOGIC ---
  const startEdit = (contact: Contact) => {
      setIsEditing(contact.id);
      setEditForm(contact);
  };

  const saveEdit = () => {
      if (!editForm.name || !editForm.whatsapp) return;
      setContacts(contacts.map(c => c.id === isEditing ? { ...c, ...editForm } as Contact : c));
      setIsEditing(null);
  };

  const cancelEdit = () => {
      setIsEditing(null);
      setEditForm({});
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-pink-600 to-red-900 p-8 font-sans text-white">
        <header className="flex items-center space-x-3 mb-8">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-pink-200/20 text-pink-300">
            <FamilyIcon />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Gestão Familiar</h1>
            <p className="text-md text-white/80">Adicione e gerencie seus contatos</p>
          </div>
        </header>
        
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Family contacts list */}
          <div>
              <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-white/90">Contatos da Família</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {contacts.map(contact => (
                      <div key={contact.id} className="bg-black/20 backdrop-blur-sm border border-white/10 p-5 rounded-xl shadow-lg flex flex-col space-y-3">
                          {isEditing === contact.id ? (
                              <div className="space-y-2 bg-black/40 p-3 rounded-lg">
                                  <label className="text-xs text-white/60">Nome</label>
                                  <input 
                                    className="w-full p-2 rounded bg-black/30 text-white border border-white/10 mb-2" 
                                    value={editForm.name} 
                                    onChange={e => setEditForm({...editForm, name: e.target.value})} 
                                    placeholder="Nome"
                                  />
                                  <label className="text-xs text-white/60">WhatsApp (DDD + Número)</label>
                                  <input 
                                    className="w-full p-2 rounded bg-black/30 text-white border border-white/10" 
                                    value={editForm.whatsapp} 
                                    onChange={e => setEditForm({...editForm, whatsapp: e.target.value})} 
                                    placeholder="5511999999999"
                                  />
                                  <div className="flex gap-2 justify-end mt-2 pt-2 border-t border-white/10">
                                      <button onClick={cancelEdit} className="text-xs text-gray-300 hover:text-white px-2">Cancelar</button>
                                      <button onClick={saveEdit} className="text-xs bg-green-600 hover:bg-green-500 px-3 py-1 rounded font-bold">Salvar</button>
                                  </div>
                              </div>
                          ) : (
                              <>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-lg font-bold">{contact.name}</p>
                                        <p className="text-sm text-white/70">{contact.relationship}</p>
                                    </div>
                                    <button onClick={() => startEdit(contact)} className="text-xs text-white/40 hover:text-white bg-white/5 px-2 py-1 rounded">Editar</button>
                                </div>
                                <div className="border-t border-white/10 pt-3">
                                    <p className="text-sm flex items-center gap-2">
                                        <span className="opacity-50">📞</span> {contact.whatsapp}
                                    </p>
                                </div>
                              </>
                          )}
                          
                          {!isEditing && (
                            <div className="flex items-center justify-end flex-wrap gap-2 border-t border-white/10 pt-3 mt-auto">
                                <button onClick={() => handleSimulateCall(contact.name)} className="flex items-center gap-1.5 text-sm bg-blue-500/80 hover:bg-blue-500 px-3 py-1.5 rounded-md transition-colors" aria-label={`Ligar para ${contact.name}`}>
                                    <PhoneIcon /> Ligar
                                </button>
                                <button onClick={() => handleSimulateWhatsApp(contact)} className="flex items-center gap-1.5 text-sm bg-teal-500/80 hover:bg-teal-500 px-3 py-1.5 rounded-md transition-colors" aria-label={`Enviar WhatsApp para ${contact.name}`}>
                                    <MessageIcon /> WhatsApp
                                </button>
                            </div>
                          )}
                      </div>
                  ))}
              </div>
          </div>
        </div>
      </div>
      {isScheduleModalOpen && selectedContact && (
        <ScheduleModal
          isOpen={isScheduleModalOpen}
          onClose={handleCloseScheduleModal}
          onSchedule={handleScheduleAction}
          contact={selectedContact}
        />
      )}
      {isSmsModalOpen && selectedContact && (
        <SmsModal
          isOpen={isSmsModalOpen}
          onClose={handleCloseSmsModal}
          onSend={handleSendSms}
          contact={selectedContact}
        />
      )}
    </>
  );
};
