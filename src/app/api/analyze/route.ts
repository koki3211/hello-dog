import { NextRequest, NextResponse } from "next/server";
import { analyzeDogFrames } from "@/lib/analyze";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "APIキーが設定されていません。.envファイルにANTHROPIC_API_KEYを設定してください。" },
        { status: 500 }
      );
    }

    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > 20 * 1024 * 1024) {
      return NextResponse.json(
        { error: "リクエストサイズが大きすぎます" },
        { status: 413 }
      );
    }

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

    if (error instanceof Error && error.message.includes("401")) {
      return NextResponse.json(
        { error: "APIキーが無効です。正しいANTHROPIC_API_KEYを設定してください。" },
        { status: 401 }
      );
    }

    const message =
      error instanceof Error ? error.message : "分析中にエラーが発生しました";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
