import { NextResponse } from 'next/server'
import { getGeminiService } from '@/lib/gemini'

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    const gemini = getGeminiService()

    const systemPrompt = `あなたはチラシ・POP生成のエキスパートです。ユーザーの要望を分析し、以下のJSON形式でテンプレートを生成してください。

返答は必ずJSON形式のみで、他の説明は不要です。

{
  "imageArea": "上半分 | 全幅 | 左半分 | 右半分",
  "catchCopy": "魅力的なキャッチコピー（20-40文字程度）",
  "tagline": "タグライン・補足見出し（15文字以内）",
  "description": "補足説明（50-100文字程度）",
  "benefits": ["メリットや特徴1", "メリットや特徴2", "メリットや特徴3"],
  "storeInfo": {
    "name": "店舗名（ユーザーが指定した場合）",
    "address": "住所（ユーザーが指定した場合）",
    "hours": "営業時間（ユーザーが指定した場合）",
    "tel": "電話番号（ユーザーが指定した場合）",
    "access": "アクセス情報（ユーザーが指定した場合）"
  },
  "colorTheme": "#HEX形式の色コード",
  "layoutStyle": "modern | classic | playful"
}

ユーザーが具体的な情報を提供していない項目は、適切なデフォルト値を生成するか、店舗情報の場合は空文字列""にしてください。
色は要望に合わせて自由に設定してください。

ユーザーの要望: ${prompt}`

    const text = await gemini.generateText(systemPrompt)

    // Parse the generated JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("JSON形式の応答が取得できませんでした")
    }
    
    const parsedTemplate = JSON.parse(jsonMatch[0])
    
    // デフォルト値でテンプレートを正規化
    const template = {
      imageArea: parsedTemplate.imageArea || '上半分',
      catchCopy: parsedTemplate.catchCopy || 'キャッチコピー',
      tagline: parsedTemplate.tagline || '',
      description: parsedTemplate.description || '説明文',
      benefits: parsedTemplate.benefits || [],
      storeInfo: {
        name: parsedTemplate.storeInfo?.name || '',
        address: parsedTemplate.storeInfo?.address || '',
        hours: parsedTemplate.storeInfo?.hours || '',
        tel: parsedTemplate.storeInfo?.tel || '',
        access: parsedTemplate.storeInfo?.access || ''
      },
      colorTheme: parsedTemplate.colorTheme || '#3B82F6',
      layoutStyle: parsedTemplate.layoutStyle || 'modern'
    }

    return NextResponse.json(template)
  } catch (error: any) {
    console.error('[API] Template generation error:', error);
    return NextResponse.json(
      { 
        error: 'テンプレートの生成に失敗しました',
        details: error instanceof Error ? error.message : JSON.stringify(error)
      },
      { status: 500 }
    )
  }
}
