// api/sync.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenerativeAI } from "@google/generative-ai";

// 🔥 Lê a chave da Vercel (segurança total)
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("GEMINI_API_KEY não definida nas variáveis da Vercel!");
}

// Inicializa Gemini 3 Pro
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-3.0-pro"
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método não permitido" });
    }

    const { message } = req.body ?? {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Mensagem inválida" });
    }

    // ⚡ Chamada real ao Gemini 3 Pro
    const result = await model.generateContent(message);
    const reply = result.response.text();

    return res.status(200).json({ ok: true, reply });

  } catch (error) {
    console.error("Erro IA:", error);
    return res.status(500).json({
      ok: false,
      error: "Erro interno ao processar IA"
    });
  }
}
