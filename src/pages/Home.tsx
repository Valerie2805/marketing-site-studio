import {
  ArrowUpRight,
  BadgeCheck,
  FolderCog,
  Palette,
  ShieldCheck,
  Sparkles,
  Wand2,
} from 'lucide-react'
import BrandStudio from '@/components/BrandStudio'
import GeneratedPreview from '@/components/GeneratedPreview'
import InsightPanel from '@/components/InsightPanel'
import MetricCard from '@/components/MetricCard'
import PasswordGate from '@/components/PasswordGate'
import ProjectRail from '@/components/ProjectRail'
import SourceIntake from '@/components/SourceIntake'
import { useStudioStore } from '@/hooks/useStudioStore'

const promisePoints = [
  'Multi-projets pour tous vos sites autorises',
  'Detection des pages et reconstruction editable',
  'Refonte marketing et design en direct',
  'Base prete pour votre futur app.mirevona.fr',
]

const transformationSteps = [
  {
    icon: ShieldCheck,
    title: 'Valider le mandat',
    body: 'Chaque projet garde une trace d autorisation afin de securiser les refontes de vos propres sites ou de ceux de vos clients.',
  },
  {
    icon: Wand2,
    title: 'Cartographier le site',
    body: 'L application lit l URL source, repere les pages publiques, extrait les titres, CTA et preuves a reutiliser intelligemment.',
  },
  {
    icon: Palette,
    title: 'Refondre et livrer',
    body: 'Vous ajustez branding, ton, intensite marketing et obtenez une nouvelle structure complete prete a etre presentee.',
  },
]

