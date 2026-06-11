import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BrandSettings, SiteProject } from '../../shared/types'
import { analyzeSiteRequest, loginRequest } from '@/utils/api'
import { buildGeneratedSite } from '@/utils/generation'

type StudioState = {
  projects: SiteProject[]
  activeProjectId: string
  loading: boolean
  error: string | null
  authToken: string | null
  authLoading: boolean
  authError: string | null
  createProject: () => void
  selectProject: (id: string) => void
  updateProject: (
    value: Partial<
      Pick<SiteProject, 'label' | 'sourceUrl' | 'authorizationConfirmed' | 'authorizationEvidence'>
    >,
  ) => void
  setPreviewPageSlug: (value: string) => void
  updateBrand: (value: Partial<BrandSettings>) => void
  analyzeActiveProject: () => Promise<void>
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

const createProjectId = () =>
  `project-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

const createProjectLabel = (count: number) => `Projet ${count}`

const createDefaultProject = (count: number): SiteProject => {
  const now = Date.now()

  return {
    id: createProjectId(),
    label: createProjectLabel(count),
    sourceUrl: '',
    authorizationConfirmed: false,
    authorizationEvidence: '',
    analysis: null,
    generatedSite: null,
    previewPageSlug: '/',
    brand: { ...defaultBrand },
    createdAt: now,
    updatedAt: now,
  }
}

const getActiveProject = (state: Pick<StudioState, 'projects' | 'activeProjectId'>) =>
  state.projects.find((project) => project.id === state.activeProjectId) ?? state.projects[0]

const updateProjectList = (
  projects: SiteProject[],
  activeProjectId: string,
  updater: (project: SiteProject) => SiteProject,
) =>
  projects.map((project) =>
    project.id === activeProjectId ? { ...updater(project), updatedAt: Date.now() } : project,
  )

const brandMatchesDefault = (brand: BrandSettings) =>
  brand.brandName === defaultBrand.brandName &&
  brand.signatureOffer === defaultBrand.signatureOffer &&
  brand.audienceFocus === defaultBrand.audienceFocus

export const useStudioStore = create<StudioState>()(
  persist(
    (set, get) => {
      const initialProject = createDefaultProject(1)

      return {
      projects: [initialProject],
      activeProjectId: initialProject.id,
      loading: false,
      error: null,
      authToken: null,
      authLoading: false,
      authError: null,
      createProject: () =>
        set((state) => {
          const project = createDefaultProject(state.projects.length + 1)
          return {
            projects: [...state.projects, project],
            activeProjectId: project.id,
            error: null,
          }
        }),
      selectProject: (activeProjectId) => set({ activeProjectId, error: null }),
      updateProject: (value) =>
        set((state) => {
          const activeProject = getActiveProject(state)
          if (!activeProject) {
            return state
          }

          return {
            projects: updateProjectList(state.projects, activeProject.id, (project) => ({
              ...project,
              ...value,
            })),
          }
        }),
      setPreviewPageSlug: (previewPageSlug) =>
        set((state) => {
          const activeProject = getActiveProject(state)
          if (!activeProject) {
            return state
          }

          return {
            projects: updateProjectList(state.projects, activeProject.id, (project) => ({
              ...project,
              previewPageSlug,
            })),
          }
        }),
      updateBrand: (value) => {
        const state = get()
        const activeProject = getActiveProject(state)
        if (!activeProject) {
          return
        }

        const brand = { ...activeProject.brand, ...value }
        set({
          projects: updateProjectList(state.projects, activeProject.id, (project) => ({
            ...project,
            brand,
            generatedSite: buildGeneratedSite(project.analysis, brand),
          })),
        })
      },
      analyzeActiveProject: async () => {
        const state = get()
        const activeProject = getActiveProject(state)
        const authToken = state.authToken

        if (!activeProject) {
          set({ error: 'Cree d abord un projet avant de lancer une analyse.' })
          return
        }

        if (!activeProject.label.trim()) {
          set({ error: 'Donne un nom de projet pour retrouver facilement chaque refonte.' })
          return
        }

        if (!activeProject.sourceUrl.trim()) {
          set({ error: 'Ajoute une URL avant de lancer l analyse.' })
          return
        }

        if (!activeProject.authorizationConfirmed) {
          set({
            error:
              'Confirme que tu possedes ce site ou que tu disposes d une autorisation avant l analyse.',
          })
          return
        }

        if (!authToken) {
          set({ error: 'Mot de passe requis. Connecte-toi pour analyser un site.' })
          return
        }

        set({ loading: true, error: null })

        try {
          const currentBrand = activeProject.brand
          const analysis = await analyzeSiteRequest(activeProject.sourceUrl, authToken)
          const shouldAutoSuggest = brandMatchesDefault(currentBrand)

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

          const autoLabel =
            activeProject.label === createProjectLabel(state.projects.indexOf(activeProject) + 1)
              ? analysis.siteName
              : activeProject.label

          set({
            projects: updateProjectList(state.projects, activeProject.id, (project) => ({
              ...project,
              label: autoLabel,
              analysis,
              brand: suggestedBrand,
              generatedSite: buildGeneratedSite(analysis, suggestedBrand),
              previewPageSlug: '/',
              lastAnalyzedAt: Date.now(),
            })),
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
          error: null,
          authError: null,
          loading: false,
        })
      },
    }},
    {
      name: 'mirevona-rebuild-studio',
      version: 1,
      partialize: (state) => ({
        projects: state.projects,
        activeProjectId: state.activeProjectId || state.projects[0]?.id || '',
        authToken: state.authToken,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) {
          return
        }

        if (!state.projects.length) {
          const project = createDefaultProject(1)
          state.projects = [project]
          state.activeProjectId = project.id
          return
        }

        if (!state.activeProjectId) {
          state.activeProjectId = state.projects[0].id
        }
      },
    },
  ),
)
