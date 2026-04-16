export type AuthSession = {
  username: string;
  token: string;
};

const AUTH_STORAGE_KEY = 'lab04.auth.session';
const AUTH_CHANGED_EVENT = 'lab04-auth-changed';

const emitAuthChanged = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
  }
};

const toBase64 = (value: string) => {
  const bytes = new TextEncoder().encode(value);
  let binary = '';

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary);
};

export const buildBasicAuthHeader = (username: string, password: string) => `Basic ${toBase64(`${username}:${password}`)}`;

export const saveAuthSession = (session: AuthSession) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  emitAuthChanged();
};

export const loadAuthSession = (): AuthSession | null => {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
};

export const clearAuthSession = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  emitAuthChanged();
};

export const getAuthHeaders = () => {
  const session = loadAuthSession();

  if (!session) {
    return {};
  }

  return {
    Authorization: `Basic ${session.token}`,
  };
};

export const onAuthChanged = (handler: () => void) => {
  window.addEventListener(AUTH_CHANGED_EVENT, handler);
  window.addEventListener('storage', handler);

  return () => {
    window.removeEventListener(AUTH_CHANGED_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
};

