import axios from "axios";

export default async function handler(req, res) {
  // Permite apenas requisições POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Texto inválido" });
    }

    const apiKey = process.env.ELEVEN_API_KEY;
    const voiceId = process.env.ELEVEN_VOICE_ID; // Rachel (voz recomendada)

    if (!apiKey || !voiceId) {
      return res.status(500).json({ error: "Variáveis de ambiente não configuradas" });
    }

    // Configuração otimizada para Rachel
    const body = {
      text,
      model_id: "eleven_multilingual_v2",  // melhor modelo atual
      voice_settings: {
        stability: 0.45,         // equilíbrio entre emoção e firmeza
        similarity_boost: 0.92,  // maximiza fidelidade da voz Rachel
        style: 0.40,             // entonação assistente inteligente
        use_speaker_boost: true, // mais presença e volume natural
      }
    };

    const headers = {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
    };

    // Requisição à ElevenLabs
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      body,
      { headers, responseType: "arraybuffer" }
    );

    // Configura o retorno como áudio MP3
    res.setHeader("Content-Type", "audio/mpeg");
    res.status(200).send(response.data);

  } catch (error) {
    console.error("Erro na API de voz:", error?.response?.data || error);
    res.status(500).json({
      error: "Erro ao gerar áudio da voz Rachel",
      details: error?.response?.data || error,
    });
  }
}
