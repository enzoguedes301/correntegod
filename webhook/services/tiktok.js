/* ==========================================================
   TIKTOK EVENTS API — envia conversões (server-side)
   ========================================================== */

const axios = require('axios');

const API_BASE = 'https://business-api.tiktok.com/open_api/v1.3/event/track/';

/**
 * Envia um evento genérico para a TikTok Events API (server-side).
 * Mais confiável que o pixel do navegador (não depende de ad blockers,
 * cookies de terceiros, Safari ITP, etc.)
 *
 * @param {string} nomeEvento - 'InitiateCheckout' (PIX gerado) ou
 *                              'CompletePayment' (pagamento confirmado)
 */
async function enviarEvento(nomeEvento, { email, telefone, valor, transactionId, ip, userAgent }) {
  try {
    if (!process.env.TIKTOK_ACCESS_TOKEN || !process.env.TIKTOK_PIXEL_ID) {
      console.log('⚠️ TikTok Events API não configurado — pulando evento');
      return { success: false, skipped: true };
    }

    const payload = {
      event_source: 'web',
      event_source_id: process.env.TIKTOK_PIXEL_ID,
      data: [
        {
          event: nomeEvento,
          event_time: Math.floor(Date.now() / 1000),
          event_id: `${transactionId}-${nomeEvento}`,
          user: {
            // A TikTok exige hash SHA-256 de dados pessoais (nunca em texto puro)
            email: email ? hashSha256(email.trim().toLowerCase()) : undefined,
            phone: telefone ? hashSha256(somenteDigitos(telefone)) : undefined,
            ip: ip || undefined,
            user_agent: userAgent || undefined,
          },
          properties: {
            currency: 'BRL',
            value: Number(valor),
          },
        },
      ],
    };

    const response = await axios.post(API_BASE, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Token': process.env.TIKTOK_ACCESS_TOKEN,
      },
    });

    console.log(`📣 Evento TikTok '${nomeEvento}' enviado:`, transactionId);
    return { success: true, response: response.data };

  } catch (erro) {
    console.error(`❌ Erro ao enviar evento TikTok '${nomeEvento}':`, erro.response?.data || erro.message);
    return { success: false, error: erro.response?.data || erro.message };
  }
}

/** Dispara quando o doador gera o QR Code PIX (ainda não pagou) */
function enviarEventoInicioCheckout(dados) {
  return enviarEvento('InitiateCheckout', dados);
}

/** Dispara quando o webhook da ZuckPay confirma o pagamento */
function enviarEventoPagamentoConfirmado(dados) {
  return enviarEvento('CompletePayment', dados);
}

function somenteDigitos(valor) {
  return (valor || '').replace(/\D/g, '');
}

function hashSha256(texto) {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(texto).digest('hex');
}

module.exports = {
  enviarEventoInicioCheckout,
  enviarEventoPagamentoConfirmado,
};
