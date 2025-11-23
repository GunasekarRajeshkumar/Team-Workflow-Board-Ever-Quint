import React from 'react';
import type { TaskStatus, TaskPriority } from '../../types/task';
import type { TaskFilters, TaskSort } from '../../types/filters';
import { TextInput } from '../../components/ui/TextInput';
import { Select } from '../../components/ui/Select';
import type { SelectOption } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import styles from './Filters.module.css';

interface FiltersProps {
  filters: TaskFilters;
  sort: TaskSort;
  onFiltersChange: (filters: Partial<TaskFilters>) => void;
  onSortChange: (sort: Partial<TaskSort>) => void;
  onClear: () => void;
}

const statusOptions: SelectOption[] = [
  { value: 'Backlog', label: 'Backlog' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Done', label: 'Done' },
];

const priorityOptions: SelectOption[] = [
  { value: '', label: 'All Priorities' },
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
];

const sortFieldOptions: SelectOption[] = [
  { value: 'createdAt', label: 'Created Date' },
  { value: 'updatedAt', label: 'Updated Date' },
  { value: 'priority', label: 'Priority' },
];

const sortDirectionOptions: SelectOption[] = [
  { value: 'asc', label: 'Ascending' },
  { value: 'desc', label: 'Descending' },
];

export const Filters: React.FC<FiltersProps> = ({
  filters,
  sort,
  onFiltersChange,
  onSortChange,
  onClear,
}) => {
  const hasActiveFilters =
    filters.statuses.length > 0 || filters.priority !== null || filters.search !== '';

  const handleStatusToggle = (status: TaskStatus) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter((s) => s !== status)
      : [...filters.statuses, status];
    onFiltersChange({ statuses: newStatuses });
  };

  return (
    <div className={styles.filters}>
      <div className={styles.row}>
        <TextInput
          name="search"
          label="Search"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => onFiltersChange({ search: e.target.value })}
        />

        <div>
          <label className={styles.label}>Status</label>
          <div className={styles.checkboxGroup}>
            {statusOptions.map((option) => {
              const status = option.value as TaskStatus;
              return (
                <label key={option.value} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={filters.statuses.includes(status)}
                    onChange={() => handleStatusToggle(status)}
                  />
                  <span>{option.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        <Select
          name="priority"
          label="Priority"
          value={filters.priority || ''}
          onChange={(e) =>
            onFiltersChange({ priority: (e.target.value || null) as TaskPriority | null })
          }
          options={priorityOptions}
        />
      </div>

      <div className={styles.row}>
        <Select
          name="sortField"
          label="Sort By"
          value={sort.field}
          onChange={(e) => onSortChange({ field: e.target.value as TaskSort['field'] })}
          options={sortFieldOptions}
        />

        <Select
          name="sortDirection"
          label="Direction"
          value={sort.direction}
          onChange={(e) => onSortChange({ direction: e.target.value as 'asc' | 'desc' })}
          options={sortDirectionOptions}
        />

        {hasActiveFilters && (
          <div className={styles.clearButton}>
            <Button variant="secondary" onClick={onClear} size="sm">
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
