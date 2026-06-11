import { describe, expect, it } from 'vitest'
import type { BrandSettings, SiteAnalysis } from '../../shared/types'
import { buildGeneratedSite } from './generation'

const brand: BrandSettings = {
  brandName: 'Nova Pulse',
  primaryColor: '#0f172a',
  secondaryColor: '#f8f5ef',
  accentColor: '#ff6b57',
  backgroundMode: 'cover',
  backgroundDim: 0.7,
  backgroundZoom: 1,
  backgroundMotion: false,
  backgroundMotionRange: 26,
  backgroundMotionDuration: 18,
  tone: 'viral',
  viralityLevel: 4,
  audienceFocus: 'les prospects les plus chauds',
  signatureOffer: 'Une refonte plus claire et plus vendeuse.',
}

const analysis: SiteAnalysis = {
  sourceUrl: 'https://example.com',
  siteName: 'Example',
  pageTitle: 'Example | Conseil',
  metaDescription: 'Nous aidons les marques a mieux vendre.',
  positioning: 'Positionnement orienté resultat.',
  toneSummary: 'Ton expert et rassurant.',
  coreOffer: 'Conseil et execution marketing.',
  seoKeywords: ['marketing', 'conversion'],
  offers: ['Audit express', 'Refonte site'],
  callsToAction: ['Demander un audit'],
  socialProof: ['Plus de 50 projets livres'],
  contactInfo: ['contact@example.com'],
  heroLines: ['Une promesse plus claire', 'Un design plus net'],
  notableFacts: ['Fonde en 2020', 'Equipe senior', 'Delais raccourcis'],
  viralHooks: ['Une version plus memorisable'],
  pages: [
    { url: 'https://example.com', title: 'Accueil', headings: ['Hero'] },
    {
      url: 'https://example.com/services',
      title: 'Services',
      headings: ['Audit complet', 'Accompagnement continu'],
    },
    {
      url: 'https://example.com/contact',
      title: 'Contact',
      headings: ['Parler a un expert'],
    },
  ],
  diagnostic: ['Le CTA principal doit etre renforce'],
}

describe('buildGeneratedSite', () => {
  it('genere une structure exploitable depuis l analyse et les reglages de marque', () => {
    const result = buildGeneratedSite(analysis, brand)

    expect(result).not.toBeNull()
    expect(result?.brandName).toBe('Nova Pulse')
    expect(result?.headline).toContain('Example')
    expect(result?.pages.length ?? 0).toBeGreaterThanOrEqual(2)
    expect(result?.pages.some((page) => page.slug === '/offre')).toBe(true)
    expect(result?.pages.some((page) => page.slug === '/services')).toBe(true)
    expect(result?.shareHooks[0]).toContain('Nova Pulse')
    expect(result?.faq.some((item) => item.question.includes('plusieurs pages'))).toBe(true)
  })

  it('retourne null quand aucune analyse n est disponible', () => {
    expect(buildGeneratedSite(null, brand)).toBeNull()
  })
})
