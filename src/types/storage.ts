import type { Task } from './task';

export interface StorageData {
  schemaVersion: number;
  tasks: Task[];
}

export const CURRENT_SCHEMA_VERSION = 2;

