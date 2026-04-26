import type { AppState } from '../types';

const STORAGE_KEY = 'dailyreport_v1';

const DEFAULT_STATE: AppState = {
  entries: [],
  customCategories: [],
};

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw) as AppState;
    return {
      entries: Array.isArray(parsed.entries) ? parsed.entries : [],
      customCategories: Array.isArray(parsed.customCategories) ? parsed.customCategories : [],
    };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

let saveTimer: ReturnType<typeof setTimeout> | null = null;

export function saveState(state: AppState): void {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // localStorage が利用不可の場合は無視
    }
  }, 300);
}
