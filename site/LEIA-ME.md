# Corrente do Bem — guia da página

Página de campanha de doações para o **Osvaldo**, feita para celular.

## Como o visitante percorre a página

```
Abre o site
   ↓
Foto do Osvaldo + família ocupando a tela toda
   ↓   (3 segundos)
██ POP-UP ██  Passo 1 → escolhe o valor (R$ 50 a R$ 500)
              Passo 2 → nome e WhatsApp
              Passo 3 → QR Code + chave PIX
   ↓
Quem fecha o pop-up continua lendo a história,
e uma barra fixa no rodapé traz o botão "Doar agora" de volta.
```

## Estrutura da pasta

```
correntedobem/
├── index.html          ← textos, fotos, PIX
├── css/estilo.css      ← aparência e cores
├── js/campanha.js      ← CONFIG, cronômetro, pop-up, leads
├── imagens/            ← coloque as fotos aqui
└── LEIA-ME.md          ← este guia
```

---

## 1. Números e textos curtos — `js/campanha.js`

Tudo que muda com frequência está no bloco `CONFIG`, no topo:

| Campo | O que faz |
|---|---|
| `nome` | Nome do destinatário. Já está em `"Osvaldo"`. |
| `meta` | Valor total. Já está em `100000`. |
| `arrecadado` | **Atualize à mão** conforme as doações entram. |
| `doadores` | Quantas pessoas já doaram. |
| `inicioCampanha` | Data/hora de início. O cronômetro conta 30 dias daí. |
| `segundosAteModal` | Segundos até o pop-up abrir sozinho. Está em `3`. |
| `mostrarUmaVezSo` | `false` enquanto testa (senão o pop-up não volta). Mude para `true` ao publicar, para não incomodar quem volta ao site. |
| `valorMinimo`/`valorMaximo`/`passo` | R$ 50 a R$ 500, de 50 em 50. |
| `valorSugerido` | Botão pré-selecionado (hoje: 100). |
| `etiquetas` | Selo em alguns valores ("mais comum", "padrinho"). |
| `impacto` | Frase para cada faixa de valor — **ajuste para a realidade do Osvaldo**. |
| `whatsapp` | **Seu número com DDI e DDD, só números**: `5511999998888`. |
| `textoCompartilhar` | Texto do botão Compartilhar. |

---

## 2. Textos longos — `index.html`

Procure por `[COLCHETES]` e pelos comentários `<!-- TROCAR -->`:

- **Abertura**: título e uma frase de impacto (2 linhas).
- **A história**: 4 parágrafos sobre o Osvaldo.
- **Para onde vai cada real**: 4 itens com valores.
- **Galeria**: legendas e descrições (`alt`) das fotos.
- **PIX**: chave e nome do titular — nos dois lugares.
- **Transparência**: uma entrada por novidade.
- **Rodapé**: organizador e contato.

---

## 3. Fotos — pasta `imagens/`

| Arquivo | Onde aparece | Formato ideal |
|---|---|---|
| `capa.jpg` | Tela de abertura | **Vertical ou quadrada** (o celular é vertical) |
| `foto1.jpg` … `foto4.jpg` | Carrossel | 4:5 vertical, 1000×1250 |
| `qrcode-pix.png` | Passo 3 do pop-up | Quadrado |

A foto de capa é a mais importante: é ela que faz a pessoa parar de rolar.
Use uma em que o rosto do Osvaldo apareça bem.

Enquanto um arquivo não existe, aparece um espaço reservado — dá para ir
preenchendo aos poucos. Comprima as fotos (squoosh.app) antes de subir.

---

## 4. ⚠ Receber os contatos captados

**Hoje os contatos NÃO chegam até você.** Eles ficam salvos no navegador de
quem doou, o que serve só para teste. Para ver os que estão no seu navegador,
aperte F12 e digite no Console:

```js
JSON.parse(localStorage.correntedobem_leads)
```

### Para receber de verdade — escolha uma opção

**Formspree** (mais simples, grátis até 50/mês)
1. Crie conta em formspree.io e um formulário novo
2. Copie a URL que aparece (`https://formspree.io/f/XXXXXX`)
3. Em `js/campanha.js`, procure `PARA RECEBER OS CONTATOS`
4. Descomente as 5 linhas do `fetch` e troque a URL
5. Os contatos chegam no seu e-mail

**Google Forms** (grátis, ilimitado, vai para uma planilha)
1. Crie um formulário com os campos Nome, Telefone e Valor
2. Pegue o link de resposta pré-preenchida para descobrir os IDs dos campos
3. Me peça para configurar — esse é mais trabalhoso

**Só WhatsApp** (zero configuração)
Já funciona: no passo 3 há um botão que abre sua conversa com a mensagem
pronta. Você perde quem não clica, mas não depende de nada externo.

---

## 5. Cores

Nas primeiras linhas de `css/estilo.css` (`:root`):

- `--cor-principal` — terracota: botões e destaques
- `--cor-acento` — verde: barra de progresso
- `--fundo` — creme

---

## 6. Antes de publicar

- [ ] História do Osvaldo escrita
- [ ] Chave PIX e titular **conferidos duas vezes**
- [ ] `CONFIG.whatsapp` com o número real
- [ ] `CONFIG.inicioCampanha` com a data de lançamento
- [ ] `CONFIG.mostrarUmaVezSo` mudado para `true`
- [ ] Foto de capa vertical, com o rosto do Osvaldo
- [ ] Destino dos contatos configurado (item 4)
- [ ] **Testado num celular de verdade**, não só no computador
- [ ] `og:image` apontando para uma foto boa — é a miniatura no WhatsApp

### Onde hospedar

Arquivos estáticos, funcionam em qualquer lugar. Grátis:
**Netlify Drop** (netlify.com/drop — arrasta a pasta e sai o link),
**Cloudflare Pages**, **Vercel** ou **GitHub Pages**.

---

## Observações honestas

**O site não processa pagamentos.** A doação acontece pelo PIX, fora da página.
O valor escolhido orienta a pessoa, mas ela digita esse valor no app do banco.
Para cobrança automática e total atualizando sozinho, seria preciso Mercado
Pago/Pagar.me ou um site tipo Vakinha (cobram taxa, mas trazem rastreamento).

**O total é atualizado à mão** no `CONFIG`. Numa campanha de 30 dias, atualizar
uma vez por dia funciona bem e mostra movimento — o que estimula novas doações.

**Sobre o pop-up aos 3 segundos:** ele captura mais contatos, mas parte das
pessoas fecha sem ler a história. Se a conversão vier baixa nos primeiros dias,
experimente aumentar `segundosAteModal` para 15 ou 20 — assim a pessoa chega
no pop-up já sabendo quem é o Osvaldo. Vale testar os dois.

**Transparência é o que mais converte** numa campanha familiar. Comprovantes,
fotos do dinheiro sendo usado e atualizações frequentes valem mais do que
qualquer efeito visual.
