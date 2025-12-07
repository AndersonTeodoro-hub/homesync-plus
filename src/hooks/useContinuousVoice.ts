import { useEffect, useRef, useState } from "react";

export default function useContinuousVoice(onTranscript: (text: string) => void) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      console.warn("SpeechRecognition não suportado neste navegador.");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "pt-PT";

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1][0].transcript;
      onTranscript(result); // envia texto para a IA
    };

    recognition.onerror = (err: any) => {
      console.error("Erro no reconhecimento de voz:", err);
      recognition.stop();
    };

    recognition.onend = () => {
      if (listening) recognition.start(); // mantém contínuo
    };

    recognitionRef.current = recognition;
  }, []);

  // inicia escuta contínua
  const start = () => {
    recognitionRef.current?.start();
    setListening(true);
  };

  // para tudo
  const stop = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  return { listening, start, stop };
}
