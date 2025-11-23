import type { Task, TaskPriority } from '../types/task';
import type { TaskFilters, TaskSort } from '../types/filters';

/**
 * Filters tasks based on the provided filters
 */
export function filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
  return tasks.filter((task) => {
    // Status filter
    if (filters.statuses.length > 0 && !filters.statuses.includes(task.status)) {
      return false;
    }

    // Priority filter
    if (filters.priority && task.priority !== filters.priority) {
      return false;
    }

    // Search filter (title and description)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesTitle = task.title.toLowerCase().includes(searchLower);
      const matchesDescription = task.description.toLowerCase().includes(searchLower);
      if (!matchesTitle && !matchesDescription) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Sorts tasks based on the provided sort configuration
 */
export function sortTasks(tasks: Task[], sort: TaskSort): Task[] {
  const sorted = [...tasks];

  sorted.sort((a, b) => {
    let comparison = 0;

    switch (sort.field) {
      case 'createdAt':
      case 'updatedAt':
        comparison = new Date(a[sort.field]).getTime() - new Date(b[sort.field]).getTime();
        break;
      case 'priority':
        const priorityOrder: Record<TaskPriority, number> = {
          High: 3,
          Medium: 2,
          Low: 1,
        };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
    }

    return sort.direction === 'asc' ? comparison : -comparison;
  });

  return sorted;
}

