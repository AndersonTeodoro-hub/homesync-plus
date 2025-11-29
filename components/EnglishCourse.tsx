
import React, { useState, useEffect } from 'react';
import { EnglishIcon, PlayCircleIcon, CheckCircleIcon, SparklesIcon } from './Icons';

// --- DADOS DAS 20 AULAS (SYNC ENGLISH TRAINING V1.0) ---
const LESSONS = [
  {
    id: 1,
    title: "Cumprimentos Básicos",
    phrase: { en: "Good morning", phonetic: "(gúd mórnin)", pt: "Bom dia" },
    variations: ["Good afternoon (Boa tarde)", "Good evening (Boa noite)", "Hello (Olá)"],
    dialogue: { q: "Hello, how are you?", a: "I am fine, thanks." },
    challenge: { q: "Como se diz 'Boa noite' ao chegar?", options: ["Good night", "Good evening", "Good bye"], correct: 1 },
    motivation: "Excellent start! You are ready to shine."
  },
  {
    id: 2,
    title: "Perguntando 'Como vai?'",
    phrase: { en: "How are you?", phonetic: "(ráu ár iú?)", pt: "Como você está?" },
    variations: ["How is it going?", "What's up?", "Are you okay?"],
    dialogue: { q: "How are you today?", a: "I am great, and you?" },
    challenge: { q: "Qual é informal?", options: ["How do you do?", "What's up?", "How are you?"], correct: 1 },
    motivation: "Great job! Connection is key."
  },
  {
    id: 3,
    title: "Apresentações",
    phrase: { en: "My name is Anderson", phonetic: "(mái nêim is Anderson)", pt: "Meu nome é Anderson" },
    variations: ["I am Anderson", "You can call me Andy", "This is my friend"],
    dialogue: { q: "What is your name?", a: "My name is Sarah." },
    challenge: { q: "Qual está correto?", options: ["I name is...", "My name are...", "My name is..."], correct: 2 },
    motivation: "Nice to meet you! Keep practicing."
  },
  {
    id: 4,
    title: "Prazer em Conhecer",
    phrase: { en: "Nice to meet you", phonetic: "(náis tu mít iú)", pt: "Prazer em conhecer você" },
    variations: ["Glad to meet you", "Pleasure to meet you", "Lovely to meet you"],
    dialogue: { q: "This is John.", a: "Nice to meet you, John." },
    challenge: { q: "Tradução de 'Glad':", options: ["Triste", "Contente", "Bravo"], correct: 1 },
    motivation: "Politeness opens doors!"
  },
  {
    id: 5,
    title: "Pedindo Ajuda",
    phrase: { en: "Can you help me?", phonetic: "(kén iú rélp mi?)", pt: "Você pode me ajudar?" },
    variations: ["I need help", "Please, help me", "Could you help?"],
    dialogue: { q: "Excuse me, can you help me?", a: "Sure, what do you need?" },
    challenge: { q: "Qual é mais educado?", options: ["Help me!", "Can you help me?", "I want help"], correct: 1 },
    motivation: "Asking for help is a superpower."
  },
  {
    id: 6,
    title: "Localização (Banheiro)",
    phrase: { en: "Where is the bathroom?", phonetic: "(uér is da béf-rum?)", pt: "Onde fica o banheiro?" },
    variations: ["Where is the restroom?", "Where is the toilet?", "Is there a bathroom here?"],
    dialogue: { q: "Where is the bathroom?", a: "It is down the hall on the left." },
    challenge: { q: "'Restroom' é usado onde?", options: ["Casa", "Lugar Público (EUA)", "Quarto"], correct: 1 },
    motivation: "Essential phrase mastered!"
  },
  {
    id: 7,
    title: "Preços e Compras",
    phrase: { en: "How much is this?", phonetic: "(ráu mátch is dis?)", pt: "Quanto custa isto?" },
    variations: ["How much does it cost?", "What is the price?", "Is it expensive?"],
    dialogue: { q: "How much is this shirt?", a: "It is twenty dollars." },
    challenge: { q: "O que significa 'Cheap'?", options: ["Caro", "Barato", "Grande"], correct: 1 },
    motivation: "Smart shopper! Saving money."
  },
  {
    id: 8,
    title: "Pedindo Água",
    phrase: { en: "I would like water", phonetic: "(ái uúd láik uó-rer)", pt: "Eu gostaria de água" },
    variations: ["Water, please", "Can I have water?", "A glass of water"],
    dialogue: { q: "What would you like to drink?", a: "I would like water, please." },
    challenge: { q: "'I would like' é:", options: ["Eu quero (grosseiro)", "Eu gostaria (educado)", "Eu odeio"], correct: 1 },
    motivation: "Stay hydrated and polite!"
  },
  {
    id: 9,
    title: "Pagando a Conta",
    phrase: { en: "Check, please", phonetic: "(tchék, plís)", pt: "A conta, por favor" },
    variations: ["Can I have the bill?", "I want to pay", "Do you accept credit card?"],
    dialogue: { q: "Are you ready to pay?", a: "Yes, check please." },
    challenge: { q: "'Bill' é mais comum onde?", options: ["EUA", "Reino Unido", "Brasil"], correct: 1 },
    motivation: "You are handling real life situations!"
  },
  {
    id: 10,
    title: "Transporte (Táxi/Uber)",
    phrase: { en: "I need a taxi", phonetic: "(ái níd a ték-si)", pt: "Eu preciso de um táxi" },
    variations: ["Call me an Uber", "Where is the bus station?", "Take me to the hotel"],
    dialogue: { q: "Where do you want to go?", a: "To the airport, please." },
    challenge: { q: "Significado de 'Subway':", options: ["Sanduíche", "Metrô", "Ônibus"], correct: 1 },
    motivation: "You are moving forward fast!"
  },
  {
    id: 11,
    title: "Desculpas e Licença",
    phrase: { en: "Excuse me", phonetic: "(eks-kiúz mi)", pt: "Com licença / Desculpe" },
    variations: ["I am sorry", "Pardon me", "Forgive me"],
    dialogue: { q: "Excuse me, can I pass?", a: "Oh, sorry! Go ahead." },
    challenge: { q: "Quando usar 'Sorry'?", options: ["Pedir licença", "Pedir desculpas por erro", "Chamar atenção"], correct: 1 },
    motivation: "Manners make the man (and woman)."
  },
  {
    id: 12,
    title: "Dizendo Não Entendi",
    phrase: { en: "I don't understand", phonetic: "(ái dônt an-der-sténd)", pt: "Eu não entendo" },
    variations: ["I didn't get that", "Can you repeat?", "Speak slower, please"],
    dialogue: { q: "Do you understand?", a: "No, speak slower please." },
    challenge: { q: "Como pedir para repetir?", options: ["Say again", "Repeat", "Both work"], correct: 2 },
    motivation: "Honesty helps you learn."
  },
  {
    id: 13,
    title: "Horas e Tempo",
    phrase: { en: "What time is it?", phonetic: "(uát táim is it?)", pt: "Que horas são?" },
    variations: ["Do you have the time?", "Is it late?", "It is 2 PM"],
    dialogue: { q: "What time is it?", a: "It is five o'clock." },
    challenge: { q: "Meio-dia é:", options: ["Midnight", "Noon", "Morning"], correct: 1 },
    motivation: "Time is on your side."
  },
  {
    id: 14,
    title: "Gostos Pessoais",
    phrase: { en: "I like coffee", phonetic: "(ái láik có-fi)", pt: "Eu gosto de café" },
    variations: ["I love pizza", "I don't like tea", "Do you like music?"],
    dialogue: { q: "Do you like sushi?", a: "Yes, I love it!" },
    challenge: { q: "Como dizer 'Eu odeio' (forte)?", options: ["I dislike", "I hate", "I don't like"], correct: 1 },
    motivation: "Express yourself freely!"
  },
  {
    id: 15,
    title: "Profissões e Trabalho",
    phrase: { en: "I work here", phonetic: "(ái uôrk rí-ar)", pt: "Eu trabalho aqui" },
    variations: ["What is your job?", "I am a teacher", "I work at an office"],
    dialogue: { q: "What do you do?", a: "I am a developer." },
    challenge: { q: "Pergunta comum sobre trabalho:", options: ["What do you make?", "What do you do?", "What is your work?"], correct: 1 },
    motivation: "Building your career in English."
  },
  {
    id: 16,
    title: "Família",
    phrase: { en: "This is my mother", phonetic: "(dis is mái má-der)", pt: "Esta é minha mãe" },
    variations: ["I have two brothers", "She is my sister", "My father is home"],
    dialogue: { q: "Do you have siblings?", a: "Yes, one brother." },
    challenge: { q: "'Siblings' significa:", options: ["Pais", "Irmãos (geral)", "Primos"], correct: 1 },
    motivation: "Family comes first."
  },
  {
    id: 17,
    title: "Emergência",
    phrase: { en: "Call the police", phonetic: "(cól da po-lís)", pt: "Ligue para a polícia" },
    variations: ["I need a doctor", "Where is the hospital?", "Help!"],
    dialogue: { q: "Are you okay?", a: "No, I need a doctor." },
    challenge: { q: "Número de emergência nos EUA:", options: ["190", "911", "112"], correct: 1 },
    motivation: "Safety vocabulary is vital."
  },
  {
    id: 18,
    title: "Rotina Diária",
    phrase: { en: "I wake up early", phonetic: "(ái uêik ap âr-li)", pt: "Eu acordo cedo" },
    variations: ["I go to the gym", "I brush my teeth", "I go to sleep"],
    dialogue: { q: "When do you wake up?", a: "At 7 AM." },
    challenge: { q: "Passado de 'Wake up':", options: ["Waked up", "Woke up", "Walking up"], correct: 1 },
    motivation: "Consistency builds success."
  },
  {
    id: 19,
    title: "Sentimentos",
    phrase: { en: "I am happy", phonetic: "(ái ém ré-pi)", pt: "Eu estou feliz" },
    variations: ["I am tired", "I am hungry", "Are you sad?"],
    dialogue: { q: "Why are you tired?", a: "Because I worked a lot." },
    challenge: { q: "'Hungry' vs 'Angry':", options: ["Fome / Raiva", "Raiva / Fome", "Igual"], correct: 0 },
    motivation: "Emotional intelligence in English!"
  },
  {
    id: 20,
    title: "Despedidas",
    phrase: { en: "See you later", phonetic: "(sí iú lêi-rer)", pt: "Vejo você mais tarde" },
    variations: ["Goodbye", "Have a nice day", "Take care"],
    dialogue: { q: "I have to go now.", a: "Okay, see you later!" },
    challenge: { q: "'Take care' significa:", options: ["Tome cuidado", "Se cuida (carinhoso)", "Pegue o carro"], correct: 1 },
    motivation: "CONGRATULATIONS! You finished the course!"
  }
];

