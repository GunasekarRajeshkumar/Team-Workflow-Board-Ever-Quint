import React from 'react';
import styles from './Card.module.css';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  role?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, role }) => {
  const cardClassName = `${styles.card} ${onClick ? styles.cardClickable : ''} ${className}`;

  return (
    <div className={cardClassName} onClick={onClick} role={role}>
      {children}
    </div>
  );
};


