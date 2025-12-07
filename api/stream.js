import { GoogleGenerativeAI } from "@google/generative-ai";
import twilio from "twilio";

export default async function handler(req, res) {
  const chunks = [];

  req.on("data", (chunk) => chunks.push(chunk));

  req.on("end", async () => {
    const buffer = Buffer.concat(chunks);

    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Decodifica áudio Base64 recebido pela Twilio
      const audioB64 = buffer.toString("utf8");

      // Envia áudio ao Gemini
      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  mimeType: "audio/pcm",
                  data: audioB64,
                },
              },
            ],
          },
        ],
      });

      const replyText = result.response.text();

      // Envia texto para conversão em voz pelo Twilio
      const twimlResponse = `
        <Response>
          <Say voice="Polly.Camila">${replyText}</Say>
        </Response>
      `;

      res.setHeader("Content-Type", "text/xml");
      return res.status(200).send(twimlResponse.trim());
    } catch (error) {
      console.error(error);

      res.setHeader("Content-Type", "text/xml");
      return res.status(200).send(`
        <Response>
          <Say voice="Polly.Camila">Desculpe, houve um erro ao processar sua fala.</Say>
        </Response>
      `);
    }
  });
}
