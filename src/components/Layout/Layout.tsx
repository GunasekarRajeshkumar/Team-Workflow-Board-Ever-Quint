import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import type { Task, TaskStatus } from '../../types/task';
import styles from './Layout.module.css';

interface LayoutProps {
  tasks: Task[];
  onCreateTask?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ tasks, onCreateTask }) => {
  const [isMobile, setIsMobile] = useState(false);

  const taskCounts = React.useMemo(() => {
    return tasks.reduce(
      (acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
      },
      { Backlog: 0, 'In Progress': 0, Done: 0 } as Record<TaskStatus, number>
    );
  }, [tasks]);

  // Check if mobile on mount and resize
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className={styles.layout}>
      <MobileNav 
        taskCounts={taskCounts} 
        onCreateTask={onCreateTask}
      />
      {!isMobile && (
        <div className={styles.sidebarWrapper}>
          <Sidebar 
            taskCounts={taskCounts} 
            onCreateTask={onCreateTask}
          />
        </div>
      )}
      <div className={styles.mainContent}>
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
