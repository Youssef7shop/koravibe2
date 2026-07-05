// ====== STREAM CONFIG ======
(function() {
  // Block all popups
  window.open = function() { return null; };
  window.alert = function() {};
  window.confirm = function() { return false; };
  window.prompt = function() { return null; };
  
  // Block redirects from iframes
  window.addEventListener('blur', function() {
    setTimeout(function() { window.focus(); }, 50);
  });

  // Block beforeunload redirects
  window.addEventListener('beforeunload', function(e) {
    e.stopPropagation();
  });

  // Override iframes after load
  function blockIframePopups() {
    document.querySelectorAll('iframe').forEach(function(iframe) {
      try {
        if (iframe.contentWindow) {
          iframe.contentWindow.open = function() { return null; };
          iframe.contentWindow.alert = function() {};
          iframe.contentWindow.confirm = function() { return false; };
        }
      } catch(e) {}
    });
  }
  setInterval(blockIframePopups, 1000);
})();

const CONFIG = {
  matchTitle: "⚽ بث مباشر للمباراة",
  topLinks: {
    link1: { text: "البث الرئيسي", url: "https://kooratv-1.vercel.app/main" },
    link2: { text: "koora TV", url: "https://kooratv-1.vercel.app" }
  },
  servers: {
    server1: "",
    server2: "",
    server3: ""
  }
};

let currentServerNum = 1;
let isPlayClicked = false;
let lastMsgId = 0;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById('match-main-title').innerText = CONFIG.matchTitle;
  const l1 = document.getElementById('top-link-1');
  l1.innerText = CONFIG.topLinks.link1.text; l1.href = CONFIG.topLinks.link1.url;
  const l2 = document.getElementById('top-link-2');
  l2.innerText = CONFIG.topLinks.link2.text; l2.href = CONFIG.topLinks.link2.url;
});

// ====== STREAM FUNCTIONS ======
function loadServerSource(n) {
  const targetIframe = document.getElementById('iframe-server' + n);
  const streamUrl = CONFIG.servers['server' + n];
  if (!streamUrl || !targetIframe) return;
  if (targetIframe.src !== streamUrl) {
    for (let i = 1; i <= 3; i++) {
      const iframe = document.getElementById('iframe-server' + i);
      if (i !== n && iframe) iframe.src = "";
    }
    targetIframe.src = streamUrl;
  }
}

function switchServer(n) {
  currentServerNum = n;
  document.querySelectorAll('.server-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.server-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('server' + n).classList.add('active');
  document.querySelectorAll('.server-btn')[n - 1].classList.add('active');
  if (isPlayClicked) { loadServerSource(n); setTimeout(goFullscreen, 200); setTimeout(triggerAutoClose, 1500); }
}

function goFullscreen() {
  const pw = document.getElementById('player-wrapper');
  if (!pw) return;
  if (pw.requestFullscreen) pw.requestFullscreen();
  else if (pw.webkitRequestFullscreen) pw.webkitRequestFullscreen();
  else if (pw.mozRequestFullScreen) pw.mozRequestFullScreen();
  else if (pw.msRequestFullscreen) pw.msRequestFullscreen();
}

function triggerAutoClose() {
  const iframe = document.getElementById('iframe-server' + currentServerNum);
  if (!iframe) return;
  try {
    const rect = iframe.getBoundingClientRect();
    iframe.dispatchEvent(new MouseEvent('click', { view: window, bubbles: true, cancelable: true, clientX: rect.left + rect.width * 0.86, clientY: rect.top + rect.height * 0.42 }));
  } catch(e) {}
}

function dismissOverlay() {
  isPlayClicked = true;
  document.getElementById('overlay').classList.add('hidden');
  loadServerSource(currentServerNum);
  goFullscreen();
  setTimeout(triggerAutoClose, 1500);
}

function refreshPage() {
  const icon = document.getElementById('refresh-icon');
  if (icon) { icon.style.transition = 'transform 0.6s'; icon.style.transform = 'rotate(360deg)'; }
  setTimeout(() => window.location.reload(), 600);
}