export default function Home() {
  const {
    projects,
    activeProjectId,
    loading,
    error,
    authToken,
    authLoading,
    authError,
    createProject,
    selectProject,
    updateProject,
    setPreviewPageSlug,
    updateBrand,
    analyzeActiveProject,
    login,
    logout,
  } = useStudioStore()

  const activeProject =
    projects.find((project) => project.id === activeProjectId) ?? projects[0] ?? null

  const activeGeneratedSite = activeProject?.generatedSite ?? null
  const activeAnalysis = activeProject?.analysis ?? null
  const activeBrand = activeProject?.brand
  const previewPageSlug = activeProject?.previewPageSlug ?? '/'

  const metricValues = [
    {
      label: 'Portefeuille',
      value: `${projects.length} projets`,
      detail: 'Chaque site autorise garde sa propre analyse, son branding et sa structure generee.',
    },
    {
      label: 'Pages refondues',
      value: activeGeneratedSite ? `${activeGeneratedSite.pages.length} pages` : '0 page',
      detail: activeGeneratedSite
        ? 'La generation recree l arborescence detectee en pages editables.'
        : 'Analysez un projet pour produire la nouvelle structure.',
    },
    {
      label: 'Conformite',
      value: activeProject?.authorizationConfirmed ? 'Autorise' : 'A valider',
      detail: activeProject?.authorizationConfirmed
        ? 'Le projet actif peut etre analyse et reconstruit.'
        : 'Confirmez l autorisation avant de lancer l analyse.',
    },
  ]

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <PasswordGate open={!authToken} loading={authLoading} error={authError} onSubmit={login} />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,107,87,0.18),transparent_25%),radial-gradient(circle_at_80%_20%,rgba(103,232,249,0.18),transparent_22%),linear-gradient(180deg,#08101f_0%,#050816_100%)]" />
        <div className="absolute left-0 top-24 h-72 w-72 rounded-full bg-[#ff6b57]/15 blur-3xl" />
        <div className="absolute right-0 top-16 h-96 w-96 rounded-full bg-[#22d3ee]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-14">
          <header className="flex flex-col gap-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8 shadow-[0_10px_40px_rgba(255,107,87,0.18)]">
                  <Sparkles className="h-5 w-5 text-[#ff8a7a]" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-white/45">Mirevona Rebuild Studio</p>
                  <p className="font-serif text-2xl text-white">Refondez vos sites autorises a partir d une URL source</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.2em] text-white/60">
                  <BadgeCheck className="h-4 w-4 text-[#67e8f9]" />
                  pret pour sous-domaine
                </div>
                {authToken ? (
                  <button
                    type="button"
                    onClick={logout}
                    className="rounded-full border border-white/10 bg-white/6 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/65 transition hover:bg-white/10"
                  >
                    Deconnexion
                  </button>
                ) : null}
              </div>
            </div>

            <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr]">
              <div>
                <p className="text-xs uppercase tracking-[0.34em] text-[#f6c7b8]">Audit, redesign, reconstruction complete</p>
                <h1 className="mt-4 max-w-4xl font-serif text-5xl leading-[1.02] text-white md:text-6xl">
                  Creez un nouveau site complet depuis les informations d un site source autorise,
                  puis ameliorez sa clarte, son design et sa capacite a convertir.
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-8 text-white/70">
                  Cette application est concue pour vos propres sites et ceux de vos clients. Elle
                  detecte les pages publiques, recompose les contenus utiles, puis genere une version
                  plus forte, plus nette et plus facile a presenter avant publication.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  {promisePoints.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/10 bg-white/6 px-4 py-3 text-sm text-white/75"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <div className="mt-10 grid gap-4 md:grid-cols-3">
                  {metricValues.map((item) => (
                    <MetricCard key={item.label} label={item.label} value={item.value} detail={item.detail} />
                  ))}
                </div>
              </div>

              <div className="space-y-4 rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_30px_100px_rgba(2,6,23,0.34)] backdrop-blur">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.28em] text-white/45">Ce que l app fait</p>
                  <ArrowUpRight className="h-4 w-4 text-white/55" />
                </div>

                {transformationSteps.map((step) => {
                  const Icon = step.icon

                  return (
                    <article key={step.title} className="rounded-[26px] border border-white/8 bg-[#0a1120] p-5">
                      <div className="flex items-start gap-4">
                        <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/6">
                          <Icon className="h-5 w-5 text-[#67e8f9]" />
                        </div>
                        <div>
                          <h2 className="font-serif text-2xl text-white">{step.title}</h2>
                          <p className="mt-2 text-sm leading-7 text-white/65">{step.body}</p>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>
          </header>

          <div className="mt-12 grid gap-6 xl:grid-cols-[0.36fr_0.64fr]">
            <ProjectRail
              projects={projects}
              activeProjectId={activeProjectId}
              onSelect={selectProject}
              onCreate={createProject}
            />

            <div className="grid gap-6">
              <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_24px_90px_rgba(5,10,25,0.3)]">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-[#67e8f9]">Projet actif</p>
                    <h2 className="mt-2 font-serif text-3xl text-white">
                      {activeProject?.label ?? 'Nouveau projet'}
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-white/68">
                      Chaque projet garde sa propre URL source, ses preuves d autorisation, son
                      branding et son apercu complet. Ideal pour enchainer plusieurs refontes
                      clients sans melanger les contenus.
                    </p>
                  </div>

                  <div className="grid gap-3 text-sm text-white/70 md:grid-cols-2">
                    <div className="rounded-[24px] border border-white/10 bg-[#0a1120] px-4 py-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/40">Source</p>
                      <p className="mt-2 font-medium text-white">
                        {activeProject?.sourceUrl || 'Aucune URL renseignee'}
                      </p>
                    </div>
                    <div className="rounded-[24px] border border-white/10 bg-[#0a1120] px-4 py-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/40">Statut</p>
                      <p className="mt-2 inline-flex items-center gap-2 font-medium text-white">
                        <FolderCog className="h-4 w-4 text-[#67e8f9]" />
                        {activeAnalysis ? 'Analyse disponible' : 'Projet en preparation'}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {activeProject ? (
                <SourceIntake
                  projectLabel={activeProject.label}
                  sourceUrl={activeProject.sourceUrl}
                  authorizationConfirmed={activeProject.authorizationConfirmed}
                  authorizationEvidence={activeProject.authorizationEvidence}
                  loading={loading}
                  error={error}
                  onProjectLabelChange={(value) => updateProject({ label: value })}
                  onChange={(value) => updateProject({ sourceUrl: value })}
                  onAuthorizationToggle={(value) => updateProject({ authorizationConfirmed: value })}
                  onAuthorizationEvidenceChange={(value) =>
                    updateProject({ authorizationEvidence: value })
                  }
                  onSubmit={analyzeActiveProject}
                />
              ) : null}

              <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
                <div className="space-y-6">
                  <InsightPanel
                    projectLabel={activeProject?.label ?? 'Nouveau projet'}
                    authorizationConfirmed={activeProject?.authorizationConfirmed ?? false}
                    authorizationEvidence={activeProject?.authorizationEvidence ?? ''}
                    analysis={activeAnalysis}
                  />
                  {activeBrand ? <BrandStudio brand={activeBrand} onChange={updateBrand} /> : null}
                </div>

                <GeneratedPreview
                  brand={activeBrand ?? projects[0].brand}
                  generatedSite={activeGeneratedSite}
                  activePageSlug={previewPageSlug}
                  onSelectPage={setPreviewPageSlug}
                  onOpenPage={(slug) => {
                    const path = slug === '/' ? '/site' : `/site${slug}`
                    window.open(path, '_blank', 'noopener,noreferrer')
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
