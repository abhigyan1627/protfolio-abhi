import type { InputHTMLAttributes, ReactNode, Ref, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cx } from '../../lib/cx';
import { errorClass, hintClass, inputClass, labelClass } from './styles';

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

export function Field({ id, label, error, hint, required, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        {required && <span className="text-red-800"> *</span>}
      </label>
      {children}
      {hint && !error && <p className={hintClass}>{hint}</p>}
      {error && (
        <p id={`${id}-error`} className={errorClass}>
          {error}
        </p>
      )}
    </div>
  );
}

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & { id: string; invalid?: boolean; ref?: Ref<HTMLInputElement> };

export function TextInput({ id, invalid, className, ...props }: TextInputProps) {
  return (
    <input
      id={id}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid ? `${id}-error` : undefined}
      className={cx(inputClass, className)}
      {...props}
    />
  );
}

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { id: string; invalid?: boolean; ref?: Ref<HTMLTextAreaElement> };

export function TextArea({ id, invalid, className, ...props }: TextAreaProps) {
  return (
    <textarea
      id={id}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid ? `${id}-error` : undefined}
      className={cx(inputClass, 'min-h-28 resize-y', className)}
      {...props}
    />
  );
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { id: string; invalid?: boolean; ref?: Ref<HTMLSelectElement> };

export function SelectInput({ id, invalid, className, children, ...props }: SelectProps) {
  return (
    <select
      id={id}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid ? `${id}-error` : undefined}
      className={cx(inputClass, className)}
      {...props}
    >
      {children}
    </select>
  );
}
