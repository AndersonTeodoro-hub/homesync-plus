
import React from 'react';

interface AvatarProps {
  role: 'user' | 'model';
  isSleeping?: boolean;
  voiceState?: 'idle' | 'listening' | 'speaking' | 'thinking';
}

export const Avatar: React.FC<AvatarProps> = ({ role, isSleeping = false, voiceState = 'idle' }) => {
  if (role === 'model') {
    const isSpeaking = voiceState === 'speaking';
    
    return (
      <div className="w-full h-full flex items-center justify-center">
        <svg 
          viewBox="0 0 600 900" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-2xl"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* CORPO: CÁPSULA PREMIUM (Azul Suave) */}
            <radialGradient id="bodyGradient" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFFFFF"/>
              <stop offset="55%" stopColor="#EEF3FA"/>
              <stop offset="100%" stopColor="#D4DCE8"/>
            </radialGradient>

            {/* ROSTO: BRANCO PURO DESTACADO */}
            <radialGradient id="faceGradient" cx="50%" cy="38%" r="85%">
              <stop offset="0%" stopColor="#FFFFFF"/>
              <stop offset="50%" stopColor="#F1F5FF"/>
              <stop offset="100%" stopColor="#D5DEEE"/>
            </radialGradient>

            {/* OLHOS: PROFUNDIDADE REALISTA */}
            <radialGradient id="eyeDepth" cx="45%" cy="40%" r="90%">
                <stop offset="0%" stopColor="#000000" stopOpacity="0.95"/>
                <stop offset="55%" stopColor="#0A0A0A" stopOpacity="0.95"/>
                <stop offset="100%" stopColor="#1A1A1A" stopOpacity="1"/>
            </radialGradient>

            {/* SOMBRA PÁLPEBRA */}
            <linearGradient id="eyeShadow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#000000" stopOpacity="0.33"/>
                <stop offset="100%" stopColor="#000000" stopOpacity="0"/>
            </linearGradient>
          </defs>

          <style>
            {`
              /* Respiração Natural */
              @keyframes breathe {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-15px); }
              }
              
              /* SINCRONIZAÇÃO LABIAL AVANÇADA (Organic Lip Sync) */
              /* Varia a altura e largura para simular fonemas (A, O, E, M) */
              @keyframes lipSync {
                0% { transform: scaleY(1) scaleX(1); }
                25% { transform: scaleY(2.5) scaleX(0.85); } /* Boca alta (Ah/Oh) */
                40% { transform: scaleY(0.8) scaleX(1.2); } /* Boca larga (Ee) */
                60% { transform: scaleY(1.8) scaleX(0.95); } /* Boca média */
                80% { transform: scaleY(0.5) scaleX(1.0); } /* Boca quase fechada (Mm) */
                100% { transform: scaleY(1) scaleX(1); }
              }

              .sync-body {
                animation: breathe 6s ease-in-out infinite;
                transform-origin: center;
              }
              
              /* Classe aplicada apenas quando falando */
              .mouth-talking {
                animation: lipSync 0.3s linear infinite; /* Rápido e contínuo */
              }
              
              /* Garante que a boca cresça a partir do centro */
              .mouth-container {
                transform-box: fill-box;
                transform-origin: center;
              }
            `}
          </style>

          {/* GRUPO PRINCIPAL (Animado) */}
          <g className="sync-body">
            
            {/* 1. CORPO (Cápsula) */}
            <rect x="170" y="260" width="260" height="480" rx="130" fill="url(#bodyGradient)" />

            {/* 2. ROSTO (Círculo sobreposto - Camada Superior) */}
            {/* Sombra suave atrás da cabeça para destacar do corpo */}
            <circle cx="300" cy="334" r="120" fill="#000000" fillOpacity="0.1" filter="blur(10px)" />
            <circle cx="300" cy="330" r="120" fill="url(#faceGradient)"/>

            {/* Blush Suave */}
            <ellipse cx="245" cy="340" rx="30" ry="20" fill="#FFB7C7" fillOpacity="0.25" />
            <ellipse cx="355" cy="340" rx="30" ry="20" fill="#FFB7C7" fillOpacity="0.25" />

            {isSleeping ? (
                // --- ESTADO: DORMINDO ---
                <g id="eyes-closed">
                    <rect x="240" y="312" width="30" height="6" rx="3" fill="#334155" fillOpacity="0.7"/>
                    <rect x="330" y="312" width="30" height="6" rx="3" fill="#334155" fillOpacity="0.7"/>
                    {/* Boca pequena dormindo */}
                    <rect x="292" y="360" width="16" height="4" rx="2" fill="#94A3B8"/>
                </g>
            ) : (
                // --- ESTADO: ACORDADA ---
                <g id="face-awake">
                    {/* Olhos Abertos */}
                    <g id="eyes-open">
                        {/* Esquerdo */}
                        <g>
                            <circle cx="255" cy="315" r="18" fill="url(#eyeDepth)" />
                            <circle cx="255" cy="315" r="20" fill="none" stroke="#000" strokeOpacity="0.1" strokeWidth="1"/>
                            <circle cx="248" cy="308" r="5" fill="#FFFFFF" fillOpacity="0.9"/>
                            <circle cx="260" cy="321" r="3" fill="#FFFFFF" fillOpacity="0.4"/>
                        </g>
                        {/* Direito */}
                        <g>
                            <circle cx="345" cy="315" r="18" fill="url(#eyeDepth)" />
                            <circle cx="345" cy="315" r="20" fill="none" stroke="#000" strokeOpacity="0.1" strokeWidth="1"/>
                            <circle cx="338" cy="308" r="5" fill="#FFFFFF" fillOpacity="0.9"/>
                            <circle cx="350" cy="321" r="3" fill="#FFFFFF" fillOpacity="0.4"/>
                        </g>
                    </g>

                    {/* BOCA DINÂMICA */}
                    <g 
                      id="mouth-active" 
                      className={`mouth-container ${isSpeaking ? 'mouth-talking' : ''}`}
                    >
                        {/* A boca base é um retângulo arredondado que será deformado pela animação CSS */}
                        <rect x="288" y="360" width="24" height="8" rx="4" fill="#1A1A1A"/>
                    </g>
                </g>
            )}
          </g>
        </svg>
      </div>
    );
  }

  return null;
};
