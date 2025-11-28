
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
        {/* 
           AVATAR OFICIAL EM SVG (VETOR) - VERSÃO ESTÁVEL
           - Corpo: Cápsula Azul
           - Rosto: Círculo Branco destacado
           - Boca: Sincronização Labial Dinâmica
        */}
        <svg 
          viewBox="0 0 200 340" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-2xl"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* GRADIENTE DO CORPO (Azul Bebê Suave) */}
            <linearGradient id="bodyGradient" x1="100" y1="0" x2="100" y2="340" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#E0F2FE" /> {/* Sky 100 */}
              <stop offset="100%" stopColor="#7DD3FC" /> {/* Sky 300 */}
            </linearGradient>

            {/* GRADIENTE DO ROSTO (Branco Puro) */}
            <radialGradient id="faceGradient" cx="0.5" cy="0.5" r="0.5">
                <stop offset="85%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#F1F5F9" />
            </radialGradient>

            {/* Sombra para destacar a cabeça do corpo */}
            <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
              <feOffset dx="0" dy="4" />
              <feComponentTransfer>
                  <feFuncA type="linear" slope="0.15"/>
              </feComponentTransfer>
              <feMerge> 
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/> 
              </feMerge>
            </filter>

            {/* Blur das Bochechas */}
            <filter id="blushBlur" x="-50%" y="-50%" width="200%" height="200%">
               <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
            </filter>
          </defs>

          <style>
            {`
              /* Flutuação Suave */
              @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-6px); }
              }
              
              /* Piscar de Olhos */
              @keyframes blink {
                0%, 96%, 100% { transform: scaleY(1); }
                98% { transform: scaleY(0.1); }
              }

              /* SINCRONIZAÇÃO LABIAL (LIP SYNC) */
              @keyframes talkMouth {
                0%, 100% { transform: scaleY(1) scaleX(1); }
                25% { transform: scaleY(0.4) scaleX(1.1); } /* Boca fechando */
                50% { transform: scaleY(1.5) scaleX(0.9); } /* Boca abrindo (O) */
                75% { transform: scaleY(0.8) scaleX(1.05); }
              }

              .avatar-anim {
                animation: float 6s ease-in-out infinite;
                transform-origin: center;
              }
              
              .mouth-anim {
                transform-origin: 100px 135px; /* Centro da boca */
              }
            `}
          </style>

          <g className="avatar-anim">
            
            {/* 1. CORPO (Cápsula Azul Alongada) */}
            <rect 
                x="25" y="25" 
                width="150" height="290" 
                rx="75" 
                fill="url(#bodyGradient)" 
            />

            {/* 2. CABEÇA (Círculo Branco Perfeito) */}
            <circle 
                cx="100" cy="100" 
                r="80" 
                fill="url(#faceGradient)" 
                filter="url(#dropShadow)"
            />

            {/* 3. ROSTO */}
            <g>
                {/* Bochechas Rosadas */}
                <circle cx="45" cy="115" r="16" fill="#FDA4AF" opacity="0.5" filter="url(#blushBlur)" />
                <circle cx="155" cy="115" r="16" fill="#FDA4AF" opacity="0.5" filter="url(#blushBlur)" />

                {isSleeping ? (
                    // --- ESTADO: DORMINDO ---
                    <g opacity="0.6">
                        {/* Olhos Fechados */}
                        <path d="M 60 100 L 80 100" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
                        <path d="M 120 100 L 140 100" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
                        {/* Boca Pequena */}
                        <path d="M 96 130 L 104 130" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
                    </g>
                ) : (
                    // --- ESTADO: ACORDADA ---
                    <g>
                        {/* Olhos Pretos Grandes */}
                        <g fill="#0F172A">
                            <ellipse cx="70" cy="95" rx="11" ry="15" style={{ transformOrigin: '70px 95px', animation: 'blink 4s infinite' }}>
                                <circle cx="73" cy="91" r="4" fill="white" />
                            </ellipse>
                            <ellipse cx="130" cy="95" rx="11" ry="15" style={{ transformOrigin: '130px 95px', animation: 'blink 4s infinite 0.2s' }}>
                                <circle cx="133" cy="91" r="4" fill="white" />
                            </ellipse>
                        </g>

                        {/* BOCA DINÂMICA */}
                        <g className="mouth-anim" style={isSpeaking ? { animation: 'talkMouth 0.3s ease-in-out infinite' } : {}}>
                            {isSpeaking ? (
                                // Boca Aberta (Falando)
                                <rect x="94" y="132" width="12" height="6" rx="3" fill="#334155" />
                            ) : (
                                // Boca Fechada (Traço)
                                <path 
                                    d="M 95 135 L 105 135" 
                                    stroke="#334155" 
                                    strokeWidth="4" 
                                    strokeLinecap="round" 
                                />
                            )}
                        </g>
                    </g>
                )}
            </g>
          </g>
        </svg>
      </div>
    );
  }

  return null;
};
