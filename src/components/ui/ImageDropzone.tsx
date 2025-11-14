"use client";

import { useState } from "react";

interface ImageDropzoneProps {
  name: string;
  onChange: (file: File | null) => void;
  previewUrl: string | null;
}

export default function ImageDropzone({ name, onChange, previewUrl }: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (file: File | null) => {
    onChange(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-3 w-full max-w-xs mx-auto 
                  flex flex-col items-center justify-center cursor-pointer transition-all ${
                    isDragging ? "border-blue-500" : "border-gray-300"
                  }`}
      onDragEnter={() => setIsDragging(true)}
      onDragLeave={() => setIsDragging(false)}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {previewUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={previewUrl}
          alt="Selected"
          className="w-full h-auto rounded-md mb-3"
        />
      ) : (
        <>
          <p className="text-gray-600 text-center">Drag Image here</p>
          <span className="text-gray-400 my-1">or</span>
        </>
      )}
      <label className="text-blue-600 px-4 cursor-pointer hover:text-blue-400">
        {previewUrl ? "Change Image" : "Browse Image"}
        <input
          type="file"
          name={name}
          className="hidden"
          accept="image/*"
          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
        />
      </label>
    </div>
  );
}