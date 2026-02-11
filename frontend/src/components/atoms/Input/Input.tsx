import type { InputHTMLAttributes } from 'react';
import styles from './Input.module.css';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  type?: 'text' | 'number' | 'email';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

export function Input({
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled,
  error,
  min,
  max,
  step,
  className,
  ...rest
}: InputProps) {
  const errorClass = error ? styles['input--error'] : '';

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      min={min}
      max={max}
      step={step}
      className={`${styles.input} ${errorClass} ${className ?? ''}`.trim()}
      aria-invalid={error}
      {...rest}
    />
  );
}
