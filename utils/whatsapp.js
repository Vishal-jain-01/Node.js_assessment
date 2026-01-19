const getProvider = () => (process.env.WHATSAPP_PROVIDER || 'cloud').toLowerCase();

const getCloudConfig = () => ({
  token: process.env.WHATSAPP_CLOUD_TOKEN,
  phoneNumberId: process.env.WHATSAPP_CLOUD_PHONE_NUMBER_ID,
  verifyToken: process.env.WHATSAPP_VERIFY_TOKEN
});

const getTwilioConfig = () => ({
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  fromNumber: process.env.TWILIO_WHATSAPP_NUMBER
});

export const validateWhatsAppConfig = () => {
  const provider = getProvider();
  const missing = [];

  if (provider === 'cloud') {
    const { token, phoneNumberId, verifyToken } = getCloudConfig();
    if (!token) missing.push('WHATSAPP_CLOUD_TOKEN');
    if (!phoneNumberId) missing.push('WHATSAPP_CLOUD_PHONE_NUMBER_ID');
    if (!verifyToken) missing.push('WHATSAPP_VERIFY_TOKEN');
  } else if (provider === 'twilio') {
    const { accountSid, authToken, fromNumber } = getTwilioConfig();
    if (!accountSid) missing.push('TWILIO_ACCOUNT_SID');
    if (!authToken) missing.push('TWILIO_AUTH_TOKEN');
    if (!fromNumber) missing.push('TWILIO_WHATSAPP_NUMBER');
  } else {
    missing.push('WHATSAPP_PROVIDER (cloud or twilio)');
  }

  if (missing.length > 0) {
    throw new Error(`Missing WhatsApp configuration: ${missing.join(', ')}`);
  }

  return provider;
};

export const sendWhatsAppMessage = async ({ to, message }) => {
  const provider = getProvider();

  if (provider === 'cloud') {
    const { token, phoneNumberId } = getCloudConfig();
    const response = await fetch(`https://graph.facebook.com/v17.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: {
          body: message
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error?.message || 'Cloud API request failed');
    }

    return {
      provider: 'cloud',
      providerMessageId: data?.messages?.[0]?.id || '',
      status: 'sent',
      rawResponse: data
    };
  }

  if (provider === 'twilio') {
    const { accountSid, authToken, fromNumber } = getTwilioConfig();
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        From: `whatsapp:${fromNumber}`,
        To: `whatsapp:${to}`,
        Body: message
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || 'Twilio request failed');
    }

    return {
      provider: 'twilio',
      providerMessageId: data?.sid || '',
      status: data?.status || 'sent',
      rawResponse: data
    };
  }

  throw new Error('Unsupported WhatsApp provider');
};

export const normalizeInboundPayload = (body) => {
  const provider = getProvider();

  if (provider === 'cloud') {
    const message = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    const metadata = body?.entry?.[0]?.changes?.[0]?.value?.metadata;

    if (!message) {
      return null;
    }

    return {
      provider: 'cloud',
      providerMessageId: message?.id || '',
      from: message?.from || '',
      to: metadata?.display_phone_number || '',
      text: message?.text?.body || message?.button?.text || ''
    };
  }

  if (provider === 'twilio') {
    if (!body?.From || !body?.Body) {
      return null;
    }

    return {
      provider: 'twilio',
      providerMessageId: body?.MessageSid || '',
      from: body?.From?.replace('whatsapp:', '') || '',
      to: body?.To?.replace('whatsapp:', '') || '',
      text: body?.Body || ''
    };
  }

  return null;
};
