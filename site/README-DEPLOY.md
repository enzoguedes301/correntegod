# 🚀 CORRENTE DO BEM — PRONTO PARA UPLOAD

## 📊 Resumo do Projeto

**Campanha solidária para reconstruir o carrinho do Seu Osvaldo**

- ✅ Design verde claro (Vakinha)
- ✅ Logo no cabeçalho
- ✅ 5 fotos na galeria
- ✅ Barra de progresso animada (R$ 2.237,50 de R$ 100.000)
- ✅ Modal com 3 passos para doação
- ✅ Responsivo (mobile + desktop)
- ✅ Transparência de gastos

---

## 📁 Estrutura do Projeto

```
correntedobem/
├── index.html              ← Página principal
├── css/
│   └── estilo.css          ← Estilos (verde)
├── js/
│   └── campanha.js         ← Funcionalidades
├── imagens/
│   ├── logo.png            ← Logo (verde)
│   ├── Abraço Solidário...  ← Fundo da abertura
│   ├── donate1.png         ← Marina (esposa)
│   ├── donate2.png         ← Filha
│   ├── donate4.png         ← Família
│   ├── Carrinho Destruído...← Prova visual
│   └── qrcode-pix.png      ← QR Code (TROCAR)
├── DEPLOY-CHECKLIST.md     ← Guia completo
├── DADOS-A-TROCAR.md       ← Dados fictícios
└── README-DEPLOY.md        ← Este arquivo
```

---

## 🔧 Configurações Finais (IMPORTANTE!)

### ANTES DE PUBLICAR, TROCAR:

1. **Dados pessoais** (vários lugares)
   - Nome completo
   - Email
   - WhatsApp/Telefone
   - CPF (opcional)

2. **Chave PIX** (js/campanha.js)
   - Configurar número correto

3. **QR Code** (imagens/qrcode-pix.png)
   - Substituir por seu QR Code real

4. **Sistema de leads** (js/campanha.js - linha 426)
   - Descomente e configure:
     - Google Forms
     - Formspree
     - Ou planilha própria

---

## 🌐 OPÇÕES DE UPLOAD

### 1️⃣ GITHUB PAGES (Recomendado - Gratuito)
```bash
git init
git add .
git commit -m "Corrente do Bem"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/correntedobem.git
git push -u origin main
```
**URL:** `https://seu_usuario.github.io/correntedobem`

### 2️⃣ VERCEL (Rápido - Gratuito)
```bash
npm i -g vercel
vercel
```
**URL:** `https://correntedobem.vercel.app`

### 3️⃣ NETLIFY (Fácil - Gratuito)
- Ir em netlify.com
- Fazer drag & drop da pasta
**URL:** `https://correntedobem.netlify.app`

### 4️⃣ HOSPEDAGEM TRADICIONAL (FTP)
- Bluehost, SiteGround, Hostinger
- Upload via FileZilla ou cPanel

---

## ✅ TESTE ANTES DE PUBLICAR

```bash
# Iniciar servidor local
python -m http.server 8000

# Acessar
http://localhost:8000
```

Verificar:
- [ ] Página carrega
- [ ] Logo aparece
- [ ] Animação da barra funciona
- [ ] Modal abre
- [ ] Botão "Quero Ajudar" funciona
- [ ] Responsivo no celular (F12)

---

## 📱 COMO COMPARTILHAR

Depois de publicar, compartilhar o link em:

- **WhatsApp** — Copiar e colar link
- **Instagram** — Print + link na bio
- **Facebook** — Compartilhar link direto
- **Telegram** — Copiar link
- **Email** — Enviar link para contatos

---

## 💰 DEPOIS DE PUBLICAR

### Atualizar progresso:
1. Receber doação no PIX
2. Registrar valor em `js/campanha.js` (linha 18):
   ```javascript
   arrecadado: 2237.50,  // ← Atualizar aqui
   doadores: 38,         // ← E aqui
   ```
3. Fazer deploy novamente

### Adicionar atualizações:
Na seção "Transparência", adicionar comprovantes de gastos

---

## 🆘 PROBLEMAS COMUNS

**Logo não aparece?**
- Verificar se arquivo está em `imagens/logo.png`
- Limpar cache (Ctrl+Shift+Delete)

**Modal não abre?**
- Verificar console (F12)
- Testar em navegador diferente

**PIX não copia?**
- Verificar chave em `js/campanha.js`
- Adicionar QR Code real

**Fotos não carregam?**
- Verificar se estão em `imagens/`
- Nomes exactos (atenção à acentuação)

---

## 📞 CONTATO & SUPORTE

Arquivo de instruções completo: **DEPLOY-CHECKLIST.md**
Dados a trocar: **DADOS-A-TROCAR.md**

---

## 🎉 VOCÊ ESTÁ PRONTO!

O site está 100% funcional e pronto para publicar.

**Próximo passo:** Escolha uma opção de upload acima e publique! 🚀

---

**Boa sorte com a Corrente do Bem! 💚**
