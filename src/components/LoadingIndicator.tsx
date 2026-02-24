"use client";

import { useState, useEffect } from "react";

const dogMessages = [
  "犬の表情を読み取っています...",
  "しっぽの動きを解析中...",
  "犬語に翻訳しています...",
  "ワンコの気持ちを推測中...",
  "耳の角度をチェック中...",
  "体のボディランゲージを分析中...",
];

interface LoadingIndicatorProps {
  stage?: "extracting" | "analyzing";
}

export default function LoadingIndicator({
  stage = "analyzing",
}: LoadingIndicatorProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % dogMessages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex flex-col items-center py-8 space-y-4 animate-fade-in">
      {/* 犬のアニメーション */}
      <div className="text-5xl animate-bounce">🐕</div>

      {/* ステージ表示 */}
      <p className="text-sm font-semibold text-primary">
        {stage === "extracting"
          ? "動画からフレームを抽出中..."
          : "AIが分析中..."}
      </p>

      {/* ローディングドット */}
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse-dot" />
        <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse-dot-delay-1" />
        <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse-dot-delay-2" />
      </div>

      {/* サイクルメッセージ */}
      <p className="text-sm text-text-muted text-center transition-opacity duration-300">
        {dogMessages[messageIndex]}
      </p>
    </div>
  );
}
