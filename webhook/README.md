# 💚 Corrente do Bem — Webhook ZuckPay

Webhook em Node.js para processar pagamentos ZuckPay e registrar doações em tempo real.

## 🚀 Setup Rápido

### 1. Clone o repositório
```bash
git clone https://github.com/correntegod/correntedobem-webhook.git
cd correntedobem-webhook
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure variáveis de ambiente
```bash
cp .env.example .env
```

Edite `.env` com suas credenciais:
```env
ZUCKPAY_CLIENT_ID=JJ_9647038311
ZUCKPAY_CLIENT_SECRET=seu_secret_aqui
GOOGLE_SHEET_ID=seu_sheet_id
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_app
```

### 4. Inicie o servidor
```bash
npm start
```

Ou em desenvolvimento:
```bash
npm run dev
```

---

## 📋 Variáveis de Ambiente

| Variável | Descrição | Obrigatório |
|----------|-----------|-------------|
| `ZUCKPAY_CLIENT_ID` | ID do cliente ZuckPay | ✅ |
| `ZUCKPAY_CLIENT_SECRET` | Secret do cliente ZuckPay | ✅ |
| `PORT` | Porta do servidor (padrão: 3000) | ❌ |
| `GOOGLE_SHEET_ID` | ID da planilha Google | ❌ |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Email da conta de serviço | ❌ |
| `GOOGLE_PRIVATE_KEY` | Chave privada da conta de serviço | ❌ |
| `SMTP_HOST` | Host SMTP (padrão: smtp.gmail.com) | ❌ |
| `SMTP_USER` | Email para enviar | ❌ |
| `SMTP_PASS` | Senha de app do email | ❌ |
| `SITE_URL` | URL do site (para emails) | ❌ |

---

## 🔗 Endpoints

### GET `/health`
Verifica se o servidor está ativo.

```bash
curl http://localhost:3000/health
```

### POST `/webhook/zuckpay`
Recebe notificações de pagamento da ZuckPay.

**Headers:**
```
Content-Type: application/json
X-ZuckPay-Signature: (opcional)
```

**Body:**
```json
{
  "event": "payment_approved",
  "transaction": {
    "id": "abc123",
    "status": "PAID",
    "amount": 50.00,
    "nome": "João",
    "email": "joao@email.com",
    "payment_method": "pix",
    "confirmed_date": "2026-11-16T10:00:00"
  }
}
```

### GET `/status`
Retorna status geral da campanha.

```bash
curl http://localhost:3000/status
```

**Resposta:**
```json
{
  "arrecadado": 2250.00,
  "doadores": 38,
  "meta": 100000,
  "percentual": "2.25"
}
```

### GET `/doacoes`
Lista todas as doações confirmadas.

```bash
curl http://localhost:3000/doacoes
```

---

## 🔧 Configurar ZuckPay

### 1. Adicionar Webhook URL

No painel ZuckPay:
1. Vá em **Integrações → Webhooks**
2. Clique em **Adicionar Webhook**
3. Configure:
   - **URL:** `https://seu-dominio.com/webhook/zuckpay`
   - **Eventos:** `payment_approved`, `payment_pending`, `payment_refused`

### 2. Gerar Secret (opcional)

Se quiser validar assinatura HMAC:
1. Em **Credenciais API**, gere um Webhook Secret
2. Adicione ao `.env`: `WEBHOOK_SECRET=seu_secret`

---

## 📊 Google Sheets Integration

### 1. Criar Conta de Serviço

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto
3. Vá em **Credenciais** → **Criar Credencial** → **Conta de Serviço**
4. Copie o **email** e a **chave privada** (em JSON)

### 2. Compartilhar Planilha

1. Crie uma planilha no Google Sheets
2. Copie o **ID** da URL: `https://docs.google.com/spreadsheets/d/SHEET_ID/`
3. Compartilhe com o email da conta de serviço (permissão de editor)

### 3. Adicionar ao `.env`

```env
GOOGLE_SHEET_ID=seu_sheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=seu-email@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
```

---

## 📧 Email de Confirmação

### Configurar Gmail

1. Ative **2FA** na sua conta Google
2. Vá em [Senhas de Aplicativos](https://myaccount.google.com/apppasswords)
3. Gere uma senha para "Mail"
4. Adicione ao `.env`:

```env
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_de_app
SMTP_FROM=noreply@correntedobem.com.br
```

---

## 🚀 Deploy

### Vercel (Recomendado)

```bash
npm i -g vercel
vercel login
vercel --prod
```

Configure variáveis de ambiente no painel Vercel.

### Railway

```bash
railway login
railway init
railway up
```

### Heroku

```bash
heroku login
heroku create seu-app-name
git push heroku main
heroku config:set ZUCKPAY_CLIENT_ID=...
```

---

## 🧪 Testar Webhook

```bash
curl -X POST http://localhost:3000/webhook/zuckpay \
  -H "Content-Type: application/json" \
  -d '{
    "event": "payment_approved",
    "transaction": {
      "id": "test-123",
      "status": "PAID",
      "amount": 50.00,
      "nome": "Teste",
      "email": "teste@example.com",
      "payment_method": "pix",
      "confirmed_date": "2026-11-16T10:00:00"
    }
  }'
```

---

## 📝 Logs

O servidor loga eventos importantes:

```
✅ Pagamento aprovado: abc123
✉️ Email enviado para: joao@email.com
📊 Doação registrada em Google Sheets: abc123
```

---

## ❓ FAQ

**P: Posso testar localmente?**
R: Sim! Use ngrok para expor seu localhost:
```bash
ngrok http 3000
# Adicione a URL em ZuckPay → Webhooks
```

**P: E se o webhook falhar?**
R: ZuckPay tenta reenviar em intervalos crescentes (até 5 vezes).

**P: Como validar assinatura do webhook?**
R: Descomente a função `validarAssinatura()` em `index.js`.

---

## 📞 Suporte

- [Documentação ZuckPay](https://www.zuckpay.com.br)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Node.js Express](https://expressjs.com)

---

**Feito com 💚 para a Corrente do Bem**
