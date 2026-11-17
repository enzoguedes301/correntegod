/* ==========================================================
   CORRENTE DO BEM — comportamento da página

   >>> TUDO QUE VOCÊ PRECISA EDITAR ESTÁ NO BLOCO "CONFIG" ABAIXO <<<
   ========================================================== */

const CONFIG = {

  // ----- NOME DO DESTINATÁRIO -----
  // Nome preservado por segurança da família (a página avisa isso).
  nome: "Seu Osvaldo",

  // ----- META DA CAMPANHA -----
  meta: 100000,                       // R$ 100.000

  // ----- QUANTO JÁ FOI ARRECADADO -----
  // Atualize este número à mão conforme as doações entram.
  arrecadado: 2237.50,
  doadores: 38,

  // ----- CRONÔMETRO DE 30 DIAS -----
  inicioCampanha: "2026-11-16T00:00:00",
  duracaoDias: 30,

  // ----- POP-UP -----
  // Segundos até o pop-up aparecer sozinho ao abrir o site.
  segundosAteModal: 3,

  // Se true, o pop-up só aparece uma vez por visitante (por 24h).
  // Deixe false enquanto estiver testando, senão ele não volta a abrir.
  mostrarUmaVezSo: false,

  // ----- VALORES DE DOAÇÃO -----
  valorMinimo: 50,
  valorMaximo: 500,
  passo: 50,
  valorSugerido: 100,                 // botão pré-selecionado

  etiquetas: {
    100: "mais comum",
    300: "padrinho",
  },

  // ----- O QUE CADA VALOR REPRESENTA -----
  // TROCAR: confira se os valores batem com a realidade antes de publicar.
  // Prometer o que o valor não cobre destrói a confiança da campanha.
  impacto: {
    50:  "Repõe o pão e as salsichas de um dia de venda.",
    100: "Ajuda a comprar a medicação da esposa.",
    150: "Paga o gás e os insumos da semana.",
    200: "Ajuda a quitar uma conta atrasada da casa.",
    250: "Compra a chapa nova do carrinho.",
    300: "Garante o estoque de uma semana inteira de trabalho.",
    400: "Ajuda no material do cursinho da filha.",
    500: "Financia boa parte da estrutura do carrinho novo.",
  },

  // ----- CONTATO -----
  // TROCAR: número do WhatsApp com DDI e DDD, só números. Ex.: 5511999998888
  whatsapp: "5500000000000",

  // ----- WEBHOOK (gera o PIX com segurança, sem expor credenciais no navegador) -----
  webhookUrl: "https://correntegod.vercel.app",

  // ----- TEXTO PARA COMPARTILHAR -----
  textoCompartilhar: "O Seu Osvaldo perdeu o carrinho de cachorro-quente que sustentava a família. Vamos ajudar ele a recomeçar — qualquer valor faz diferença.",
};

/* ==========================================================
   Daqui para baixo normalmente não é preciso mexer.
   ========================================================== */

const $ = (id) => document.getElementById(id);

const moeda = (v) => "R$ " + Math.round(v).toLocaleString("pt-BR");

/* ---------- Aviso flutuante ---------- */

let toastTimer;
function avisar(mensagem) {
  const el = $("toast");
  el.textContent = mensagem;
  el.hidden = false;
  requestAnimationFrame(() => el.classList.add("visivel"));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.classList.remove("visivel");
    setTimeout(() => { el.hidden = true; }, 300);
  }, 2800);
}

/* ==========================================================
   BARRA DE PROGRESSO
   ========================================================== */

function montarProgresso() {
  const { meta, arrecadado, doadores } = CONFIG;
  const pct = meta > 0 ? Math.min((arrecadado / meta) * 100, 100) : 0;
  const faltante = Math.max(meta - arrecadado, 0);

  $("valor-meta").textContent = moeda(meta);
  $("num-doadores").textContent = doadores.toLocaleString("pt-BR");
  $("valor-faltante").textContent = arrecadado >= meta ? "Meta atingida 🎉" : moeda(faltante);
  $("progresso-pct").textContent = Math.round(pct) + "%";
  $("barra-fixa-valor").textContent = moeda(arrecadado);
  $("barra-fixa-meta").textContent = "de " + moeda(meta);

  const barra = $("barra-preenchida");
  // Aguarda um pouco para que o usuário veja a barra preenchendo desde 0%
  setTimeout(() => {
    barra.style.width = pct + "%";
    barra.closest(".barra").setAttribute("aria-valuenow", Math.round(pct));
  }, 500);

  // Anima o número enquanto a barra está preenchendo
  animarNumero($("valor-arrecadado"), 0, arrecadado, 2200);
}

