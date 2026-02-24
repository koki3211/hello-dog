"use client";

import { useState, useCallback, useRef } from "react";
import VideoCapture from "@/components/VideoCapture";
import AnalysisResult from "@/components/AnalysisResult";
import LoadingIndicator from "@/components/LoadingIndicator";
import HistoryList from "@/components/HistoryList";
import { extractFramesFromVideo } from "@/lib/extractFrames";
import { addToHistory } from "@/lib/history";
import type { AnalysisResult as AnalysisResultType } from "@/lib/analyze";

type AppState = "idle" | "extracting" | "analyzing" | "done" | "error";

export default function Home() {
  const [state, setState] = useState<AppState>("idle");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResultType | null>(null);
  const [error, setError] = useState<string>("");
  const [historyKey, setHistoryKey] = useState(0);
  const thumbnailRef = useRef<string | undefined>(undefined);

  const handleVideoReady = useCallback((file: File) => {
    setVideoFile(file);
    setResult(null);
    setError("");
    setState("idle");
    thumbnailRef.current = undefined;
  }, []);

  const handleAnalyze = async () => {
    if (!videoFile) return;

    try {
      setState("extracting");

      const frames = await extractFramesFromVideo(videoFile, 4);

      // 最初のフレームをサムネイルとして保存
      if (frames.length > 0) {
        thumbnailRef.current = `data:${frames[0].mediaType};base64,${frames[0].data}`;
      }

      setState("analyzing");

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          frames: frames.map((f) => ({
            data: f.data,
            mediaType: f.mediaType,
          })),
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(
          errData?.error || `サーバーエラー (${response.status})`
        );
      }

      const data = (await response.json()) as AnalysisResultType;
      setResult(data);
      setState("done");

      // 履歴に保存
      addToHistory(data, thumbnailRef.current);
      setHistoryKey((prev) => prev + 1);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "予期しないエラーが発生しました"
      );
      setState("error");
    }
  };

  const handleReset = () => {
    setVideoFile(null);
    setResult(null);
    setError("");
    setState("idle");
    thumbnailRef.current = undefined;
  };

  const handleHistorySelect = (historyResult: AnalysisResultType) => {
    setResult(historyResult);
    setState("done");
    setVideoFile(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ヘッダー */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-surface-secondary">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-center">
          <h1 className="text-lg font-bold flex items-center gap-2">
            <span className="text-2xl">🐶</span>
            ワンコの気持ち
          </h1>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* 説明テキスト */}
        {state === "idle" && !videoFile && (
          <div className="text-center space-y-2 py-4">
            <p className="text-2xl">🎥 🐕 💭</p>
            <h2 className="text-xl font-bold">
              犬の動画を撮影して
              <br />
              気持ちを読み取ろう
            </h2>
            <p className="text-sm text-text-muted">
              カメラで犬を撮影するか、ライブラリから動画を選んでください。
              <br />
              AIが犬の表情や行動から気持ちを分析します。
            </p>
          </div>
        )}

        {/* 動画キャプチャ */}
        {state !== "done" && (
          <VideoCapture
            onVideoReady={handleVideoReady}
            disabled={state === "extracting" || state === "analyzing"}
          />
        )}

        {/* 分析ボタン */}
        {videoFile && state === "idle" && (
          <button
            onClick={handleAnalyze}
            className="w-full bg-secondary text-white font-bold py-4 px-6 rounded-2xl hover:bg-secondary/90 transition-colors shadow-lg text-lg"
          >
            🔍 この犬の気持ちを分析する
          </button>
        )}

        {/* ローディング */}
        {(state === "extracting" || state === "analyzing") && (
          <LoadingIndicator stage={state === "extracting" ? "extracting" : "analyzing"} />
        )}

        {/* エラー */}
        {state === "error" && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center space-y-3">
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={handleAnalyze}
              className="text-sm font-semibold text-red-600 underline"
            >
              もう一度試す
            </button>
          </div>
        )}

        {/* 結果表示 */}
        {state === "done" && result && (
          <>
            <AnalysisResult result={result} />
            <button
              onClick={handleReset}
              className="w-full bg-surface text-foreground font-semibold py-3 px-6 rounded-2xl border-2 border-surface-secondary hover:border-primary/30 transition-colors"
            >
              別の犬を分析する
            </button>
          </>
        )}

        {/* 履歴 */}
        {state === "idle" && !videoFile && (
          <HistoryList
            onSelectEntry={handleHistorySelect}
            refreshKey={historyKey}
          />
        )}
      </main>

      {/* フッター */}
      <footer className="max-w-lg mx-auto px-4 py-8 text-center">
        <p className="text-xs text-text-muted">
          Powered by Claude AI
        </p>
      </footer>
    </div>
  );
}
