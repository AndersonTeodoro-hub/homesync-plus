// api/sync.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Endpoint responsável por processar prompts de texto
 * e integrar futuramente com Google Gemini / GPT / outros modelos.
 *
 * Atualmente retorna apenas uma resposta mock,
 * mas a estrutura já está preparada para upgrades.
 */

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Método não permitido" });
        }

        const { message } = req.body ?? {};

        if (!message || typeof message !== "string") {
            return res.status(400).json({ error: "Mensagem inválida" });
        }

        // 🚀 Aqui é onde no futuro você faz integração com Google Gemini
        // const model = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        // const result = await model.generate({ prompt: message });

        const simulatedResponse = `Recebi sua mensagem: "${message}". Em breve responderei com IA real.`;

        return res.status(200).json({
            ok: true,
            reply: simulatedResponse
        });

    } catch (error: any) {
        console.error("Erro no /api/sync:", error);

        return res.status(500).json({
            ok: false,
            error: "Erro interno no servidor"
        });
    }
}
