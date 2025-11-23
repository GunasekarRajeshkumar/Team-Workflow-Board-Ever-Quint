import React from 'react';
import type { Task, TaskStatus } from '../types/task';
import { Board } from '../features/board';
import { Filters } from '../features/filters';
import { EmptyState } from '../components/EmptyState';
import type { TaskFilters, TaskSort } from '../types/filters';
import { filterTasks, sortTasks } from '../utils/filters';

interface BoardPageProps {
  tasks: Task[];
  filters: TaskFilters;
  sort: TaskSort;
  onFiltersChange: (filters: Partial<TaskFilters>) => void;
  onSortChange: (sort: Partial<TaskSort>) => void;
  onClearFilters: () => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onTaskClick: (task: Task) => void;
}

export const BoardPage: React.FC<BoardPageProps> = ({
  tasks,
  filters,
  sort,
  onFiltersChange,
  onSortChange,
  onClearFilters,
  onStatusChange,
  onTaskClick,
}) => {
  const filteredAndSortedTasks = React.useMemo(() => {
    const filtered = filterTasks(tasks, filters);
    return sortTasks(filtered, sort);
  }, [tasks, filters, sort]);

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: 700, color: 'var(--color-neutral-dark)' }}>
          Task Board
        </h1>
        <p style={{ margin: 0, color: 'var(--color-neutral-medium)' }}>
          Manage and organize your tasks
        </p>
      </div>

      <Filters
        filters={filters}
        sort={sort}
        onFiltersChange={onFiltersChange}
        onSortChange={onSortChange}
        onClear={onClearFilters}
      />

      {tasks.length === 0 ? (
        <EmptyState
          title="No tasks yet"
          message="Get started by creating your first task!"
        />
      ) : filteredAndSortedTasks.length === 0 ? (
        <EmptyState
          title="No tasks match your filters"
          message="Try adjusting your filters to see more tasks."
          actionLabel="Clear Filters"
          onAction={onClearFilters}
        />
      ) : (
        <Board
          tasks={filteredAndSortedTasks}
          onStatusChange={onStatusChange}
          onTaskClick={onTaskClick}
        />
      )}
    </div>
  );
};


