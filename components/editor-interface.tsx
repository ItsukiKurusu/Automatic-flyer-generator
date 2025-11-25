'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Download, ImageIcon, Palette, FileText, Store } from 'lucide-react'
import { FlyerPreview } from '@/components/flyer-preview'
import { ExportDialog } from '@/components/export-dialog'
import type { FlyerTemplate } from '@/types/flyer'

interface EditorInterfaceProps {
  template: FlyerTemplate
  onBack: () => void
  onTemplateUpdate: (template: FlyerTemplate) => void
}

export function EditorInterface({ template, onBack, onTemplateUpdate }: EditorInterfaceProps) {
  // テンプレートにデフォルト値を設定
  const normalizedTemplate: FlyerTemplate = {
    imageArea: template?.imageArea || '上半分',
    catchCopy: template?.catchCopy || 'キャッチコピー',
    description: template?.description || '説明文',
    storeInfo: {
      name: template?.storeInfo?.name || '',
      address: template?.storeInfo?.address || '',
      hours: template?.storeInfo?.hours || '',
      tel: template?.storeInfo?.tel || '',
      access: template?.storeInfo?.access || ''
    },
    colorTheme: template?.colorTheme || '#3B82F6'
  }
  
  const [localTemplate, setLocalTemplate] = useState(normalizedTemplate)
  const [showExport, setShowExport] = useState(false)

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            戻る
          </Button>
          <h1 className="text-lg font-semibold">テンプレート編集</h1>
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
            <Card className="p-6">
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="content">
                    <FileText className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">内容</span>
                  </TabsTrigger>
                  <TabsTrigger value="image">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">画像</span>
                  </TabsTrigger>
                  <TabsTrigger value="color">
                    <Palette className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">色</span>
                  </TabsTrigger>
                  <TabsTrigger value="store">
                    <Store className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">店舗</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="catchCopy">キャッチコピー</Label>
                    <Textarea
                      id="catchCopy"
                      value={localTemplate.catchCopy}
                      onChange={(e) => updateTemplate({ catchCopy: e.target.value })}
                      className="min-h-20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">説明文</Label>
                    <Textarea
                      id="description"
                      value={localTemplate.description}
                      onChange={(e) => updateTemplate({ description: e.target.value })}
                      className="min-h-32"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="image" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>画像エリア位置</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {['上半分', '全幅', '左半分', '右半分'].map((position) => (
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
                  <div className="p-4 bg-muted rounded-lg text-sm text-muted-foreground">
                    <p>画像をアップロード機能は実装予定です。現在はプレースホルダーが表示されます。</p>
                  </div>
                </TabsContent>

                <TabsContent value="color" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="colorTheme">カラーテーマ</Label>
                    <Input
                      id="colorTheme"
                      type="color"
                      value={localTemplate.colorTheme}
                      onChange={(e) => updateTemplate({ colorTheme: e.target.value })}
                      className="h-12"
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'].map((color) => (
                      <button
                        key={color}
                        onClick={() => updateTemplate({ colorTheme: color })}
                        className="h-12 rounded-lg border-2 hover:scale-105 transition-transform"
                        style={{ 
                          backgroundColor: color,
                          borderColor: localTemplate.colorTheme === color ? '#000' : 'transparent'
                        }}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="store" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">店舗名</Label>
                    <Input
                      id="name"
                      value={localTemplate.storeInfo.name}
                      onChange={(e) => updateStoreInfo('name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">住所</Label>
                    <Input
                      id="address"
                      value={localTemplate.storeInfo.address}
                      onChange={(e) => updateStoreInfo('address', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tel">電話番号</Label>
                    <Input
                      id="tel"
                      value={localTemplate.storeInfo.tel}
                      onChange={(e) => updateStoreInfo('tel', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hours">営業時間</Label>
                    <Input
                      id="hours"
                      value={localTemplate.storeInfo.hours}
                      onChange={(e) => updateStoreInfo('hours', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="access">アクセス</Label>
                    <Input
                      id="access"
                      value={localTemplate.storeInfo.access}
                      onChange={(e) => updateStoreInfo('access', e.target.value)}
                    />
                  </div>
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
                  <div className="text-sm text-muted-foreground">A4サイズ</div>
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
