/* ==========================================================
   CORRENTE DO BEM — WEBHOOK ZUCKPAY

   Processa pagamentos ZuckPay e registra doações
   ========================================================== */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');

// Importar serviços
const { processarDoacaoZuckPay, gerarPix, consultarStatusPix } = require('./services/zuckpay');
const { registrarEmGoogleSheets } = require('./services/google-sheets');
const { enviarEmailConfirmacao } = require('./services/email');
const { enviarEventoInicioCheckout, enviarEventoPagamentoConfirmado } = require('./services/tiktok');

const app = express();
const PORT = process.env.PORT || 3000;

// ============ MIDDLEWARE ============

// CORS restrito: só o site da campanha pode chamar as rotas públicas
// (ajuste SITE_URL no .env para o domínio real quando publicar)
const origensPermitidas = (process.env.SITE_URL || '').split(',').filter(Boolean);
app.use(cors({
  origin: origensPermitidas.length > 0 ? origensPermitidas : true
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// ============ ROTAS ============

/**
 * Raiz — confirma que o serviço está no ar
 */
app.get('/', (req, res) => {
  res.json({
    service: 'Corrente do Bem — Webhook ZuckPay',
    status: 'online',
    endpoints: ['/health', '/pix/gerar', '/pix/status', '/webhook/zuckpay', '/status', '/doacoes']
  });
});

/**
 * Health Check
 */
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

/**
 * GERAR PIX
 * POST /pix/gerar
 *
 * Chamado pelo site (frontend) para gerar um QR Code PIX.
 * As credenciais ZuckPay ficam só aqui no servidor, nunca no navegador.
 * Body: { nome, cpf, email, telefone, valor }
 */
app.post('/pix/gerar', async (req, res) => {
  try {
    const { nome, cpf, email, telefone, valor } = req.body;

    if (!nome || !email || !valor || Number(valor) <= 0) {
      return res.status(400).json({ success: false, error: 'Dados inválidos' });
    }

    const resultado = await gerarPix({ nome, cpf, email, telefone, valor });

    if (!resultado.success) {
      return res.status(502).json(resultado);
    }

    // Dispara o evento de início de checkout pro TikTok (não bloqueia a resposta ao usuário)
    enviarEventoInicioCheckout({
      email,
      telefone,
      valor,
      transactionId: resultado.transactionId,
      ip: req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
    }).catch(() => {});

    res.json(resultado);
  } catch (erro) {
    console.error('❌ Erro em /pix/gerar:', erro.message);
    res.status(500).json({ success: false, error: 'Erro interno' });
  }
});

/**
 * CONSULTAR STATUS DO PIX
 * GET /pix/status?transactionId=...
 *
 * Chamado pelo site para saber se o PIX já foi pago
 * (enquanto espera o webhook, ou como fallback).
 */
app.get('/pix/status', async (req, res) => {
  try {
    const { transactionId } = req.query;

    if (!transactionId) {
      return res.status(400).json({ success: false, error: 'transactionId é obrigatório' });
    }

    const resultado = await consultarStatusPix(transactionId);
    res.json(resultado);
  } catch (erro) {
    console.error('❌ Erro em /pix/status:', erro.message);
    res.status(500).json({ success: false, error: 'Erro interno' });
  }
});

/**
 * WEBHOOK ZuckPay
 * POST /webhook/zuckpay
 *
 * Recebe notificações de pagamento da ZuckPay
 */
app.post('/webhook/zuckpay', async (req, res) => {
  try {
    const payload = req.body;

    console.log('📨 Webhook recebido:', {
      event: payload.event,
      transactionId: payload.transaction?.id,
      status: payload.transaction?.status,
      amount: payload.transaction?.amount
    });

    // ✅ Validar assinatura (opcional, mas recomendado)
    // const signatureHeader = req.headers['x-zuckpay-signature'];
    // if (!validarAssinatura(signatureHeader, payload)) {
    //   console.error('❌ Assinatura inválida');
    //   return res.status(401).json({ error: 'Unauthorized' });
    // }

    // ============ PROCESSAR EVENTO ============

    switch (payload.event) {
      case 'payment_approved':
      case 'payment_confirmed':
        await processarPagamentoAprovado(payload);
        break;

      case 'payment_pending':
        await processarPagamentoPendente(payload);
        break;

      case 'payment_refused':
      case 'payment_failed':
        await processarPagamentoRecusado(payload);
        break;

      default:
        console.log('⚠️ Evento desconhecido:', payload.event);
    }

    // ✅ Responder OK imediatamente
    // (processa assincronamente para evitar timeout)
    res.status(200).json({ success: true, message: 'Webhook recebido' });

  } catch (erro) {
    console.error('❌ Erro ao processar webhook:', erro);
    // Mesmo com erro, retornar 200 para ZuckPay não reenviar
    res.status(200).json({ error: erro.message });
  }
});

/**
 * Status da Campanha
 * GET /status
 */
app.get('/status', async (req, res) => {
  try {
    // Buscar dados da planilha
    const dados = await obterStatusCampanha();
    res.json(dados);
  } catch (erro) {
    res.status(500).json({ error: erro.message });
  }
});

/**
 * Listar doações
 * GET /doacoes
 */
app.get('/doacoes', async (req, res) => {
  try {
    // Buscar doações da planilha
    const doacoes = await obterDoacoes();
    res.json(doacoes);
  } catch (erro) {
    res.status(500).json({ error: erro.message });
  }
});

// ============ FUNÇÕES ============

/**
 * Processa pagamento aprovado
 */
async function processarPagamentoAprovado(payload) {
  const transaction = payload.transaction;

  console.log('✅ Pagamento aprovado:', {
    id: transaction.id,
    valor: transaction.amount,
    doador: transaction.nome || transaction.email
  });

  // 1️⃣ Registrar em Google Sheets
  if (process.env.GOOGLE_SHEET_ID) {
    await registrarEmGoogleSheets({
      transactionId: transaction.id,
      nome: transaction.nome,
      email: transaction.email,
      documento: transaction.document,
      telefone: transaction.phone,
      valor: transaction.amount,
      metodo: transaction.payment_method,
      status: 'CONFIRMADO',
      dataConfirmacao: transaction.confirmed_date || new Date().toISOString()
    });
  }

  // 2️⃣ Enviar email de confirmação
  if (transaction.email) {
    await enviarEmailConfirmacao({
      nome: transaction.nome || 'Doador',
      email: transaction.email,
      valor: transaction.amount,
      transactionId: transaction.id,
      metodo: transaction.payment_method
    });
  }

  // 3️⃣ Avisar o TikTok que o pagamento foi confirmado de verdade
  await enviarEventoPagamentoConfirmado({
    email: transaction.email,
    telefone: transaction.phone,
    valor: transaction.amount,
    transactionId: transaction.id,
  }).catch(() => {});

  // 4️⃣ Atualizar site (opcional - via API)
  // await atualizarSite({
  //   valorArrecadado: transaction.amount,
  //   doadores: 1
  // });

  console.log('✨ Doação processada com sucesso!');
}

/**
 * Processa pagamento pendente
 */
async function processarPagamentoPendente(payload) {
  const transaction = payload.transaction;

  console.log('⏳ Pagamento pendente:', {
    id: transaction.id,
    valor: transaction.amount
  });

  // Registrar como pendente
  if (process.env.GOOGLE_SHEET_ID) {
    await registrarEmGoogleSheets({
      transactionId: transaction.id,
      nome: transaction.nome,
      email: transaction.email,
      valor: transaction.amount,
      status: 'PENDENTE',
      dataCriacao: new Date().toISOString()
    });
  }
}

/**
 * Processa pagamento recusado
 */
async function processarPagamentoRecusado(payload) {
  const transaction = payload.transaction;

  console.log('❌ Pagamento recusado:', {
    id: transaction.id,
    motivo: transaction.failure_reason
  });

  // Registrar como recusado
  if (process.env.GOOGLE_SHEET_ID) {
    await registrarEmGoogleSheets({
      transactionId: transaction.id,
      nome: transaction.nome,
      email: transaction.email,
      valor: transaction.amount,
      status: 'RECUSADO',
      motivo: transaction.failure_reason,
      dataCriacao: new Date().toISOString()
    });
  }
}

/**
 * Obtém status geral da campanha
 */
async function obterStatusCampanha() {
  // Implementar lógica de busca na planilha
  return {
    arrecadado: 0,
    doadores: 0,
    meta: 100000
  };
}

/**
 * Obtém lista de doações
 */
async function obterDoacoes() {
  // Implementar lógica de busca na planilha
  return [];
}

/**
 * Valida assinatura HMAC do webhook
 */
function validarAssinatura(signatureHeader, payload) {
  if (!signatureHeader || !process.env.WEBHOOK_SECRET) {
    return true; // Pular validação se não configurado
  }

  const partes = signatureHeader.split(',');
  const ts = partes[0]?.split('=')[1];
  const v1 = partes[1]?.split('=')[1];

  if (!ts || !v1) return false;

  // Anti-replay: timestamp não pode ser muito antigo (5 min)
  if (Math.abs(Date.now() - parseInt(ts) * 1000) > 300000) {
    return false;
  }

  // Validar HMAC
  const bodyStr = JSON.stringify(payload);
  const expected = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET)
    .update(`${ts}.${bodyStr}`)
    .digest('hex');

  return crypto.timingSafeEqual(v1, expected);
}

// ============ INICIALIZAR SERVIDOR ============

app.listen(PORT, () => {
  console.log(`\n${'='.repeat(50)}`);
  console.log('🚀 Webhook ZuckPay iniciado!');
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`💚 Corrente do Bem está pronto para receber doações`);
  console.log(`${'='.repeat(50)}\n`);
});

module.exports = app;
