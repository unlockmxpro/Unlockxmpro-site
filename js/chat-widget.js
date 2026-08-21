(function () {
  'use strict';

  var CHATBOT_URL = 'https://postiz.unlockmxpro.com/chatbot';
  var WA_HREF = 'https://wa.me/524661470586?text=' + encodeURIComponent('Hola UnlockMxPro');
  var SITE = 'unlock';
  var COPY = document.documentElement.lang === 'en' ? {
    title: 'UnlockMxPro Support',
    subtitle: 'We reply as soon as we can',
    placeholder: 'Type your question…',
    send: 'Send',
    welcome: 'Hi! I am the UnlockMxPro assistant. How can I help you today?',
    fallback: 'I could not connect right now. Write us on WhatsApp and we will help you there.',
    whatsapp: 'Continue on WhatsApp',
    open: 'Open chat',
    close: 'Close chat'
  } : {
    title: 'Soporte UnlockMxPro',
    subtitle: 'Te respondemos lo antes posible',
    placeholder: 'Escríbenos lo que necesitas…',
    send: 'Enviar',
    welcome: '¡Hola! Soy el asistente de UnlockMxPro. ¿En qué te ayudo hoy?',
    fallback: 'No pude conectar ahora. Escríbenos por WhatsApp y te atendemos ahí.',
    whatsapp: 'Continuar por WhatsApp',
    open: 'Abrir chat',
    close: 'Cerrar chat'
  };

  var sessionId = 'sess_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  var open = false;

  var style = document.createElement('style');
  style.textContent = [
    '#umx-chat-btn{position:fixed;bottom:28px;left:24px;z-index:9998;width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#2563eb,#38bdf8);box-shadow:0 4px 20px rgba(37,99,235,.45);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .2s}',
    '#umx-chat-btn:hover{transform:scale(1.08)}',
    '#umx-chat-btn:focus-visible{outline:2px solid #38bdf8;outline-offset:3px}',
    '#umx-chat-btn svg{width:26px;height:26px;fill:#fff}',
    '#umx-chat-window{position:fixed;bottom:96px;left:24px;z-index:9999;width:360px;max-width:calc(100vw - 32px);background:#fff;border-radius:20px;box-shadow:0 8px 40px rgba(0,0,0,.18);display:none;flex-direction:column;overflow:hidden;font-family:Inter,system-ui,sans-serif;border:1px solid #e2e8f0}',
    '#umx-chat-window.open{display:flex}',
    '#umx-chat-header{background:linear-gradient(135deg,#2563eb,#38bdf8);padding:16px 18px;color:#fff;display:flex;align-items:center;gap:12px}',
    '#umx-chat-header .avatar{width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.25);display:flex;align-items:center;justify-content:center;flex-shrink:0}',
    '#umx-chat-header .avatar svg{width:20px;height:20px;fill:#fff}',
    '#umx-chat-header .info{flex:1}',
    '#umx-chat-header .title{font-weight:700;font-size:.95rem}',
    '#umx-chat-header .subtitle{font-size:.75rem;opacity:.85;margin-top:2px}',
    '#umx-chat-close{background:none;border:none;color:#fff;cursor:pointer;font-size:1.3rem;line-height:1;padding:4px;opacity:.8}',
    '#umx-chat-close:hover{opacity:1}',
    '#umx-chat-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;max-height:340px;background:#f8fafc}',
    '.umx-msg{display:flex;flex-direction:column;max-width:82%}',
    '.umx-msg.bot{align-self:flex-start}',
    '.umx-msg.user{align-self:flex-end}',
    '.umx-msg .bubble{padding:10px 14px;border-radius:16px;font-size:.88rem;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}',
    '.umx-msg.bot .bubble{background:#fff;color:#1e293b;border:1px solid #e2e8f0;border-bottom-left-radius:4px}',
    '.umx-msg.user .bubble{background:#2563eb;color:#fff;border-bottom-right-radius:4px}',
    '.umx-msg .bubble a{color:#2563eb;font-weight:600}',
    '.umx-msg .ts{font-size:.7rem;color:#94a3b8;margin-top:3px}',
    '.umx-msg.user .ts{text-align:right}',
    '.umx-typing .bubble{display:flex;gap:4px;align-items:center;padding:12px 16px}',
    '.umx-typing .dot{width:7px;height:7px;border-radius:50%;background:#94a3b8;animation:umx-bounce .9s infinite}',
    '.umx-typing .dot:nth-child(2){animation-delay:.15s}',
    '.umx-typing .dot:nth-child(3){animation-delay:.3s}',
    '@keyframes umx-bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}',
    '#umx-chat-footer{padding:12px 14px;border-top:1px solid #e2e8f0;background:#fff}',
    '#umx-chat-input-row{display:flex;gap:8px}',
    '#umx-chat-input{flex:1;border:1px solid #e2e8f0;border-radius:10px;padding:9px 13px;font-size:.88rem;outline:none;font-family:inherit;resize:none;background:#f8fafc;color:#1e293b}',
    '#umx-chat-input:focus{border-color:#2563eb;background:#fff}',
    '#umx-chat-send{background:linear-gradient(135deg,#2563eb,#38bdf8);border:none;border-radius:10px;padding:9px 14px;cursor:pointer;color:#fff;display:flex;align-items:center;justify-content:center}',
    '#umx-chat-send:hover{opacity:.9}',
    '#umx-chat-send svg{width:18px;height:18px;fill:#fff}'
  ].join('');
  document.head.appendChild(style);

  var btn = document.createElement('button');
  btn.id = 'umx-chat-btn';
  btn.type = 'button';
  btn.setAttribute('aria-label', COPY.open);
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'umx-chat-window');
  btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z"/></svg>';

  var win = document.createElement('div');
  win.id = 'umx-chat-window';
  win.setAttribute('role', 'dialog');
  win.setAttribute('aria-label', COPY.title);
  win.innerHTML =
    '<div id="umx-chat-header">' +
      '<div class="avatar" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg></div>' +
      '<div class="info"><div class="title"></div><div class="subtitle"></div></div>' +
      '<button type="button" id="umx-chat-close">✕</button>' +
    '</div>' +
    '<div id="umx-chat-messages"></div>' +
    '<div id="umx-chat-footer">' +
      '<div id="umx-chat-input-row">' +
        '<textarea id="umx-chat-input" rows="1"></textarea>' +
        '<button type="button" id="umx-chat-send"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button>' +
      '</div>' +
    '</div>';

  win.querySelector('.title').textContent = COPY.title;
  win.querySelector('.subtitle').textContent = COPY.subtitle;
  win.querySelector('#umx-chat-close').setAttribute('aria-label', COPY.close);
  win.querySelector('#umx-chat-input').setAttribute('placeholder', COPY.placeholder);
  win.querySelector('#umx-chat-send').setAttribute('aria-label', COPY.send);

  document.body.appendChild(btn);
  document.body.appendChild(win);

  var messagesEl = win.querySelector('#umx-chat-messages');
  var inputEl = win.querySelector('#umx-chat-input');

  function now() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function addMessage(text, role, link) {
    var div = document.createElement('div');
    div.className = 'umx-msg ' + role;
    var bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.textContent = text == null ? '' : String(text);
    if (link && link.href && link.label) {
      bubble.appendChild(document.createTextNode(' '));
      var a = document.createElement('a');
      a.href = link.href;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = link.label;
      bubble.appendChild(a);
    }
    var ts = document.createElement('div');
    ts.className = 'ts';
    ts.textContent = now();
    div.appendChild(bubble);
    div.appendChild(ts);
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function showTyping() {
    var el = document.createElement('div');
    el.className = 'umx-msg bot umx-typing';
    el.id = 'umx-typing';
    var bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.setAttribute('aria-hidden', 'true');
    for (var i = 0; i < 3; i++) {
      var dot = document.createElement('div');
      dot.className = 'dot';
      bubble.appendChild(dot);
    }
    el.appendChild(bubble);
    messagesEl.appendChild(el);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function hideTyping() {
    var el = messagesEl.querySelector('#umx-typing');
    if (el) el.remove();
  }

  function addFallback() {
    addMessage(COPY.fallback, 'bot', { href: WA_HREF, label: COPY.whatsapp });
  }

  async function sendMessage() {
    var text = inputEl.value.trim();
    if (!text) return;
    inputEl.value = '';
    inputEl.style.height = 'auto';
    addMessage(text, 'user');
    showTyping();

    try {
      var resp = await fetch(CHATBOT_URL + '/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId: sessionId, site: SITE })
      });
      hideTyping();
      if (!resp.ok) {
        addFallback();
        return;
      }
      var data = await resp.json();
      if (data && typeof data.reply === 'string' && data.reply.trim()) {
        addMessage(data.reply, 'bot');
      } else {
        addFallback();
      }
    } catch (err) {
      hideTyping();
      addFallback();
    }
  }

  function setOpen(next) {
    open = next;
    win.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? COPY.close : COPY.open);
    if (open) {
      if (messagesEl.children.length === 0) addMessage(COPY.welcome, 'bot');
      inputEl.focus();
    }
  }

  btn.addEventListener('click', function () {
    setOpen(!open);
  });

  win.querySelector('#umx-chat-close').addEventListener('click', function () {
    setOpen(false);
  });

  win.querySelector('#umx-chat-send').addEventListener('click', sendMessage);

  inputEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  inputEl.addEventListener('input', function () {
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(inputEl.scrollHeight, 100) + 'px';
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && open) setOpen(false);
  });
})();
