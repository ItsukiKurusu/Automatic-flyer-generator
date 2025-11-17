'use client'

import { useState } from 'react'
import { ChatInterface } from '@/components/chat-interface'
import { EditorInterface } from '@/components/editor-interface'
import type { FlyerTemplate } from '@/types/flyer'

export default function Home() {
  const [currentView, setCurrentView] = useState<'chat' | 'editor'>('chat')
  const [template, setTemplate] = useState<FlyerTemplate | null>(null)

  const handleTemplateGenerated = (generatedTemplate: FlyerTemplate) => {
    setTemplate(generatedTemplate)
    setCurrentView('editor')
  }

  const handleBackToChat = () => {
    setCurrentView('chat')
  }

  return (
    <main className="min-h-screen bg-background">
      {currentView === 'chat' ? (
        <ChatInterface onTemplateGenerated={handleTemplateGenerated} />
      ) : (
        <EditorInterface 
          template={template!} 
          onBack={handleBackToChat}
          onTemplateUpdate={setTemplate}
        />
      )}
    </main>
  )
}
