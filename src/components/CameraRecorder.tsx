"use client";

import { useRef, useState, useCallback, useEffect, useTransition } from "react";

interface CameraRecorderProps {
  onRecordingComplete: (file: File) => void;
  onClose: () => void;
}

export default function CameraRecorder({
  onRecordingComplete,
  onClose,
}: CameraRecorderProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [cameraReady, setCameraReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [, startTransition] = useTransition();

  const MAX_DURATION = 30; // 最大30秒

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        startTransition(() => setCameraReady(true));
      } catch {
        if (!cancelled) {
          startTransition(() =>
            setError("カメラへのアクセスが許可されていません。設定からカメラへのアクセスを許可してください。")
          );
        }
      }
    }

    initCamera();
    return () => {
      cancelled = true;
      stopCamera();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stopCamera]);

  const startRecording = useCallback(() => {
    if (!streamRef.current) return;

    chunksRef.current = [];
    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
      ? "video/webm;codecs=vp9"
      : MediaRecorder.isTypeSupported("video/webm")
        ? "video/webm"
        : "video/mp4";

    const recorder = new MediaRecorder(streamRef.current, { mimeType });
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeType });
      const ext = mimeType.includes("webm") ? "webm" : "mp4";
      const file = new File([blob], `dog-video-${Date.now()}.${ext}`, {
        type: mimeType,
      });
      stopCamera();
      onRecordingComplete(file);
    };

    recorder.start(100);
    setIsRecording(true);
    setRecordingTime(0);

    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => {
        if (prev >= MAX_DURATION - 1) {
          recorder.stop();
          setIsRecording(false);
          if (timerRef.current) clearInterval(timerRef.current);
          return MAX_DURATION;
        }
        return prev + 1;
      });
    }, 1000);
  }, [stopCamera, onRecordingComplete]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, []);

  const handleClose = useCallback(() => {
    stopCamera();
    onClose();
  }, [stopCamera, onClose]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (error) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6">
        <div className="text-white text-center space-y-4">
          <p className="text-4xl">📷</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={handleClose}
            className="bg-white/20 text-white px-6 py-2 rounded-full text-sm"
          >
            戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* カメラプレビュー */}
      <div className="flex-1 relative overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* 上部オーバーレイ */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent">
          <button
            onClick={handleClose}
            className="text-white text-2xl w-10 h-10 flex items-center justify-center"
          >
            ✕
          </button>
          {isRecording && (
            <div className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              REC {formatTime(recordingTime)}
            </div>
          )}
        </div>

        {/* 録画プログレスバー */}
        {isRecording && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div
              className="h-full bg-red-500 transition-all duration-1000 ease-linear"
              style={{ width: `${(recordingTime / MAX_DURATION) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* 下部コントロール */}
      <div className="bg-black p-6 pb-10 flex items-center justify-center">
        {cameraReady ? (
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className="relative w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-all"
          >
            {isRecording ? (
              <div className="w-8 h-8 bg-red-500 rounded-sm" />
            ) : (
              <div className="w-16 h-16 bg-red-500 rounded-full" />
            )}
          </button>
        ) : (
          <div className="text-white text-sm">カメラを起動中...</div>
        )}
      </div>

      {/* ヒント */}
      {!isRecording && cameraReady && (
        <div className="absolute bottom-28 left-0 right-0 text-center">
          <p className="text-white/70 text-xs">
            ボタンを押して録画開始（最大{MAX_DURATION}秒）
          </p>
        </div>
      )}
    </div>
  );
}
