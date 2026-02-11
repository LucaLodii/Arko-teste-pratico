import type { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: 'none' | 'small' | 'medium' | 'large';
  variant?: 'default' | 'outlined' | 'flat';
  highlight?: 'none' | 'success';
}

export function Card({
  children,
  padding = 'medium',
  variant = 'default',
  highlight = 'none',
  className,
  ...rest
}: CardProps) {
  const baseStyles = 'rounded-2xl transition-all duration-300';
  const variants = {
    default: 'border border-olive-50 bg-white shadow-soft',
    outlined: 'border border-olive-200 bg-transparent',
    flat: 'border border-transparent bg-olive-50/50',
  };
  const paddings = {
    none: '',
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8',
  };
  const highlights = {
    none: '',
    success: 'relative overflow-hidden bg-sage-50/30 ring-2 ring-sage-400',
  };

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${highlights[highlight]} ${className ?? ''}`.trim()}
      {...rest}
    >
      {highlight === 'success' && (
        <div className="absolute right-0 top-0 rounded-bl-lg bg-sage-400 px-3 py-1 text-xs font-bold text-olive-900">
          Melhor Opção
        </div>
      )}
      {children}
    </div>
  );
}
