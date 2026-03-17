/* =============================================
  Controller - Coordenação de Aplicação
   ============================================= */

let allUsers = [];
let selectedUserId = null;
let openCommentPanels = new Set();
let commentCache = {};

const Controller = {

  async init() {
    try {
      allUsers = await Model.fetchUsers();
      document.getElementById('userCount').textContent = allUsers.length;
      ['skel1', 'skel2', 'skel3'].forEach(id => document.getElementById(id)?.remove());
      View.renderUserList(allUsers, null);
      setApiStatus(true);
      showToast('API conectada com sucesso!', 'success');
    } catch (err) {
      ['skel1', 'skel2', 'skel3'].forEach(id => document.getElementById(id)?.remove());
      document.getElementById('userList').innerHTML =
        View.renderError(err.message, 'Controller.init()');
      setApiStatus(false);
      showToast('Falha ao conectar com a API', 'error');
    }
  },

  async selectUser(userId) {
    selectedUserId = userId;
    openCommentPanels.clear();
    const user = allUsers.find(u => u.id === userId);
    const index = allUsers.findIndex(u => u.id === userId);

    document.querySelectorAll('.user-item').forEach(el => el.classList.remove('active'));
    document.querySelector(`.user-item[onclick*="(${userId})"]`)?.classList.add('active');

    document.getElementById('emptyState').style.display = 'none';
    const section = document.getElementById('profileSection');
    section.style.display = 'block';
    section.innerHTML = `<div style="text-align:center;padding:3rem;color:var(--ink-light);font-size:.85rem">Carregando postagens…</div>`;

    try {
      const posts = await Model.fetchPostsByUser(userId);
      let html = View.renderProfile(user, index, posts.length);
      html += `<div class="section-header">
                 <h3 class="section-title">Postagens Recentes</h3>
                 <span class="post-count-badge">${posts.length}</span>
               </div>`;
      html += `<div class="posts-grid">`;
      posts.forEach((post, i) => { html += View.renderPost(post, i); });
      html += `</div>`;
      section.innerHTML = html;
    } catch (err) {
      section.innerHTML = View.renderError(err.message, `Controller.selectUser(${userId})`);
      showToast('Erro ao carregar postagens', 'error');
    }
  },

  async toggleComments(postId) {
    const panel = document.getElementById(`commentPanel-${postId}`);
    const btn = document.getElementById(`commentsBtn-${postId}`);
    const card = document.getElementById(`post-${postId}`);

    if (panel.classList.contains('open')) {
      panel.classList.remove('open');
      card.classList.remove('expanded');
      btn.innerHTML = `
        <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg> Ver comentários`;
      openCommentPanels.delete(postId);
      return;
    }

    panel.classList.add('open');
    card.classList.add('expanded');
    btn.classList.add('loading');
    btn.innerHTML = `<span style="display:inline-block;animation:spin .7s linear infinite">⟳</span> Carregando…`;
    openCommentPanels.add(postId);

    try {
      let comments;
      if (commentCache[postId]) {
        comments = commentCache[postId];
      } else {
        comments = await Model.fetchCommentsByPost(postId);
        commentCache[postId] = comments;
      }
      panel.innerHTML =
        `<div class="comments-panel-title">💬 ${comments.length} comentários</div>` +
        comments.map((c, i) => View.renderComment(c, i)).join('');
      btn.innerHTML = `
        <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg> ${comments.length} comentários`;
    } catch (err) {
      panel.innerHTML = `<div style="font-size:.82rem;color:var(--danger);padding:.5rem">⚠ ${err.message}</div>`;
      btn.innerHTML = `⚠ Erro`;
      showToast('Erro ao carregar comentários', 'error');
    }

    btn.classList.remove('loading');
  }

};

function filterUsers() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  const filtered = allUsers.filter(u =>
    u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
  );
  View.renderUserList(filtered, selectedUserId);
}

function setApiStatus(online) {
  const dot = document.getElementById('apiDot');
  const txt = document.getElementById('apiStatusText');
  dot.style.background = online ? '#10B981' : '#EF4444';
  txt.textContent = online ? 'API online' : 'API offline';
}

function showToast(msg, type = 'info') {
  const t = document.getElementById('toast');
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${icons[type] || 'ℹ'}</span> ${msg}`;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}

Controller.init();
