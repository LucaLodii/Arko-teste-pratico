import { useState } from 'react';
import styles from './Tooltip.module.css';

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={styles.tooltipContainer}>
      <span
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className={styles.tooltipTrigger}
        tabIndex={0}
      >
        {children}
      </span>
      {isVisible && (
        <div className={styles.tooltipContent} role="tooltip">
          {content}
        </div>
      )}
    </div>
  );
}
