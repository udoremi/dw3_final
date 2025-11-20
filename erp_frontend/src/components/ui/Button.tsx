import React from 'react';

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={`flex h-12 w-full items-center justify-center rounded-lg
                  bg-primary px-4 py-2 text-base font-semibold text-primary-foreground 
                  transition-colors duration-200 
                  hover:bg-primary/90
                  focus-visible:outline-none focus-visible:ring-2 
                  focus-visible:ring-primary focus-visible:ring-offset-2
                  disabled:pointer-events-none disabled:opacity-50
                  ${className}`}
      {...props}
    />
  );
});
Button.displayName = 'Button';