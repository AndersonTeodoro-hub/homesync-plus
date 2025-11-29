
import twilio from 'twilio';

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const { sid } = request.query;

  if (!sid) {
    return response.status(400).json({ error: 'Missing Call SID' });
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (accountSid && authToken) {
    try {
      const client = twilio(accountSid, authToken);
      const call = await client.calls(sid).fetch();
      
      // Status possíveis: queued, ringing, in-progress, completed, busy, failed, no-answer
      return response.status(200).json({ status: call.status });
    } catch (error) {
      return response.status(500).json({ error: 'Twilio error', details: error.message });
    }
  } else {
    return response.status(200).json({ status: 'simulation' });
  }
}
