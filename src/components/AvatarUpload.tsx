import React, { useState, useRef, useEffect } from "react";

interface AvatarUploadProps {
  onFileSelect: (file: File | null) => void;
  initialAvatarUrl?: string | null;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  onFileSelect,
  initialAvatarUrl,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialAvatarUrl || null
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(file));
      onFileSelect(file);
    } else {
      onFileSelect(null);
      setPreviewUrl(null);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    if (inputRef.current) inputRef.current.value = "";
    onFileSelect(null);
  };

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-teal-400 shadow-md">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Avatar Preview"
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-700 text-teal-400 text-4xl font-bold select-none">
            ?
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="avatar-upload"
      />
      <label
        htmlFor="avatar-upload"
        className="cursor-pointer bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md font-semibold transition"
      >
        {previewUrl ? "Change Avatar" : "Upload Avatar"}
      </label>

      {previewUrl && (
        <button
          onClick={handleRemove}
          className="text-red-500 hover:text-red-400 text-sm underline"
          type="button"
        >
          Remove Avatar
        </button>
      )}
    </div>
  );
};

export default AvatarUpload;
