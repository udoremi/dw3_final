import React from 'react';
import { ChevronDown } from 'lucide-react';

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={`flex h-12 w-full appearance-none rounded-lg 
                    bg-background 
                    border border-border 
                    px-4 py-2 text-base text-foreground
                    placeholder:text-muted-foreground 
                    
                    focus:outline-none 
                    focus:ring-0
                    focus:border-primary
                    
                    transition-colors duration-200
                    ${className}`}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
});
Select.displayName = 'Select';