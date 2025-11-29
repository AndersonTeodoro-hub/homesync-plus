
import React, { useState, useEffect } from 'react';
import type { Contact } from '../types';
import { FamilyIcon, PhoneIcon, MessageIcon, TrashIcon } from './Icons';
import { ScheduleModal } from './ScheduleModal';
import { SmsModal } from './SmsModal';

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
  
  // Estado de Edição / Criação
  const [isEditing, setIsEditing] = useState<number | 'new' | null>(null);
  const [editForm, setEditForm] = useState<Partial<Contact>>({});

  useEffect(() => {
      localStorage.setItem('familyContacts', JSON.stringify(contacts));
  }, [contacts]);

  // --- ACTIONS ---

  const handleSimulateCall = (contactName: string) => {
    // Esta função é apenas um fallback visual local. 
    // A chamada real é interceptada pelo App.tsx via comando de voz ou props.
    alert(`Iniciando protocolo de chamada para ${contactName}...`);
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

  // --- CRUD LOGIC ---

  const startAddNew = () => {
      setIsEditing('new');
      setEditForm({ name: '', relationship: '', phone: '', whatsapp: '', email: '' });
  };

  const startEdit = (contact: Contact) => {
      setIsEditing(contact.id);
      setEditForm(contact);
  };

  const handleDelete = (id: number) => {
      if (confirm('Tem certeza que deseja remover este contato?')) {
          setContacts(contacts.filter(c => c.id !== id));
      }
  };

  const saveContact = () => {
      if (!editForm.name || !editForm.phone) {
          alert("Nome e Telefone são obrigatórios.");
          return;
      }

      if (isEditing === 'new') {
          const newContact: Contact = {
              id: Date.now(),
              name: editForm.name,
              relationship: editForm.relationship || '',
              phone: editForm.phone,
              whatsapp: editForm.whatsapp || editForm.phone, // Assume mesmo numero se vazio
              email: editForm.email || ''
          };
          setContacts([...contacts, newContact]);
      } else {
          setContacts(contacts.map(c => c.id === isEditing ? { ...c, ...editForm } as Contact : c));
      }
      setIsEditing(null);
      setEditForm({});
  };

  const cancelEdit = () => {
      setIsEditing(null);
      setEditForm({});
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-pink-600 to-red-900 p-8 font-sans text-white">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-pink-200/20 text-pink-300">
                <FamilyIcon />
            </div>
            <div>
                <h1 className="text-3xl font-bold text-white">Gestão Familiar</h1>
                <p className="text-md text-white/80">Contatos para Emergência e Comunicação</p>
            </div>
          </div>
          
          <button 
            onClick={startAddNew}
            className="px-6 py-2 bg-white text-pink-700 font-bold rounded-full shadow-lg hover:bg-pink-50 transition-transform hover:scale-105 flex items-center gap-2"
          >
            <span className="text-xl leading-none">+</span> Adicionar
          </button>
        </header>
        
        <div className="max-w-5xl mx-auto">
          
          {/* Form de Edição / Criação (Aparece no topo se estiver criando novo) */}
          {isEditing === 'new' && (
             <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl mb-8 animate-fade-in shadow-2xl">
                <h3 className="text-xl font-bold mb-4">Novo Contato</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                        className="p-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/50" 
                        placeholder="Nome (Ex: Mãe)" 
                        value={editForm.name} 
                        onChange={e => setEditForm({...editForm, name: e.target.value})} 
                    />
                    <input 
                        className="p-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/50" 
                        placeholder="Parentesco (Ex: Mãe)" 
                        value={editForm.relationship} 
                        onChange={e => setEditForm({...editForm, relationship: e.target.value})} 
                    />
                    <input 
                        className="p-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/50" 
                        placeholder="Telefone (+55...)" 
                        value={editForm.phone} 
                        onChange={e => setEditForm({...editForm, phone: e.target.value})} 
                    />
                    <input 
                        className="p-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/50" 
                        placeholder="WhatsApp (Se diferente)" 
                        value={editForm.whatsapp} 
                        onChange={e => setEditForm({...editForm, whatsapp: e.target.value})} 
                    />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={cancelEdit} className="px-4 py-2 rounded-lg text-white/70 hover:bg-white/10">Cancelar</button>
                    <button onClick={saveContact} className="px-6 py-2 rounded-lg bg-green-500 hover:bg-green-600 font-bold shadow-lg">Salvar Contato</button>
                </div>
             </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contacts.map(contact => (
                  <div key={contact.id} className="bg-black/20 backdrop-blur-sm border border-white/10 p-5 rounded-2xl shadow-lg flex flex-col transition-all hover:border-white/30 hover:bg-black/30 group">
                      {isEditing === contact.id ? (
                          // MODO EDIÇÃO CARD
                          <div className="space-y-3">
                              <input className="w-full p-2 rounded bg-black/40 border border-white/20 text-white" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} placeholder="Nome" />
                              <input className="w-full p-2 rounded bg-black/40 border border-white/20 text-white" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} placeholder="Telefone" />
                              <div className="flex justify-end gap-2 mt-2">
                                  <button onClick={cancelEdit} className="text-xs px-2 py-1 bg-white/10 rounded">Cancelar</button>
                                  <button onClick={saveContact} className="text-xs px-2 py-1 bg-green-600 rounded font-bold">Salvar</button>
                              </div>
                          </div>
                      ) : (
                          // MODO VISUALIZAÇÃO CARD
                          <>
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-xl font-bold text-white">{contact.name}</h3>
                                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-200 border border-pink-500/30">
                                        {contact.relationship}
                                    </span>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => startEdit(contact)} className="p-1.5 hover:bg-white/10 rounded text-white/60 hover:text-white" title="Editar">✏️</button>
                                    <button onClick={() => handleDelete(contact.id)} className="p-1.5 hover:bg-red-500/20 rounded text-red-400 hover:text-red-300" title="Excluir"><TrashIcon /></button>
                                </div>
                            </div>
                            
                            <div className="text-sm text-white/70 space-y-1 mb-4 flex-1">
                                <p className="flex items-center gap-2"><PhoneIcon /> {contact.phone}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 mt-auto pt-3 border-t border-white/10">
                                <button onClick={() => handleSimulateCall(contact.name)} className="flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-colors text-sm font-medium">
                                    <PhoneIcon /> Ligar
                                </button>
                                <button onClick={() => handleSimulateWhatsApp(contact)} className="flex items-center justify-center gap-2 py-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-300 transition-colors text-sm font-medium">
                                    <MessageIcon /> Zap
                                </button>
                            </div>
                          </>
                      )}
                  </div>
              ))}
          </div>
          
          {contacts.length === 0 && (
              <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/20">
                  <p className="text-white/50 text-lg">Nenhum contato adicionado.</p>
                  <button onClick={startAddNew} className="mt-4 text-pink-300 hover:underline">Adicionar o primeiro</button>
              </div>
          )}

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
