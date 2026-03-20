'use client'

import { MapPin, Phone, Clock, Navigation, CheckCircle2 } from 'lucide-react'
import type { FlyerTemplate } from '@/types/flyer'

interface FlyerPreviewProps {
  template: FlyerTemplate
}

export function FlyerPreview({ template }: FlyerPreviewProps) {
  // データが不完全な場合のデフォルト値
  const safeTemplate: FlyerTemplate = {
    imageArea: template?.imageArea || '上半分',
    catchCopy: template?.catchCopy || 'キャッチコピー',
    tagline: template?.tagline || '',
    description: template?.description || '説明文',
    benefits: template?.benefits || [],
    storeInfo: {
      name: template?.storeInfo?.name || '',
      address: template?.storeInfo?.address || '',
      hours: template?.storeInfo?.hours || '',
      tel: template?.storeInfo?.tel || '',
      access: template?.storeInfo?.access || ''
    },
    colorTheme: template?.colorTheme || '#3B82F6',
    layoutStyle: template?.layoutStyle || 'modern'
  }
  
  const getImageAreaStyle = () => {
    switch (safeTemplate.imageArea) {
      case '上半分':
        return 'h-[40%]'
      case '全幅':
        return 'h-full absolute inset-0'
      case '左半分':
        return 'h-full w-1/2 absolute left-0'
      case '右半分':
        return 'h-full w-1/2 absolute right-0'
      default:
        return 'h-[40%]'
    }
  }

  const isFullOrSideImage = ['全幅', '左半分', '右半分'].includes(safeTemplate.imageArea)

  return (
    <div 
      id="flyer-preview" 
      className={`w-full aspect-[1/1.414] bg-white rounded-lg shadow-xl overflow-hidden relative flex flex-col ${
        safeTemplate.layoutStyle === 'classic' ? 'font-serif' : 'font-sans'
      }`}
      style={{ maxWidth: '595px' }}
    >
      {/* Image Area */}
      <div 
        className={`${getImageAreaStyle()} relative flex items-center justify-center transition-all duration-500`}
        style={{ backgroundColor: `${safeTemplate.colorTheme}15` }}
      >
        <div className="text-center space-y-2 p-8">
          <div 
            className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${safeTemplate.colorTheme}30` }}
          >
            <svg className="w-10 h-10" style={{ color: safeTemplate.colorTheme }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: safeTemplate.colorTheme }}>
            Visual placeholder
          </p>
        </div>
      </div>

      {/* Content Area */}
      <div 
        className={`${isFullOrSideImage ? 'absolute inset-0 flex flex-col justify-center' : 'flex-1'} ${
          safeTemplate.imageArea === '左半分' ? 'ml-[50%]' : safeTemplate.imageArea === '右半分' ? 'mr-[50%]' : ''
        } p-8 flex flex-col ${isFullOrSideImage ? 'bg-white/90 backdrop-blur-md' : ''}`}
      >
        {/* Header Section */}
        <div className="text-center space-y-3 mb-6">
          {safeTemplate.tagline && (
            <p className="text-sm font-bold tracking-[0.2em] uppercase" style={{ color: safeTemplate.colorTheme }}>
              {safeTemplate.tagline}
            </p>
          )}
          <h1 
            className={`font-bold text-balance leading-tight ${
              safeTemplate.layoutStyle === 'playful' ? 'text-4xl md:text-5xl -rotate-1' : 'text-3xl md:text-4xl'
            }`}
            style={{ color: safeTemplate.colorTheme }}
          >
            {safeTemplate.catchCopy}
          </h1>
        </div>

        {/* Description & Benefits */}
        <div className="space-y-6 flex-1">
          {safeTemplate.description && (
            <p className="text-base text-gray-700 leading-relaxed text-center">
              {safeTemplate.description}
            </p>
          )}

          {safeTemplate.benefits && safeTemplate.benefits.length > 0 && (
            <div className="grid gap-3 max-w-sm mx-auto">
              {safeTemplate.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: safeTemplate.colorTheme }} />
                  <span className="text-sm font-medium text-gray-800">{benefit}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Store Info */}
        {safeTemplate.storeInfo.name && (
          <div 
            className="mt-8 pt-6 border-t-2 space-y-4"
            style={{ borderColor: `${safeTemplate.colorTheme}30` }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                {safeTemplate.storeInfo.name}
              </h2>
              <div
                className="px-3 py-1 text-xs font-bold rounded-full text-white"
                style={{ backgroundColor: safeTemplate.colorTheme }}
              >
                INFO
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-600">
              {safeTemplate.storeInfo.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 opacity-70" />
                  <span>{safeTemplate.storeInfo.address}</span>
                </div>
              )}
              {safeTemplate.storeInfo.tel && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 flex-shrink-0 opacity-70" />
                  <span>{safeTemplate.storeInfo.tel}</span>
                </div>
              )}
              {safeTemplate.storeInfo.hours && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 flex-shrink-0 opacity-70" />
                  <span>{safeTemplate.storeInfo.hours}</span>
                </div>
              )}
              {safeTemplate.storeInfo.access && (
                <div className="flex items-start gap-2">
                  <Navigation className="w-4 h-4 mt-0.5 flex-shrink-0 opacity-70" />
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
