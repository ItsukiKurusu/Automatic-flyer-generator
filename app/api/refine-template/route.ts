import { NextResponse } from 'next/server'
import { getGeminiService } from '@/lib/gemini'

export async function POST(request: Request) {
  try {
    const { currentTemplate, refinePrompt } = await request.json()

    const gemini = getGeminiService()

    const systemPrompt = `あなたはチラシ・POP生成のエキスパートです。
現在のチラシテンプレートと、ユーザーからの修正要望を受け取り、最適な更新後のJSONを生成してください。

現在のテンプレート:
${JSON.stringify(currentTemplate, null, 2)}

ユーザーの修正要望:
"${refinePrompt}"

以下のJSON形式で、更新が必要な箇所を反映した完全なテンプレートを返してください。
返答は必ずJSON形式のみで、他の説明は不要です。

{
  "imageArea": "上半分 | 全幅 | 左半分 | 右半分",
  "catchCopy": "キャッチコピー（20-40文字程度）",
  "tagline": "タグライン・補足見出し（15文字以内）",
  "description": "詳細説明文（50-100文字程度）",
  "benefits": ["メリットや特徴1", "メリットや特徴2", "メリットや特徴3"],
  "storeInfo": {
    "name": "店舗名",
    "address": "住所",
    "hours": "営業時間",
    "tel": "電話番号",
    "access": "アクセス情報"
  },
  "colorTheme": "#HEX形式の色コード",
  "layoutStyle": "modern | classic | playful"
}

既存の情報を活かしつつ、ユーザーの要望に合わせて色、レイアウト、文言を適切に調整してください。`

    const text = await gemini.generateText(systemPrompt)

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("JSON形式の応答が取得できませんでした")
    }

    const updatedTemplate = JSON.parse(jsonMatch[0])

    return NextResponse.json(updatedTemplate)
  } catch (error: any) {
    console.error('[API] Refinement error:', error);
    return NextResponse.json(
      {
        error: '修正案の生成に失敗しました',
        details: error instanceof Error ? error.message : JSON.stringify(error)
      },
      { status: 500 }
    )
  }
}
