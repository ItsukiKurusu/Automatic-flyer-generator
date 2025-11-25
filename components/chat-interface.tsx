'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Sparkles, Loader2 } from 'lucide-react'
import type { FlyerTemplate } from '@/types/flyer'

interface ChatInterfaceProps {
  onTemplateGenerated: (template: FlyerTemplate) => void
}

export function ChatInterface({ onTemplateGenerated }: ChatInterfaceProps) {
  const [input, setInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const examplePrompts = [
    '新規オープンの整体院。青系。写真は上半分。キャッチコピーは太め。下に店舗情報を入れてほしい',
    'カフェの新メニュー告知。温かみのある色合い。写真を全面に使いたい',
    '美容室のキャンペーン。ピンク系。エレガントな雰囲気で'
  ]

  const handleGenerate = async () => {
    if (!input.trim()) return

    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/generate-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const template = await response.json()
      
      // デフォルト値を設定してデータ整合性を確保
      const normalizedTemplate = {
        imageArea: template.imageArea || '上半分',
        catchCopy: template.catchCopy || 'キャッチコピー',
        description: template.description || '説明文',
        storeInfo: {
          name: template.storeInfo?.name || '',
          address: template.storeInfo?.address || '',
          hours: template.storeInfo?.hours || '',
          tel: template.storeInfo?.tel || '',
          access: template.storeInfo?.access || ''
        },
        colorTheme: template.colorTheme || '#3B82F6'
      }
      
      onTemplateGenerated(normalizedTemplate)
    } catch (error) {
      console.error('[v0] Template generation error:', error)
      alert('テンプレートの生成に失敗しました。もう一度お試しください。')
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
          <h1 className="text-4xl md:text-5xl font-bold text-balance">
            チラシ・POP自動生成
          </h1>
          <p className="text-lg text-muted-foreground text-balance">
            イメージを入力するだけで、プロフェッショナルなチラシが自動生成されます
          </p>
        </div>

        {/* Input Area */}
        <Card className="p-6 space-y-4 shadow-lg">
          <label className="text-sm font-medium">
            どんなチラシ・POPを作りたいですか？
          </label>
          <Textarea
            placeholder="例：新規オープンの整体院。青系。写真は上半分。キャッチコピーは太め。下に店舗情報を入れてほしい"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-32 resize-none"
            disabled={isGenerating}
          />
          <Button 
            onClick={handleGenerate} 
            className="w-full h-12 text-base"
            disabled={isGenerating || !input.trim()}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                テンプレートを生成
              </>
            )}
          </Button>
        </Card>

        {/* Example Prompts */}
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground text-center">
            または、例を選択してください
          </p>
          <div className="grid gap-2">
            {examplePrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => setInput(prompt)}
                className="text-left p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-sm"
                disabled={isGenerating}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
