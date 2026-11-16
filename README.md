# 💚 Corrente do Bem

Monorepo com os dois projetos da campanha solidária do Seu Osvaldo.

## Estrutura

```
correntegod/
├── site/      ← Site da campanha (HTML/CSS/JS estático)
└── webhook/   ← API Node.js/Express que processa pagamentos ZuckPay
```

## Deploy na Vercel

Cada pasta é um **projeto Vercel separado** (mesmo repositório GitHub, dois projetos).

### Site
1. Criar novo projeto na Vercel → importar este repositório
2. Em **Settings → General → Root Directory**, definir: `site`
3. Framework Preset: **Other** (é HTML estático)
4. Deploy

### Webhook
1. Criar outro novo projeto na Vercel → importar este mesmo repositório
2. Em **Settings → General → Root Directory**, definir: `webhook`
3. Configurar variáveis de ambiente (ver `webhook/README.md`)
4. Deploy

Depois de publicado o webhook, copie a URL gerada (ex: `https://correntegod-webhook.vercel.app`)
e atualize em `site/js/campanha.js` → `CONFIG.webhookUrl`.

## Documentação específica

- [`site/README-DEPLOY.md`](site/README-DEPLOY.md) — guia do site
- [`webhook/README.md`](webhook/README.md) — guia do webhook/API
