import React, { useRef, useState } from "react";

interface AvatarUploadProps {
  size?: "sm" | "lg";
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ size = "lg" }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const dimensions = size === "sm" ? "w-24 h-24" : "w-32 h-32";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`${dimensions} rounded-full border-2 border-dashed border-accent bg-card flex items-center justify-center overflow-hidden hover:border-primary transition focus:outline-none focus:ring-2 focus:ring-primary/40`}
        aria-label="Upload profile photo"
      >
        {preview ? (
          <img
            src={preview}
            alt="Profile preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-text/50 text-sm font-medium">Photo</span>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        aria-hidden="true"
      />
    </div>
  );
};

export default AvatarUpload;