function animarNumero(el, de, para, duracao) {
  const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (para === de || semMovimento) { el.textContent = moeda(para); return; }

  const inicio = performance.now();
  function passo(agora) {
    const t = Math.min((agora - inicio) / duracao, 1);
    const suave = 1 - Math.pow(1 - t, 3);
    el.textContent = moeda(de + (para - de) * suave);
    if (t < 1) requestAnimationFrame(passo);
  }
  requestAnimationFrame(passo);
}

/* ==========================================================
   CRONÔMETRO DE 30 DIAS
   ========================================================== */

function montarCronometro() {
  const inicio = new Date(CONFIG.inicioCampanha);
  const fim = new Date(inicio.getTime() + CONFIG.duracaoDias * 86400000);

  const dd = $("cd-dias"), hh = $("cd-horas"), mm = $("cd-min"), ss = $("cd-seg");

  function tick() {
    const restante = fim.getTime() - Date.now();

    if (restante <= 0) {
      dd.textContent = hh.textContent = mm.textContent = ss.textContent = "00";
      $("cronometro").classList.add("encerrado");
      clearInterval(intervalo);
      return;
    }

    const seg = Math.floor(restante / 1000);
    dd.textContent = String(Math.floor(seg / 86400));
    hh.textContent = String(Math.floor((seg % 86400) / 3600)).padStart(2, "0");
    mm.textContent = String(Math.floor((seg % 3600) / 60)).padStart(2, "0");
    ss.textContent = String(seg % 60).padStart(2, "0");
  }

  tick();
  const intervalo = setInterval(tick, 1000);
}

/* ==========================================================
   VALORES DE DOAÇÃO
   Os botões existem em dois lugares (página e pop-up) e ficam
   sempre com o mesmo valor selecionado.
   ========================================================== */

let valorEscolhido = CONFIG.valorSugerido;

function criarBotoesValor(container) {
  const { valorMinimo, valorMaximo, passo, etiquetas } = CONFIG;

  for (let v = valorMinimo; v <= valorMaximo; v += passo) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "valor-opcao";
    botao.dataset.valor = String(v);
    botao.setAttribute("aria-pressed", "false");
    botao.innerHTML = etiquetas[v]
      ? `R$ ${v}<span class="sugestao">${etiquetas[v]}</span>`
      : `R$ ${v}`;

    botao.addEventListener("click", () => {
      escolherValor(v);
      $("valor-outro").value = "";
      $("valor-outro-modal").value = "";
    });

    container.appendChild(botao);
  }
}

function escolherValor(v) {
  valorEscolhido = v;

  document.querySelectorAll(".valor-opcao").forEach((b) => {
    const ativo = Number(b.dataset.valor) === v;
    b.classList.toggle("ativo", ativo);
    b.setAttribute("aria-pressed", String(ativo));
  });

  const texto = valorEscolhido > 0 ? moeda(valorEscolhido) : "—";
  $("resumo-valor").textContent = texto;
  $("modal-valor-eco").textContent = texto;
  $("modal-valor-eco2").textContent = texto;

  const impacto = textoImpacto(valorEscolhido);
  $("resumo-impacto").textContent = impacto;
  $("modal-impacto").textContent = impacto;
}

function textoImpacto(valor) {
  if (!valor || valor <= 0) return "";
  const patamares = Object.keys(CONFIG.impacto).map(Number).sort((a, b) => a - b);
  let texto = "";
  for (const p of patamares) if (valor >= p) texto = CONFIG.impacto[p];
  return texto;
}

function montarValores() {
  criarBotoesValor($("valores"));
  criarBotoesValor($("valores-modal"));

  // Campos de valor livre — os dois espelham um ao outro
  [["valor-outro", "valor-outro-modal"], ["valor-outro-modal", "valor-outro"]]
    .forEach(([origem, espelho]) => {
      $(origem).addEventListener("input", (e) => {
        const v = parseInt(e.target.value, 10);
        $(espelho).value = e.target.value;
        document.querySelectorAll(".valor-opcao").forEach((b) => {
          b.classList.remove("ativo");
          b.setAttribute("aria-pressed", "false");
        });
        valorEscolhido = Number.isFinite(v) && v > 0 ? v : 0;
        const texto = valorEscolhido > 0 ? moeda(valorEscolhido) : "—";
        $("resumo-valor").textContent = texto;
        $("modal-valor-eco").textContent = texto;
        $("modal-valor-eco2").textContent = texto;
        const impacto = textoImpacto(valorEscolhido);
        $("resumo-impacto").textContent = impacto;
        $("modal-impacto").textContent = impacto;
      });
    });

  escolherValor(valorEscolhido);
}

