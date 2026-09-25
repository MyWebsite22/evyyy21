const configured = import.meta.env.VITE_API_URL?.trim();

export function getApiUrl() {
  return configured || localStorage.getItem('mimi-api-url') || 'http://localhost:8787';
}

export function setApiUrl(url) {
  const clean = url.trim().replace(/\/$/, '');
  localStorage.setItem('mimi-api-url', clean);
  return clean;
}

async function request(path, options = {}) {
  const token = sessionStorage.getItem('mimi-token');
  const response = await fetch(`${getApiUrl()}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  let data = {};
  try { data = await response.json(); } catch {}
  if (!response.ok) throw new Error(data.error || 'No pude conectar con el refugio.');
  return data;
}

export const api = {
  health: () => request('/api/health'),
  login: (password) => request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ password })
  }),
  chat: (message, history) => request('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ message, history })
  })
};
