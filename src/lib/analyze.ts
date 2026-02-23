import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export interface DogThought {
  emotion: string;
  thought: string;
  confidence: number;
  details: string;
}

export interface AnalysisResult {
  thoughts: DogThought[];
  summary: string;
  dogDescription: string;
}

export async function analyzeDogFrames(
  frames: { data: string; mediaType: string }[]
): Promise<AnalysisResult> {
  const imageContent: Anthropic.ImageBlockParam[] = frames.map((frame) => ({
    type: "image",
    source: {
      type: "base64",
      media_type: frame.mediaType as
        | "image/jpeg"
        | "image/png"
        | "image/gif"
        | "image/webp",
      data: frame.data,
    },
  }));

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    system: `あなたは犬の行動分析のエキスパートです。犬の動画から抽出されたフレーム画像を分析し、犬が何を考えているかをユーモアを交えて推測してください。

以下のJSON形式で回答してください（JSON以外は出力しないでください）:
{
  "thoughts": [
    {
      "emotion": "感情を表す短い言葉（例: わくわく、不安、眠い、甘えたい）",
      "thought": "犬の心の声（一人称で、犬っぽい口調で。例: 「ごはんまだかな〜お腹すいたワン...」）",
      "confidence": 0.0〜1.0の数値,
      "details": "その推測の根拠（犬の体の動き、表情、尻尾の状態などから）"
    }
  ],
  "summary": "全体的な犬の状態を1〜2文で",
  "dogDescription": "犬の見た目の特徴（犬種の推測含む）"
}

複数のフレームから時系列的な変化も読み取ってください。犬が写っていない場合は、その旨を伝えてください。`,
    messages: [
      {
        role: "user",
        content: [
          ...imageContent,
          {
            type: "text",
            text: "この動画のフレームに写っている犬が何を考えているか教えてください。犬の表情、体の動き、尻尾の状態、周囲の環境なども考慮して分析してください。",
          },
        ],
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("AI応答にテキストが含まれていません");
  }

  const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("AI応答をパースできませんでした");
  }

  return JSON.parse(jsonMatch[0]) as AnalysisResult;
}
