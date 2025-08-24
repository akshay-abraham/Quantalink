/**
 * @file src/components/ui/button.tsx
 * @description A customizable button component based on ShadCN UI.
 *              It supports variants, sizes, and includes a glowing hover effect
 *              and a ripple click effect.
 * @note This is a client component due to the event handlers for interactive effects.
 */
"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Define the base styles and variants for the button using `class-variance-authority`.
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background/30 hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

/**
 * The Button component.
 * It's forward-reffed to allow parent components to get a reference to the DOM element.
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // If `asChild` is true, it will render the child component with the button's props.
    const Comp = asChild ? Slot : "button"
    
    /**
     * Handles the mouse move event to position the background glow effect.
     * @param {React.MouseEvent<HTMLButtonElement>} e - The mouse event.
     */
    const handleGlow = (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      e.currentTarget.style.setProperty('--glow-x', `${x}px`);
      e.currentTarget.style.setProperty('--glow-y', `${y}px`);
    };

    /**
     * Handles the click event to create a ripple effect.
     * @param {React.MouseEvent<HTMLButtonElement>} e - The mouse event.
     */
    const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
        const button = e.currentTarget;
        const circle = document.createElement("span");
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${e.clientX - button.offsetLeft - radius}px`;
        circle.style.top = `${e.clientY - button.offsetTop - radius}px`;
        circle.classList.add("ripple");

        const ripple = button.getElementsByClassName("ripple")[0];
        if (ripple) {
            ripple.remove();
        }

        button.appendChild(circle);
    }
    
    /**
     * A combined click handler to run both the ripple effect and any passed `onClick` prop.
     * @param {React.MouseEvent<HTMLButtonElement>} e - The mouse event.
     */
    const combinedClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        handleRipple(e);
        props.onClick?.(e);
    }

    return (
      <Comp
        // The `btn-glow` class enables the hover effect defined in globals.css.
        className={cn(buttonVariants({ variant, size, className }), 'btn-glow')}
        ref={ref}
        onMouseMove={handleGlow}
        onClick={combinedClickHandler}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