/* ==========================================================
   POP-UP DE DOAÇÃO — 3 passos
   ========================================================== */

const CHAVE_VISTO = "correntedobem_modal_visto";

function modalJaFoiVisto() {
  if (!CONFIG.mostrarUmaVezSo) return false;
  try {
    const quando = localStorage.getItem(CHAVE_VISTO);
    if (!quando) return false;
    return Date.now() - Number(quando) < 86400000;   // 24 horas
  } catch { return false; }
}

function marcarModalVisto() {
  try { localStorage.setItem(CHAVE_VISTO, String(Date.now())); } catch { /* modo anônimo */ }
}

function abrirModal(passo = 1) {
  const modal = $("modal");
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  irParaPasso(passo);
  marcarModalVisto();
}

function fecharModal() {
  $("modal").hidden = true;
  document.body.style.overflow = "";
  clearInterval(pixPollingTimer);
}

function irParaPasso(n) {
  document.querySelectorAll(".passo").forEach((el) => {
    el.hidden = Number(el.dataset.conteudo) !== n;
  });
  document.querySelectorAll(".passo-ponto").forEach((p) => {
    p.classList.toggle("ativo", Number(p.dataset.passo) <= n);
  });
  // Volta ao topo do pop-up a cada troca de passo
  const caixa = $("modal").querySelector(".modal-caixa");
  if (caixa) caixa.scrollTop = 0;
}

function montarModal() {
  // Abre sozinho após alguns segundos
  if (!modalJaFoiVisto()) {
    setTimeout(() => {
      // Não interrompe quem já está preenchendo algo
      if ($("modal").hidden && !document.querySelector("input:focus")) {
        abrirModal(1);
      }
    }, CONFIG.segundosAteModal * 1000);
  }

  $("modal-fechar").addEventListener("click", fecharModal);
  $("modal-fundo").addEventListener("click", fecharModal);
  $("btn-depois").addEventListener("click", fecharModal);
  $("btn-fechar3").addEventListener("click", fecharModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !$("modal").hidden) fecharModal();
  });

  // Passo 1 → 2
  $("btn-passo1").addEventListener("click", () => {
    if (valorEscolhido <= 0) {
      avisar("Escolha um valor para continuar.");
      return;
    }
    irParaPasso(2);
    setTimeout(() => $("lead-nome").focus(), 350);
  });

  $("btn-voltar2").addEventListener("click", () => irParaPasso(1));

  // Botões que abrem o pop-up
  $("btn-doar").addEventListener("click", () => {
    if (valorEscolhido <= 0) { avisar("Escolha um valor para continuar."); return; }
    abrirModal(2);
    setTimeout(() => $("lead-nome").focus(), 350);
  });

  $("btn-barra-fixa").addEventListener("click", () => abrirModal(1));

  // Botão "Contribuir outro dia"
  if ($("btn-depois-grande")) {
    $("btn-depois-grande").addEventListener("click", () => {
      avisar("Obrigado pelo interesse! Volte quando puder contribuir.");
    });
  }

  montarFormulario();
}

/* ==========================================================
   FORMULÁRIO — nome e telefone
   ========================================================== */

