import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat, Modality, Blob, LiveServerMessage } from '@google/genai';
import { SYSTEM_INSTRUCTION, LIVE_MODEL_NAME } from './constants';
import type { View, Message, Session } from './types';
import { decode, encode, decodeAudioData } from './utils';
import { Sidebar } from './components/Sidebar';
import { Home } from './components/Home';
import { Dashboard } from './components/Dashboard';
import { TextChat } from './components/TextChat';
import { Shopping } from './components/Shopping';
import { Family } from './components/Family';
import { MenuIcon } from './components/Icons';
import { Nutritionist } from './components/Nutritionist';
import { PersonalTrainer } from './components/PersonalTrainer';
import { GlobalVoiceControl } from './components/GlobalVoiceControl';
import { ShareModal } from './components/ShareModal';

// Adiciona a tipagem para a função de compartilhamento da plataforma
declare global {
  interface AIStudio {
    getShareableUrl: () => Promise<string>;
  }
  interface Window {
    aistudio?: AIStudio;
  }
}

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chat, setChat] = useState<Chat | null>(null);
  
  // --- Voice Interaction State ---
  const [appState, setAppState] = useState<'sleeping' | 'active'>('sleeping');
  const [voiceState, setVoiceState] = useState<'idle' | 'listening' | 'speaking' | 'thinking'>('idle');
  const [currentUserTurn, setCurrentUserTurn] = useState('');
  const [currentModelTurn, setCurrentModelTurn] = useState('');

  // --- App Sharing State ---
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState('');
  
  // --- Voice Session Refs ---
  const sessionRef = useRef<Promise<Session> | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);

  // --- Initialization ---
  useEffect(() => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const chatSession = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: { systemInstruction: SYSTEM_INSTRUCTION },
      });
      setChat(chatSession);
    } catch (e) {
      setError(e instanceof Error ? `Initialization Error: ${e.message}` : "An unknown initialization error occurred.");
    }
    
    // Global cleanup for voice session
    return () => {
      stopVoiceSession(false);
    };
  }, []);
  
  // --- Text Chat Logic ---
  const handleSendMessage = async (userInput: string) => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);

    const userMessage: Message = { id: Date.now(), role: 'user', content: userInput };
    setMessages(prev => [...prev, userMessage]);

    if (!chat) {
        setError("Chat not initialized.");
        setIsLoading(false);
        return;
    }
    
    try {
      const result = await chat.sendMessage({ message: userInput });
      const modelMessage: Message = { id: Date.now() + 1, role: 'model', content: result.text };
      setMessages(prev => [...prev, modelMessage]);
    } catch (e) {
      setError(e instanceof Error ? `Error: ${e.message}` : "An unknown AI error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = (messageId: number, feedback: 'positive' | 'negative') => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, feedback } : msg
      )
    );
  };
  
  // --- Voice Interaction Logic (Moved from Home.tsx) ---
  const playAudioData = async (audioData: string) => {
    if (!outputAudioContextRef.current) {
        outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    const ctx = outputAudioContextRef.current;
    if (ctx.state === 'suspended') {
        await ctx.resume();
    }

    setVoiceState('speaking');
    nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
    const audioBuffer = await decodeAudioData(decode(audioData), ctx, 24000, 1);
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    source.addEventListener('ended', () => {
        sourcesRef.current.delete(source);
        if (sourcesRef.current.size === 0 && !sessionRef.current) {
            setVoiceState('idle');
        }
    });
    source.start(nextStartTimeRef.current);
    nextStartTimeRef.current += audioBuffer.duration;
    sourcesRef.current.add(source);
  };
  
  const stopVoiceSession = async (changeState: boolean = true) => {
    if (changeState) {
        setAppState('sleeping');
        setVoiceState('idle');
    }

    if (sessionRef.current) {
      try {
        const session = await sessionRef.current;
        session.close();
      } catch (e) {
        console.warn("Error closing voice session:", e);
      } finally {
        sessionRef.current = null;
      }
    }

    mediaStreamRef.current?.getTracks().forEach(track => track.stop());
    mediaStreamRef.current = null;
    scriptProcessorRef.current?.disconnect();
    scriptProcessorRef.current = null;
    sourcesRef.current.forEach(source => source.stop());
    sourcesRef.current.clear();
    nextStartTimeRef.current = 0;
  };

  const startVoiceSession = async () => {
    if (appState === 'active') {
      stopVoiceSession();
      return;
    }

    setAppState('active');
    setError(null);

    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('Media Devices API not supported.');
      mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      
      sessionRef.current = ai.live.connect({
          model: LIVE_MODEL_NAME,
          config: {
              responseModalities: [Modality.AUDIO],
              inputAudioTranscription: {},
              outputAudioTranscription: {},
              systemInstruction: SYSTEM_INSTRUCTION,
          },
          callbacks: {
              onopen: () => {
                  setVoiceState('listening');
                  const source = inputAudioContextRef.current!.createMediaStreamSource(mediaStreamRef.current!);
                  scriptProcessorRef.current = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
                  scriptProcessorRef.current.onaudioprocess = (event) => {
                      const inputData = event.inputBuffer.getChannelData(0);
                      const pcmBlob: Blob = { data: encode(new Uint8Array(new Int16Array(inputData.map(v => v * 32767)).buffer)), mimeType: 'audio/pcm;rate=16000' };
                      sessionRef.current?.then((session) => session.sendRealtimeInput({ media: pcmBlob }));
                  };
                  source.connect(scriptProcessorRef.current);
                  scriptProcessorRef.current.connect(inputAudioContextRef.current!.destination);
              },
              onmessage: async (msg) => {
                  if (msg.serverContent?.inputTranscription) {
                      setVoiceState('listening');
                      setCurrentUserTurn(prev => prev + msg.serverContent.inputTranscription.text);
                  }
                  if (msg.serverContent?.outputTranscription) {
                      setVoiceState('thinking');
                      setCurrentModelTurn(prev => prev + msg.serverContent.outputTranscription.text);
                  }
                  
                  const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                  if (audioData) await playAudioData(audioData);
                  
                  if (msg.serverContent?.turnComplete) {
                      const chatViews: View[] = ['text-chat', 'nutritionist', 'personal-trainer'];
                      if (chatViews.includes(activeView) && (currentUserTurn.trim() || currentModelTurn.trim())) {
                          if (currentUserTurn.trim()) {
                            const userMessage: Message = { id: Date.now(), role: 'user', content: currentUserTurn.trim() };
                            setMessages(prev => [...prev, userMessage]);
                          }
                           if (currentModelTurn.trim()) {
                            const modelMessage: Message = { id: Date.now() + 1, role: 'model', content: currentModelTurn.trim() };
                            setMessages(prev => [...prev, modelMessage]);
                          }
                      }
                      setCurrentUserTurn('');
                      setCurrentModelTurn('');
                      if (sourcesRef.current.size === 0) setVoiceState('idle');
                  }

                  if (msg.serverContent?.interrupted) {
                      sourcesRef.current.forEach(s => s.stop());
                      sourcesRef.current.clear();
                      nextStartTimeRef.current = 0;
                      setVoiceState('idle');
                  }
              },
              onerror: (e) => {
                  setError(`Voice error: ${e.message}`);
                  stopVoiceSession();
              },
              onclose: () => stopVoiceSession(),
          }
      });
    } catch (e) {
      setError(e instanceof Error ? `Voice session failed: ${e.message}` : "Unknown voice session error.");
      stopVoiceSession();
    }
  };

  // --- App Sharing Logic ---
  const handleShareApp = async () => {
    try {
        const url = window.location.href;
        setShareUrl(url);
        
        // Use a standard public API for QR codes to avoid library import issues in the browser environment
        const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(url)}&color=000000&bgcolor=ffffff`;
        setQrCodeUrl(qrApiUrl);
        setIsShareModalOpen(true);
    } catch (err) {
        console.error("Failed to generate QR code", err);
        setError("Não foi possível gerar o código de compartilhamento.");
    }
  };


  // --- View Logic ---
  const handleSetView = (view: View) => {
    setActiveView(view);
    setIsSidebarOpen(false);
  };

  const renderActiveView = () => {
    switch(activeView) {
        case 'dashboard':
            return <Dashboard setView={handleSetView} />;
        case 'text-chat':
            return <TextChat 
                        messages={messages} 
                        isLoading={isLoading} 
                        error={error} 
                        onSendMessage={handleSendMessage} 
                        onFeedback={handleFeedback}
                        onShareApp={handleShareApp}
                    />;
        case 'nutritionist':
            return <Nutritionist 
                        messages={messages} 
                        isLoading={isLoading} 
                        error={error} 
                        onSendMessage={handleSendMessage} 
                        onFeedback={handleFeedback}
                        onShareApp={handleShareApp}
                    />;
        case 'personal-trainer':
            return <PersonalTrainer 
                        messages={messages} 
                        isLoading={isLoading} 
                        error={error} 
                        onSendMessage={handleSendMessage} 
                        onFeedback={handleFeedback}
                        onShareApp={handleShareApp}
                    />;
        case 'shopping':
            return <Shopping />;
        case 'family':
            return <Family />;
        case 'home':
        default:
            return <Home 
                        appState={appState}
                        voiceState={voiceState}
                        error={error}
                        setView={handleSetView}
                        startVoiceSession={startVoiceSession}
                        onShareApp={handleShareApp}
                    />;
    }
  }

  return (
    <div className="flex h-screen font-sans overflow-hidden">
      <div
        className={`fixed inset-y-0 left-0 w-64 z-30 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isSidebarOpen}
      >
        <Sidebar 
          activeView={activeView} 
          setView={handleSetView} 
          onShareApp={handleShareApp}
        />
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      <main className="flex-1 flex flex-col h-full relative font-sans">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="absolute top-5 left-5 z-20 p-2 rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 transition-colors md:hidden"
          aria-label="Open menu"
        >
          <MenuIcon />
        </button>

        {renderActiveView()}
        
        {appState === 'active' && (
            <GlobalVoiceControl
              voiceState={voiceState}
              stopVoiceSession={() => stopVoiceSession(true)}
            />
        )}
      </main>
      
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        qrDataUrl={qrCodeUrl}
        shareUrl={shareUrl}
        title="Compartilhar Async+"
        description="Escaneie para abrir no celular ou copie o link."
      />
    </div>
  );
};

export default App;