"use client";

import { useState, useMemo } from "react";
import type { HistoryEntry } from "@/lib/history";
import { getHistory, clearHistory } from "@/lib/history";
import type { AnalysisResult } from "@/lib/analyze";
import Image from "next/image";

interface HistoryListProps {
  onSelectEntry: (result: AnalysisResult) => void;
  refreshKey: number;
}

export default function HistoryList({
  onSelectEntry,
  refreshKey,
}: HistoryListProps) {
  const [expanded, setExpanded] = useState(false);
  const [cleared, setCleared] = useState(false);

  // refreshKeyまたはclearedが変わるたびに履歴を再取得
  const entries = useMemo<HistoryEntry[]>(() => {
    if (cleared) return [];
    return getHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey, cleared]);

  if (entries.length === 0) return null;

  const displayEntries = expanded ? entries : entries.slice(0, 3);

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const hours = d.getHours().toString().padStart(2, "0");
    const mins = d.getMinutes().toString().padStart(2, "0");
    return `${month}/${day} ${hours}:${mins}`;
  };

  const handleClear = () => {
    if (confirm("履歴をすべて削除しますか？")) {
      clearHistory();
      setCleared(true);
    }
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-muted">過去の分析</h3>
        <button
          onClick={handleClear}
          className="text-xs text-text-muted hover:text-red-500 transition-colors"
        >
          すべて削除
        </button>
      </div>

      <div className="space-y-2">
        {displayEntries.map((entry) => (
          <button
            key={entry.id}
            onClick={() => onSelectEntry(entry.result)}
            className="w-full bg-surface rounded-xl p-3 border border-surface-secondary hover:border-primary/30 transition-colors text-left flex items-center gap-3"
          >
            {entry.thumbnailDataUrl ? (
              <Image
                src={entry.thumbnailDataUrl}
                alt=""
                width={48}
                height={48}
                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                unoptimized
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-surface-secondary flex items-center justify-center flex-shrink-0 text-xl">
                🐶
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {entry.result.dogDescription}
              </p>
              <p className="text-xs text-text-muted truncate">
                {entry.result.thoughts[0]?.thought}
              </p>
            </div>
            <span className="text-xs text-text-muted flex-shrink-0">
              {formatDate(entry.timestamp)}
            </span>
          </button>
        ))}
      </div>

      {entries.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-center text-xs text-primary font-semibold py-2"
        >
          {expanded
            ? "閉じる"
            : `他 ${entries.length - 3} 件の履歴を表示`}
        </button>
      )}
    </div>
  );
}
