import type { LabelHTMLAttributes } from 'react';
import styles from './Label.module.css';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
}

export function Label({ children, htmlFor, required, className, ...rest }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={`${styles.label} ${className ?? ''}`.trim()}
      {...rest}
    >
      {children}
      {required && <span className={styles.required} aria-hidden="true">*</span>}
    </label>
  );
}
