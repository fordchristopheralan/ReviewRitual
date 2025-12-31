import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const textareaId = id || React.useId();
    
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="mb-1.5 block font-display text-xs uppercase tracking-wide text-text-secondary"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          className={cn(
            'flex min-h-[120px] w-full resize-y rounded-lg border-2 border-warm-gray bg-white px-4 py-3 font-body text-base text-text-primary placeholder:text-medium-gray',
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
Textarea.displayName = 'Textarea';

export { Textarea };
