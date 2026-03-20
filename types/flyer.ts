export interface FlyerTemplate {
  imageArea: '上半分' | '全幅' | '左半分' | '右半分'
  catchCopy: string
  tagline?: string
  description: string
  benefits?: string[]
  storeInfo: {
    name: string
    address: string
    hours: string
    tel: string
    access: string
  }
  colorTheme: string
  layoutStyle?: 'modern' | 'classic' | 'playful'
}
