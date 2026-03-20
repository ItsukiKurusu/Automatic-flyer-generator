'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Sparkles, Loader2, AlertCircle } from 'lucide-react'
import type { FlyerTemplate } from '@/types/flyer'
import { toast } from 'sonner'

interface ChatInterfaceProps {
  onTemplateGenerated: (template: FlyerTemplate) => void
}

export function ChatInterface({ onTemplateGenerated }: ChatInterfaceProps) {
  const [input, setInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const examplePrompts = [
    '新規オープンの整体院。青系。写真は上半分。キャッチコピーは太め。下に店舗情報を入れてほしい',
    'カフェの新メニュー告知。温かみのある色合い。写真を全面に使いたい',
    '美容室のキャンペーン。ピンク系。エレガントな雰囲気で'
  ]

  const handleGenerate = async () => {
    if (!input.trim()) return

    setIsGenerating(true)
    setError(null)
    
    try {
      const response = await fetch('/api/generate-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.details || data.error || 'テンプレートの生成に失敗しました')
      }

      const template = data
      
      // デフォルト値を設定してデータ整合性を確保
      const normalizedTemplate: FlyerTemplate = {
        imageArea: template.imageArea || '上半分',
        catchCopy: template.catchCopy || 'キャッチコピー',
        tagline: template.tagline || '',
        description: template.description || '説明文',
        benefits: template.benefits || [],
        storeInfo: {
          name: template.storeInfo?.name || '',
          address: template.storeInfo?.address || '',
          hours: template.storeInfo?.hours || '',
          tel: template.storeInfo?.tel || '',
          access: template.storeInfo?.access || ''
        },
        colorTheme: template.colorTheme || '#3B82F6',
        layoutStyle: template.layoutStyle || 'modern'
      }
      
      onTemplateGenerated(normalizedTemplate)
      toast.success('テンプレートを生成しました')
    } catch (err: any) {
      console.error('[v0] Template generation error:', err)
      setError(err.message)
      toast.error('生成に失敗しました')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="w-full max-w-3xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-balance tracking-tight">
            チラシ・POP自動生成
          </h1>
          <p className="text-lg text-muted-foreground text-balance">
            イメージを入力するだけで、プロフェッショナルなチラシが自動生成されます
          </p>
        </div>

        {/* Input Area */}
        <Card className="p-6 space-y-4 shadow-xl border-t-4 border-t-primary">
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              どんなチラシ・POPを作りたいですか？
            </label>
            <Textarea
              placeholder="例：新規オープンの整体院。青系。写真は上半分。キャッチコピーは太め。下に店舗情報を入れてほしい"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-32 resize-none text-base p-4"
              disabled={isGenerating}
            />
          </div>

          {error && (
            <div className="flex items-start gap-3 p-4 bg-destructive/10 text-destructive rounded-lg text-sm border border-destructive/20 animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="font-bold">エラーが発生しました</p>
                <p className="opacity-90">{error}</p>
                <p className="text-xs mt-2 underline cursor-help">ヒント: GEMINI_API_KEYが設定されているか確認してください。</p>
              </div>
            </div>
          )}

          <Button 
            onClick={handleGenerate} 
            className="w-full h-14 text-lg font-bold shadow-lg transition-all active:scale-[0.98]"
            disabled={isGenerating || !input.trim()}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                AIがデザインを作成中...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6 mr-3" />
                テンプレートを生成
              </>
            )}
          </Button>
        </Card>

        {/* Example Prompts */}
        <div className="space-y-4">
          <p className="text-sm font-medium text-muted-foreground text-center">
            または、人気のテーマから始める
          </p>
          <div className="grid sm:grid-cols-3 gap-3">
            {examplePrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => setInput(prompt)}
                className="text-left p-4 rounded-xl bg-card border hover:border-primary/50 hover:bg-primary/5 transition-all text-sm group"
                disabled={isGenerating}
              >
                <span className="line-clamp-3 text-muted-foreground group-hover:text-primary transition-colors">
                  {prompt}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
