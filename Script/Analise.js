function mostrarAlerta(mensagem) {
 
  const alerta = document.createElement("div");
  alerta.id = "alerta-dom-suspeito";
  alerta.innerHTML = `
    <div class="alert-content">
      <strong class="alert-title">⚠️ Atenção: domínio suspeito detectado</strong>
      <p class="alert-text"> Você acessou o domínio ${mensagem}, que pode estar associado a práticas de phishing.</p>
      <p class="alert-footer"> 
         Phishing é uma tentativa de enganar você para roubar dados pessoais.
        <a href="https://www.google.com" target="_blank" rel="noopener">[Saiba mais]</a>
      </p>
    </div>
  `;

  // Cria botão de fechar
  const btnFechar = document.createElement("button");
  btnFechar.className = "close-btn";
  btnFechar.textContent = "✖";
  btnFechar.addEventListener("click", () => alerta.remove());

  alerta.appendChild(btnFechar);
  document.body.appendChild(alerta);
}

const dominiosSuspeitos = [
  "vl.de",
  ".ws",
  ".com.au",
  ".vx51r.com",
  ".weebly.com",
  "duckdns.org",
  "vercel.app",
  "sufybkt.com",
  ".live",
  ".buzz",
  ".support",
  ".help",
  "ipfs.io",       
  ".services",
  ".cam",
  "b4nk.xyz",
  "degetoken.com",  
  "dege-token.com",
  ".best",
  ".rest",
  ".stream",
  ".mov",
  ".xyz",
  ".top",
  ".club",
  ".online",
  ".tk",
  ".ml",
  ".ga",
  ".cf",
  ".gq",
  ".bid",
  ".loan",
  ".vip",
  ".wang",
  ".icu",
  ".party",
  ".trade",
  ".accountant",
  ".review",
  ".password",      
  ".secure",        
  ".verify",        
  ".signin",
  ".update",
  ".reset",
  "bit.ly",
  "tinyurl.com",
  "goo.gl",
  "ow.ly",
  "t.co",
  ".de",
  ".sa"
];

function analisarUrl(urlString) {
  let url;
  try {
    url = new URL(urlString);
  } catch {
    console.warn("URL inválida:", urlString);
    return false;
  }

  const host = url.hostname.toLowerCase();
  const fullUrl = url.href.toLowerCase();

  for (let dominioRaw of dominiosSuspeitos) {
    const domain = dominioRaw.replace(/^\./, "").toLowerCase();

    const isHostMatch = host === domain || host.endsWith("." + domain);


    const isSuspiciousLong = domain.length >= 5;
    const isInHref = isSuspiciousLong && fullUrl.includes(domain);

    if (isHostMatch || isInHref) {
      mostrarAlerta(host);
      return true;
    }
  }

  return false;
}

// Monitora mudanças de URL 
(function monitorarSinglePageApp() {
  const push = history.pushState;
  history.pushState = function () {
    push.apply(this, arguments);
    analisarUrl(window.location.href);
  };
  window.addEventListener("popstate", () => {
    analisarUrl(window.location.href);
  });
})();

// Monitora carregamento e unload
window.addEventListener("load", () => analisarUrl(window.location.href));
window.addEventListener("beforeunload", () => analisarUrl(window.location.href));
