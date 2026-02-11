import type { LabelHTMLAttributes } from 'react';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
}

export function Label({ children, htmlFor, required, className, ...rest }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-olive-700 mb-1.5 ${className ?? ''}`.trim()}
      {...rest}
    >
      {children}
      {required && <span className="text-status-error ml-1" aria-hidden="true">*</span>}
    </label>
  );
}
