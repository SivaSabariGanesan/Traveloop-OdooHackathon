import React, { useRef, useState, useCallback } from "react";

interface ProfileImageUploadProps {
  dark?: boolean;
  onChange?: (file: File) => void;
}

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({ dark = false, onChange }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);

      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError("PNG, JPG or WEBP only");
        return;
      }
      if (file.size > MAX_SIZE_BYTES) {
        setError("Max size is 5 MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      onChange?.(file);
    },
    [onChange]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // reset so same file can be re-selected
    e.target.value = "";
  };

  const handleClick = () => inputRef.current?.click();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  // Style tokens
  const borderColor = error
    ? "rgba(220,85,85,0.7)"
    : isHovered
    ? "#C65D3A"
    : dark
    ? "rgba(198,93,58,0.45)"
    : "rgba(198,93,58,0.4)";

  const bgColor = dark ? "rgba(61,46,34,0.25)" : "rgba(255,255,255,0.22)";

  const glowShadow = isHovered
    ? "0 0 0 3px rgba(198,93,58,0.18), 0 4px 16px rgba(198,93,58,0.15)"
    : "0 2px 8px rgba(198,93,58,0.08)";

  return (
    <div className="flex flex-col items-center gap-1.5">
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="hidden"
        aria-label="Upload profile photo"
        onChange={handleInputChange}
      />

      {/* Circular upload trigger */}
      <button
        type="button"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        aria-label={preview ? "Change profile photo" : "Upload profile photo"}
        className="relative rounded-full overflow-hidden transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C65D3A] focus-visible:ring-offset-2"
        style={{
          width: 88,
          height: 88,
          border: `2px dashed ${borderColor}`,
          background: preview ? "transparent" : bgColor,
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          boxShadow: glowShadow,
          transition: "box-shadow 0.3s ease, border-color 0.3s ease",
        }}
      >
        {preview ? (
          /* Preview state */
          <>
            <img
              src={preview}
              alt="Profile preview"
              className="w-full h-full object-cover rounded-full"
              style={{ display: "block" }}
            />
            {/* Hover overlay with camera icon */}
            <div
              className="absolute inset-0 rounded-full flex items-center justify-center transition-opacity duration-200"
              style={{
                background: "rgba(28,22,18,0.52)",
                opacity: isHovered ? 1 : 0,
              }}
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5"
                fill="none"
                stroke="#F0E6D3"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center w-full h-full gap-1" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 transition-transform duration-200"
              style={{
                transform: isHovered ? "scale(1.12)" : "scale(1)",
                color: "#C65D3A",
              }}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
        )}
      </button>

      {/* Helper / error text */}
      {error ? (
        <p className="text-xs" style={{ color: "#DC5555" }}>
          {error}
        </p>
      ) : (
        <p
          className="text-xs transition-colors duration-200"
          style={{
            color: preview
              ? isHovered
                ? "#C65D3A"
                : dark
                ? "rgba(240,230,211,0.45)"
                : "rgba(59,47,47,0.45)"
              : isHovered
              ? "#C65D3A"
              : dark
              ? "rgba(240,230,211,0.4)"
              : "rgba(59,47,47,0.4)",
          }}
        >
          {preview ? "Change photo" : "Upload profile photo"}
        </p>
      )}
    </div>
  );
};

export default ProfileImageUpload;
