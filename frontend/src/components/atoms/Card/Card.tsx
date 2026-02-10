import type { HTMLAttributes } from 'react';
import styles from './Card.module.css';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'outlined';
}

export function Card({
  children,
  padding = 'medium',
  variant = 'default',
  className,
  ...rest
}: CardProps) {
  const paddingClass = styles[`card--padding-${padding}`];
  const variantClass = variant === 'outlined' ? styles['card--outlined'] : '';

  return (
    <div
      className={`${styles.card} ${paddingClass} ${variantClass} ${className ?? ''}`.trim()}
      {...rest}
    >
      {children}
    </div>
  );
}
