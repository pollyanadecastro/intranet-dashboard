/* =============================================
   Model - Comunicação com a API
   ============================================= */

const API_BASE = 'https://jsonplaceholder.typicode.com';
const TIMEOUT_MS = 8000;

async function fetchWithTimeout(url, timeoutMs = TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status} — ${res.statusText}`);
    return await res.json();
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError')
      throw new Error(`Timeout: a API não respondeu em ${timeoutMs / 1000}s`);
    throw err;
  }
}

const Model = {
  users: [],

  async fetchUsers() {
    return fetchWithTimeout(`${API_BASE}/users`);
  },

  async fetchPostsByUser(userId) {
    return fetchWithTimeout(`${API_BASE}/posts?userId=${userId}`);
  },

  async fetchCommentsByPost(postId) {
    return fetchWithTimeout(`${API_BASE}/comments?postId=${postId}`);
  }
};
