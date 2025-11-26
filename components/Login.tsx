
import React, { useState } from 'react';
import { Avatar } from './Avatar';
import { UserIcon, LockIcon } from './Icons';

interface LoginProps {
  onLogin: (userName: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
        setError('Por favor, digite seu nome.');
        return;
    }
    
    // CÓDIGO DE ACESSO EXCLUSIVO
    if (code.toUpperCase() !== 'SYNC2025') {
        setError('Código de acesso inválido. Use o código do convite.');
        return;
    }
    
    onLogin(name.trim());
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0f172a] to-[#1e293b] px-6 text-white font-sans relative overflow-hidden">
        {/* Efeitos de Fundo */}
        <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[60%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[60%] bg-pink-600/10 blur-[120px] rounded-full pointer-events-none" />

        {/* Card de Login */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl w-full max-w-md relative z-10">
            
            {/* Header / Avatar */}
            <div className="flex flex-col items-center mb-8">
                <div className="w-32 h-32 mb-4">
                    <Avatar role="model" voiceState="idle" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    Async <span className="text-pink-500 font-light">+</span>
                </h1>
                <p className="text-slate-400 text-sm mt-1">Acesso Exclusivo Beta</p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-300 ml-1">Seu Nome</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <UserIcon />
                        </div>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Como devemos te chamar?"
                            className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:border-pink-500/50 text-white placeholder-slate-500 transition-colors"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-300 ml-1">Código de Acesso</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <LockIcon />
                        </div>
                        <input 
                            type="password" 
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="SYNC..."
                            className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:border-pink-500/50 text-white placeholder-slate-500 transition-colors"
                        />
                    </div>
                </div>

                {error && (
                    <div className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">
                        {error}
                    </div>
                )}

                <button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-pink-600/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] mt-2"
                >
                    Entrar no Futuro
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-xs text-slate-500">
                    Não tem um código? <a href="#" className="text-pink-400 hover:underline">Solicite convite</a>
                </p>
            </div>
        </div>
        
        <footer className="mt-8 text-center text-slate-600 text-xs">
            &copy; 2025 HomeSync+. Todos os direitos reservados.
        </footer>
    </div>
  );
};
