import { NextRequest, NextResponse } from "next/server";
import { analyzeDogFrames } from "@/lib/analyze";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { frames } = body as {
      frames: { data: string; mediaType: string }[];
    };

    if (!frames || !Array.isArray(frames) || frames.length === 0) {
      return NextResponse.json(
        { error: "フレーム画像が提供されていません" },
        { status: 400 }
      );
    }

    if (frames.length > 5) {
      return NextResponse.json(
        { error: "フレーム数は最大5枚までです" },
        { status: 400 }
      );
    }

    const result = await analyzeDogFrames(frames);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Analysis error:", error);

    const message =
      error instanceof Error ? error.message : "分析中にエラーが発生しました";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
