# 💳 INTEGRAÇÃO ZUCKPAY — Guia de Setup

## 🔑 Passo 1: Gerar Credenciais ZuckPay

1. Acesse: **https://www.zuckpay.com.br**
2. Faça login em sua conta
3. Vá em **Menu → Desenvolvedores → Credenciais API**
4. Clique em **Gerar Nova Credencial**
5. Copie:
   - **Client ID**
   - **Client Secret** (⚠️ guarde com segurança!)

---

## 📝 Passo 2: Configurar no Projeto

Abra `js/zuckpay-config.js` e substitua:

```javascript
const ZUCKPAY_CONFIG = {
  clientId: 'SEU_CLIENT_ID_AQUI',
  clientSecret: 'SEU_CLIENT_SECRET_AQUI',
  webhookUrl: 'https://seu-dominio.com/webhook/zuckpay',
  // ... resto da config
};
```

**Importante:** Nunca compartilhe ou commite o `Client Secret` no git!

---

## 🌐 Passo 3: Configurar Webhook

A ZuckPay vai mandar confirmações de pagamento para sua URL. Configure em:

**Painel ZuckPay → Integrações → Webhooks**

1. **URL:** `https://seu-dominio.com/webhook/zuckpay`
2. **Eventos:** Marque:
   - ✅ `payment_approved`
   - ✅ `payment_pending`
   - ✅ `payment_refused`

---

## 💰 Passo 4: Habilitar Métodos de Pagamento

No painel ZuckPay, ative os métodos que você quer usar:

- ✅ **PIX** (instantâneo, sem taxas)
- ✅ **Cartão de Crédito** (Visa, Mastercard, Amex)
- ✅ **PayPal** (internacional)
- ✅ **SPEI** (México)
- ✅ **COP/NEQUI** (Colômbia)

---

## 🧪 Passo 5: Testar Localmente

```bash
# Iniciar servidor local
python -m http.server 8000

# Acessar
http://localhost:8000
```

**Testar PIX:**
```javascript
// No console do navegador (F12)
const resultado = await ZuckPayAPI.gerarPix({
  nome: 'Teste',
  cpf: '12345678901',
  email: 'teste@test.com',
  telefone: '11999999999',
  valor: 50
});
console.log(resultado);
```

---

## 📱 Passo 6: Integrar no Modal de Doação

Edite `js/campanha.js` e adicione ao **Passo 3** (tela do PIX):

```javascript
// Depois de salvar o lead, gerar PIX na ZuckPay
const pixResponse = await ZuckPayAPI.gerarPix({
  nome: lead.nome,
  cpf: lead.telefone.replace(/\D/g, '').slice(0, 11), // usar algo único
  email: lead.email,
  telefone: lead.telefone,
  valor: valorEscolhido
});

if (pixResponse.success) {
  // Exibir QR Code
  $('pix-qr').innerHTML = `<img src="${pixResponse.qrcodeImage}" alt="QR Code PIX">`;
  
  // Exibir código copia-e-cola
  $('pix-chave').textContent = pixResponse.qrcode;
}
```

---

## 🔐 Segurança — IMPORTANTE!

### ⚠️ Nunca faça isso:

```javascript
❌ // NÃO coloque credenciais no navegador!
const clientSecret = 'sk_live_xxx';

❌ // NÃO commite .env com credenciais
// git add .env
```

### ✅ Sempre faça isso:

```javascript
✅ // Coloque credenciais em variáveis de ambiente
process.env.ZUCKPAY_CLIENT_ID
process.env.ZUCKPAY_CLIENT_SECRET

✅ // Chame a API do seu SERVIDOR, não do navegador
// client-side → seu-servidor → ZuckPay API
```

---

## 📊 Receber Confirmações de Pagamento

A ZuckPay vai fazer um POST para sua webhook URL:

```json
{
  "event": "payment_approved",
  "transaction": {
    "id": "abc123",
    "status": "PAID",
    "amount": 50.00,
    "external_id": "DOACAO-123456"
  }
}
```

**Seu servidor deve:**
1. ✅ Retornar `200 OK` imediatamente
2. ✅ Processar a confirmação de forma assíncrona
3. ✅ Atualizar o banco de dados
4. ✅ Enviar email de confirmação ao doador

---

## 🚀 Próximos Passos

1. ✅ Gerar credenciais
2. ✅ Configurar webhook
3. ✅ Testar localmente
4. ✅ Preparar seu servidor para receber webhooks
5. ✅ Publicar o site
6. ✅ Monitorar transações no painel ZuckPay

---

## 💡 Dicas

**PIX:**
- ✅ Sem taxas no recebimento
- ✅ Instantâneo (segundos)
- ✅ Recomendado para campanhas sociais

**Cartão:**
- 💳 Aceita múltiplas parcelas
- 📊 Taxas maiores (consulte ZuckPay)
- 🌍 Funciona internacionalmente

**PayPal:**
- 🌐 25 moedas suportadas
- 🔒 Seguro (tokenização)
- 📈 Popular no exterior

---

**Pronto? Comece em [ZuckPay → Desenvolvedores → Credenciais API](https://www.zuckpay.com.br)** 🚀
