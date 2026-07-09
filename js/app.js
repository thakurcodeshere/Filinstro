// ── Filinstro App Controller ──

let state = {
  user: null,
  posts: [],
  activePost: null,
  activeFilter: 'all',
  activeTrendsTab: 'trends'
};

// ── Init ──
(function init() {
  const stored = sessionStorage.getItem('fil_user');
  if (!stored) { window.location.href = 'index.html'; return; }
  state.user = JSON.parse(stored);

  renderProfile();
  state.posts = generateMockPosts(state.user.niche || 'lifestyle');
  renderPostList();
  renderTrends();
  selectPost(0);
  showToast(`Welcome back, ${state.user.name}! 🎉`);
})();

// ── Profile ──
function renderProfile() {
  const u = state.user;
  const initials = (u.name || '?').replace('@','').substring(0,2).toUpperCase();
  document.getElementById('profile-avatar').textContent = initials;
  document.getElementById('profile-name').textContent = u.name;
  document.getElementById('profile-niche').textContent = `✨ ${u.niche || 'Lifestyle'} · Demo Mode`;
  document.getElementById('stat-followers').textContent = fmtNum(u.followers);
  document.getElementById('stat-following').textContent = fmtNum(u.following);
  document.getElementById('stat-posts').textContent = u.posts;
}

// ── Post List ──
function renderPostList() {
  const el = document.getElementById('post-list');
  el.innerHTML = state.posts.map((p, i) => `
    <div class="post-item ${i === 0 ? 'active' : ''}" id="post-item-${i}" onclick="selectPost(${i})">
      <img class="post-thumb" src="${p.image}" alt="" onerror="this.style.background='var(--border)'"/>
      <div class="post-item-text">
        <div class="post-item-title">${p.title}</div>
        <div class="post-item-meta">${p.date} · ❤️ ${fmtNum(p.likes)}</div>
      </div>
      <div class="post-item-count">${p.comments}</div>
    </div>
  `).join('');
}

// ── Select Post ──
function selectPost(idx) {
  state.activePost = idx;
  state.activeFilter = 'all';

  // Update sidebar active state
  document.querySelectorAll('.post-item').forEach((el, i) => el.classList.toggle('active', i === idx));

  const post = state.posts[idx];
  document.getElementById('top-bar-title').textContent = post.title;
  document.getElementById('top-bar-sub').textContent = `${post.comments} comments · ${post.date}`;
  document.getElementById('comments-panel-title').textContent = `All Comments (${post.rawComments.length})`;

  // Reset chip UI
  document.querySelectorAll('.chip').forEach(c => {
    c.classList.toggle('active', c.classList.contains('chip-all'));
  });

  renderStats(post.rawComments);
  renderComments(post.rawComments);
}

// ── Stats Strip ──
const CAT_COLORS = {
  hate:       { color:'#f87171', border:'rgba(239,68,68,0.2)',   bar:'linear-gradient(90deg,#ef4444,#b91c1c)' },
  comic:      { color:'#fbbf24', border:'rgba(245,158,11,0.2)',  bar:'linear-gradient(90deg,#f59e0b,#d97706)' },
  abuse:      { color:'#fb923c', border:'rgba(249,115,22,0.2)',  bar:'linear-gradient(90deg,#f97316,#ea580c)' },
  praise:     { color:'#34d399', border:'rgba(16,185,129,0.2)',  bar:'linear-gradient(90deg,#10b981,#059669)' },
  appreciate: { color:'#c084fc', border:'rgba(168,85,247,0.2)', bar:'linear-gradient(90deg,#a855f7,#7c3aed)' },
  politics:   { color:'#60a5fa', border:'rgba(59,130,246,0.2)', bar:'linear-gradient(90deg,#3b82f6,#1d4ed8)' },
  education:  { color:'#22d3ee', border:'rgba(6,182,212,0.2)',  bar:'linear-gradient(90deg,#06b6d4,#0e7490)' },
  tech:       { color:'#818cf8', border:'rgba(99,102,241,0.2)', bar:'linear-gradient(90deg,#6366f1,#4338ca)' },
  sarcasm:    { color:'#f472b6', border:'rgba(236,72,153,0.2)', bar:'linear-gradient(90deg,#ec4899,#be185d)' },
  spam:       { color:'#fca5a5', border:'rgba(239,68,68,0.15)', bar:'linear-gradient(90deg,#ef4444,#9f1239)' },
  question:   { color:'#fde047', border:'rgba(250,204,21,0.2)', bar:'linear-gradient(90deg,#eab308,#a16207)' },
  motivation: { color:'#6ee7b7', border:'rgba(16,185,129,0.15)',bar:'linear-gradient(90deg,#10b981,#065f46)' },
  neutral:    { color:'#94a3b8', border:'rgba(148,163,184,0.2)',bar:'linear-gradient(90deg,#64748b,#334155)' },
};

