import twilio from "twilio";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: "Método não permitido. Use POST para fazer chamadas." });
  }

  const { numberToCall, message } = req.body;

  if (!numberToCall) {
    return res
      .status(400)
      .json({ error: "O número do destinatário é obrigatório." });
  }

  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

    const client = twilio(accountSid, authToken);

    const speakMessage =
      message || "Olá, esta é uma chamada automática enviada pela Sync.";

    // link do twiml
    const twimlUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/twiml?text=${encodeURIComponent(
      speakMessage
    )}`;

    const call = await client.calls.create({
      to: numberToCall,
      from: twilioNumber,
      url: twimlUrl,
    });

    return res.status(200).json({
      success: true,
      status: "Chamando...",
      to: numberToCall,
      callSid: call.sid,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao iniciar a chamada.",
      details: error.message,
    });
  }
}
