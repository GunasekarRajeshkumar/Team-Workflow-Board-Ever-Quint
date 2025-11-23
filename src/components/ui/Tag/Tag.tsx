import React from 'react';
import styles from './Tag.module.css';

export interface TagProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  onRemove?: () => void;
}

export const Tag: React.FC<TagProps> = ({ children, variant = 'default', onRemove }) => {
  return (
    <span className={`${styles.tag} ${styles[`tag--${variant}`]}`}>
      {children}
      {onRemove && (
        <button
          type="button"
          className={styles.removeButton}
          onClick={onRemove}
          aria-label={`Remove ${children}`}
        >
          ×
        </button>
      )}
    </span>
  );
};


