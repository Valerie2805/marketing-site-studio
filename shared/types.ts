export type ToneOption = 'premium' | 'direct' | 'luxe' | 'viral' | 'expert'

export type SourcePage = {
  url: string
  title: string
  headings: string[]
}

export type SiteAnalysis = {
  sourceUrl: string
  siteName: string
  pageTitle: string
  metaDescription: string
  positioning: string
  toneSummary: string
  coreOffer: string
  seoKeywords: string[]
  offers: string[]
  callsToAction: string[]
  socialProof: string[]
  contactInfo: string[]
  heroLines: string[]
  notableFacts: string[]
  viralHooks: string[]
  pages: SourcePage[]
  diagnostic: string[]
}

export type BrandSettings = {
  brandName: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  logoDataUrl?: string
  backgroundImage?: string
  backgroundMode: 'cover' | 'contain'
  backgroundDim: number
  backgroundZoom: number
  backgroundMotion: boolean
  backgroundMotionRange: number
  backgroundMotionDuration: number
  tone: ToneOption
  viralityLevel: number
  audienceFocus: string
  signatureOffer: string
}

export type GeneratedSection = {
  id: string
  eyebrow: string
  title: string
  body: string
  highlight?: string
  bullets: string[]
}

export type GeneratedPage = {
  slug: string
  name: string
  sections: GeneratedSection[]
}

export type GeneratedSite = {
  brandName: string
  headline: string
  subheadline: string
  heroCta: string
  supportCta: string
  proofBanner: string
  shareHooks: string[]
  pages: GeneratedPage[]
  faq: Array<{ question: string; answer: string }>
}

export type AnalyzeSiteRequest = {
  url: string
}

export type AnalyzeSiteResponse = {
  analysis: SiteAnalysis
}

export type AuthLoginRequest = {
  password: string
}

export type AuthLoginResponse = {
  token: string
  expiresAt: number
}
