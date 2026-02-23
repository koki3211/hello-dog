"use client";

import { useRef, useState, useCallback } from "react";

interface VideoCaptureProps {
  onVideoReady: (file: File) => void;
  disabled?: boolean;
}

export default function VideoCapture({
  onVideoReady,
  disabled,
}: VideoCaptureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("video/")) {
        alert("動画ファイルを選択してください");
        return;
      }

      const maxSize = 100 * 1024 * 1024; // 100MB
      if (file.size > maxSize) {
        alert("ファイルサイズは100MB以下にしてください");
        return;
      }

      const url = URL.createObjectURL(file);
      setPreview(url);
      setFileName(file.name);
      onVideoReady(file);
    },
    [onVideoReady]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clearPreview = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  return (
    <div className="w-full space-y-4">
      {preview ? (
        <div className="relative rounded-2xl overflow-hidden bg-black">
          <video
            src={preview}
            controls
            playsInline
            className="w-full max-h-[400px] object-contain"
          />
          <button
            onClick={clearPreview}
            disabled={disabled}
            className="absolute top-3 right-3 bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-black/80 transition-colors disabled:opacity-50"
          >
            ✕
          </button>
          <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
            {fileName}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* カメラで撮影 */}
          <button
            onClick={() => cameraInputRef.current?.click()}
            disabled={disabled}
            className="w-full flex items-center justify-center gap-3 bg-primary text-white font-semibold py-4 px-6 rounded-2xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            カメラで犬を撮影する
          </button>
          <input
            ref={cameraInputRef}
            type="file"
            accept="video/*"
            capture="environment"
            onChange={handleFileInput}
            className="hidden"
          />

          {/* ライブラリから選択 */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="w-full flex items-center justify-center gap-3 bg-surface text-foreground font-semibold py-4 px-6 rounded-2xl border-2 border-surface-secondary hover:border-primary/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            ライブラリから動画を選ぶ
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}
