"use client";

import type { AnalysisResult as AnalysisResultType } from "@/lib/analyze";

interface AnalysisResultProps {
  result: AnalysisResultType;
}

const emotionColors: Record<string, string> = {
  わくわく: "bg-yellow-100 text-yellow-800",
  嬉しい: "bg-green-100 text-green-800",
  眠い: "bg-blue-100 text-blue-800",
  不安: "bg-purple-100 text-purple-800",
  甘えたい: "bg-pink-100 text-pink-800",
  お腹すいた: "bg-orange-100 text-orange-800",
  警戒: "bg-red-100 text-red-800",
  リラックス: "bg-teal-100 text-teal-800",
  好奇心: "bg-indigo-100 text-indigo-800",
  退屈: "bg-gray-100 text-gray-800",
};

function getEmotionColor(emotion: string): string {
  for (const [key, color] of Object.entries(emotionColors)) {
    if (emotion.includes(key)) return color;
  }
  return "bg-amber-100 text-amber-800";
}

function getEmotionEmoji(emotion: string): string {
  const emojiMap: Record<string, string> = {
    わくわく: "🐾",
    嬉しい: "😊",
    眠い: "😴",
    不安: "😟",
    甘えたい: "🥺",
    お腹すいた: "🍖",
    警戒: "👀",
    リラックス: "😌",
    好奇心: "🔍",
    退屈: "😑",
    興奮: "🎉",
    楽しい: "🎾",
    寂しい: "💧",
  };
  for (const [key, emoji] of Object.entries(emojiMap)) {
    if (emotion.includes(key)) return emoji;
  }
  return "🐶";
}

export default function AnalysisResult({ result }: AnalysisResultProps) {
  return (
    <div className="w-full space-y-4 animate-fade-in">
      {/* 犬の説明 */}
      <div className="bg-surface rounded-2xl p-4 shadow-sm border border-surface-secondary">
        <p className="text-sm text-text-muted">{result.dogDescription}</p>
      </div>

      {/* 犬の気持ち */}
      <div className="space-y-3">
        {result.thoughts.map((thought, index) => (
          <div
            key={index}
            className="animate-bounce-in"
            style={{ animationDelay: `${index * 0.15}s` }}
          >
            {/* 吹き出し */}
            <div className="bg-surface rounded-2xl p-4 shadow-sm border border-surface-secondary relative">
              {/* 感情タグ */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">
                  {getEmotionEmoji(thought.emotion)}
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${getEmotionColor(thought.emotion)}`}
                >
                  {thought.emotion}
                </span>
                <div className="ml-auto flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${
                        i < Math.round(thought.confidence * 5)
                          ? "bg-primary"
                          : "bg-surface-secondary"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* 心の声 */}
              <p className="text-lg font-medium leading-relaxed">
                {thought.thought}
              </p>

              {/* 根拠 */}
              <p className="text-xs text-text-muted mt-2">{thought.details}</p>
            </div>
          </div>
        ))}
      </div>

      {/* まとめ */}
      <div className="bg-secondary/10 rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-secondary mb-1">
          まとめ
        </h3>
        <p className="text-sm leading-relaxed">{result.summary}</p>
      </div>
    </div>
  );
}