export const EnglishCourse: React.FC = () => {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [step, setStep] = useState<'phrase' | 'variations' | 'dialogue' | 'challenge' | 'end'>('phrase');
  const [showTranslation, setShowTranslation] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  
  const lesson = LESSONS[currentLessonIndex];

  // TTS Helper (Nativo do navegador para rapidez)
  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9; // Um pouco mais lento para didática
    window.speechSynthesis.speak(utterance);
  };

  const handleNextStep = () => {
    setFeedback(null);
    if (step === 'phrase') setStep('variations');
    else if (step === 'variations') setStep('dialogue');
    else if (step === 'dialogue') setStep('challenge');
    else if (step === 'challenge') setStep('end');
    else if (step === 'end') {
        if (currentLessonIndex < LESSONS.length - 1) {
            setCurrentLessonIndex(prev => prev + 1);
            setStep('phrase');
        } else {
            alert("Curso Concluído! Parabéns!");
            setCurrentLessonIndex(0);
            setStep('phrase');
        }
    }
  };

  const checkAnswer = (optionIndex: number) => {
      if (optionIndex === lesson.challenge.correct) {
          setFeedback("Correct! 🎉");
          speak("Correct!");
          setTimeout(handleNextStep, 1500);
      } else {
          setFeedback("Try again. ❌");
          speak("Try again.");
      }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-indigo-900 to-slate-900 p-6 font-sans text-white h-full relative">
      {/* Header */}
      <header className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-500/20 rounded-lg text-pink-300">
                <EnglishIcon />
            </div>
            <div>
                <h1 className="text-xl font-bold">Sync English <span className="text-xs bg-pink-600 px-2 py-0.5 rounded-full">V1.0</span></h1>
                <p className="text-xs text-slate-400">Aula {currentLessonIndex + 1} de {LESSONS.length}</p>
            </div>
        </div>
        <div className="text-right">
            <div className="text-xs uppercase tracking-widest text-slate-500">Progresso</div>
            <div className="w-32 h-2 bg-slate-700 rounded-full mt-1 overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500" 
                    style={{ width: `${((currentLessonIndex) / LESSONS.length) * 100}%` }}
                ></div>
            </div>
        </div>
      </header>

      {/* Main Stage */}
      <div className="max-w-2xl mx-auto min-h-[400px] flex flex-col justify-center">
        
        {/* PHASE 1: PHRASE */}
        {step === 'phrase' && (
            <div className="text-center animate-fade-in">
                <h2 className="text-sm text-pink-400 font-bold uppercase mb-6 tracking-widest">Frase Principal</h2>
                
                {/* O Core Didático de 3 Linhas */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-2xl mb-8">
                    <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">{lesson.phrase.en}</h3>
                    <p className="text-xl text-yellow-300 font-mono italic mb-6 opacity-90">{lesson.phrase.phonetic}</p>
                    
                    <div className={`transition-all duration-500 ${showTranslation ? 'opacity-100' : 'opacity-0 h-0'}`}>
                        <p className="text-lg text-slate-400 pb-4 border-t border-white/10 pt-4">{lesson.phrase.pt}</p>
                    </div>

                    <button 
                        onClick={() => setShowTranslation(!showTranslation)}
                        className="text-xs text-white/30 hover:text-white mt-2"
                    >
                        {showTranslation ? 'Ocultar Tradução' : 'Mostrar Tradução'}
                    </button>
                </div>

                <div className="flex justify-center gap-4">
                    <button 
                        onClick={() => speak(lesson.phrase.en)}
                        className="flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-full font-bold shadow-lg transition-transform hover:scale-105"
                    >
                        <PlayCircleIcon /> Ouvir
                    </button>
                    <button 
                        onClick={handleNextStep}
                        className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-full font-bold transition-colors"
                    >
                        Próximo
                    </button>
                </div>
            </div>
        )}

        {/* PHASE 2: VARIATIONS */}
        {step === 'variations' && (
            <div className="animate-fade-in">
                <h2 className="text-center text-sm text-blue-400 font-bold uppercase mb-6 tracking-widest">Variações</h2>
                <div className="space-y-4 mb-8">
                    {lesson.variations.map((v, idx) => (
                        <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-colors">
                            <span className="text-lg">{v}</span>
                            <button 
                                onClick={() => speak(v.split('(')[0])} // Fala só a parte em inglês
                                className="p-2 bg-indigo-500/20 text-indigo-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <PlayCircleIcon />
                            </button>
                        </div>
                    ))}
                </div>
                <div className="text-center">
                    <button onClick={handleNextStep} className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-full font-bold">Continuar</button>
                </div>
            </div>
        )}

        {/* PHASE 3: DIALOGUE */}
        {step === 'dialogue' && (
            <div className="animate-fade-in max-w-md mx-auto">
                <h2 className="text-center text-sm text-green-400 font-bold uppercase mb-6 tracking-widest">Mini Diálogo</h2>
                
                <div className="space-y-6 mb-8">
                    {/* Sync */}
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center font-bold">S</div>
                        <div className="bg-pink-500/20 p-4 rounded-2xl rounded-tl-none border border-pink-500/30">
                            <p className="text-lg">{lesson.dialogue.q}</p>
                            <button onClick={() => speak(lesson.dialogue.q)} className="mt-2 text-xs text-pink-300 flex items-center gap-1"><PlayCircleIcon /> Ouvir</button>
                        </div>
                    </div>

                    {/* User */}
                    <div className="flex gap-4 flex-row-reverse">
                        <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center font-bold">U</div>
                        <div className="bg-slate-700 p-4 rounded-2xl rounded-tr-none border border-slate-600">
                            <p className="text-lg">{lesson.dialogue.a}</p>
                            <button onClick={() => speak(lesson.dialogue.a)} className="mt-2 text-xs text-slate-300 flex items-center gap-1"><PlayCircleIcon /> Ouvir Resposta</button>
                        </div>
                    </div>
                </div>
                <div className="text-center">
                    <button onClick={handleNextStep} className="px-8 py-3 bg-green-600 hover:bg-green-500 rounded-full font-bold shadow-lg">Próximo</button>
                </div>
            </div>
        )}

        {/* PHASE 4: CHALLENGE */}
        {step === 'challenge' && (
            <div className="text-center animate-fade-in">
                <h2 className="text-sm text-yellow-400 font-bold uppercase mb-6 tracking-widest">Desafio Rápido</h2>
                
                <div className="bg-white/5 border border-white/10 p-8 rounded-3xl mb-8">
                    <h3 className="text-2xl font-bold mb-8">{lesson.challenge.q}</h3>
                    
                    <div className="grid gap-4">
                        {lesson.challenge.options.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => checkAnswer(idx)}
                                className="p-4 rounded-xl bg-black/20 hover:bg-indigo-600/30 border border-white/10 hover:border-indigo-500 transition-all font-medium text-lg text-left pl-6"
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
                {feedback && <div className="text-xl font-bold animate-pulse mb-4">{feedback}</div>}
            </div>
        )}

        {/* PHASE 5: END */}
        {step === 'end' && (
            <div className="text-center animate-fade-in flex flex-col items-center justify-center h-full">
                <div className="w-24 h-24 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-orange-500/20">
                    <CheckCircleIcon />
                </div>
                <h2 className="text-3xl font-bold mb-4">Lesson Complete!</h2>
                <p className="text-xl text-slate-300 mb-8 italic">"{lesson.motivation}"</p>
                
                <button 
                    onClick={handleNextStep}
                    className="px-10 py-4 bg-white text-indigo-900 font-bold rounded-full shadow-xl hover:scale-105 transition-transform"
                >
                    Próxima Aula
                </button>
            </div>
        )}

      </div>
    </div>
  );
};
