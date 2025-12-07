import twilio from "twilio";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST para conectar chamadas." });
  }

  const { callSidA, userNumber } = req.body;

  if (!callSidA || !userNumber) {
    return res.status(400).json({
      error: "callSidA e userNumber são obrigatórios para conectar chamadas.",
    });
  }

  try {
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    // Cria a segunda chamada (para você)
    const callToYou = await client.calls.create({
      to: userNumber,
      from: process.env.TWILIO_PHONE_NUMBER,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/notify-user`,
    });

    // Armazena o SID da segunda chamada
    const callSidB = callToYou.sid;

    console.log("Call A:", callSidA);
    console.log("Call B:", callSidB);

    return res.status(200).json({
      success: true,
      message: "Conectando as duas chamadas...",
      callSidA,
      callSidB,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao conectar chamadas.",
      details: error.message,
    });
  }
}
