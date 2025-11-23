import { describe, it, expect } from 'vitest';
import type { Task } from '../../types/task';
import type { TaskFilters, TaskSort } from '../../types/filters';
import { filterTasks, sortTasks } from '../filters';

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'High Priority Task',
    description: 'This is important',
    status: 'Backlog',
    priority: 'High',
    assignee: 'John',
    tags: ['urgent'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Medium Task',
    description: 'Medium priority',
    status: 'In Progress',
    priority: 'Medium',
    assignee: 'Jane',
    tags: [],
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    title: 'Low Priority Task',
    description: 'Not urgent',
    status: 'Done',
    priority: 'Low',
    assignee: 'Bob',
    tags: [],
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  },
];

describe('filterTasks', () => {
  it('filters by status', () => {
    const filters: TaskFilters = {
      statuses: ['Backlog'],
      priority: null,
      search: '',
    };

    const result = filterTasks(mockTasks, filters);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('filters by priority', () => {
    const filters: TaskFilters = {
      statuses: [],
      priority: 'High',
      search: '',
    };

    const result = filterTasks(mockTasks, filters);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('filters by search term in title', () => {
    const filters: TaskFilters = {
      statuses: [],
      priority: null,
      search: 'High',
    };

    const result = filterTasks(mockTasks, filters);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('filters by search term in description', () => {
    const filters: TaskFilters = {
      statuses: [],
      priority: null,
      search: 'important',
    };

    const result = filterTasks(mockTasks, filters);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('returns all tasks when no filters applied', () => {
    const filters: TaskFilters = {
      statuses: [],
      priority: null,
      search: '',
    };

    const result = filterTasks(mockTasks, filters);
    expect(result).toHaveLength(3);
  });
});

describe('sortTasks', () => {
  it('sorts by createdAt ascending', () => {
    const sort: TaskSort = {
      field: 'createdAt',
      direction: 'asc',
    };

    const result = sortTasks(mockTasks, sort);
    expect(result[0].id).toBe('1');
    expect(result[2].id).toBe('3');
  });

  it('sorts by createdAt descending', () => {
    const sort: TaskSort = {
      field: 'createdAt',
      direction: 'desc',
    };

    const result = sortTasks(mockTasks, sort);
    expect(result[0].id).toBe('3');
    expect(result[2].id).toBe('1');
  });

  it('sorts by priority', () => {
    const sort: TaskSort = {
      field: 'priority',
      direction: 'desc',
    };

    const result = sortTasks(mockTasks, sort);
    expect(result[0].priority).toBe('High');
    expect(result[2].priority).toBe('Low');
  });
});

