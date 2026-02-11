import type { InputHTMLAttributes } from 'react';

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
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
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
  fullWidth = true,
  leftIcon,
  rightIcon,
  ...rest
}: InputProps) {
  const baseStyles =
    'block rounded-lg border text-olive-900 placeholder:text-olive-300 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 min-h-[48px] sm:text-sm text-base';
  const stateStyles = error
    ? 'border-status-error/50 focus:border-status-error focus:ring-status-error/20 bg-red-50/10'
    : 'border-olive-200 hover:border-olive-300 focus:border-sage-400 focus:ring-sage-400/20 bg-white';
  const disabledStyles = disabled ? 'opacity-60 bg-olive-50 cursor-not-allowed' : '';
  const widthClass = fullWidth ? 'w-full' : '';
  const paddingLeft = leftIcon ? 'pl-10' : 'pl-4';
  const paddingRight = rightIcon ? 'pr-10' : 'pr-4';

  return (
    <div className={`relative ${widthClass}`}>
      {leftIcon && (
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-olive-400">
          {leftIcon}
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        className={`${baseStyles} ${stateStyles} ${disabledStyles} ${widthClass} ${paddingLeft} ${paddingRight} py-2.5 ${className ?? ''}`.trim()}
        aria-invalid={error}
        {...rest}
      />
      {rightIcon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-olive-400">{rightIcon}</div>
      )}
    </div>
  );
}
