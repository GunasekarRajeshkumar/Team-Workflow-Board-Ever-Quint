import React from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { Task, TaskStatus } from '../../types/task';
import { BoardColumn } from './BoardColumn';
import { TaskCard } from './TaskCard';
import styles from './Board.module.css';

interface BoardProps {
  tasks: Task[];
  onStatusChange: (id: string, status: TaskStatus) => void;
  onTaskClick: (task: Task) => void;
}

const STATUSES: TaskStatus[] = ['Backlog', 'In Progress', 'Done'];

export const Board: React.FC<BoardProps> = ({ tasks, onStatusChange, onTaskClick }) => {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [tasksByStatus, setTasksByStatus] = React.useState<Record<TaskStatus, Task[]>>(() => {
    return STATUSES.reduce(
      (acc, status) => {
        acc[status] = tasks.filter((task) => task.status === status);
        return acc;
      },
      {} as Record<TaskStatus, Task[]>
    );
  });

  // Update tasksByStatus when tasks prop changes
  React.useEffect(() => {
    setTasksByStatus(
      STATUSES.reduce(
        (acc, status) => {
          acc[status] = tasks.filter((task) => task.status === status);
          return acc;
        },
        {} as Record<TaskStatus, Task[]>
      )
    );
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the task being dragged
    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    // If dragging over a column (status)
    if (STATUSES.includes(overId as TaskStatus)) {
      const newStatus = overId as TaskStatus;
      if (activeTask.status !== newStatus) {
        // Update the task status immediately for visual feedback
        setTasksByStatus((prev) => {
          const newState = { ...prev };
          // Remove from old status
          newState[activeTask.status] = newState[activeTask.status].filter(
            (t) => t.id !== activeId
          );
          // Add to new status
          if (!newState[newStatus].find((t) => t.id === activeId)) {
            newState[newStatus] = [
              { ...activeTask, status: newStatus },
              ...newState[newStatus],
            ];
          }
          return newState;
        });
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the task being dragged
    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    // If dropped on a column (status)
    if (STATUSES.includes(overId as TaskStatus)) {
      const newStatus = overId as TaskStatus;
      if (activeTask.status !== newStatus) {
        onStatusChange(activeId, newStatus);
      }
    }
    // If dropped on another task, use that task's status
    else {
      const overTask = tasks.find((t) => t.id === overId);
      if (overTask && activeTask.status !== overTask.status) {
        onStatusChange(activeId, overTask.status);
      }
    }
  };

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.board}>
        {STATUSES.map((status) => (
          <SortableContext
            key={status}
            id={status}
            items={tasksByStatus[status].map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <BoardColumn
              status={status}
              tasks={tasksByStatus[status]}
              onStatusChange={onStatusChange}
              onTaskClick={onTaskClick}
            />
          </SortableContext>
        ))}
      </div>
      <DragOverlay>
        {activeTask ? (
          <div style={{ opacity: 0.9, transform: 'rotate(3deg) scale(1.02)', cursor: 'grabbing' }}>
            <TaskCard
              task={activeTask}
              onStatusChange={onStatusChange}
              onClick={() => {}}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

