import type { Task, TaskStatus, TaskPriority } from '../types/task';
import { CURRENT_SCHEMA_VERSION } from '../types/storage';
import type { StorageData } from '../types/storage';
import { generateDummyTasks } from './dummyTasks';

const STORAGE_KEY = 'task-manager-data';

// Legacy schema v1 (simpler structure)
interface LegacyTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface LegacyStorageData {
  schemaVersion?: number;
  tasks: LegacyTask[];
}

/**
 * Migrates data from schema version 1 to version 2
 * In v2, we ensure all tasks have proper timestamps
 */
function migrateV1ToV2(data: LegacyStorageData): StorageData {
  const now = new Date().toISOString();
  return {
    schemaVersion: 2,
    tasks: data.tasks.map((task) => ({
      ...task,
      createdAt: task.createdAt || now,
      updatedAt: task.updatedAt || now,
    })),
  };
}

/**
 * Loads tasks from localStorage with migration support
 */
export function loadTasks(): { tasks: Task[]; migrated: boolean } {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // If no stored data, generate dummy tasks
      const dummyTasks = generateDummyTasks();
      saveTasks(dummyTasks);
      return { tasks: dummyTasks, migrated: false };
    }

    const data: LegacyStorageData = JSON.parse(stored);
    const schemaVersion = data.schemaVersion || 1;

    if (schemaVersion < CURRENT_SCHEMA_VERSION) {
      // Perform migration
      const migratedData = migrateV1ToV2(data);
      saveTasks(migratedData.tasks);
      return { tasks: migratedData.tasks, migrated: true };
    }

    return { tasks: (data as StorageData).tasks, migrated: false };
  } catch (error) {
    // Error handled by return value
    if (import.meta.env.DEV) {
      console.error('Failed to load tasks from storage:', error);
    }
    // On error, generate dummy tasks
    const dummyTasks = generateDummyTasks();
    saveTasks(dummyTasks);
    return { tasks: dummyTasks, migrated: false };
  }
}

/**
 * Saves tasks to localStorage
 */
export function saveTasks(tasks: Task[]): void {
  try {
    const data: StorageData = {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      tasks,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    // Error handled by return value
    if (import.meta.env.DEV) {
      console.error('Failed to save tasks to storage:', error);
    }
    throw new Error('Failed to save tasks. Storage may be unavailable.');
  }
}

/**
 * Checks if localStorage is available
 */
export function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

