// ── Filinstro PWA Install Banner ──

let deferredPrompt = null;

(function initPWA() {
  // Register Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('[PWA] Service Worker registered:', reg.scope))
        .catch(err => console.warn('[PWA] SW registration failed:', err));
    });
  }

  // Capture install prompt
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallBanner();
  });

  // Detect when installed
  window.addEventListener('appinstalled', () => {
    hideBanner();
    deferredPrompt = null;
    showToastPWA('Filinstro installed! 🎉 Open it from your home screen.');
  });

  // Auto-show after 3s if prompt is available
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (deferredPrompt) showInstallBanner();
    }, 3000);
  });
})();

function showInstallBanner() {
  if (document.getElementById('pwa-banner')) return;

  const banner = document.createElement('div');
  banner.id = 'pwa-banner';
  banner.innerHTML = `
    <div id="pwa-banner-inner">
      <div id="pwa-banner-left">
        <div id="pwa-banner-icon">📲</div>
        <div>
          <div id="pwa-banner-title">Install Filinstro</div>
          <div id="pwa-banner-sub">Add to home screen for the best experience</div>
        </div>
      </div>
      <div id="pwa-banner-actions">
        <button id="pwa-install-btn" onclick="triggerInstall()">Install</button>
        <button id="pwa-dismiss-btn" onclick="hideBanner()">✕</button>
      </div>
    </div>
  `;

  const style = document.createElement('style');
  style.textContent = `
    #pwa-banner {
      position: fixed; bottom: 0; left: 0; right: 0; z-index: 9998;
      background: rgba(15,12,41,0.97); border-top: 1px solid rgba(168,85,247,0.3);
      backdrop-filter: blur(20px); padding: 16px 20px;
      animation: slideUpBanner 0.4s ease;
    }
    @keyframes slideUpBanner { from { transform: translateY(100%); } to { transform: translateY(0); } }
    #pwa-banner-inner { display: flex; align-items: center; justify-content: space-between; max-width: 600px; margin: 0 auto; gap: 16px; }
    #pwa-banner-left { display: flex; align-items: center; gap: 14px; }
    #pwa-banner-icon { font-size: 28px; }
    #pwa-banner-title { font-size: 14px; font-weight: 700; color: #f1f5f9; }
    #pwa-banner-sub { font-size: 12px; color: #94a3b8; margin-top: 2px; }
    #pwa-banner-actions { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
    #pwa-install-btn {
      background: linear-gradient(135deg, #a855f7, #ec4899); color: #fff;
      border: none; border-radius: 50px; padding: 10px 20px; font-size: 13px;
      font-weight: 700; cursor: pointer; font-family: inherit;
    }
    #pwa-dismiss-btn {
      background: rgba(255,255,255,0.05); color: #94a3b8; border: 1px solid rgba(255,255,255,0.1);
      border-radius: 50px; padding: 8px 12px; font-size: 13px; cursor: pointer; font-family: inherit;
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(banner);
}

function hideBanner() {
  const b = document.getElementById('pwa-banner');
  if (b) b.remove();
}

async function triggerInstall() {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  deferredPrompt = null;
  hideBanner();
  if (outcome === 'accepted') {
    showToastPWA('Installing Filinstro… 🚀');
  }
}

function showToastPWA(msg) {
  // Works on both pages (toast container may be named differently)
  const c = document.getElementById('toast-container');
  if (!c) return;
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<span>📲</span><span>${msg}</span>`;
  c.appendChild(t);
  setTimeout(() => t.remove(), 4000);
}

// ── iOS install instructions (Safari doesn't support beforeinstallprompt) ──
function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
}

if (isIOS() && !window.navigator.standalone) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const banner = document.createElement('div');
      banner.id = 'pwa-banner';
      banner.innerHTML = `
        <div id="pwa-banner-inner">
          <div id="pwa-banner-left">
            <div id="pwa-banner-icon">📲</div>
            <div>
              <div id="pwa-banner-title">Install on iPhone</div>
              <div id="pwa-banner-sub">Tap <strong>Share</strong> → <strong>Add to Home Screen</strong></div>
            </div>
          </div>
          <button id="pwa-dismiss-btn" onclick="hideBanner()">✕</button>
        </div>`;
      showInstallBanner();
    }, 3500);
  });
}
