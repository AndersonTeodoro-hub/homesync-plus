import React, { useState } from 'react';
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

const initialContacts: Contact[] = [
  { id: 1, name: 'Cristina', relationship: 'Esposa', phone: '+55 11 91234-5678', whatsapp: '+55 11 91234-5678', email: '' },
  { id: 2, name: 'Filho Exemplo', relationship: 'Filho', phone: '+55 11 95555-4444', whatsapp: '+55 11 95555-4444', email: '' },
];


export const Family: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const handleSimulateCall = (contactName: string) => {
    alert(`Simulando chamada para ${contactName}...`);
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
    alert(`Simulando envio de SMS para ${selectedContact.name}:\n"${message}"`);
    handleCloseSmsModal();
  };
  
  const handleSimulateWhatsApp = (contactName: string) => {
    const message = prompt(`Digite a mensagem de WhatsApp para ${contactName}:`);
     if (message) {
      alert(`Simulando envio de WhatsApp para ${contactName}:\n"${message}"`);
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
    const formattedDate = new Date(`${details.date}T${details.time}`).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    const actionText = details.actionType === 'call' ? 'Chamada agendada' : 'Lembrete de compromisso agendado';
    
    alert(`${actionText} para ${details.contactName} em ${formattedDate} às ${details.time}.\nMotivo: ${details.message}`);
    handleCloseScheduleModal();
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
          {/* User's own contact card */}
          <div>
              <h2 className="text-xl font-semibold text-white/90 mb-4">Meus Dados</h2>
              <div className="bg-black/20 backdrop-blur-sm border border-white/10 p-4 rounded-xl shadow-lg">
                  <p><strong>Nome:</strong> {mainUser.name}</p>
                  <p><strong>Telefone:</strong> {mainUser.phone}</p>
                  <p><strong>WhatsApp:</strong> {mainUser.whatsapp}</p>
                  <p><strong>Email:</strong> {mainUser.email}</p>
                  <button className="mt-4 text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded-md transition-colors">
                      Editar
                  </button>
              </div>
          </div>

          {/* Family contacts list */}
          <div>
              <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-white/90">Contatos da Família</h2>
                  <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-md">
                      Adicionar Contato
                  </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {contacts.map(contact => (
                      <div key={contact.id} className="bg-black/20 backdrop-blur-sm border border-white/10 p-5 rounded-xl shadow-lg flex flex-col space-y-3">
                          <div>
                              <p className="text-lg font-bold">{contact.name}</p>
                              <p className="text-sm text-white/70">{contact.relationship}</p>
                          </div>
                          <div className="border-t border-white/10 pt-3">
                              <p className="text-sm"><strong>Telefone:</strong> {contact.phone}</p>
                              <p className="text-sm"><strong>WhatsApp:</strong> {contact.whatsapp}</p>
                          </div>
                          <div className="flex items-center justify-end flex-wrap gap-2 border-t border-white/10 pt-3 mt-auto">
                            <button onClick={() => handleOpenScheduleModal(contact)} className="flex items-center gap-1.5 text-sm bg-purple-500/80 hover:bg-purple-500 px-3 py-1.5 rounded-md transition-colors" aria-label={`Agendar para ${contact.name}`}>
                                <CalendarIcon /> Agendar
                            </button>
                            <button onClick={() => handleSimulateCall(contact.name)} className="flex items-center gap-1.5 text-sm bg-blue-500/80 hover:bg-blue-500 px-3 py-1.5 rounded-md transition-colors" aria-label={`Ligar para ${contact.name}`}>
                                <PhoneIcon /> Ligar
                            </button>
                            <button onClick={() => handleOpenSmsModal(contact)} className="flex items-center gap-1.5 text-sm bg-green-500/80 hover:bg-green-500 px-3 py-1.5 rounded-md transition-colors" aria-label={`Enviar SMS para ${contact.name}`}>
                                <MessageIcon /> SMS
                            </button>
                            <button onClick={() => handleSimulateWhatsApp(contact.name)} className="flex items-center gap-1.5 text-sm bg-teal-500/80 hover:bg-teal-500 px-3 py-1.5 rounded-md transition-colors" aria-label={`Enviar WhatsApp para ${contact.name}`}>
                                <MessageIcon /> WhatsApp
                            </button>
                          </div>
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