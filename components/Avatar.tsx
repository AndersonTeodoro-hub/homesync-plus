import React from 'react';

interface AvatarProps {
  role: 'user' | 'model';
  isSleeping?: boolean;
  voiceState?: 'idle' | 'listening' | 'speaking' | 'thinking';
}

export const Avatar: React.FC<AvatarProps> = ({ role, isSleeping = false, voiceState = 'idle' }) => {
  if (role === 'model') {
    const isSpeaking = voiceState === 'speaking';
    const isListening = voiceState === 'listening';
    
    // Animação de respiração lenta para o modo dormir
    const breathingStyle = isSleeping 
        ? { animation: 'breathe 6s ease-in-out infinite' } 
        : { animation: 'float 6s ease-in-out infinite' };

    return (
      <div className="w-full h-full relative" style={breathingStyle}>
        <svg 
          viewBox="0 0 200 320" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-2xl"
        >
          <defs>
            {/* Gradiente do Corpo de Vidro */}
            <linearGradient id="glass-body" x1="100" y1="0" x2="100" y2="320" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="white" stopOpacity="0.15"/>
              <stop offset="0.4" stopColor="white" stopOpacity="0.05"/>
              <stop offset="1" stopColor="white" stopOpacity="0.02"/>
            </linearGradient>

            {/* Borda de Vidro */}
            <linearGradient id="glass-stroke" x1="0" y1="0" x2="200" y2="320" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="white" stopOpacity="0.8"/>
              <stop offset="0.5" stopColor="white" stopOpacity="0.1"/>
              <stop offset="1" stopColor="white" stopOpacity="0.4"/>
            </linearGradient>

            {/* Cabeça Interna (Esfera Branca Suave) */}
            <radialGradient id="inner-head" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(100 110) rotate(90) scale(95)">
              <stop stopColor="#F8FAFC"/>
              <stop offset="1" stopColor="#E2E8F0"/>
            </radialGradient>

            {/* Blush (Bochechas Rosadas) */}
            <radialGradient id="blush-glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(100 110) rotate(90) scale(40)">
              <stop stopColor="#F472B6" stopOpacity="0.4"/>
              <stop offset="1" stopColor="#F472B6" stopOpacity="0"/>
            </radialGradient>

            {/* Sombra suave interna */}
            <filter id="soft-glow" x="-20%" y="-20%" width="140%" height="140%">
               <feGaussianBlur stdDeviation="5" result="blur"/>
            </filter>
          </defs>

          <style>
            {`
              @keyframes breathe {
                0%, 100% { transform: translateY(0) scale(1); }
                50% { transform: translateY(-5px) scale(1.02); }
              }
              @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-8px); }
              }
              @keyframes blink {
                0%, 96%, 100% { transform: scaleY(1); }
                98% { transform: scaleY(0.1); }
              }
              @keyframes speak {
                0%, 100% { transform: scaleY(1); }
                50% { transform: scaleY(1.5); }
              }
              @keyframes listening-pulse {
                0%, 100% { transform: scale(1); opacity: 0.8; }
                50% { transform: scale(1.1); opacity: 1; }
              }
            `}
          </style>

          {/* 1. Sombra base para dar profundidade no fundo escuro */}
          <ellipse cx="100" cy="290" rx="60" ry="15" fill="black" fillOpacity="0.4" filter="url(#soft-glow)" />

          {/* 2. Cápsula Externa (Vidro Traseiro) */}
          <rect x="20" y="20" width="160" height="280" rx="80" fill="url(#glass-body)" />

          {/* 3. Cabeça Interna (A "Alma" da Sync) */}
          <g transform="translate(0, 10)">
             {/* Forma da cabeça */}
             <circle cx="100" cy="110" r="65" fill="url(#inner-head)" />
             
             {/* Corpo interno sutil desvanecendo para baixo */}
             <path d="M60 160 C 60 160, 65 240, 100 240 C 135 240, 140 160, 140 160" stroke="white" strokeOpacity="0.1" strokeWidth="0" fill="white" fillOpacity="0.1" />
             
             {/* Bochechas (Blush) */}
             <circle cx="65" cy="115" r="15" fill="#F9A8D4" fillOpacity="0.3" filter="url(#soft-glow)" />
             <circle cx="135" cy="115" r="15" fill="#F9A8D4" fillOpacity="0.3" filter="url(#soft-glow)" />
          </g>

          {/* 4. Rosto (Olhos e Boca) */}
          <g transform="translate(0, 10)">
            {isSleeping ? (
               /* Olhos Dormindo (Traços horizontais suaves) */
               <g stroke="#334155" strokeWidth="5" strokeLinecap="round" opacity="0.8">
                  <path d="M75 110 Q 85 112, 95 110" />
                  <path d="M105 110 Q 115 112, 125 110" />
               </g>
            ) : (
               /* Olhos Acordados (Ovais grandes e pretos) */
               <g fill="#1E293B" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
                  <ellipse cx="82" cy="105" rx="9" ry="12" style={{ animation: 'blink 4s infinite' }}>
                    {/* Brilho no olho */}
                    <circle cx="85" cy="100" r="3" fill="white" fillOpacity="0.8" />
                  </ellipse>
                  <ellipse cx="118" cy="105" rx="9" ry="12" style={{ animation: 'blink 4s infinite 0.2s' }}>
                     {/* Brilho no olho */}
                     <circle cx="121" cy="100" r="3" fill="white" fillOpacity="0.8" />
                  </ellipse>
               </g>
            )}

            {/* Boca (Pequeno ponto ou traço) */}
            {isSpeaking ? (
                <ellipse cx="100" cy="135" rx="6" ry="6" fill="#334155" opacity="0.8" style={{ animation: 'speak 0.4s infinite' }} />
            ) : (
                <circle cx="100" cy="132" r="2.5" fill="#334155" opacity="0.6" />
            )}
          </g>

          {/* 5. Cápsula Externa (Reflexos e Borda Frontal) */}
          <rect x="20" y="20" width="160" height="280" rx="80" stroke="url(#glass-stroke)" strokeWidth="2" fill="none" />
          
          {/* Reflexo Glossy Superior */}
          <path d="M50 35 Q 100 25, 150 35 Q 150 70, 130 50 Q 100 40, 70 50 Q 50 70, 50 35" fill="white" fillOpacity="0.15" />

          {/* Reflexo Lateral Suave */}
          <path d="M35 100 Q 30 150, 35 200" stroke="white" strokeWidth="3" strokeOpacity="0.1" strokeLinecap="round" fill="none" />
        </svg>
      </div>
    );
  }

  // Fallback for User Role icon (Simple Profile)
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <circle cx="40" cy="40" r="38" fill="#E2E8F0" />
        <path 
            d="M40 38C45.5228 38 50 33.5228 50 28C50 22.4772 45.5228 18 40 18C34.4772 18 30 22.4772 30 28C30 33.5228 34.4772 38 40 38ZM25 62C25 53.7157 31.7157 47 40 47C48.2843 47 55 53.7157 55 62H25Z" 
            fill="#64748B"
        />
    </svg>
  );
};