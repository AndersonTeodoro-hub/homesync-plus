import axios from "axios";

// ===== PRESETS EMOCIONAIS OPTIMIZADOS PARA RACHEL =====

const PRESET_CTA = {
  stability: 0.38,
  similarity_boost: 0.95,
  style: 0.70,
  use_speaker_boost: true,
};

const PRESET_EMPATHY = {
  stability: 0.55,
  similarity_boost: 0.85,
  style: 0.20,
  use_speaker_boost: false,
};

const PRESET_FUTURISTIC = {
  stability: 0.45,
  similarity_boost: 0.90,
  style: 0.35,
  use_speaker_boost: true,
};

const PRESET_TEACHER = {
  stability: 0.50,
  similarity_boost: 0.89,
  style: 0.25,
  use_speaker_boost: true,
};

// ===== SELETOR DE EMOÇÃO INTELIGENTE =====

function selectPreset(text: string) {
  const t = text.toLowerCase();

  // Comandos fortes / CTA
  if (
    t.includes("faça isso") ||
    t.includes("agora") ||
    t.includes("atenção") ||
    t.includes("urgente") ||
    t.includes("continue") ||
    t.includes("avançar")
  ) {
    return PRESET_CTA;
  }

  // Empatia / Calma
  if (
    t.includes("está tudo bem") ||
    t.includes("calma") ||
    t.includes("não se preocupe") ||
    t.includes("eu entendo") ||
    t.includes("respira")
  ) {
    return PRESET_EMPATHY;
  }

  // Futurista / Assistente avançada
  if (
    t.includes("ativando") ||
    t.includes("processando") ||
    t.includes("modo") ||
    t.includes("sistema") ||
    t.includes("sincronizado")
  ) {
    return PRESET_FUTURISTIC;
  }

  // Explicações
  return PRESET_TEACHER;
}

// ===== API PRINCIPAL DE VOZ =====

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Texto vazio" });
    }

    const apiKey = process.env.ELEVEN_API_KEY;
    const voiceId = process.env.ELEVEN_VOICE_ID;

    if (!apiKey || !voiceId) {
      return res.status(500).json({ error: "Variáveis de ambiente não configuradas" });
    }

    const emotionPreset = selectPreset(text);

    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: emotionPreset,
      },
      {
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
      }
    );

    res.setHeader("Content-Type", "audio/mpeg");
    return res.status(200).send(response.data);

  } catch (err) {
    console.error("Erro ao sintetizar voz:", err);
    return res.status(500).json({ error: "Erro interno ao gerar voz." });
  }
}
