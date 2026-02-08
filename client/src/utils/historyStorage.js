const STORAGE_KEY = 'fitness_ai_conversations';
const MAX_HISTORY = 50;

function sortHistory(list) {
  return [...list].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return (new Date(b.updatedAt) - new Date(a.updatedAt));
  });
}

export function getHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    const arr = Array.isArray(list) ? list : [];
    const normalized = arr.map((c) => ({ ...c, pinned: Boolean(c.pinned) }));
    return sortHistory(normalized);
  } catch {
    return [];
  }
}

export function saveConversation({ id, title, messages, updatedAt, pinned }) {
  const list = getHistory();
  const index = list.findIndex((c) => c.id === id);
  const existing = index >= 0 ? list[index] : null;
  const item = {
    id,
    title: title ?? existing?.title ?? 'Cuộc hội thoại mới',
    messages: messages ?? existing?.messages ?? [],
    updatedAt: updatedAt || new Date().toISOString(),
    pinned: pinned ?? existing?.pinned ?? false,
  };
  const next = index >= 0
    ? list.map((c) => (c.id === id ? item : c))
    : [item, ...list];
  const trimmed = next.slice(0, MAX_HISTORY);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sortHistory(trimmed)));
  return getHistory();
}

export function updateConversation(id, patch) {
  const list = getHistory();
  const conv = list.find((c) => c.id === id);
  if (!conv) return list;
  const updated = { ...conv, ...patch, updatedAt: new Date().toISOString() };
  const next = list.map((c) => (c.id === id ? updated : c));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sortHistory(next)));
  return getHistory();
}

export function getConversation(id) {
  return getHistory().find((c) => c.id === id) || null;
}

export function deleteConversation(id) {
  const list = getHistory().filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return list;
}

export function generateId() {
  return 'conv_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
}

export function makeTitle(messages) {
  const firstUser = messages.find((m) => m.sender === 'user');
  if (!firstUser || !firstUser.text) return 'Cuộc hội thoại mới';
  const t = firstUser.text.trim();
  return t.length > 35 ? t.slice(0, 35) + '...' : t;
}
