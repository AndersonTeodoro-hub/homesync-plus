export default function handler(req, res) {
  const twiml = `
    <Response>
      <Say voice="Polly.Camila">Olá, aqui é a Sync. Pode falar, estou ouvindo.</Say>

      <Gather input="speech" action="/api/handle-intent" method="POST">
        <Say voice="Polly.Camila">
          Você deseja falar com Anderson? Diga conectar Anderson.
        </Say>
      </Gather>

      <Connect>
        <Stream url="${process.env.NEXT_PUBLIC_BASE_URL}/api/stream" />
      </Connect>
    </Response>
  `;

  res.setHeader("Content-Type", "text/xml");
  return res.status(200).send(twiml.trim());
}
