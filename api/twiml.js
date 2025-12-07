export default function handler(req, res) {
  const text =
    req.query.text ||
    "Olá, aqui é a Sync. Sua chamada está ativa. Obrigada por usar nossos serviços.";

  const twimlResponse = `
    <Response>
      <Say voice="Polly.Camila">${text}</Say>
    </Response>
  `;

  res.setHeader("Content-Type", "text/xml");
  return res.status(200).send(twimlResponse.trim());
}
