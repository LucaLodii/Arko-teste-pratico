/**
 * InputField molecule
 *
 * Import rules:
 * - Molecules import atoms from '../../atoms'
 * - Organisms import atoms from '../../atoms' and molecules from '../../molecules'
 */
import { useId } from 'react';
import type { InputHTMLAttributes } from 'react';
import { Label, Input, Tooltip, Icon } from '../../atoms';

export interface InputFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | boolean;
  helperText?: string;
  fullWidth?: boolean;
  id?: string;
  tooltip?: string;
}

export function InputField({
  label,
  value,
  onChange,
  error,
  helperText,
  fullWidth = true,
  id: idProp,
  tooltip,
  required,
  type = 'text',
  placeholder,
  disabled,
  min,
  max,
  step,
  className,
  ...rest
}: InputFieldProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;

  const errorMessage = typeof error === 'string' ? error : undefined;
  const hasError = !!error;
  const describedBy =
    errorMessage ? `${id}-error` : helperText ? `${id}-helper` : undefined;

  return (
    <div className={`flex flex-col ${fullWidth ? 'w-full' : ''} ${className ?? ''}`.trim()}>
      <div className="mb-1.5 flex items-center gap-1.5">
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
        {tooltip && (
          <Tooltip content={tooltip}>
            <span aria-label="Mais informações">
              <Icon name="info" />
            </span>
          </Tooltip>
        )}
      </div>
      <Input
        id={id}
        type={(type === 'number' || type === 'email' ? type : 'text') as 'text' | 'number' | 'email'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        min={typeof min === 'number' ? min : undefined}
        max={typeof max === 'number' ? max : undefined}
        step={typeof step === 'number' ? step : undefined}
        error={hasError}
        aria-invalid={hasError}
        aria-describedby={describedBy}
        {...rest}
      />
      <div className="mt-1.5 min-h-[20px]">
        {errorMessage ? (
          <span
            id={`${id}-error`}
            className="flex items-center gap-1 text-sm font-medium text-status-error animate-slide-down"
            role="alert"
          >
            <Icon name="error" size="sm" className="shrink-0" />
            {errorMessage}
          </span>
        ) : helperText ? (
          <span id={`${id}-helper`} className="text-xs text-olive-500">
            {helperText}
          </span>
        ) : null}
      </div>
    </div>
  );
}
