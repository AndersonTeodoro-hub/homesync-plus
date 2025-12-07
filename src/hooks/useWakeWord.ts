import { useEffect, useState } from "react";

export default function useWakeWord(onWake: () => void) {
  const [listening, setListening] = useState(false);

  useEffect(() => {
    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let microphone: MediaStreamAudioSourceNode | null = null;
    let audioStream: MediaStream | null = null;
    let recognizer: SpeechRecognition | null = null;

    async function startWakeDetection() {
      try {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        microphone = audioContext.createMediaStreamSource(audioStream);
        analyser = audioContext.createAnalyser();
        microphone.connect(analyser);

        // Speech API
        recognizer = new (window as any).webkitSpeechRecognition();
        recognizer.continuous = true;
        recognizer.interimResults = false;
        recognizer.lang = "en-US";

        recognizer.onresult = (event: any) => {
          const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();

          console.log("Ouvido:", transcript);

          if (transcript.includes("hey sync")) {
            console.log("Wake Word Detectada!");
            onWake(); // ativa a Sync
          }
        };

        recognizer.onerror = () => {
          console.warn("Erro no reconhecimento de fala. Reiniciando...");
          recognizer?.start();
        };

        recognizer.onend = () => {
          recognizer?.start(); // mantém ouvindo sempre
        };

        recognizer.start();
        setListening(true);
      } catch (err) {
        console.error("Erro ao iniciar detecção de hotword:", err);
      }
    }

    startWakeDetection();

    return () => {
      recognizer?.stop();
      audioStream?.getTracks().forEach((track) => track.stop());
      audioContext?.close();
    };
  }, [onWake]);

  return listening;
}
