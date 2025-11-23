import type { TaskStatus, TaskPriority } from '../types/task';
import type { TaskFilters, TaskSort } from '../types/filters';

/**
 * Parses URL search params into filter and sort state
 */
export function parseUrlParams(searchParams: URLSearchParams): {
  filters: TaskFilters;
  sort: TaskSort;
} {
  const statusParam = searchParams.get('status');
  const statuses: TaskStatus[] = statusParam
    ? (statusParam.split(',') as TaskStatus[]).filter((s) =>
        ['Backlog', 'In Progress', 'Done'].includes(s)
      )
    : [];

  const priorityParam = searchParams.get('priority');
  const priority: TaskPriority | null = priorityParam &&
  ['Low', 'Medium', 'High'].includes(priorityParam)
    ? (priorityParam as TaskPriority)
    : null;

  const search = searchParams.get('search') || '';

  const sortField = searchParams.get('sortField') || 'createdAt';
  const sortDirection = (searchParams.get('sortDirection') || 'desc') as 'asc' | 'desc';

  return {
    filters: {
      statuses,
      priority,
      search,
    },
    sort: {
      field: (['createdAt', 'updatedAt', 'priority'].includes(sortField)
        ? sortField
        : 'updatedAt') as TaskSort['field'],
      direction: sortDirection,
    },
  };
}

/**
 * Converts filter and sort state to URL search params
 */
export function buildUrlParams(filters: TaskFilters, sort: TaskSort): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.statuses.length > 0) {
    params.set('status', filters.statuses.join(','));
  }

  if (filters.priority) {
    params.set('priority', filters.priority);
  }

  if (filters.search) {
    params.set('search', filters.search);
  }

  if (sort.field !== 'createdAt' || sort.direction !== 'desc') {
    params.set('sortField', sort.field);
    params.set('sortDirection', sort.direction);
  }

  return params;
}

