import React, { useRef, useState } from "react";

interface AvatarUploadProps {
  size?: "sm" | "lg";
}

const CameraIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-8 h-8 text-text/40"
  >
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const AvatarUpload: React.FC<AvatarUploadProps> = ({ size = "lg" }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const dimensions = size === "sm" ? "w-24 h-24" : "w-28 h-28";

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
        className={`${dimensions} rounded-full border-2 border-dashed border-primary/40 bg-white/30 backdrop-blur-sm flex flex-col items-center justify-center overflow-hidden hover:border-primary hover:bg-white/50 transition group focus:outline-none focus:ring-2 focus:ring-primary/40`}
        aria-label="Upload profile photo"
      >
        {preview ? (
          <img
            src={preview}
            alt="Profile preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-1">
            <CameraIcon />
            <span className="text-[10px] font-medium text-text/40 group-hover:text-text/60 transition">
              Upload
            </span>
          </div>
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