function renderStats(comments) {
  const stats = getCategoryStats(comments);
  const strip = document.getElementById('stats-strip');
  strip.innerHTML = Object.entries(CATEGORIES).map(([key, cat]) => {
    const c = CAT_COLORS[key] || { color:'#94a3b8', border:'rgba(148,163,184,0.2)', bar:'linear-gradient(90deg,#64748b,#334155)' };
    return `
      <div class="stat-strip-item" onclick="filterBy('${key}')" style="border-color:${c.border}">
        <div class="stat-strip-num" style="color:${c.color}">${stats[key] || 0}</div>
        <div class="stat-strip-lbl" style="color:${c.color}">${cat.icon} ${cat.label}</div>
        <div class="stat-strip-bar" style="background:${c.bar}"></div>
      </div>`;
  }).join('');
}

// ── Comments List ──
function renderComments(comments) {
  const filter = state.activeFilter;
  const filtered = filter === 'all' ? comments : comments.filter(c => c.category === filter);
  const list = document.getElementById('comments-list');

  if (!filtered.length) {
    list.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text-muted)"><div style="font-size:36px;margin-bottom:12px">🔍</div><div>No ${filter} comments found</div></div>`;
    return;
  }

  list.innerHTML = filtered.map((c, i) => {
    const cat = getCategoryData(c.category);
    return `
    <div class="comment-card" style="animation-delay:${i * 0.03}s">
      <img class="comment-avatar" src="${c.avatar}" alt="${c.user}" onerror="this.src='https://i.pravatar.cc/40?img=${i+1}'"/>
      <div class="comment-body">
        <div class="comment-header">
          <span class="comment-user">@${c.user}</span>
          <span class="badge ${cat.class}">${cat.icon} ${cat.label}</span>
          <span class="comment-time">${c.time}</span>
        </div>
        <div class="comment-text">${escHtml(c.text)}</div>
        <div class="comment-footer">
          <span class="comment-likes">❤️ ${c.likes}</span>
          <button class="btn btn-ghost btn-sm" style="padding:3px 10px;font-size:11px" onclick="replyTo('${c.user}')">↩ Reply</button>
          <button class="btn btn-ghost btn-sm" style="padding:3px 10px;font-size:11px" onclick="reportComment('${c.id}')">🚩 Report</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

// ── Filter ──
function filterBy(cat) {
  state.activeFilter = cat;
  const post = state.posts[state.activePost];
  if (!post) return;

  // Update chips
  document.querySelectorAll('.chip').forEach(c => {
    c.classList.toggle('active', c.classList.contains(`chip-${cat}`));
  });
  document.getElementById('comments-panel-title').textContent =
    cat === 'all' ? `All Comments (${post.rawComments.length})` :
    `${getCategoryData(cat).icon} ${getCategoryData(cat).label} Comments`;

  renderComments(post.rawComments);
}

// ── Trends ──
function renderTrends() {
  const niche = state.user.niche || 'lifestyle';
  const trends = getTrends(niche);
  const tips = getGrowthTips();

  if (state.activeTrendsTab === 'trends') {
    const engageScore = Math.floor(70 + Math.random() * 25);
    document.getElementById('trends-body').innerHTML = `
      <div class="engage-card">
        <div class="engage-score">${engageScore}</div>
        <div class="engage-label">Engagement Score</div>
        <div class="engage-sub">${engageScore >= 85 ? '🔥 Above Average' : engageScore >= 70 ? '✅ Healthy' : '📈 Growing'}</div>
      </div>
      <div style="font-size:11px;color:var(--text-muted);font-weight:700;text-transform:uppercase;letter-spacing:1px;padding:4px 0">Trending in ${niche}</div>
      ${trends.map((t, i) => `
        <div class="trend-item">
          <div class="trend-item-header">
            <div class="trend-hashtag">${t.tag}</div>
            <div class="trend-growth">${t.growth}</div>
          </div>
          <div class="trend-posts">${t.posts} posts</div>
          <div class="trend-score-bar" style="width:${t.score}%"></div>
          <div class="trend-tip">💡 ${t.tip}</div>
        </div>
      `).join('')}
    `;
  } else {
    document.getElementById('trends-body').innerHTML = tips.map(t => `
      <div class="tip-card">
        <div class="tip-icon">${t.icon}</div>
        <div class="tip-title">${t.title}</div>
        <div class="tip-body">${t.body}</div>
      </div>
    `).join('');
  }
}

function switchTrendsTab(tab) {
  state.activeTrendsTab = tab;
  document.getElementById('ttab-trends').classList.toggle('active', tab === 'trends');
  document.getElementById('ttab-tips').classList.toggle('active', tab === 'tips');
  renderTrends();
}

// ── Actions ──
function switchView(view) {
  document.getElementById('nav-comments').classList.toggle('active', view === 'comments');
  document.getElementById('nav-trends').classList.toggle('active', view === 'trends');
  if (view === 'trends') {
    document.getElementById('view-comments').style.display = 'none';
    document.getElementById('trends-panel').style.display = 'flex';
    document.getElementById('trends-panel').style.width = '100%';
    document.getElementById('top-bar-title').textContent = 'Trend & Growth Engine';
    document.getElementById('top-bar-sub').textContent = `Trends for ${state.user.niche} niche`;
    switchTrendsTab('trends');
  } else {
    document.getElementById('view-comments').style.display = 'flex';
    document.getElementById('trends-panel').style.width = '300px';
    document.getElementById('top-bar-title').textContent = state.posts[state.activePost]?.title || 'Comment Intelligence';
    document.getElementById('top-bar-sub').textContent = 'Analyze and filter your post comments';
  }
}

function refreshComments() {
  const btn = document.getElementById('refresh-btn');
  btn.innerHTML = '<div class="spinner" style="width:14px;height:14px"></div> Refreshing…';
  btn.disabled = true;
  setTimeout(() => {
    if (state.activePost !== null) {
      state.posts[state.activePost].rawComments = generateMockComments(state.user.niche, state.activePost + Math.floor(Math.random()*10));
      selectPost(state.activePost);
    }
    btn.innerHTML = '↻ Refresh';
    btn.disabled = false;
    showToast('Comments refreshed! ✨');
  }, 1200);
}

function replyTo(user) {
  showToast(`Opening reply to @${user}…`, '↩');
}

function reportComment(id) {
  showToast('Comment reported for review.', '🚩');
}

function exportCSV() {
  const post = state.posts[state.activePost];
  if (!post) { showToast('Select a post first.', '⚠️'); return; }
  const rows = [['User','Comment','Category','Time','Likes']];
  post.rawComments.forEach(c => rows.push([c.user, c.text, c.category, c.time, c.likes]));
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `filinstro_comments_${post.id}.csv`;
  a.click();
  showToast('CSV exported! ⬇️');
}

function logout() {
  sessionStorage.removeItem('fil_user');
  window.location.href = 'index.html';
}

// ── Helpers ──
function fmtNum(n) {
  if (n >= 1e6) return (n/1e6).toFixed(1)+'M';
  if (n >= 1e3) return (n/1e3).toFixed(1)+'K';
  return String(n);
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function showToast(msg, icon = '✅') {
  const c = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<span>${icon}</span><span>${msg}</span>`;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}
