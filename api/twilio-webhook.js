
// Esta é uma Serverless Function da Vercel
// Ela roda no servidor, protegendo suas chaves de API da Twilio.

export default async function handler(request, response) {
  // 1. Segurança: Verificar se a requisição é válida
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  // 2. Obter dados da requisição (quem ligar, o que falar)
  const { to, message } = request.body;

  if (!to || !message) {
    return response.status(400).json({ error: 'Missing parameters' });
  }

  // 3. Integração com Twilio (Exemplo - Requer chaves reais no .env)
  // const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  
  try {
    /*
    // Código real da Twilio (descomentar quando tiver a conta)
    const call = await client.calls.create({
      twiml: `<Response><Say language="pt-BR">${message}</Say></Response>`,
      to: to,
      from: process.env.TWILIO_PHONE_NUMBER,
    });
    return response.status(200).json({ success: true, sid: call.sid });
    */

    // Simulação de Sucesso (para o MVP)
    console.log(`[SERVER] Simulando ligação para ${to} dizendo: "${message}"`);
    return response.status(200).json({ success: true, mode: 'simulation' });

  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: 'Failed to initiate call' });
  }
}
