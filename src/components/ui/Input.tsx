import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, id, ...props }, ref) => {
    const inputId = id || React.useId();
    
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block font-display text-xs uppercase tracking-wide text-text-secondary"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={inputId}
          className={cn(
            'flex h-12 w-full rounded-lg border-2 border-warm-gray bg-white px-4 py-3 font-body text-base text-text-primary placeholder:text-medium-gray',
            'focus:border-focus-orange focus:outline-none focus:ring-0',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-warning-red',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-warning-red">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
