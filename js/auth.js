// ── Auth logic for Filinstro landing page ──

function demoLogin() {
  const nameEl = document.getElementById('demo-name');
  const nicheEl = document.getElementById('demo-niche');
  const name = nameEl ? (nameEl.value.trim() || 'Creator') : 'Creator';
  const niche = nicheEl ? nicheEl.value : 'lifestyle';

  const btn = document.getElementById('demo-btn');
  if (btn) {
    btn.innerHTML = '<div class="spinner"></div> Loading…';
    btn.disabled = true;
  }

  // Save session
  sessionStorage.setItem('fil_user', JSON.stringify({
    name: name.startsWith('@') ? name : '@' + name,
    niche,
    mode: 'demo',
    avatar: generateAvatarColor(name),
    followers: Math.floor(Math.random() * 90000) + 10000,
    following: Math.floor(Math.random() * 3000) + 200,
    posts: Math.floor(Math.random() * 200) + 50,
    joinedAt: new Date().toISOString()
  }));

  setTimeout(() => { window.location.href = 'dashboard.html'; }, 1200);
}

function realLogin() {
  const username = document.getElementById('real-username')?.value?.trim();
  const appId = document.getElementById('real-appid')?.value?.trim();

  if (!username || !appId) {
    showToast('Please fill in both fields.', '⚠️');
    return;
  }

  // In a real app: initiate OAuth flow
  // window.location.href = `https://api.instagram.com/oauth/authorize?client_id=${appId}&redirect_uri=...`
  showToast('OAuth flow requires server setup. Switching to demo mode.', 'ℹ️');
  setTimeout(() => {
    sessionStorage.setItem('fil_user', JSON.stringify({
      name: username.startsWith('@') ? username : '@' + username,
      niche: 'lifestyle',
      mode: 'oauth_pending',
      avatar: generateAvatarColor(username),
      followers: 0,
      following: 0,
      posts: 0,
    }));
    window.location.href = 'dashboard.html';
  }, 1500);
}

function generateAvatarColor(name) {
  const colors = [
    ['#833ab4','#fd1d1d'],['#a855f7','#ec4899'],['#3b82f6','#06b6d4'],
    ['#10b981','#3b82f6'],['#f59e0b','#ef4444'],['#ec4899','#8b5cf6']
  ];
  const idx = (name.charCodeAt(0) || 0) % colors.length;
  return colors[idx];
}
