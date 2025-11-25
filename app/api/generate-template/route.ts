import { NextResponse } from 'next/server'
import { getGeminiService } from '@/lib/gemini'

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    const gemini = getGeminiService()

    const systemPrompt = `あなたはチラシ・POP生成のエキスパートです。ユーザーの要望を分析し、以下のJSON形式でテンプレートを生成してください。

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
色は青系=#3B82F6、緑系=#10B981、オレンジ系=#F59E0B、赤系=#EF4444、紫系=#8B5CF6、ピンク系=#EC4899を基準にしてください。

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
      description: parsedTemplate.description || '説明文',
      storeInfo: {
        name: parsedTemplate.storeInfo?.name || '',
        address: parsedTemplate.storeInfo?.address || '',
        hours: parsedTemplate.storeInfo?.hours || '',
        tel: parsedTemplate.storeInfo?.tel || '',
        access: parsedTemplate.storeInfo?.access || ''
      },
      colorTheme: parsedTemplate.colorTheme || '#3B82F6'
    }

    return NextResponse.json(template)
  } catch (error) {
    console.error('[v0] Template generation error:', error)
    return NextResponse.json(
      { 
        error: 'テンプレートの生成に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
