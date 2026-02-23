"use client";

const dogMessages = [
  "犬の表情を読み取っています...",
  "しっぽの動きを解析中...",
  "犬語に翻訳しています...",
  "ワンコの気持ちを推測中...",
];

export default function LoadingIndicator() {
  return (
    <div className="w-full flex flex-col items-center py-8 space-y-4 animate-fade-in">
      {/* 犬のアニメーション */}
      <div className="text-5xl animate-bounce">🐕</div>

      {/* ローディングドット */}
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse-dot" />
        <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse-dot-delay-1" />
        <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse-dot-delay-2" />
      </div>

      {/* メッセージ */}
      <p className="text-sm text-text-muted text-center">
        {dogMessages[Math.floor(Math.random() * dogMessages.length)]}
      </p>
    </div>
  );
}
