'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Download, ImageIcon, Palette, FileText, Store, Sparkles, Loader2, Layout } from 'lucide-react'
import { FlyerPreview } from '@/components/flyer-preview'
import { ExportDialog } from '@/components/export-dialog'
import type { FlyerTemplate } from '@/types/flyer'
import { toast } from 'sonner'

interface EditorInterfaceProps {
  template: FlyerTemplate
  onBack: () => void
  onTemplateUpdate: (template: FlyerTemplate) => void
}

export function EditorInterface({ template, onBack, onTemplateUpdate }: EditorInterfaceProps) {
  const [localTemplate, setLocalTemplate] = useState<FlyerTemplate>(template)
  const [showExport, setShowExport] = useState(false)
  const [refinePrompt, setRefinePrompt] = useState('')
  const [isRefining, setIsRefining] = useState(false)

  const updateTemplate = (updates: Partial<FlyerTemplate>) => {
    const newTemplate = { ...localTemplate, ...updates }
    setLocalTemplate(newTemplate)
    onTemplateUpdate(newTemplate)
  }

  const updateStoreInfo = (field: string, value: string) => {
    updateTemplate({
      storeInfo: { ...localTemplate.storeInfo, [field]: value }
    })
  }

  const handleRefine = async () => {
    if (!refinePrompt.trim()) return

    setIsRefining(true)
    try {
      const response = await fetch('/api/refine-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentTemplate: localTemplate,
          refinePrompt: refinePrompt
        })
      })

      if (!response.ok) throw new Error('Failed to refine')

      const updatedTemplate = await response.json()
      setLocalTemplate(updatedTemplate)
      onTemplateUpdate(updatedTemplate)
      setRefinePrompt('')
      toast.success('AIによってチラシが更新されました')
    } catch (error) {
      console.error('Refinement error:', error)
      toast.error('AIによる更新に失敗しました')
    } finally {
      setIsRefining(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            戻る
          </Button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-semibold hidden sm:block">フライヤーデザイナー</h1>
          </div>
          <Button onClick={() => setShowExport(true)}>
            <Download className="w-4 h-4 mr-2" />
            エクスポート
          </Button>
        </div>
      </header>

      <div className="container mx-auto p-4 lg:p-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Editor Panel */}
          <div className="space-y-6">
            {/* AI Refinement Card */}
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-bold">AIに修正を依頼する</span>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="例：もっと高級感を出して、特典を赤字で強調して"
                    value={refinePrompt}
                    onChange={(e) => setRefinePrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRefine()}
                    disabled={isRefining}
                    className="bg-background"
                  />
                  <Button onClick={handleRefine} disabled={isRefining || !refinePrompt.trim()}>
                    {isRefining ? <Loader2 className="w-4 h-4 animate-spin" /> : '依頼'}
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="content">
                    <FileText className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">内容</span>
                  </TabsTrigger>
                  <TabsTrigger value="style">
                    <Layout className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">スタイル</span>
                  </TabsTrigger>
                  <TabsTrigger value="image">
                    <ImageIcon className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">画像</span>
                  </TabsTrigger>
                  <TabsTrigger value="color">
                    <Palette className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">色</span>
                  </TabsTrigger>
                  <TabsTrigger value="store">
                    <Store className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">店舗</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="catchCopy">キャッチコピー</Label>
                    <Input
                      id="catchCopy"
                      value={localTemplate.catchCopy}
                      onChange={(e) => updateTemplate({ catchCopy: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tagline">タグライン</Label>
                    <Input
                      id="tagline"
                      value={localTemplate.tagline}
                      onChange={(e) => updateTemplate({ tagline: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">説明文</Label>
                    <Textarea
                      id="description"
                      value={localTemplate.description}
                      onChange={(e) => updateTemplate({ description: e.target.value })}
                      className="min-h-24"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>メリット・特徴</Label>
                    {(localTemplate.benefits || []).map((benefit, idx) => (
                      <Input
                        key={idx}
                        value={benefit}
                        onChange={(e) => {
                          const newBenefits = [...(localTemplate.benefits || [])]
                          newBenefits[idx] = e.target.value
                          updateTemplate({ benefits: newBenefits })
                        }}
                        className="mb-2"
                      />
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateTemplate({ benefits: [...(localTemplate.benefits || []), ''] })}
                    >
                      追加
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="style" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>レイアウトスタイル</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['modern', 'classic', 'playful'] as const).map((style) => (
                        <Button
                          key={style}
                          variant={localTemplate.layoutStyle === style ? 'default' : 'outline'}
                          onClick={() => updateTemplate({ layoutStyle: style })}
                          className="w-full capitalize"
                        >
                          {style}
                        </Button>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="image" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>画像エリア位置</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['上半分', '全幅', '左半分', '右半分'] as const).map((position) => (
                        <Button
                          key={position}
                          variant={localTemplate.imageArea === position ? 'default' : 'outline'}
                          onClick={() => updateTemplate({ imageArea: position })}
                          className="w-full"
                        >
                          {position}
                        </Button>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="color" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="colorTheme">カラーテーマ</Label>
                    <div className="flex gap-4">
                      <Input
                        id="colorTheme"
                        type="color"
                        value={localTemplate.colorTheme}
                        onChange={(e) => updateTemplate({ colorTheme: e.target.value })}
                        className="h-12 w-20 p-1"
                      />
                      <Input
                        type="text"
                        value={localTemplate.colorTheme}
                        onChange={(e) => updateTemplate({ colorTheme: e.target.value })}
                        className="flex-1 font-mono"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-6 gap-2">
                    {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'].map((color) => (
                      <button
                        key={color}
                        onClick={() => updateTemplate({ colorTheme: color })}
                        className="h-10 rounded-full border-2 hover:scale-110 transition-transform"
                        style={{ 
                          backgroundColor: color,
                          borderColor: localTemplate.colorTheme === color ? '#000' : 'transparent'
                        }}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="store" className="space-y-4 mt-4">
                  {[
                    { id: 'name', label: '店舗名' },
                    { id: 'address', label: '住所' },
                    { id: 'tel', label: '電話番号' },
                    { id: 'hours', label: '営業時間' },
                    { id: 'access', label: 'アクセス' }
                  ].map((field) => (
                    <div key={field.id} className="space-y-1">
                      <Label htmlFor={field.id}>{field.label}</Label>
                      <Input
                        id={field.id}
                        value={localTemplate.storeInfo[field.id as keyof typeof localTemplate.storeInfo]}
                        onChange={(e) => updateStoreInfo(field.id, e.target.value)}
                      />
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">プレビュー</h2>
                  <div className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">A4</div>
                </div>
                <FlyerPreview template={localTemplate} />
              </div>
            </Card>
          </div>
        </div>
      </div>

      <ExportDialog 
        open={showExport} 
        onOpenChange={setShowExport}
        template={localTemplate}
      />
    </div>
  )
}
