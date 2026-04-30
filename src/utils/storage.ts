import type { AppState } from '../types';
import { PREDEFINED_CATEGORIES } from '../constants/categories';

const STORAGE_KEY = 'dailyreport_v1';

const DEFAULT_STATE: AppState = {
  entries: [],
  plans: [],
  categories: [...PREDEFINED_CATEGORIES],
};

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE, categories: [...PREDEFINED_CATEGORIES] };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parsed = JSON.parse(raw) as any;
    // 旧データ（customCategories）からの移行
    if (Array.isArray(parsed.customCategories) && !Array.isArray(parsed.categories)) {
      const merged = [...PREDEFINED_CATEGORIES];
      for (const c of parsed.customCategories) {
        if (!merged.includes(c)) merged.push(c);
      }
      return { entries: Array.isArray(parsed.entries) ? parsed.entries : [], plans: [], categories: merged };
    }
    return {
      entries: Array.isArray(parsed.entries) ? parsed.entries : [],
      plans: Array.isArray(parsed.plans) ? parsed.plans : [],
      categories: Array.isArray(parsed.categories) && parsed.categories.length > 0
        ? parsed.categories
        : [...PREDEFINED_CATEGORIES],
    };
  } catch {
    return { ...DEFAULT_STATE, categories: [...PREDEFINED_CATEGORIES] };
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
