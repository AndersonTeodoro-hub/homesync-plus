
// Esta é uma Serverless Function da Vercel
// Ela roda no servidor, protegendo suas chaves de API da Twilio.

import twilio from 'twilio';

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

  // 3. Integração com Twilio
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  // Verifica se as chaves existem (se o usuário configurou na Vercel)
  if (accountSid && authToken && fromNumber) {
    try {
      const client = twilio(accountSid, authToken);
      
      console.log(`[SERVER] Iniciando ligação real via Twilio para ${to}...`);
      
      const call = await client.calls.create({
        twiml: `<Response><Say language="pt-BR" voice="alice">${message}</Say></Response>`,
        to: to,
        from: fromNumber,
      });

      console.log(`[SERVER] Ligação iniciada! SID: ${call.sid}`);
      return response.status(200).json({ success: true, mode: 'real', sid: call.sid });

    } catch (error) {
      console.error('[SERVER] Erro na Twilio:', error);
      // Se der erro na Twilio (ex: número não verificado no trial), retorna erro mas não quebra o app
      return response.status(500).json({ error: 'Failed to initiate Twilio call', details: error.message });
    }
  } else {
    // Fallback: Se não tiver chaves configuradas, apenas simula sucesso (Modo Demonstração)
    console.log(`[SERVER] Chaves Twilio não encontradas. Simulando ligação para ${to} dizendo: "${message}"`);
    return response.status(200).json({ success: true, mode: 'simulation' });
  }
}