function montarFormulario() {
  const campoTelefone = $("lead-telefone");
  const campoCpf = $("lead-cpf");

  // Vai formatando o telefone enquanto a pessoa digita
  campoTelefone.addEventListener("input", (e) => {
    const n = e.target.value.replace(/\D/g, "").slice(0, 11);
    let saida = n;
    if (n.length > 10)      saida = `(${n.slice(0,2)}) ${n.slice(2,7)}-${n.slice(7)}`;
    else if (n.length > 6)  saida = `(${n.slice(0,2)}) ${n.slice(2,6)}-${n.slice(6)}`;
    else if (n.length > 2)  saida = `(${n.slice(0,2)}) ${n.slice(2)}`;
    else if (n.length > 0)  saida = `(${n}`;
    e.target.value = saida;
  });

  // Vai formatando o CPF enquanto a pessoa digita
  campoCpf.addEventListener("input", (e) => {
    const n = e.target.value.replace(/\D/g, "").slice(0, 11);
    let saida = n;
    if (n.length > 9)       saida = `${n.slice(0,3)}.${n.slice(3,6)}.${n.slice(6,9)}-${n.slice(9)}`;
    else if (n.length > 6)  saida = `${n.slice(0,3)}.${n.slice(3,6)}.${n.slice(6)}`;
    else if (n.length > 3)  saida = `${n.slice(0,3)}.${n.slice(3)}`;
    e.target.value = saida;
  });

  $("form-lead").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = $("lead-nome").value.trim();
    const telefone = campoTelefone.value.replace(/\D/g, "");
    const email = $("lead-email").value.trim();
    const cpf = campoCpf.value.replace(/\D/g, "");
    let valido = true;

    if (nome.length < 2) {
      mostrarErro("nome", "Por favor, digite seu nome.");
      valido = false;
    } else limparErro("nome");

    if (telefone.length < 10) {
      mostrarErro("telefone", "Digite um WhatsApp válido com DDD.");
      valido = false;
    } else limparErro("telefone");

    if (!email.includes("@")) {
      mostrarErro("email", "Digite um e-mail válido.");
      valido = false;
    } else limparErro("email");

    if (cpf.length !== 11) {
      mostrarErro("cpf", "Digite um CPF válido (11 dígitos).");
      valido = false;
    } else limparErro("cpf");

    if (!valido) return;

    const lead = {
      nome,
      telefone: campoTelefone.value,
      email,
      cpf,
      valor: valorEscolhido,
      anonimo: $("lead-anonimo").checked,
      data: new Date().toISOString(),
    };

    salvarLead(lead);

    // Primeiro nome, para a mensagem de agradecimento
    $("modal-nome-eco").textContent = nome.split(" ")[0];

    // Monta o link do WhatsApp já com a mensagem pronta
    const msg = encodeURIComponent(
      `Olá! Sou ${nome} e acabei de doar ${moeda(valorEscolhido)} para a campanha do ${CONFIG.nome}. Segue o comprovante.`
    );
    $("btn-whatsapp").href = `https://wa.me/${CONFIG.whatsapp}?text=${msg}`;

    irParaPasso(3);
    gerarPixReal({ nome, email, telefone, cpf, valor: valorEscolhido });
  });
}

/* ==========================================================
   GERAR PIX (via webhook — credenciais nunca ficam no navegador)
   ========================================================== */

let pixTransactionId = null;
let pixPollingTimer = null;

