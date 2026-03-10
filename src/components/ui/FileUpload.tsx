"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X } from "lucide-react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
}

export default function FileUpload({
  onFileSelect,
  selectedFile,
  onClear,
  accept = {
    "application/pdf": [".pdf"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
      ".docx",
    ],
  },
  maxSize = 10 * 1024 * 1024,
}: FileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
  });

  if (selectedFile) {
    return (
      <div className="flex items-center gap-3 p-4 bg-primary-500/10 border border-primary-500/20 rounded-xl">
        <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center flex-shrink-0">
          <FileText className="w-5 h-5 text-primary-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {selectedFile.name}
          </p>
          <p className="text-xs text-gray-500">
            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
        <button
          onClick={onClear}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200
        ${
          isDragActive
            ? "border-primary-500/50 bg-primary-500/5"
            : "border-white/10 hover:border-primary-500/30 hover:bg-white/[0.02]"
        }`}
    >
      <input {...getInputProps()} />
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
          isDragActive ? "bg-primary-500/20" : "bg-white/5"
        }`}
      >
        <Upload
          className={`w-6 h-6 ${
            isDragActive ? "text-primary-400" : "text-gray-500"
          }`}
        />
      </div>
      <p className="text-sm font-medium text-gray-300">
        {isDragActive
          ? "Solte o arquivo aqui"
          : "Arraste um arquivo ou clique para selecionar"}
      </p>
      <p className="text-xs text-gray-500 mt-1">
        PDF, DOC ou DOCX (máx. 10MB)
      </p>
    </div>
  );
}
