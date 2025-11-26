
import React from 'react';
// Fix: Correctly import View type and necessary icons.
import type { View } from '../types';
import { HomeIcon, DashboardIcon, FinanceIcon, CheckCircleIcon, ShoppingCartIcon, InventoryIcon, TextAiIcon, HeartIcon, LearnIcon, EmergencyIcon, FamilyIcon, NutritionistIcon, PersonalTrainerIcon, ShareAppIcon, MessageIcon, AsyncLogoIcon } from './Icons';

interface SidebarProps {
  activeView: View;
  setView: (view: View) => void;
  onShareApp: () => void;
}

const menuItems = [
  // Fix: Use correct icon components for each menu item.
  { id: 'home', label: 'Async+ (Início)', icon: <HomeIcon />, tags: ['VOZ'] },
  { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { id: 'finances', label: 'Finanças', icon: <FinanceIcon /> },
  { id: 'tasks', label: 'Tarefas', icon: <CheckCircleIcon /> },
  { id: 'shopping', label: 'Compras', icon: <ShoppingCartIcon /> },
  { id: 'inventory', label: 'Inventário', icon: <InventoryIcon /> },
  { id: 'text-chat', label: 'Sync (IA Texto)', icon: <TextAiIcon />, tags: ['AI'] },
  { id: 'nutritionist', label: 'Nutricionista', icon: <NutritionistIcon />, tags: ['AI'] },
  { id: 'personal-trainer', label: 'Personal Trainer', icon: <PersonalTrainerIcon />, tags: ['AI'] },
  { id: 'essence', label: 'Essência', icon: <HeartIcon /> },
  { id: 'learning', label: 'Aprendizado', icon: <LearnIcon /> },
  { id: 'emergency', label: 'Emergência', icon: <EmergencyIcon /> },
  { id: 'family', label: 'Família', icon: <FamilyIcon /> },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setView, onShareApp }) => {
  return (
    <aside className="w-64 flex-shrink-0 bg-white flex flex-col h-screen overflow-y-auto border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <AsyncLogoIcon className="w-10 h-10 shadow-md rounded-xl" />
          <div>
            <h1 className="font-bold text-lg text-gray-800 tracking-tight">Async<span className="text-violet-600">+</span></h1>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Gestão Inteligente</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 px-2 py-4 space-y-1">
        <span className="px-2 text-xs font-semibold text-gray-400 uppercase">Menu Principal</span>
        {menuItems.map(item => (
          <a
            key={item.id}
            href="#"
            onClick={(e) => { e.preventDefault(); setView(item.id as View); }}
            className={`flex items-center justify-between p-2.5 rounded-lg text-sm font-medium transition-colors duration-200 relative ${
              activeView === item.id 
                ? 'bg-violet-100 text-violet-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {activeView === item.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-violet-600 rounded-r-full"></div>}
            <div className="flex items-center space-x-3">
              <span className="w-5 h-5">{item.icon}</span>
              <span>{item.label}</span>
            </div>
            {item.tags && (
              <div className="flex space-x-1">
                {item.tags.map(tag => (
                   <span key={tag} className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                     tag === 'VOZ' ? 'bg-violet-200 text-violet-800' : 'bg-cyan-200 text-cyan-800'
                   }`}>{tag}</span>
                ))}
              </div>
            )}
          </a>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 mt-auto space-y-4">
        {/* Feedback Button for Beta Testers - Highlighted */}
        <a 
            href="mailto:anderson.teodoro@gmail.com?subject=Feedback Async+ Beta"
            className="flex items-center justify-center space-x-2 w-full p-2.5 rounded-lg bg-yellow-50 hover:bg-yellow-100 text-yellow-700 transition-colors border border-yellow-200 text-sm font-semibold shadow-sm"
        >
            <MessageIcon />
            <span>Reportar Bug / Feedback</span>
        </a>

        <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-sm">
                A
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-800">Anderson T.</p>
                <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Online
                </p>
              </div>
            </div>
            <button onClick={onShareApp} className="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors" aria-label="Compartilhar App">
              <ShareAppIcon />
            </button>
        </div>
      </div>
    </aside>
  );
};
