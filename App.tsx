
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat, Modality, Blob, LiveServerMessage } from '@google/genai';
import { SYSTEM_INSTRUCTION, LIVE_MODEL_NAME } from './constants';
import type { View, Message, Session, Contact } from './types';
import { decode, encode, decodeAudioData } from './utils';
import { Sidebar } from './components/Sidebar';
import { Home } from './components/Home';
import { Dashboard } from './components/Dashboard';
import { TextChat } from './components/TextChat';
import { Shopping } from './components/Shopping';
import { Family } from './components/Family';
import { Finances } from './components/Finances';
import { Tasks } from './components/Tasks';
import { Inventory } from './components/Inventory';
import { Learning } from './components/Learning';
import { Essence } from './components/Essence';
import { Babysitter } from './components/Babysitter';
import { MenuIcon, PhoneIcon } from './components/Icons';
import { Nutritionist } from './components/Nutritionist';
import { PersonalTrainer } from './components/PersonalTrainer';
import { GlobalVoiceControl } from './components/GlobalVoiceControl';
import { ShareModal } from './components/ShareModal';
import { Login } from './components/Login';
import { PremiumModal } from './components/PremiumModal';

declare global {
  interface AIStudio {
    getShareableUrl: () => Promise<string>;
  }
  interface Window {
    aistudio?: AIStudio;
  }
}

