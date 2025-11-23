import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task, TaskPriority } from '../../types/task';
import { Card } from '../../components/ui/Card';
import { Tag } from '../../components/ui/Tag';
import { Select } from '../../components/ui/Select';
import { formatRelativeTime } from '../../utils/date';
import styles from './TaskCard.module.css';

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, status: Task['status']) => void;
  onClick: () => void;
}

const priorityColors: Record<TaskPriority, 'error' | 'warning' | 'default'> = {
  High: 'error',
  Medium: 'warning',
  Low: 'default',
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onStatusChange, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const statusOptions = [
    { value: 'Backlog', label: 'Backlog' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Done', label: 'Done' },
  ];

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onStatusChange(task.id, e.target.value as Task['status']);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={isDragging ? styles.dragging : ''}
    >
      <Card className={styles.card} onClick={onClick} role="button">
        <div className={styles.header}>
          <h3 className={styles.title}>{task.title}</h3>
          <Tag variant={priorityColors[task.priority]}>{task.priority}</Tag>
        </div>
        {task.description && (
          <p className={styles.description}>{task.description}</p>
        )}
        {task.assignee && (
          <div className={styles.assignee}>
            <span className={styles.label}>👤</span>
            <span>{task.assignee}</span>
          </div>
        )}
        {task.tags.length > 0 && (
          <div className={styles.tags}>
            {task.tags.map((tag, index) => (
              <Tag key={index} variant="primary">
                {tag}
              </Tag>
            ))}
          </div>
        )}
        <div className={styles.footer}>
          <div onClick={(e) => e.stopPropagation()}>
            <Select
              value={task.status}
              onChange={handleStatusChange}
              options={statusOptions}
              className={styles.statusSelect}
            />
          </div>
          <span className={styles.time}>🕒 {formatRelativeTime(task.updatedAt)}</span>
        </div>
      </Card>
    </div>
  );
};

