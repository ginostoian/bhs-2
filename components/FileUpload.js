"use client";

import { useState, useRef, useCallback } from "react";
import { toast } from "react-hot-toast";

/**
 * FileUpload Component
 * Handles file uploads to bunny.net storage with drag & drop support
 */
export default function FileUpload({
  onUploadComplete,
  onUploadError,
  multiple = true,
  maxSize = 50 * 1024 * 1024, // 50MB
  allowedTypes = [],
  folder = "uploads",
  className = "",
  disabled = false,
  showPreview = true,
  maxFiles = 10,
  targetUserId = null, // For admin uploads to specific users
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileSelect = useCallback(
    (files) => {
      if (!files || files.length === 0) return;

      const fileArray = Array.from(files);

      // Check max files limit
      if (multiple && fileArray.length > maxFiles) {
        toast.error(`Maximum ${maxFiles} files allowed`);
        return;
      }

      uploadFiles(fileArray);
    },
    [multiple, maxFiles],
  );

  // Handle drag and drop
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      handleFileSelect(files);
    },
    [handleFileSelect],
  );

  // Upload files to bunny.net
  const uploadFiles = async (files) => {
    if (isUploading || disabled) return;

    setIsUploading(true);
    setUploadProgress({});

    try {
      const formData = new FormData();

      // Add files
      files.forEach((file) => {
        formData.append("files", file);
      });

      // Add configuration
      formData.append("folder", folder);
      formData.append("maxSize", maxSize.toString());
      if (allowedTypes.length > 0) {
        formData.append("allowedTypes", allowedTypes.join(","));
      }

      // Add target user ID if provided (for admin uploads)
      if (targetUserId) {
        formData.append("targetUserId", targetUserId);
      }

      // Upload to API
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      // Update uploaded files
      const newFiles = result.uploaded.map((file) => ({
        ...file,
        // Keep the original id from the API response (MongoDB ObjectId)
      }));

      setUploadedFiles((prev) => [...prev, ...newFiles]);

      // Call success callback
      if (onUploadComplete) {
        onUploadComplete(newFiles, result);
      }

      // Show success message
      toast.success(result.message);

      // Show errors if any
      if (result.errors && result.errors.length > 0) {
        result.errors.forEach((error) => {
          toast.error(error);
        });
      }
    } catch (error) {
      console.error("Upload error:", error);

      // Call error callback
      if (onUploadError) {
        onUploadError(error);
      }

      // Show error message
      toast.error(error.message || "Upload failed");
    } finally {
      setIsUploading(false);
      setUploadProgress({});
    }
  };

  // Remove uploaded file
  const removeFile = async (fileId) => {
    const file = uploadedFiles.find((f) => f.id === fileId);
    if (!file) return;

    try {
      // Delete from bunny.net
      const response = await fetch("/api/upload", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filePaths: [file.filePath],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete file");
      }

      // Remove from local state
      setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
      toast.success("File removed successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to remove file");
    }
  };

  // Get file icon
  const getFileIcon = (fileName) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    const icons = {
      pdf: "📄",
      doc: "📝",
      docx: "📝",
      xls: "📊",
      xlsx: "📊",
      ppt: "📽️",
      pptx: "📽️",
      jpg: "🖼️",
      jpeg: "🖼️",
      png: "🖼️",
      gif: "🖼️",
      webp: "🖼️",
      mp4: "🎥",
      avi: "🎥",
      mov: "🎥",
      zip: "📦",
      rar: "📦",
      txt: "📄",
      default: "📎",
    };
    return icons[ext] || icons.default;
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
          isDragOver
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={allowedTypes.join(",")}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={disabled}
        />

        <div className="space-y-2">
          <div className="text-4xl">📁</div>
          <div className="text-lg font-medium text-gray-900">
            {isUploading
              ? "Uploading..."
              : "Drop files here or click to upload"}
          </div>
          <p className="text-sm text-gray-500">
            {allowedTypes.length > 0
              ? `Supported formats: ${allowedTypes.join(", ")}`
              : "All file types supported"}
            {maxSize && ` • Max size: ${formatFileSize(maxSize)}`}
          </p>
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="mt-4">
            <div className="h-2 overflow-hidden rounded-full bg-gray-200">
              <div className="h-full animate-pulse rounded-full bg-blue-600 transition-all duration-300"></div>
            </div>
            <p className="mt-2 text-sm text-gray-600">Uploading files...</p>
          </div>
        )}
      </div>

      {/* Uploaded Files Preview */}
      {showPreview && uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Uploaded Files</h4>
          <div className="space-y-2">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">
                    {getFileIcon(file.originalName)}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {file.originalName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(file.id)}
                  className="text-sm text-red-500 hover:text-red-700"
                  disabled={disabled}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
