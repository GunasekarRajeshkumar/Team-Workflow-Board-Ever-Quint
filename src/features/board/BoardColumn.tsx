import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { Task, TaskStatus } from '../../types/task';
import { TaskCard } from './TaskCard';
import styles from './BoardColumn.module.css';

interface BoardColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onStatusChange: (id: string, status: TaskStatus) => void;
  onTaskClick: (task: Task) => void;
}

const statusLabels: Record<TaskStatus, string> = {
  'Backlog': 'Backlog',
  'In Progress': 'In Progress',
  'Done': 'Done',
};

export const BoardColumn: React.FC<BoardColumnProps> = ({
  status,
  tasks,
  onStatusChange,
  onTaskClick,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      className={`${styles.column} ${isOver ? styles.columnOver : ''}`}
      data-status={status}
    >
      <div className={styles.header}>
        <h2 className={styles.title}>{statusLabels[status]}</h2>
        <span className={styles.count}>{tasks.length}</span>
      </div>
      <div className={styles.tasks}>
        {tasks.length === 0 ? (
          <div className={styles.empty}>No tasks in this column</div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={onStatusChange}
              onClick={() => onTaskClick(task)}
            />
          ))
        )}
      </div>
    </div>
  );
};

