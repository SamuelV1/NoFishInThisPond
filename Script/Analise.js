function mostrarAlerta(mensagem) {
  // Verifica se o DOM está pronto
  if (!document.body) {
    return setTimeout(() => mostrarAlerta(mensagem), 50);
  }

  
  if (document.getElementById("alerta-dom-suspeito")) return;

  const alerta = document.createElement("div");
  alerta.id = "alerta-dom-suspeito";
  alerta.innerHTML = `
    <div class="alert-content">
      <strong class="alert-title">⚠️ Atenção: domínio suspeito detectado</strong>
      <p class="alert-text">Você acessou o domínio <strong>${mensagem}</strong>, que pode estar associado a práticas de phishing.</p>
      <p class="alert-footer">
        Phishing é uma tentativa de enganar você para roubar dados pessoais.
        <a href="https://pt.wikipedia.org/wiki/Phishing" target="_blank" rel="noopener">[Saiba mais]</a>
      </p>
    </div>
  `;

  const btnFechar = document.createElement("button");
  btnFechar.className = "close-btn";
  btnFechar.textContent = "✖";
  btnFechar.addEventListener("click", () => alerta.remove());

  alerta.appendChild(btnFechar);

  Object.assign(alerta.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    backgroundColor: "#c62828",
    color: "white",
    padding: "15px",
    borderRadius: "8px",
    zIndex: 99999,
    maxWidth: "300px",
    fontFamily: "Arial, sans-serif",
    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
  });

  document.body.appendChild(alerta);
}

const dominiosSuspeitos = [
  "vl.de", ".ws", ".com.au", ".vx51r.com", ".weebly.com", "duckdns.org",
  "vercel.app", "sufybkt.com", ".live", ".buzz", ".support", ".help",
  "ipfs.io", ".services", ".cam", "b4nk.xyz", "degetoken.com",
  "dege-token.com", ".best", ".rest", "w3schools", ".stream", ".mov",
  ".xyz", ".top", ".club", ".online", ".tk", ".ml", ".ga", ".cf", ".gq",
  ".bid", ".loan", ".vip", ".wang", ".icu", ".party", ".trade", ".accountant",
  ".review", ".password", ".secure", ".verify", ".signin", ".update",
  ".reset", "bit.ly", "tinyurl.com", "goo.gl", "ow.ly", "t.co", ".de", ".sa"
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

// monitora mudanças de URL sem recarregar a página
(function monitorarSinglePageApp() {
  const push = history.pushState;
  history.pushState = function () {
    push.apply(this, arguments);
    setTimeout(() => analisarUrl(window.location.href), 100);
  };
  window.addEventListener("popstate", () => {
    setTimeout(() => analisarUrl(window.location.href), 100);
  });
})();

// Executa ao carregar a página
window.addEventListener("load", () => {
  setTimeout(() => analisarUrl(window.location.href), 100);
});
