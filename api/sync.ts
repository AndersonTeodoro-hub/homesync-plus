import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { message, history } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash",
    });

    const prompt = `
Você é a Sync, uma assistente de IA criada para conversar com naturalidade,
responder rápido e agir como uma companhia inteligente.

O usuário disse: "${message}"

Responda de forma clara, amigável e curta, ideal para voz.
`;

    const result = await model.generateContent(prompt);

    const responseText = result.response.text();

    return res.status(200).json({ reply: responseText });

  } catch (error) {
    console.error("Erro na API:", error);
    return res.status(500).json({ error: "Erro interno" });
  }
}
