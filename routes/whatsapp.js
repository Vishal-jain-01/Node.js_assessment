import express from "express";
import { Message } from '../models/Message.js'
import { normalizeInboundPayload, sendWhatsAppMessage } from '../utils/whatsapp.js'

const router = express.Router();

const buildRelatedEntity = (relatedEntity) => {
  if (!relatedEntity) {
    return null;
  }

  const entityType = relatedEntity.entityType || relatedEntity.type;
  const entityId = relatedEntity.entityId || relatedEntity.id;

  if (!entityType || !entityId) {
    return null;
  }

  return {
    entityType,
    entityId
  };
};

router.get('/whatsapp/webhook', (req, res) => {
  if ((process.env.WHATSAPP_PROVIDER || 'cloud').toLowerCase() !== 'cloud') {
    return res.sendStatus(200);
  }

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

router.post('/whatsapp/webhook', async (req, res) => {
  try {
    const inbound = normalizeInboundPayload(req.body);

    if (!inbound) {
      return res.status(200).json({
        status_code: 200,
        message: 'No inbound message to process'
      });
    }

    const message = new Message({
      direction: 'inbound',
      status: 'received',
      provider: inbound.provider,
      providerMessageId: inbound.providerMessageId,
      from: inbound.from,
      to: inbound.to,
      body: inbound.text,
      rawPayload: req.body
    });

    await message.save();

    return res.status(200).json({
      status_code: 200,
      message: 'Inbound message logged',
      data: {
        id: message._id,
        providerMessageId: message.providerMessageId
      }
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'Error processing inbound message',
      error: error.message
    });
  }
});

router.post('/whatsapp/messages', async (req, res) => {
  try {
    const { to, message, relatedEntity } = req.body;

    if (!to || !message) {
      return res.status(400).json({
        status_code: 400,
        message: 'to and message are required'
      });
    }

    const normalizedRelatedEntity = buildRelatedEntity(relatedEntity);

    if (!normalizedRelatedEntity || !['lead', 'contact'].includes(normalizedRelatedEntity.entityType)) {
      return res.status(400).json({
        status_code: 400,
        message: 'relatedEntity with entityType lead/contact and entityId is required'
      });
    }

    const outbound = await sendWhatsAppMessage({ to, message });

    const messageLog = new Message({
      direction: 'outbound',
      status: outbound.status,
      provider: outbound.provider,
      providerMessageId: outbound.providerMessageId,
      to,
      body: message,
      relatedEntity: normalizedRelatedEntity,
      rawPayload: outbound.rawResponse
    });

    await messageLog.save();

    return res.status(200).json({
      status_code: 200,
      message: 'Message sent successfully',
      data: {
        id: messageLog._id,
        providerMessageId: messageLog.providerMessageId,
        status: messageLog.status
      }
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'Error sending WhatsApp message',
      error: error.message
    });
  }
});

export default router;
