import React, { useEffect } from "react";
import { Button } from "@/components/ui/button"; // Adjust the import path based on your project structure
import { useFormStatus } from "react-dom"; // Make sure you're using the correct useFormStatus hook for your form library

interface SubmitButtonProps {
  children?: React.ReactNode; // Optional: Customize the button text or content
  disabled?: boolean; // Allows you to pass a custom disabled state if needed
  className?: string; // Optional: Customize styling
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  children = "Submit",
  disabled,
  className,
  ...props
}) => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={disabled || pending}
      className={className}
      {...props}
    >
      {pending ? (
        <>
          <span className="mr-2 animate-spin">⏳</span> {/* Loading spinner */}
          Submitting...
        </>
      ) : (
        children
      )}
    </Button>
  );
};
