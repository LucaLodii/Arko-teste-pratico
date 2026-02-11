import type { ButtonHTMLAttributes } from 'react';
import { Spinner } from '../Spinner';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  children,
  variant = 'primary',
  type = 'button',
  disabled,
  fullWidth,
  loading,
  className,
  icon,
  ...rest
}: ButtonProps) {
  const baseStyles =
    'relative inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:active:scale-100 disabled:cursor-not-allowed disabled:opacity-60 min-h-[48px] px-6 py-2 text-base';
  const variants = {
    primary:
      'bg-sage-400 hover:bg-sage-500 text-olive-900 shadow-sm focus-visible:ring-sage-400',
    secondary:
      'bg-white border border-sage-300 text-olive-700 hover:bg-sage-50 hover:border-sage-400 focus-visible:ring-sage-400',
    ghost: 'bg-transparent text-olive-600 hover:text-olive-900 hover:bg-olive-50/50',
  };
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className ?? ''}`.trim()}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <>
          <Spinner size="sm" />
          <span>Calculando...</span>
        </>
      ) : (
        <>
          {icon && <span className="h-5 w-5">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}