async function gerarPixReal(dados) {
  mostrarEstadoPix("carregando");

  try {
    const response = await fetch(CONFIG.webhookUrl + "/pix/gerar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    const resultado = await response.json();

    if (!response.ok || !resultado.success) {
      throw new Error(resultado.error || "Falha ao gerar PIX");
    }

    pixTransactionId = resultado.transactionId;

    if (resultado.qrcodeImage) {
      const imgQr = $("pix-qr-img");
      imgQr.onerror = () => $("pix-qr").classList.add("sem-qr");
      imgQr.src = resultado.qrcodeImage;
      $("pix-qr").classList.remove("sem-qr");
      $("pix-qr").hidden = false;
    }

    if (resultado.qrcode) {
      $("pix-chave").textContent = resultado.qrcode;
      $("pix-dados").hidden = false;
    }

    mostrarEstadoPix("pronto");
    iniciarChecagemPix();
  } catch (erro) {
    console.error("Erro ao gerar PIX:", erro);
    mostrarEstadoPix("erro");
  }
}

function mostrarEstadoPix(estado) {
  $("pix-carregando").hidden = estado !== "carregando";
  $("pix-erro").hidden = estado !== "erro";
  if (estado !== "pronto") {
    $("pix-qr").hidden = true;
    $("pix-dados").hidden = true;
  }
}

function iniciarChecagemPix() {
  clearInterval(pixPollingTimer);
  if (!pixTransactionId) return;

  pixPollingTimer = setInterval(async () => {
    try {
      const response = await fetch(
        `${CONFIG.webhookUrl}/pix/status?transactionId=${encodeURIComponent(pixTransactionId)}`
      );
      const status = await response.json();

      if (status.success && status.status === "PAID") {
        clearInterval(pixPollingTimer);
        avisar("Pagamento confirmado! Muito obrigado 💚");
      }
    } catch {
      /* ignora falha pontual de rede e tenta de novo no próximo tick */
    }
  }, 5000);
}

function mostrarErro(campo, mensagem) {
  $("erro-" + campo).textContent = mensagem;
  $("erro-" + campo).classList.add("visivel");
  $("lead-" + campo).classList.add("invalido");
}

function limparErro(campo) {
  $("erro-" + campo).classList.remove("visivel");
  $("lead-" + campo).classList.remove("invalido");
}

/* ----------------------------------------------------------
   ONDE OS CONTATOS FICAM GUARDADOS

   Por enquanto os leads ficam no navegador de quem doou, o que
   serve para teste mas NÃO chega até você. Para receber de fato,
   escolha uma das opções no LEIA-ME.md (Google Forms, Formspree
   ou planilha) e descomente o trecho de envio abaixo.
   ---------------------------------------------------------- */

function salvarLead(lead) {
  try {
    const lista = JSON.parse(localStorage.getItem("correntedobem_leads") || "[]");
    lista.push(lead);
    localStorage.setItem("correntedobem_leads", JSON.stringify(lista));
  } catch { /* sem localStorage disponível */ }

  console.log("Lead registrado:", lead);

  // ---- PARA RECEBER OS CONTATOS ----
  // Descomente as 5 linhas abaixo e ponha sua URL (veja o LEIA-ME.md).
  // A doação continua funcionando mesmo se o envio falhar.
  //
  // fetch("https://COLOQUE_AQUI_SUA_URL", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(lead),
  // }).catch(() => {});
}

/* ==========================================================
   COPIAR CHAVE PIX
   ========================================================== */

function montarCopiarPix() {
  $("btn-copiar-pix").addEventListener("click", async () => {
    const chave = $("pix-chave").textContent.trim();
    try {
      await navigator.clipboard.writeText(chave);
      avisar("Chave PIX copiada!");
    } catch {
      const faixa = document.createRange();
      faixa.selectNodeContents($("pix-chave"));
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(faixa);
      avisar("Toque e segure para copiar a chave.");
    }
  });
}

/* ==========================================================
   COMPARTILHAR
   ========================================================== */

function montarCompartilhar() {
  $("btn-compartilhar").addEventListener("click", async () => {
    const dados = {
      title: document.title,
      text: CONFIG.textoCompartilhar,
      url: location.href,
    };

    if (navigator.share) {
      try { await navigator.share(dados); return; } catch { /* cancelado */ }
    }

    try {
      await navigator.clipboard.writeText(`${dados.text} ${dados.url}`);
      avisar("Link copiado — cole onde quiser!");
    } catch {
      avisar(location.href);
    }
  });
}

/* ==========================================================
   BARRA FIXA — aparece depois da primeira rolagem
   ========================================================== */

function montarBarraFixa() {
  const barra = $("barra-fixa");
  const gatilho = window.innerHeight * 0.6;

  const verificar = () => {
    barra.classList.toggle("visivel", window.scrollY > gatilho);
  };

  verificar();
  window.addEventListener("scroll", verificar, { passive: true });
}

/* ==========================================================
   GALERIA
   ========================================================== */

function montarGaleria() {
  const lightbox = $("lightbox");
  const imagem = $("lightbox-img");
  const legenda = $("lightbox-legenda");

  lightbox.hidden = true;

  document.querySelectorAll(".foto").forEach((figura) => {
    const img = figura.querySelector("img");

    img.addEventListener("error", () => figura.classList.add("sem-imagem"));
    if (img.complete && img.naturalWidth === 0) figura.classList.add("sem-imagem");

    figura.addEventListener("click", () => {
      if (figura.classList.contains("sem-imagem")) return;
      imagem.src = img.src;
      imagem.alt = img.alt;
      legenda.textContent = figura.dataset.legenda || "";
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
    });
  });

  const fechar = () => {
    lightbox.hidden = true;
    imagem.src = "";
    if ($("modal").hidden) document.body.style.overflow = "";
  };

  $("lightbox-fechar").addEventListener("click", fechar);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) fechar(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !lightbox.hidden) fechar();
  });
}

/* ==========================================================
   ANIMAÇÃO DE ENTRADA
   ========================================================== */

function montarRevelacao() {
  const alvos = document.querySelectorAll(".secao, .final, .painel-card");
  alvos.forEach((el) => el.classList.add("revelar"));

  if (!("IntersectionObserver" in window)) {
    alvos.forEach((el) => el.classList.add("visivel"));
    return;
  }

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("visivel");
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

  alvos.forEach((el) => observador.observe(el));
}

/* ==========================================================
   INÍCIO
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  montarProgresso();
  montarCronometro();
  montarValores();
  montarModal();
  montarCopiarPix();
  montarCompartilhar();
  montarBarraFixa();
  montarGaleria();
  montarRevelacao();
});

/* ----------------------------------------------------------
   Para ver os contatos captados: abra o Console do navegador
   (F12) e digite:
       JSON.parse(localStorage.correntedobem_leads)
   ---------------------------------------------------------- */
