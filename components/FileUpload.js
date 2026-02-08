'use client';

import { useState, useRef } from 'react';

export default function FileUpload({
  label,
  accept,
  onChange,
  currentFile,
  helpText,
}) {
  const [fileName, setFileName] = useState('');
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onChange(file);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-all duration-200"
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
        <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        {fileName ? (
          <p className="mt-2 text-sm text-primary-600 font-medium">{fileName}</p>
        ) : (
          <p className="mt-2 text-sm text-gray-500">
            Click to upload or drag and drop
          </p>
        )}
        {helpText && (
          <p className="mt-1 text-xs text-gray-400">{helpText}</p>
        )}
      </div>
      {currentFile && !fileName && (
        <p className="mt-1 text-xs text-green-600">
          ✓ File already uploaded
        </p>
      )}
    </div>
  );
}