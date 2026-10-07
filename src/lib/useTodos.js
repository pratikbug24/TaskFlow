import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from './api.js';
import { useToast } from '../context/ToastContext.js';

/**
 * Loads a filtered todo list and exposes optimistic CRUD helpers.
 * Shared by the Today, All todos and Completed pages.
 */
export function useTodos(filters = {}) {
  const toast = useToast();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    return params.toString();
  }, [JSON.stringify(filters)]); // eslint-disable-line react-hooks/exhaustive-deps

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api(`/todos${query ? `?${query}` : ''}`);
      setTodos(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [query, toast]);

  useEffect(() => {
    load();
  }, [load]);

  async function add(payload) {
    try {
      const created = await api('/todos', { method: 'POST', body: payload });
      setTodos((current) => [created, ...current]);
      toast.success('Task added');
      return created;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }

  async function edit(todo, patch) {
    const optimistic = { ...todo, ...patch };
    setTodos((current) => current.map((item) => (item.id === todo.id ? optimistic : item)));
    try {
      const saved = await api(`/todos/${todo.id}`, { method: 'PATCH', body: patch });
      setTodos((current) => current.map((item) => (item.id === saved.id ? saved : item)));
      return saved;
    } catch (error) {
      toast.error(error.message);
      load();
      throw error;
    }
  }

  async function toggle(todo) {
    setBusyId(todo.id);
    try {
      await edit(todo, { completed: !todo.completed });
    } finally {
      setBusyId(null);
    }
  }

  async function remove(todo) {
    const snapshot = todos;
    setTodos((current) => current.filter((item) => item.id !== todo.id));
    try {
      await api(`/todos/${todo.id}`, { method: 'DELETE' });
      toast.success('Task deleted');
    } catch (error) {
      toast.error(error.message);
      setTodos(snapshot);
    }
  }

  async function clearCompleted() {
    try {
      const { deleted } = await api('/todos/clear-completed', { method: 'POST' });
      toast.success(`${deleted} completed ${deleted === 1 ? 'task' : 'tasks'} cleared`);
      load();
    } catch (error) {
      toast.error(error.message);
    }
  }

  return { todos, loading, busyId, reload: load, add, edit, toggle, remove, clearCompleted };
}

/** Loads the aggregate todo statistics for the signed-in user. */
export function useStats() {
  const toast = useToast();
  const [stats, setStats] = useState(null);

  const load = useCallback(async () => {
    try {
      setStats(await api('/profile/stats'));
    } catch (error) {
      toast.error(error.message);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  return { stats, reloadStats: load };
}
