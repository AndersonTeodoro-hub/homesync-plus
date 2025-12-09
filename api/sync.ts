// api/sync.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenerativeAI } from "@google/generative-ai";

// 🔥 Sua API KEY (segura dentro do backend da Vercel)
const API_KEY = "AIzaSyAw7VCUND3w4A0Kh9W6YG0f6DduxFO8Byk";

// 🔥 Inicializa o cliente Gemini
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Endpoint para processar prompts de texto vindos da Sync.
 * Agora integrado ao Gemini de forma real.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Só aceita POST
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método não permitido" });
    }

    const { message } = req.body ?? {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Mensagem inválida" });
    }

    // 🔥 Chamada REAL ao Gemini
    const result = await model.generateContent(message);
    const reply = result.response.text();

    return res.status(200).json({
      ok: true,
      reply
    });

  } catch (err: any) {
    console.error("Erro no /api/sync:", err);
    return res.status(500).json({
      ok: false,
      error: "Erro interno ao processar IA"
    });
  }
}
