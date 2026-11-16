/* ==========================================================
   EMAIL — Enviar confirmação de doação
   ========================================================== */

const nodemailer = require('nodemailer');

// Configurar transportador SMTP
let transporter;

if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

/**
 * Envia email de confirmação de doação
 */
async function enviarEmailConfirmacao(dados) {
  try {
    if (!transporter) {
      console.log('⚠️ SMTP não configurado - pulando email');
      return;
    }

    const { nome, email, valor, transactionId, metodo } = dados;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #16a34a, #22c55e); padding: 20px; color: white; text-align: center; border-radius: 8px;">
          <h1 style="margin: 0;">💚 Obrigado pela sua doação!</h1>
        </div>

        <div style="padding: 30px; background: #f8fdf5;">
          <p>Olá <strong>${nome}</strong>,</p>

          <p>Recebemos sua doação de <strong>R$ ${valor.toFixed(2)}</strong> para a Corrente do Bem!</p>

          <div style="background: white; border-left: 4px solid #16a34a; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0;"><strong>Dados da Transação</strong></p>
            <p style="margin: 5px 0; color: #666;">ID: ${transactionId}</p>
            <p style="margin: 5px 0; color: #666;">Método: ${metodo.toUpperCase()}</p>
          </div>

          <p>Sua doação vai ajudar o Seu Osvaldo a reconstruir o carrinho e voltar a trabalhar com dignidade.</p>

          <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
            Você pode acompanhar o progresso da campanha em: <a href="${process.env.SITE_URL}" style="color: #16a34a; text-decoration: none;">${process.env.SITE_URL}</a>
          </p>

          <p style="margin-top: 30px; color: #666; font-size: 12px;">
            Ser Cristão de Verdade é ajudar quem precisa.<br>
            <strong>Corrente do Bem</strong>
          </p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: '✅ Sua doação foi confirmada - Corrente do Bem',
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    console.log('✉️ Email enviado para:', email);

  } catch (erro) {
    console.error('❌ Erro ao enviar email:', erro.message);
  }
}

module.exports = {
  enviarEmailConfirmacao
};
