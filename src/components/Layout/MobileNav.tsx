import React from "react";
import { Link, useLocation } from "react-router-dom";
import type { TaskStatus } from "../../types/task";
import { Button } from "../ui/Button";
import styles from "./MobileNav.module.css";

interface MobileNavProps {
  taskCounts: Record<TaskStatus, number>;
  onCreateTask?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onCreateTask }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return (
      location.pathname === path ||
      (path === "/board" && location.pathname === "/")
    );
  };

  return (
    <nav className={styles.mobileNav}>
      <div className={styles.navTop}>
        <h2 className={styles.logo}>Ever Quint</h2>
        {onCreateTask && (
          <Button
            variant="primary"
            onClick={onCreateTask}
            className={styles.createButton}
            size="sm"
          >
            Create Task
          </Button>
        )}
      </div>
      <div className={styles.navLinks}>
        <Link
          to="/dashboard"
          className={`${styles.navLink} ${
            isActive("/dashboard") ? styles.active : ""
          }`}
        >
          Dashboard
        </Link>
        <Link
          to="/board"
          className={`${styles.navLink} ${
            isActive("/board") ? styles.active : ""
          }`}
        >
          Board
        </Link>
      </div>
    </nav>
  );
};
