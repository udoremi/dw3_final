import React from 'react';

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={`flex min-h-[120px] w-full rounded-lg 
                  bg-background 
                  border border-border 
                  px-4 py-3 text-base text-foreground
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
Textarea.displayName = 'Textarea';