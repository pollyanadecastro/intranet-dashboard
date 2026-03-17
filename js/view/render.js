/* =============================================
   VIEW — Renderização HTML
   ============================================= */

const AVATAR_GRADIENTS = [
  ['#0F6FBF','#7C3AED'], ['#059669','#0891B2'], ['#D97706','#DC2626'],
  ['#7C3AED','#DB2777'], ['#0891B2','#059669'], ['#DC2626','#D97706'],
  ['#1D4ED8','#0F6FBF'], ['#065F46','#059669'], ['#92400E','#D97706'],
  ['#4338CA','#7C3AED']
];

function avatarStyle(index) {
  const [c1, c2] = AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];
  return `background: linear-gradient(135deg, ${c1}, ${c2}); color:#fff;`;
}

function initials(name) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

const View = {

  renderUserItem(user, index, isActive) {
    return `
      <div class="user-item ${isActive ? 'active' : ''}"
           onclick="Controller.selectUser(${user.id})"
           data-name="${user.name.toLowerCase()}"
           data-email="${user.email.toLowerCase()}">
        <div class="avatar" style="${avatarStyle(index)}">${initials(user.name)}</div>
        <div class="user-info">
          <div class="user-name">${user.name}</div>
          <div class="user-email">${user.email}</div>
        </div>
      </div>`;
  },

  renderUserList(users, activeId) {
    const list = document.getElementById('userList');
    if (users.length === 0) {
      list.innerHTML = `<div style="text-align:center;padding:2rem;font-size:.83rem;color:var(--ink-muted)">Nenhum resultado encontrado.</div>`;
      return;
    }
    list.innerHTML = users.map((u) => {
      const index = allUsers.findIndex(x => x.id === u.id);
      return View.renderUserItem(u, index, u.id === activeId);
    }).join('');
  },

  renderProfile(user, index, postCount) {
    const company = user.company?.name || 'Colaborador';
    const city = user.address?.city || '—';
    return `
      <div class="profile-card" id="profileCard">
        <div class="avatar profile-avatar" style="${avatarStyle(index)}">${initials(user.name)}</div>
        <div class="profile-details">
          <h2>${user.name}</h2>
          <div class="profile-email">${user.email} · ${user.phone}</div>
          <div class="profile-meta">
            <span class="badge badge-blue">
              <svg width="10" height="10" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              ${company}
            </span>
            <span class="badge badge-green">
              <svg width="10" height="10" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              ${city}
            </span>
            <span class="badge badge-amber">
              <svg width="10" height="10" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              ${postCount} postagens
            </span>
          </div>
        </div>
      </div>`;
  },

  renderPost(post, index) {
    return `
      <div class="post-card" id="post-${post.id}">
        <div class="post-title">${post.title}</div>
        <div class="post-body">${post.body}</div>
        <div class="post-footer">
          <span class="post-id">#${post.id}</span>
          <button class="comments-btn" id="commentsBtn-${post.id}"
                  onclick="Controller.toggleComments(${post.id})">
            <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            Ver comentários
          </button>
        </div>
        <div class="comments-panel" id="commentPanel-${post.id}"></div>
      </div>`;
  },

  renderComment(comment, index) {
    return `
      <div class="comment-item">
        <div class="comment-header">
          <div class="avatar comment-avatar" style="${avatarStyle(index + 3)}">
            ${initials(comment.name.split(' ').slice(0, 2).join(' '))}
          </div>
          <div>
            <div class="comment-name">
              ${comment.name.length > 40 ? comment.name.substring(0, 38) + '…' : comment.name}
            </div>
            <div class="comment-email">${comment.email}</div>
          </div>
        </div>
        <div class="comment-body">${comment.body}</div>
      </div>`;
  },

  renderError(message, retryFn) {
    return `
      <div class="error-box">
        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <div>
          <h4>Falha na comunicação com a API</h4>
          <p>${message}</p>
          <button class="retry-btn" onclick="${retryFn}">↺ Tentar novamente</button>
        </div>
      </div>`;
  }

};
