import React, { useRef, useEffect } from 'react';
import type { Message } from '../types';
import { ChatMessage } from './ChatMessage';
import { LoadingSpinner } from './LoadingSpinner';
import { ChatInput } from './ChatInput';
import { Avatar } from './Avatar';
import { ShareIcon, QrCodeIcon } from './Icons';

interface TextChatProps {
    messages: Message[];
    isLoading: boolean;
    error: string | null;
    onSendMessage: (message: string) => void;
    onFeedback: (messageId: number, feedback: 'positive' | 'negative') => void;
    onShareApp: () => void;
}

export const TextChat: React.FC<TextChatProps> = ({
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

    const getChatContent = () => {
        return messages
            .map(msg => `${msg.role === 'user' ? 'Você' : 'Async+'}: ${msg.content}`)
            .join('\n\n');
    };

    const handleShare = async () => {
        const chatContent = getChatContent();
        if (!chatContent) {
            alert("Não há nada para compartilhar ainda.");
            return;
        }
        
        const shareData = {
            title: 'Conversa com Async+',
            text: chatContent,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error('Erro ao compartilhar conversa:', err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(chatContent);
                alert('Conversa copiada para a área de transferência!');
            } catch (err) {
                console.error('Falha ao copiar conversa:', err);
                alert('Não foi possível copiar a conversa.');
            }
        }
    };

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-cyan-400 to-blue-600 text-white relative">
            <header className="bg-black/20 backdrop-blur-sm shadow-sm p-3 flex items-center justify-between sticky top-0 z-10 border-b border-white/10">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8">
                        <Avatar role="model" />
                    </div>
                    <h1 className="text-xl md:text-2xl font-bold">Sync AI (Texto)</h1>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={onShareApp} 
                        className="p-2 rounded-full hover:bg-white/20 transition-colors" 
                        aria-label="Compartilhar App com QR Code"
                    >
                        <QrCodeIcon />
                    </button>
                    <button 
                        onClick={handleShare} 
                        className="p-2 rounded-full hover:bg-white/20 transition-colors" 
                        aria-label="Compartilhar conversa"
                    >
                        <ShareIcon />
                    </button>
                </div>
            </header>

            <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 pb-28">
                <div className="max-w-3xl mx-auto w-full space-y-6">
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