import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BrandSettings, GeneratedSite, SiteAnalysis } from '../../shared/types'
import { analyzeSiteRequest, loginRequest } from '@/utils/api'
import { buildGeneratedSite } from '@/utils/generation'

type StudioState = {
  sourceUrl: string
  analysis: SiteAnalysis | null
  generatedSite: GeneratedSite | null
  previewPageSlug: string
  loading: boolean
  error: string | null
  authToken: string | null
  authLoading: boolean
  authError: string | null
  brand: BrandSettings
  setSourceUrl: (value: string) => void
  setPreviewPageSlug: (value: string) => void
  updateBrand: (value: Partial<BrandSettings>) => void
  analyzeSource: () => Promise<void>
  login: (password: string) => Promise<void>
  logout: () => void
}

const defaultBrand: BrandSettings = {
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
  audienceFocus: 'les visiteurs qui doivent passer a l action vite',
  signatureOffer: 'Une vitrine plus claire, plus memorisable et plus vendeuse.',
}

export const useStudioStore = create<StudioState>()(
  persist(
    (set, get) => ({
      sourceUrl: '',
      analysis: null,
      generatedSite: null,
      previewPageSlug: '/',
      loading: false,
      error: null,
      authToken: null,
      authLoading: false,
      authError: null,
      brand: defaultBrand,
      setSourceUrl: (sourceUrl) => set({ sourceUrl }),
      setPreviewPageSlug: (previewPageSlug) => set({ previewPageSlug }),
      updateBrand: (value) => {
        const brand = { ...get().brand, ...value }
        set({
          brand,
          generatedSite: buildGeneratedSite(get().analysis, brand),
        })
      },
      analyzeSource: async () => {
        const { sourceUrl, authToken } = get()
        if (!sourceUrl.trim()) {
          set({ error: 'Ajoute une URL avant de lancer l analyse.' })
          return
        }

        if (!authToken) {
          set({ error: 'Mot de passe requis. Connecte-toi pour analyser un site.' })
          return
        }

        set({ loading: true, error: null })

        try {
          const currentBrand = get().brand
          const analysis = await analyzeSiteRequest(sourceUrl, authToken)
          const shouldAutoSuggest =
            currentBrand.brandName === defaultBrand.brandName &&
            currentBrand.signatureOffer === defaultBrand.signatureOffer

          const suggestedBrand = shouldAutoSuggest
            ? {
                ...currentBrand,
                brandName: analysis.siteName,
                signatureOffer: analysis.metaDescription || analysis.coreOffer,
                audienceFocus: /(serrurier|serrure|porte|alarme)/i.test(
                  analysis.seoKeywords.join(' '),
                )
                  ? 'les particuliers et pros en urgence ou en prevention'
                  : currentBrand.audienceFocus,
                tone: /(serrurier|serrure|porte|alarme)/i.test(analysis.seoKeywords.join(' '))
                  ? 'direct'
                  : currentBrand.tone,
                viralityLevel: /(serrurier|serrure|porte|alarme)/i.test(
                  analysis.seoKeywords.join(' '),
                )
                  ? 3
                  : currentBrand.viralityLevel,
              }
            : currentBrand

          set({
            analysis,
            brand: suggestedBrand,
            generatedSite: buildGeneratedSite(analysis, suggestedBrand),
            previewPageSlug: '/',
            loading: false,
          })
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Analyse impossible.',
          })
        }
      },
      login: async (password: string) => {
        set({ authLoading: true, authError: null })
        try {
          const payload = await loginRequest(password)
          set({ authToken: payload.token, authLoading: false, authError: null })
        } catch (error) {
          set({
            authLoading: false,
            authError: error instanceof Error ? error.message : 'Connexion impossible.',
          })
        }
      },
      logout: () => {
        set({
          authToken: null,
          analysis: null,
          generatedSite: null,
          previewPageSlug: '/',
          error: null,
          authError: null,
          loading: false,
        })
      },
    }),
    {
      name: 'marketing-site-studio',
      partialize: (state) => ({
        sourceUrl: state.sourceUrl,
        analysis: state.analysis,
        generatedSite: state.generatedSite,
        previewPageSlug: state.previewPageSlug,
        brand: state.brand,
        authToken: state.authToken,
      }),
    },
  ),
)
