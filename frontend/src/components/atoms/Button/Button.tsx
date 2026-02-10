import type { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  type = 'button',
  disabled,
  fullWidth,
  className,
  ...rest
}: ButtonProps) {
  const variantClass = styles[`button--${variant}`];
  const fullWidthClass = fullWidth ? styles['button--fullWidth'] : '';

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${styles.button} ${variantClass} ${fullWidthClass} ${className ?? ''}`.trim()}
      {...rest}
    >
      {children}
    </button>
  );
}
