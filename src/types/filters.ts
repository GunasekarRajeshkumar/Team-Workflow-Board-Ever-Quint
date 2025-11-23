import type { TaskStatus, TaskPriority } from './task';

export interface TaskFilters {
  statuses: TaskStatus[];
  priority: TaskPriority | null;
  search: string;
}

export type SortField = 'createdAt' | 'updatedAt' | 'priority';
export type SortDirection = 'asc' | 'desc';

export interface TaskSort {
  field: SortField;
  direction: SortDirection;
}

