import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { TaskStatus } from '../../types/task';
import { Button } from '../ui/Button';
import styles from './Sidebar.module.css';

interface SidebarProps {
  taskCounts: Record<TaskStatus, number>;
  onCreateTask?: () => void;
  onClose?: () => void;
}

const statusConfig: Array<{ status: TaskStatus; label: string }> = [
  { status: 'Backlog', label: 'Backlog' },
  { status: 'In Progress', label: 'In Progress' },
  { status: 'Done', label: 'Done' },
];

export const Sidebar: React.FC<SidebarProps> = ({ taskCounts, onCreateTask, onClose }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || (path === '/dashboard' && location.pathname === '/');
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h2 className={styles.logo}>Ever Quint</h2>
        {onClose && (
          <button 
            className={styles.closeButton}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onClose) {
                onClose();
              }
            }}
            aria-label="Close sidebar"
            type="button"
          >
            <span className={styles.closeIcon}>×</span>
          </button>
        )}
      </div>
      <nav className={styles.nav}>
        <Link
          to="/dashboard"
          className={`${styles.navItem} ${isActive('/dashboard') ? styles.active : ''}`}
        >
          <span className={styles.navLabel}>Dashboard</span>
        </Link>
        <Link
          to="/board"
          className={`${styles.navItem} ${isActive('/board') ? styles.active : ''}`}
        >
          <span className={styles.navLabel}>Board</span>
        </Link>
      </nav>
      {onCreateTask && (
        <div className={styles.createButtonSection}>
          <Button variant="primary" onClick={onCreateTask} className={styles.createButton}>
            + Create Task
          </Button>
        </div>
      )}
      <div className={styles.statusSection}>
        <h3 className={styles.statusTitle}>Status</h3>
        {statusConfig.map(({ status, label }) => (
          <div key={status} className={styles.statusItem}>
            <span className={styles.statusLabel}>{label}</span>
            <span className={styles.statusCount}>{taskCounts[status]}</span>
          </div>
        ))}
      </div>
    </aside>
  );
};
