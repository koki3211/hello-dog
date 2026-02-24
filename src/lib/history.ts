import type { AnalysisResult } from "./analyze";

export interface HistoryEntry {
  id: string;
  result: AnalysisResult;
  timestamp: number;
  thumbnailDataUrl?: string;
}

const STORAGE_KEY = "wanko-history";
const MAX_ENTRIES = 20;

export function getHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

export function addToHistory(
  result: AnalysisResult,
  thumbnailDataUrl?: string
): HistoryEntry {
  const entry: HistoryEntry = {
    id: crypto.randomUUID(),
    result,
    timestamp: Date.now(),
    thumbnailDataUrl,
  };

  const history = getHistory();
  history.unshift(entry);

  // 最大件数を超えたら古いものを削除
  if (history.length > MAX_ENTRIES) {
    history.splice(MAX_ENTRIES);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  return entry;
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
