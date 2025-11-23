import { useState, useEffect, useCallback } from 'react';
import type { Task } from '../types/task';
import { loadTasks, saveTasks, isStorageAvailable } from '../utils/storage';

export function useStorage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [migrated, setMigrated] = useState(false);

  useEffect(() => {
    if (!isStorageAvailable()) {
      setError('Local storage is not available. Your data will not be persisted.');
      setIsLoading(false);
      return;
    }

    try {
      const { tasks: loadedTasks, migrated: wasMigrated } = loadTasks();
      setTasks(loadedTasks);
      setMigrated(wasMigrated);
      setError(null);
    } catch (err) {
      setError('Failed to load tasks from storage.');
      if (import.meta.env.DEV) {
        console.error('Storage load error:', err);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateTasks = useCallback(
    (newTasks: Task[]) => {
      setTasks(newTasks);
      if (isStorageAvailable()) {
        try {
          saveTasks(newTasks);
          setError(null);
        } catch (err) {
          setError('Failed to save tasks to storage.');
          if (import.meta.env.DEV) {
            console.error('Storage save error:', err);
          }
        }
      }
    },
    []
  );

  const addTask = useCallback(
    (task: Task) => {
      // Add new task at the beginning so it appears first
      const newTasks = [task, ...tasks];
      updateTasks(newTasks);
    },
    [tasks, updateTasks]
  );

  const updateTask = useCallback(
    (id: string, updates: Partial<Task>) => {
      const newTasks = tasks.map((task) =>
        task.id === id ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task
      );
      updateTasks(newTasks);
    },
    [tasks, updateTasks]
  );

  const deleteTask = useCallback(
    (id: string) => {
      const newTasks = tasks.filter((task) => task.id !== id);
      updateTasks(newTasks);
    },
    [tasks, updateTasks]
  );

  return {
    tasks,
    isLoading,
    error,
    migrated,
    addTask,
    updateTask,
    deleteTask,
  };
}

