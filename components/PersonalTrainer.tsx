import React, { useRef, useEffect } from 'react';
import type { Message } from '../types';
import { ChatMessage } from './ChatMessage';
import { LoadingSpinner } from './LoadingSpinner';
import { ChatInput } from './ChatInput';
import { PersonalTrainerIcon, QrCodeIcon } from './Icons';

interface PersonalTrainerProps {
    messages: Message[];
    isLoading: boolean;
    error: string | null;
    onSendMessage: (message: string) => void;
    onFeedback: (messageId: number, feedback: 'positive' | 'negative') => void;
    onShareApp: () => void;
}

export const PersonalTrainer: React.FC<PersonalTrainerProps> = ({
    messages,
    isLoading,
    error,
    onSendMessage,
    onFeedback,
    onShareApp,
}) => {
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-red-500 to-orange-800 text-white relative">
            <header className="bg-black/20 backdrop-blur-sm shadow-sm p-3 flex items-center justify-between sticky top-0 z-10 border-b border-white/10">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 text-orange-300">
                        <PersonalTrainerIcon />
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold">Async+ Personal Trainer</h1>
                        <p className="text-xs text-white/70">Sua especialista em fitness</p>
                    </div>
                </div>
                 <div className="flex items-center gap-2">
                    <button 
                        onClick={onShareApp} 
                        className="p-2 rounded-full hover:bg-white/20 transition-colors" 
                        aria-label="Compartilhar App com QR Code"
                    >
                        <QrCodeIcon />
                    </button>
                </div>
            </header>

            <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 pb-28">
                <div className="max-w-3xl mx-auto w-full space-y-6">
                    {messages.length === 0 && !isLoading && (
                        <div className="text-center py-10">
                            <div className="inline-block bg-white/10 p-4 rounded-full mb-4">
                                <PersonalTrainerIcon />
                            </div>
                            <h2 className="text-xl font-semibold">Bem-vindo(a) ao seu espaço de treino!</h2>
                            <p className="text-white/80 mt-2">Peça um plano de exercícios, tire dúvidas ou defina suas metas.</p>
                        </div>
                    )}
                    {messages.map((msg) => (
                        <ChatMessage key={msg.id} message={msg} onFeedback={onFeedback} />
                    ))}
                    {isLoading && <LoadingSpinner />}
                    {error && (
                        <div className="bg-red-200 border border-red-400 text-red-800 px-4 py-3 rounded-lg relative max-w-3xl mx-auto" role="alert">
                            <strong className="font-bold">Oops! </strong>
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                </div>
            </main>

            <footer className="sticky bottom-0 w-full bg-black/20 backdrop-blur-sm border-t border-white/10 p-4">
                <div className="max-w-3xl mx-auto">
                    <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
                </div>
            </footer>
        </div>
    );
};