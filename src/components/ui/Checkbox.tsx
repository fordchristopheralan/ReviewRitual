'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, checked, onChange, ...props }, ref) => {
    const checkboxId = id || React.useId();
    
    return (
      <label
        htmlFor={checkboxId}
        className={cn(
          'flex cursor-pointer items-center gap-3',
          props.disabled && 'cursor-not-allowed opacity-50',
          className
        )}
      >
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            id={checkboxId}
            ref={ref}
            checked={checked}
            onChange={onChange}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              'flex h-6 w-6 items-center justify-center rounded border-2 border-warm-gray bg-white transition-colors',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-focus-orange peer-focus-visible:ring-offset-2',
              'peer-checked:border-focus-orange peer-checked:bg-focus-orange'
            )}
          >
            <Check
              className={cn(
                'h-4 w-4 text-white opacity-0 transition-opacity',
                'peer-checked:opacity-100'
              )}
              strokeWidth={3}
            />
          </div>
        </div>
        {label && (
          <span className="font-body text-base text-text-primary">{label}</span>
        )}
      </label>
    );
  }
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };
