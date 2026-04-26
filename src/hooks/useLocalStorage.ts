import { useState, useEffect } from 'react';
import { loadState, saveState } from '../utils/storage';
import type { AppState } from '../types';

export function useLocalStorage() {
  const [state, setState] = useState<AppState>(() => loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  return { state, setState };
}
