import type { AnalysisResult } from "./analyze";

const demoResults: AnalysisResult[] = [
  {
    dogDescription:
      "ゴールデンレトリバーと思われる大型犬。毛並みは明るいクリーム色で、穏やかな表情をしています。",
    thoughts: [
      {
        emotion: "わくわく",
        thought:
          "あっ！カメラ向けられてる！もしかして散歩に行くのかな？ワクワクするワン！",
        confidence: 0.85,
        details:
          "耳がピンと立ち、口が軽く開いてパンティングしている様子から、興奮と期待が読み取れます。",
      },
      {
        emotion: "甘えたい",
        thought:
          "ねぇねぇ、撮影もいいけどナデナデしてほしいワン...こっち見てるんだからかまってよ〜",
        confidence: 0.7,
        details:
          "飼い主の方に体を傾け、しっぽを軽く振っている様子から、スキンシップを求めていると推測されます。",
      },
    ],
    summary:
      "全体的にリラックスしつつもワクワクしている様子。飼い主との触れ合いを楽しみにしているようです。",
  },
  {
    dogDescription:
      "柴犬と思われる中型犬。赤毛に白い差し毛があり、巻き尾が特徴的です。",
    thoughts: [
      {
        emotion: "好奇心",
        thought:
          "ん？なんだこの四角いやつ。食べられるのかな？ちょっとクンクンさせてワン。",
        confidence: 0.8,
        details:
          "鼻先をカメラに近づけ、耳を前方に傾けている様子から、強い好奇心が読み取れます。",
      },
      {
        emotion: "警戒",
        thought:
          "...でも一応警戒しとくワン。何かあったらすぐ逃げられるようにしとかないと。",
        confidence: 0.6,
        details:
          "体がやや後ろに引けており、いつでも後退できる体勢を取っていることから、慎重な性格がうかがえます。",
      },
      {
        emotion: "お腹すいた",
        thought: "そういえばおやつの時間まだかな...チラッ",
        confidence: 0.5,
        details:
          "時折キッチンの方向に視線を向けている様子から、食事への関心もあるようです。",
      },
    ],
    summary:
      "好奇心旺盛ながらも慎重な柴犬らしい性格が見て取れます。新しいものへの興味と警戒心のバランスが取れた状態です。",
  },
  {
    dogDescription:
      "トイプードルと思われる小型犬。アプリコット色の巻き毛で、まんまるの目が印象的です。",
    thoughts: [
      {
        emotion: "嬉しい",
        thought:
          "やったー！ご主人が遊んでくれる！大好き大好き！しっぽブンブンワン！",
        confidence: 0.9,
        details:
          "しっぽを激しく振り、体全体で喜びを表現しています。ジャンプしようとする仕草も見られます。",
      },
      {
        emotion: "興奮",
        thought:
          "テンション上がってきたワン！走りたい！ぐるぐる回りたい！",
        confidence: 0.85,
        details:
          "前足で地面をかく動作や、くるくると回る様子から、強い興奮状態にあることがわかります。",
      },
    ],
    summary:
      "非常にハッピーで活動的な状態。飼い主との交流に大きな喜びを感じている様子です。",
  },
];

export function getDemoResult(): AnalysisResult {
  const index = Math.floor(Math.random() * demoResults.length);
  return demoResults[index];
}
