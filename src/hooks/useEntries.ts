import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { TaskEntry, AppState } from '../types';
import { computeDurationMinutes } from '../utils/time';

export type NewEntryInput = Omit<TaskEntry, 'id' | 'durationMinutes' | 'createdAt' | 'updatedAt'>;

export function useEntries() {
  const { state, setState } = useLocalStorage();

  const addEntry = useCallback((input: NewEntryInput) => {
    const now = new Date().toISOString();
    const entry: TaskEntry = {
      ...input,
      id: crypto.randomUUID(),
      durationMinutes: computeDurationMinutes(input.startTime, input.endTime),
      createdAt: now,
      updatedAt: now,
    };
    setState((prev: AppState) => ({ ...prev, entries: [entry, ...prev.entries] }));
  }, [setState]);

  const updateEntry = useCallback((id: string, input: NewEntryInput) => {
    const now = new Date().toISOString();
    setState((prev: AppState) => ({
      ...prev,
      entries: prev.entries.map((e) =>
        e.id === id
          ? {
              ...e,
              ...input,
              durationMinutes: computeDurationMinutes(input.startTime, input.endTime),
              updatedAt: now,
            }
          : e
      ),
    }));
  }, [setState]);

  const deleteEntry = useCallback((id: string) => {
    setState((prev: AppState) => ({
      ...prev,
      entries: prev.entries.filter((e) => e.id !== id),
    }));
  }, [setState]);

  const addCategory = useCallback((category: string) => {
    setState((prev: AppState) => {
      if (prev.customCategories.includes(category)) return prev;
      return { ...prev, customCategories: [...prev.customCategories, category] };
    });
  }, [setState]);

  return {
    entries: state.entries,
    customCategories: state.customCategories,
    addEntry,
    updateEntry,
    deleteEntry,
    addCategory,
  };
}
