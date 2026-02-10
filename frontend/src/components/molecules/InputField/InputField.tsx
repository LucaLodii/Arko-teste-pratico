import { useId } from 'react';
import { Label, Input } from '../../atoms';
import styles from './InputField.module.css';

export interface InputFieldProps {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: 'text' | 'number' | 'email';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  id?: string;
}

export function InputField({
  label,
  value,
  onChange,
  error,
  type = 'text',
  placeholder,
  required,
  disabled,
  min,
  max,
  step,
  id: idProp,
}: InputFieldProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;

  return (
    <div className={styles.inputField}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        error={!!error}
        min={min}
        max={max}
        step={step}
      />
      {error && (
        <span className={styles.errorMessage} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
