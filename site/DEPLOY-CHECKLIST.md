# ✅ CHECKLIST PARA UPLOAD — Corrente do Bem

## 📋 Status do Projeto

### ✅ Estrutura Pronta
- [x] `index.html` — página principal
- [x] `css/estilo.css` — estilos (verde Vakinha)
- [x] `js/campanha.js` — funcionalidades
- [x] `imagens/` — todas as fotos carregadas

### ✅ Conteúdo Configurado
- [x] Logo verde no cabeçalho
- [x] Texto: "Ser Cristão de Verdade é ajudar quem precisa"
- [x] Foto de Osvaldo como fundo (Abraço Solidário)
- [x] 5 fotos na galeria
- [x] Valor arrecadado: R$ 2.237,50
- [x] Doadores: 38 pessoas
- [x] Boletim: nº 452/2026

### ✅ Dados Fictícios (TROQUE ANTES DE PUBLICAR)
- Nome: Marina Silva Santos
- Email: contato@correntedobem.com.br
- WhatsApp: (11) 98765-4321
- CPF: 123.456.789-00
- Chave PIX: (11) 98765-4321

### ✅ Design e UX
- [x] Paleta verde claro (Vakinha)
- [x] Fontes: Poppins (títulos) + Inter (texto)
- [x] Barra de progresso animada
- [x] Botões: "Quero Ajudar" + "Contribuir com Osvaldo outro dia"
- [x] Modal com 3 passos (valor, dados, PIX)
- [x] Barra fixa flutuante
- [x] Responsivo (mobile + desktop)

---

## 🚀 COMO FAZER O UPLOAD

### Opção 1: GitHub Pages (GRATUITO)
```bash
# 1. Criar repositório no GitHub
# 2. Fazer push do projeto
git init
git add .
git commit -m "Corrente do Bem - campanha solidária"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/correntedobem.git
git push -u origin main

# 3. Ir em Settings > Pages > Source: main
# Seu site estará em: https://seu_usuario.github.io/correntedobem
```

### Opção 2: Vercel (GRATUITO + RÁPIDO)
```bash
# 1. Instalar Vercel
npm i -g vercel

# 2. Deploy
vercel

# Seu site estará em: https://correntedobem.vercel.app
```

### Opção 3: Netlify (GRATUITO)
```bash
# 1. Ir em netlify.com
# 2. Drag & drop da pasta "correntedobem"
# Seu site estará em: https://correntedobem.netlify.app
```

### Opção 4: Hospedagem Paga
- Bluehost, SiteGround, Hostinger
- Upload via FTP/SFTP

---

## ⚠️ ANTES DE PUBLICAR

### TROCAR DADOS REAIS:
1. [ ] Nome completo do organizador
2. [ ] Email real
3. [ ] Telefone/WhatsApp real
4. [ ] Chave PIX real
5. [ ] Descrição real do caso

### CONFIGURAR RECEBIMENTO DE LEADS:
No `js/campanha.js`, linha ~426, descomente e configure:
- Google Forms
- Formspree
- Ou planilha própria

### TESTAR:
- [ ] Abrir no navegador (desktop)
- [ ] Abrir no celular
- [ ] Testar modal de doação
- [ ] Testar compartilhamento
- [ ] Testar cópia de PIX

---

## 📱 COMPARTILHAMENTO

### URLs Padrão
- **WhatsApp:** Copiar link da página
- **Telegram:** Copiar link da página
- **Email:** Copiar link da página
- **Instagram Story:** Print da página + link na bio

---

## 💰 RECEBER DOAÇÕES

### PIX
- Chave cadastrada no sistema do banco
- QR Code em `imagens/qrcode-pix.png`
- Atualizar em `js/campanha.js` → CONFIG.whatsapp

### Transparência
- Atualizar seção "Transparência" com cada doação recebida
- Fotografar comprovantes
- Publicar atualizações

---

## 📞 SUPORTE

**Precisa de ajuda?**
- Verificar console do navegador (F12)
- Ver localStorage: `JSON.parse(localStorage.correntedobem_leads)`
- Contatar desenvolvedor

---

**Boa sorte! 🚀💚**
