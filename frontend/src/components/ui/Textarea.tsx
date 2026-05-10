import React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

const Textarea: React.FC<TextareaProps> = ({ label, id, className = "", ...props }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-text">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={`w-full px-4 py-2.5 rounded-lg border border-secondary bg-background text-text placeholder-text/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition resize-none ${className}`}
        {...props}
      />
    </div>
  );
};

export default Textarea;
