export default function handler(req, res) {
  const twiml = `
    <Response>
      <Say voice="Polly.Camila">
        Anderson, a Sync tem uma pessoa na linha querendo falar com você.
        Deseja que eu conecte a chamada?
      </Say>
      <Gather input="speech" action="/api/response-user" method="POST">
        <Say voice="Polly.Camila">Diga Sim para conectar ou Não para recusar.</Say>
      </Gather>
    </Response>
  `;

  res.setHeader("Content-Type", "text/xml");
  return res.status(200).send(twiml.trim());
}
