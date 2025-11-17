'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FileImage, FileText, Presentation, Loader2 } from 'lucide-react'
import type { FlyerTemplate } from '@/types/flyer'

interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  template: FlyerTemplate
}

export function ExportDialog({ open, onOpenChange, template }: ExportDialogProps) {
  const [exporting, setExporting] = useState(false)
  const [exportFormat, setExportFormat] = useState<string | null>(null)

  const handleExport = async (format: 'png' | 'pdf' | 'pptx') => {
    setExporting(true)
    setExportFormat(format)

    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template, format })
      })

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `flyer.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      onOpenChange(false)
    } catch (error) {
      console.error('[v0] Export error:', error)
    } finally {
      setExporting(false)
      setExportFormat(null)
    }
  }

  const formats = [
    {
      id: 'png',
      name: 'PNG画像',
      description: 'Web表示やSNS投稿に最適',
      icon: FileImage,
      color: 'text-blue-600'
    },
    {
      id: 'pdf',
      name: 'PDF',
      description: '印刷用の高品質ファイル',
      icon: FileText,
      color: 'text-red-600'
    },
    {
      id: 'pptx',
      name: 'PowerPoint',
      description: 'さらに編集可能な形式',
      icon: Presentation,
      color: 'text-orange-600'
    }
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>エクスポート形式を選択</DialogTitle>
          <DialogDescription>
            チラシをダウンロードする形式を選んでください
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-4">
          {formats.map((format) => {
            const Icon = format.icon
            const isExporting = exporting && exportFormat === format.id
            
            return (
              <Button
                key={format.id}
                variant="outline"
                className="h-auto p-4 justify-start hover:bg-accent"
                onClick={() => handleExport(format.id as 'png' | 'pdf' | 'pptx')}
                disabled={exporting}
              >
                <div className="flex items-center gap-4 w-full">
                  {isExporting ? (
                    <Loader2 className={`w-8 h-8 ${format.color} animate-spin`} />
                  ) : (
                    <Icon className={`w-8 h-8 ${format.color}`} />
                  )}
                  <div className="text-left flex-1">
                    <div className="font-semibold">{format.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {format.description}
                    </div>
                  </div>
                </div>
              </Button>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
