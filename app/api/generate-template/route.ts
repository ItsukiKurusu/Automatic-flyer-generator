import { generateText } from 'ai'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    const { text } = await generateText({
      model: 'openai/gpt-4o-mini',
      system: `あなたはチラシ・POP生成のエキスパートです。ユーザーの要望を分析し、以下のJSON形式でテンプレートを生成してください。

返答は必ずJSON形式のみで、他の説明は不要です。

{
  "imageArea": "上半分 | 全幅 | 左半分 | 右半分 のいずれか",
  "catchCopy": "魅力的なキャッチコピー（20-40文字程度）",
  "description": "補足説明（50-100文字程度）",
  "storeInfo": {
    "name": "店舗名（ユーザーが指定した場合）",
    "address": "住所（ユーザーが指定した場合）",
    "hours": "営業時間（ユーザーが指定した場合）",
    "tel": "電話番号（ユーザーが指定した場合）",
    "access": "アクセス情報（ユーザーが指定した場合）"
  },
  "colorTheme": "#HEX形式の色コード（ユーザーの要望に基づく）"
}

ユーザーが具体的な情報を提供していない項目は、空文字列""にしてください。
色は青系=#3B82F6、緑系=#10B981、オレンジ系=#F59E0B、赤系=#EF4444、紫系=#8B5CF6、ピンク系=#EC4899を基準にしてください。`,
      prompt: prompt,
    })

    // Parse the generated JSON
    const template = JSON.parse(text)

    return NextResponse.json(template)
  } catch (error) {
    console.error('[v0] Template generation error:', error)
    return NextResponse.json(
      { error: 'テンプレートの生成に失敗しました' },
      { status: 500 }
    )
  }
}
