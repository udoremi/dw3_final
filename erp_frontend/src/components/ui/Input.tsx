import React from 'react';

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={`flex h-12 w-full rounded-lg 
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
    />
  );
});
Input.displayName = 'Input';