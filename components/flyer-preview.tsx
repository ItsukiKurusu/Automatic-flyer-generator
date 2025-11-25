'use client'

import { MapPin, Phone, Clock, Navigation } from 'lucide-react'
import type { FlyerTemplate } from '@/types/flyer'

interface FlyerPreviewProps {
  template: FlyerTemplate
}

export function FlyerPreview({ template }: FlyerPreviewProps) {
  // データが不完全な場合のデフォルト値
  const safeTemplate = {
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
  
  const getImageAreaStyle = () => {
    switch (safeTemplate.imageArea) {
      case '上半分':
        return 'h-[45%]'
      case '全幅':
        return 'h-full absolute inset-0'
      case '左半分':
        return 'h-full w-1/2 absolute left-0'
      case '右半分':
        return 'h-full w-1/2 absolute right-0'
      default:
        return 'h-[45%]'
    }
  }

  const isFullOrSideImage = ['全幅', '左半分', '右半分'].includes(safeTemplate.imageArea)

  return (
    <div 
      id="flyer-preview" 
      className="w-full aspect-[1/1.414] bg-white rounded-lg shadow-xl overflow-hidden relative"
      style={{ maxWidth: '595px' }}
    >
      {/* Image Area */}
      <div 
        className={`${getImageAreaStyle()} relative flex items-center justify-center`}
        style={{ backgroundColor: `${safeTemplate.colorTheme}20` }}
      >
        <div className="text-center space-y-2 p-8">
          <div 
            className="w-24 h-24 mx-auto rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${safeTemplate.colorTheme}40` }}
          >
            <svg className="w-12 h-12" style={{ color: safeTemplate.colorTheme }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm font-medium" style={{ color: safeTemplate.colorTheme }}>
            画像をここに配置
          </p>
        </div>
      </div>

      {/* Content Area */}
      <div 
        className={`${isFullOrSideImage ? 'absolute inset-0 flex flex-col justify-center' : ''} ${
          safeTemplate.imageArea === '左半分' ? 'ml-[50%]' : safeTemplate.imageArea === '右半分' ? 'mr-[50%]' : ''
        } p-8 space-y-6 ${isFullOrSideImage ? 'bg-white/95 backdrop-blur-sm' : ''}`}
      >
        {/* Catch Copy */}
        <div className="text-center space-y-2">
          <h1 
            className="text-3xl md:text-4xl font-bold text-balance leading-tight"
            style={{ color: safeTemplate.colorTheme }}
          >
            {safeTemplate.catchCopy}
          </h1>
          {safeTemplate.description && (
            <p className="text-base text-gray-700 text-balance">
              {safeTemplate.description}
            </p>
          )}
        </div>

        {/* Store Info */}
        {safeTemplate.storeInfo.name && (
          <div 
            className="mt-auto pt-6 border-t-2 space-y-3"
            style={{ borderColor: `${safeTemplate.colorTheme}40` }}
          >
            <h2 className="text-xl font-bold text-gray-900">
              {safeTemplate.storeInfo.name}
            </h2>
            <div className="space-y-2 text-sm text-gray-700">
              {safeTemplate.storeInfo.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: safeTemplate.colorTheme }} />
                  <span>{safeTemplate.storeInfo.address}</span>
                </div>
              )}
              {safeTemplate.storeInfo.tel && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 flex-shrink-0" style={{ color: safeTemplate.colorTheme }} />
                  <span>{safeTemplate.storeInfo.tel}</span>
                </div>
              )}
              {safeTemplate.storeInfo.hours && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 flex-shrink-0" style={{ color: safeTemplate.colorTheme }} />
                  <span>{safeTemplate.storeInfo.hours}</span>
                </div>
              )}
              {safeTemplate.storeInfo.access && (
                <div className="flex items-start gap-2">
                  <Navigation className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: safeTemplate.colorTheme }} />
                  <span>{safeTemplate.storeInfo.access}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
