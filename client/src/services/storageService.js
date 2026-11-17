import { INITIAL_ITEMS } from '../data/initialItems';

const STORAGE_KEYS = {
  ITEMS: 'lost_found_items_v3',
  USER: 'lost_found_user_v3',
  THEME: 'lost_found_theme_v3'
};

export const DEFAULT_USER = {
  id: 101,
  name: 'Bilal Ahmed',
  email: 'bilal.ahmed@campus.edu',
  studentId: 'STU-2026-8812',
  role: 'student', // 'student' or 'admin'
  avatar: 'BA'
};

export const storageService = {
  getItems: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ITEMS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading items from localStorage:', e);
    }
    // Seed default items
    storageService.saveItems(INITIAL_ITEMS);
    return INITIAL_ITEMS;
  },

  saveItems: (items) => {
    try {
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
    } catch (e) {
      console.error('Error saving items to localStorage:', e);
    }
  },

  getUser: () => {
    try {
      const user = localStorage.getItem(STORAGE_KEYS.USER);
      if (user) return JSON.parse(user);
    } catch (e) {
      console.warn('Error reading user:', e);
    }
    return DEFAULT_USER;
  },

  saveUser: (user) => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (e) {
      console.error('Error saving user:', e);
    }
  },

  getTheme: () => {
    try {
      const theme = localStorage.getItem(STORAGE_KEYS.THEME);
      if (theme) return theme;
    } catch {
      // ignore
    }
    return 'light';
  },

  saveTheme: (theme) => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch {
      // ignore
    }
  },

  resetDemoData: () => {
    localStorage.removeItem(STORAGE_KEYS.ITEMS);
    return INITIAL_ITEMS;
  }
};
