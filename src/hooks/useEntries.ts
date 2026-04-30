import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { TaskEntry, PlanEntry, AppState } from '../types';
import { computeDurationMinutes } from '../utils/time';

export type NewEntryInput = Omit<TaskEntry, 'id' | 'durationMinutes' | 'createdAt' | 'updatedAt'>;
export type NewPlanInput = Omit<PlanEntry, 'id' | 'estimatedMinutes' | 'createdAt' | 'updatedAt'>;

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
      if (prev.categories.includes(category)) return prev;
      return { ...prev, categories: [...prev.categories, category] };
    });
  }, [setState]);

  const editCategory = useCallback((oldName: string, newName: string) => {
    const now = new Date().toISOString();
    setState((prev: AppState) => ({
      categories: prev.categories.map((c) => (c === oldName ? newName : c)),
      entries: prev.entries.map((e) =>
        e.category === oldName ? { ...e, category: newName, updatedAt: now } : e
      ),
      plans: prev.plans.map((p) =>
        p.category === oldName ? { ...p, category: newName, updatedAt: now } : p
      ),
    }));
  }, [setState]);

  const deleteCategory = useCallback((category: string) => {
    setState((prev: AppState) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== category),
    }));
  }, [setState]);

  const addPlan = useCallback((input: NewPlanInput) => {
    const now = new Date().toISOString();
    const plan: PlanEntry = {
      ...input,
      id: crypto.randomUUID(),
      estimatedMinutes: computeDurationMinutes(input.startTime, input.endTime),
      createdAt: now,
      updatedAt: now,
    };
    setState((prev: AppState) => ({ ...prev, plans: [plan, ...prev.plans] }));
  }, [setState]);

  const updatePlan = useCallback((id: string, input: NewPlanInput) => {
    const now = new Date().toISOString();
    setState((prev: AppState) => ({
      ...prev,
      plans: prev.plans.map((p) =>
        p.id === id
          ? { ...p, ...input, estimatedMinutes: computeDurationMinutes(input.startTime, input.endTime), updatedAt: now }
          : p
      ),
    }));
  }, [setState]);

  const deletePlan = useCallback((id: string) => {
    setState((prev: AppState) => ({
      ...prev,
      plans: prev.plans.filter((p) => p.id !== id),
    }));
  }, [setState]);

  return {
    entries: state.entries,
    plans: state.plans,
    categories: state.categories,
    addEntry,
    updateEntry,
    deleteEntry,
    addCategory,
    editCategory,
    deleteCategory,
    addPlan,
    updatePlan,
    deletePlan,
  };
}
