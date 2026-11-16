/* ==========================================================
   ZUCKPAY — Integração com API
   ========================================================== */

const axios = require('axios');

const API_BASE = 'https://www.zuckpay.com.br/conta/v3';

/**
 * Obtém Basic Auth da ZuckPay
 */
function getBasicAuth() {
  const credentials = `${process.env.ZUCKPAY_CLIENT_ID}:${process.env.ZUCKPAY_CLIENT_SECRET}`;
  return 'Basic ' + Buffer.from(credentials).toString('base64');
}

/**
 * Gera um QR Code PIX na ZuckPay
 */
async function gerarPix(dados) {
  try {
    const response = await axios.post(
      `${API_BASE}/pix/qrcode`,
      {
        nome: dados.nome,
        cpf: (dados.cpf || '').replace(/\D/g, ''),
        email: dados.email,
        telefone: (dados.telefone || '').replace(/\D/g, ''),
        valor: parseFloat(dados.valor),
        descricao: 'Doação - Corrente do Bem',
        urlnoty: process.env.WEBHOOK_URL,
        external_id_client: 'DOACAO-' + Date.now()
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getBasicAuth()
        }
      }
    );

    const pix = response.data;
    return {
      success: true,
      transactionId: pix.transactionId,
      qrcode: pix.qrcode || pix.pix_code,
      qrcodeImage: pix.qrcode_image,
      checkoutUrl: pix.checkout_url,
      amount: pix.amount
    };

  } catch (erro) {
    console.error('❌ Erro ao gerar PIX:', erro.response?.data || erro.message);
    return {
      success: false,
      error: erro.response?.data?.message || erro.message
    };
  }
}

/**
 * Consulta status de uma transação PIX
 */
async function consultarStatusPix(transactionId) {
  try {
    const response = await axios.get(
      `${API_BASE}/pix/status?transactionId=${transactionId}`,
      {
        headers: {
          'Authorization': getBasicAuth(),
          'Accept': 'application/json'
        }
      }
    );

    return {
      success: true,
      status: response.data.status,
      amount: response.data.amount,
      confirmedDate: response.data.confirmed_date
    };

  } catch (erro) {
    console.error('❌ Erro ao consultar PIX:', erro.message);
    return {
      success: false,
      error: erro.message
    };
  }
}

/**
 * Processa doação ZuckPay
 */
async function processarDoacaoZuckPay(payload) {
  try {
    const { transaction } = payload;

    // Validar dados
    if (!transaction || !transaction.id) {
      throw new Error('Dados de transação inválidos');
    }

    console.log('💳 Processando doação:', {
      transactionId: transaction.id,
      status: transaction.status,
      valor: transaction.amount,
      metodo: transaction.payment_method
    });

    return {
      success: true,
      transactionId: transaction.id
    };

  } catch (erro) {
    console.error('❌ Erro ao processar doação:', erro.message);
    return {
      success: false,
      error: erro.message
    };
  }
}

module.exports = {
  gerarPix,
  consultarStatusPix,
  processarDoacaoZuckPay
};
