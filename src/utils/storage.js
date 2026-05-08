const STORAGE_KEYS = {
  THEME: 'iss_dashboard_theme',
  NEWS: 'iss_dashboard_news',
  CHAT: 'iss_dashboard_chat',
  POSITIONS: 'iss_dashboard_positions',
};

export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to local storage:', error);
  }
};

export const getFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting from local storage:', error);
    return null;
  }
};

export const getTheme = () => getFromStorage(STORAGE_KEYS.THEME) || 'dark';
export const saveTheme = (theme) => saveToStorage(STORAGE_KEYS.THEME, theme);

export const getCachedNews = () => {
  const cached = getFromStorage(STORAGE_KEYS.NEWS);
  if (!cached) return null;

  const { data, timestamp } = cached;
  const now = Date.now();
  const fifteenMinutes = 15 * 60 * 1000;

  if (now - timestamp > fifteenMinutes) {
    localStorage.removeItem(STORAGE_KEYS.NEWS);
    return null;
  }

  return data;
};

export const saveCachedNews = (data) => {
  saveToStorage(STORAGE_KEYS.NEWS, {
    data,
    timestamp: Date.now(),
  });
};

export const getChatHistory = () => getFromStorage(STORAGE_KEYS.CHAT) || [];
export const saveChatHistory = (history) => {
  const limitedHistory = history.slice(-30);
  saveToStorage(STORAGE_KEYS.CHAT, limitedHistory);
};

export const clearChatHistory = () => localStorage.removeItem(STORAGE_KEYS.CHAT);

export const getSavedPositions = () => getFromStorage(STORAGE_KEYS.POSITIONS) || [];
export const savePositions = (positions) => saveToStorage(STORAGE_KEYS.POSITIONS, positions);
