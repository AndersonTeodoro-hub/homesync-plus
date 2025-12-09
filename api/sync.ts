// /api/sync.ts

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        const { prompt } = req.body || {};

        if (!prompt) {
            return res.status(400).json({ error: "Missing prompt" });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        return res.status(200).json({ reply: text });
    } catch (err) {
        console.error("SYNC API ERROR:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
