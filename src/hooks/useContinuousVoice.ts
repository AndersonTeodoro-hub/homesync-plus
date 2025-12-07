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

    recognition.onstart = () => {
      setListening(true);
      console.log("Voz contínua iniciada.");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      onTranscript(transcript);
    };

    recognition.onerror = (err: any) => {
      console.error("Erro no reconhecimento de voz:", err);
    };

    recognition.onend = () => {
      if (listening) recognition.start(); // reinicia automaticamente
    };

    recognitionRef.current = recognition;
  }, []);

  const start = () => {
    recognitionRef.current?.start();
    setListening(true);
  };

  const stop = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  return { listening, start, stop };
}
