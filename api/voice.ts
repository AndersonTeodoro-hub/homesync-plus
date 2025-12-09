// /api/voice.ts

import type { VercelRequest, VercelResponse } from "@vercel/node";

const apiKey = process.env.ELEVEN_API_KEY;
const voiceId = process.env.ELEVEN_VOICE_ID;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        const { text } = req.body || {};

        if (!text) {
            return res.status(400).json({ error: "Missing text" });
        }

        const audioResponse = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
            {
                method: "POST",
                headers: {
                    "xi-api-key": apiKey!,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text,
                    model_id: "eleven_multilingual_v2"
                })
            }
        );

        const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());

        res.setHeader("Content-Type", "audio/mpeg");
        return res.status(200).send(audioBuffer);

    } catch (err) {
        console.error("VOICE API ERROR:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
