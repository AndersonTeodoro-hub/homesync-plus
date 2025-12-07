import twilio from "twilio";

export default async function handler(req, res) {
  const SpeechResult = req.body.SpeechResult?.toLowerCase() || "";

  if (!SpeechResult) {
    return res.status(200).send(`
      <Response>
        <Say voice="Polly.Camila">Não entendi. Pode repetir?</Say>
      </Response>
    `);
  }

  if (SpeechResult.includes("sim")) {
    return res.status(200).send(`
      <Response>
        <Say voice="Polly.Camila">Perfeito, conectando agora.</Say>
        <Dial>
          <Conference>sync-bridge-room</Conference>
        </Dial>
      </Response>
    `);
  }

  return res.status(200).send(`
    <Response>
      <Say voice="Polly.Camila">Tudo bem, não vou conectar agora.</Say>
    </Response>
  `);
}
