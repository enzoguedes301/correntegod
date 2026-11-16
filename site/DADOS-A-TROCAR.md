# ⚠️ DADOS A TROCAR ANTES DE PUBLICAR

## 🔴 DADOS FICTÍCIOS (ATUALMENTE NO SITE)

```
Nome: Marina Silva Santos
Email: contato@correntedobem.com.br
WhatsApp: (11) 98765-4321
CPF: 123.456.789-00
Chave PIX: (11) 98765-4321
```

---

## 📝 LOCAIS ONDE ESTÃO (Para trocar)

### 1. **Rodapé (index.html - linha ~265)**
```html
<footer class="rodape">
  <p><strong>Corrente do Bem</strong> · Organizada por <strong>Marina Silva Santos</strong></p>
  <p><strong>Email:</strong> contato@correntedobem.com.br · <strong>WhatsApp:</strong> (11) 98765-4321</p>
  <p style="font-size: 0.8rem; margin-top: 12px; color: rgba(255, 255, 255, .5);">CPF: 123.456.789-00 · Chave PIX: (11) 98765-4321</p>
</footer>
```

### 2. **Aviso de Identidade (index.html - linha ~130)**
```html
<aside class="aviso-nome">
  <strong>Sobre o nome:</strong> por segurança da família, preservamos o nome
  verdadeiro e usamos "Seu Osvaldo" nesta página. A campanha é organizada por
  <strong>Marina Silva Santos</strong>, que responde pela chave PIX...
</aside>
```

### 3. **Configuração de WhatsApp (js/campanha.js - linha ~60)**
```javascript
whatsapp: "5500000000000",  // ← TROCAR para seu número com DDI
```

Formato: `55 + DDD + número` (sem hífens ou parênteses)
Exemplo: `5511987654321`

### 4. **Chave PIX (index.html - linha ~375)**
```html
<code id="pix-chave">[SUA CHAVE PIX AQUI]</code>
```

### 5. **QR Code do PIX (imagens/qrcode-pix.png)**
- Substituir o arquivo com seu QR Code real
- Gerar em: https://www.bcb.gov.br/pix

---

## ✅ PASSO A PASSO

1. **Abrir** `index.html` num editor de texto
2. **Ctrl+H** (Find & Replace)
3. Trocar:
   - `Marina Silva Santos` → Seu nome real
   - `contato@correntedobem.com.br` → Seu email
   - `(11) 98765-4321` → Seu WhatsApp
   - `123.456.789-00` → Seu CPF (ou deixar em branco)

4. **Abrir** `js/campanha.js`
5. Linha 60: Trocar `whatsapp: "5500000000000"`

6. **Adicionar** QR Code real em `imagens/qrcode-pix.png`

---

## 🔗 TESTE LOCAL ANTES

```bash
# Abrir servidor local
python -m http.server 8000

# Acessar em http://localhost:8000
```

Testar:
- [ ] Modal abre
- [ ] Valores aparecem
- [ ] Link WhatsApp funciona
- [ ] Botão copiar PIX funciona

---

**Quando terminar, só fazer o upload! 🚀**
