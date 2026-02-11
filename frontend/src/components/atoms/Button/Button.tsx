import type { ButtonHTMLAttributes } from 'react';
import { Spinner } from '../Spinner';
import styles from './Button.module.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  type = 'button',
  disabled,
  fullWidth,
  loading,
  className,
  ...rest
}: ButtonProps) {
  const variantClass = styles[`button--${variant}`];
  const fullWidthClass = fullWidth ? styles['button--fullWidth'] : '';
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`${styles.button} ${variantClass} ${fullWidthClass} ${className ?? ''}`.trim()}
      {...rest}
    >
      {loading && <Spinner size="sm" />}
      {loading ? 'Calculando...' : children}
    </button>
  );
}