const App: React.FC = () => {
  // --- Auth State ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');

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

  // --- Premium / Call Simulation State ---
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [premiumFeatureName, setPremiumFeatureName] = useState('');
  const [activeCall, setActiveCall] = useState<{ contact: string, status: string } | null>(null);
  
  // --- Voice Session Refs ---
  const sessionRef = useRef<Promise<Session> | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);
  // Ref para acumular o texto da transcrição durante a fala da IA
  const currentResponseTextRef = useRef<string>('');

  // --- Initialization ---
  useEffect(() => {
    const storedUser = localStorage.getItem('async_user');
    if (storedUser) {
        setUserName(storedUser);
        setIsAuthenticated(true);
    }

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
    
    return () => {
      stopVoiceSession(false);
    };
  }, []);

  const handleLogin = (name: string) => {
      localStorage.setItem('async_user', name);
      setUserName(name);
      setIsAuthenticated(true);
  };
  
  // --- Helper: Find Contact ---
  const findContactNumber = (name: string): string | null => {
      try {
          const saved = localStorage.getItem('familyContacts');
          // Contatos padrão se não houver salvos
          const defaultContacts: Contact[] = [
            { id: 1, name: 'Cris', relationship: 'Esposa', phone: '5511999999999', whatsapp: '5511999999999', email: 'cris@email.com' },
            { id: 2, name: 'Filho', relationship: 'Filho', phone: '5511988888888', whatsapp: '5511988888888', email: '' }
          ];
          
          const contacts: Contact[] = saved ? JSON.parse(saved) : defaultContacts;
          
          // Busca simples (case insensitive) e parcial
          const contact = contacts.find(c => c.name.toLowerCase().includes(name.toLowerCase()));
          
          if (!contact) return null;

          // Limpeza rigorosa para formato E.164 (ex: +5511999999999)
          // Remove tudo que não for número ou +
          let cleanNumber = contact.phone.replace(/[^0-9+]/g, '');
          
          // Se não tiver +, assume que é BR e adiciona +55 (fallback simples)
          if (!cleanNumber.startsWith('+')) {
              cleanNumber = '+55' + cleanNumber;
          }
          
          return cleanNumber;
      } catch {
          return null;
      }
  };

  // --- Helper: Execute AI Action Command ---
  const executeAICommand = async (jsonString: string) => {
      try {
          const command = JSON.parse(jsonString);
          console.log("Executando comando IA:", command);

          if (command.action === 'whatsapp') {
              const contactNumber = findContactNumber(command.contact);
              
              if (contactNumber) {
                  // Remove o '+' para o link do WhatsApp, pois wa.me prefere apenas números
                  const waNumber = contactNumber.replace('+', '');
                  const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(command.message)}`;
                  
                  setTimeout(() => {
                      window.open(url, '_blank');
                  }, 2000);
              } else {
                  console.warn(`Contato não encontrado: ${command.contact}`);
                  setTimeout(() => setActiveView('family'), 2000);
              }
          } 
          else if (command.action === 'call') {
              const contactNumber = findContactNumber(command.contact);
              const contactName = command.contact;

              if (contactNumber) {
                  // 1. Mostrar feedback visual imediato
                  setActiveCall({ contact: contactName, status: 'Iniciando discagem...' });

                  try {
                      // 2. Tentar chamar o Backend Serverless (Twilio)
                      const response = await fetch('/api/twilio-webhook', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                              to: contactNumber,
                              message: `Olá ${contactName}. Aqui é a Async Plus. ${command.context || 'Tenho um recado importante para você.'}`
                          })
                      });

                      const data = await response.json();

                      if (data.mode === 'real') {
                          // Sucesso Real (Twilio configurado)
                          setActiveCall({ contact: contactName, status: 'Chamando via Rede Telefônica...' });
                          setTimeout(() => setActiveCall(null), 5000); // Fecha após 5s
                      } else {
                          // Modo Simulação (Sem chaves ou erro) -> Jogar para Premium
                          throw new Error('Simulation Mode');
                      }

                  } catch (err) {
                      // Fallback para Modal Premium se não tiver Twilio configurado ou falhar
                      console.log("Call fallback:", err);
                      setTimeout(() => {
                          setActiveCall(null);
                          setPremiumFeatureName('Ligação Autônoma Real');
                          setIsPremiumModalOpen(true);
                      }, 2000);
                  }
              } else {
                  alert(`Não encontrei o número de ${command.contact}. Por favor, adicione em Família.`);
                  setActiveView('family');
              }
          }

      } catch (e) {
          console.error("Falha ao processar comando JSON da IA", e);
      }
  };

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
      const responseText = result.text;
      
      // Verifica se há comando JSON oculto na resposta
      const jsonMatch = responseText.match(/```json([\s\S]*?)```/);
      if (jsonMatch && jsonMatch[1]) {
          executeAICommand(jsonMatch[1]);
          // Limpar o JSON da mensagem mostrada ao usuário
          const cleanText = responseText.replace(/```json[\s\S]*?```/, '').trim();
          if (cleanText) {
              const modelMessage: Message = { id: Date.now() + 1, role: 'model', content: cleanText };
              setMessages(prev => [...prev, modelMessage]);
          }
      } else {
          const modelMessage: Message = { id: Date.now() + 1, role: 'model', content: responseText };
          setMessages(prev => [...prev, modelMessage]);
      }

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
  
  // --- Voice Interaction Logic ---
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
    currentResponseTextRef.current = '';
  };

  const startVoiceSession = async () => {
    if (appState === 'active') {
      stopVoiceSession();
      return;
    }

    setAppState('active');
    setError(null);
    currentResponseTextRef.current = '';

    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('Media Devices API not supported.');
      
      mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      
      // SAUDAÇÃO PROATIVA: Modificamos a instrução do sistema para garantir que a IA fale primeiro.
      const currentUser = localStorage.getItem('async_user') || 'Usuário';
      const greetingInstruction = `
        ${SYSTEM_INSTRUCTION}
        
        [IMPORTANT: STARTUP PROTOCOL]
        You must INITIATE the conversation immediately upon connection.
        Do NOT wait for the user to speak.
        Say exactly: "Olá ${currentUser}, tudo bem? O que vamos fazer agora?" in a warm, welcoming tone.
      `;

      sessionRef.current = ai.live.connect({
          model: LIVE_MODEL_NAME,
          config: {
              responseModalities: [Modality.AUDIO],
              inputAudioTranscription: {},
              outputAudioTranscription: {},
              systemInstruction: greetingInstruction, // AQUI ESTÁ A CORREÇÃO: Instrução injetada no config
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
                  
                  // REMOVIDO: session.send() que estava quebrando o app.
              },
              onmessage: async (msg) => {
                  // 1. Acumula a transcrição do que a IA está falando
                  if (msg.serverContent?.outputTranscription?.text) {
                      const text = msg.serverContent.outputTranscription.text;
                      currentResponseTextRef.current += text;
                  }

                  // 2. Se o turno acabou, verifica se houve comando JSON no texto acumulado
                  if (msg.serverContent?.turnComplete) {
                      const fullText = currentResponseTextRef.current;
                      // Busca por JSON completo ou parcial que possa ter sido quebrado
                      const jsonMatch = fullText.match(/```json([\s\S]*?)```/);
                      
                      if (jsonMatch && jsonMatch[1]) {
                          console.log("Comando detectado na voz:", jsonMatch[1]);
                          executeAICommand(jsonMatch[1]);
                      }
                      
                      currentResponseTextRef.current = ''; // Limpa para a próxima frase
                      setCurrentUserTurn('');
                      setCurrentModelTurn('');
                      if (sourcesRef.current.size === 0) setVoiceState('idle');
                  }

                  if (msg.serverContent?.inputTranscription) {
                      setVoiceState('listening');
                      setCurrentUserTurn(prev => prev + msg.serverContent.inputTranscription.text);
                  }
                  
                  // Audio Playback
                  const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                  if (audioData) await playAudioData(audioData);
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
        const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(url)}&color=000000&bgcolor=ffffff`;
        setQrCodeUrl(qrApiUrl);
        setIsShareModalOpen(true);
    } catch (err) {
        setError("Não foi possível gerar o código de compartilhamento.");
    }
  };

  const handleSetView = (view: View) => {
    setActiveView(view);
    setIsSidebarOpen(false);
  };

  const renderActiveView = () => {
    switch(activeView) {
        case 'dashboard': return <Dashboard setView={handleSetView} />;
        case 'finances': return <Finances />;
        case 'tasks': return <Tasks />;
        case 'inventory': return <Inventory />;
        case 'learning': return <Learning />;
        case 'essence': return <Essence />;
        case 'babysitter': return <Babysitter />;
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
            return <Nutritionist messages={messages} isLoading={isLoading} error={error} onSendMessage={handleSendMessage} onFeedback={handleFeedback} onShareApp={handleShareApp} />;
        case 'personal-trainer':
            return <PersonalTrainer messages={messages} isLoading={isLoading} error={error} onSendMessage={handleSendMessage} onFeedback={handleFeedback} onShareApp={handleShareApp} />;
        case 'shopping': return <Shopping />;
        case 'family': return <Family />;
        case 'home':
        default:
            return <Home appState={appState} voiceState={voiceState} error={error} setView={handleSetView} startVoiceSession={startVoiceSession} onShareApp={handleShareApp} />;
    }
  }

  if (!isAuthenticated) {
      return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen font-sans overflow-hidden relative">
      {/* SIMULAÇÃO DE CHAMADA (Overlay) */}
      {activeCall && (
          <div className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center text-white animate-in fade-in duration-300">
              <div className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center mb-8 animate-pulse">
                  <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-3xl font-bold">
                      {activeCall.contact.charAt(0)}
                  </div>
              </div>
              <h2 className="text-3xl font-bold mb-2">{activeCall.contact}</h2>
              <p className="text-lg text-emerald-400 animate-pulse">{activeCall.status}</p>
              
              <div className="mt-12 flex gap-8">
                  <button className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition-transform hover:scale-110" onClick={() => setActiveCall(null)}>
                      <PhoneIcon />
                  </button>
              </div>
          </div>
      )}

      <div className={`fixed inset-y-0 left-0 w-64 z-30 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar activeView={activeView} setView={handleSetView} onShareApp={handleShareApp} />
      </div>

      {isSidebarOpen && <div className="fixed inset-0 bg-black/60 z-20 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}

      <main className="flex-1 flex flex-col h-full relative font-sans">
        <button onClick={() => setIsSidebarOpen(true)} className="absolute top-5 left-5 z-20 p-2 rounded-full bg-white/10 text-white backdrop-blur-sm md:hidden">
          <MenuIcon />
        </button>

        {renderActiveView()}
        
        {appState === 'active' && <GlobalVoiceControl voiceState={voiceState} stopVoiceSession={() => stopVoiceSession(true)} />}
      </main>
      
      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} qrDataUrl={qrCodeUrl} shareUrl={shareUrl} title="Compartilhar Async+" />
      
      {/* MODAL PREMIUM */}
      <PremiumModal 
        isOpen={isPremiumModalOpen} 
        onClose={() => setIsPremiumModalOpen(false)} 
        featureName={premiumFeatureName} 
      />
    </div>
  );
};
export default App;
