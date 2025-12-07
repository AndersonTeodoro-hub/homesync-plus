export default async function handler(req, res) {
  const speech = req.body.SpeechResult?.toLowerCase() || "";

  if (speech.includes("conectar") || speech.includes("anderson")) {
    return res.status(200).send(`
      <Response>
        <Say voice="Polly.Camila">Claro, estou conectando você ao Anderson.</Say>
        <Redirect method="POST">/api/connect</Redirect>
      </Response>
    `);
  }

  return res.status(200).send(`
    <Response>
      <Say voice="Polly.Camila">
        Certo, vamos continuar conversando.
      </Say>
    </Response>
  `);
}
