import { ArrowUpRight, BadgeCheck, Layers3, Palette, Sparkles, Wand2 } from 'lucide-react'
import BrandStudio from '@/components/BrandStudio'
import GeneratedPreview from '@/components/GeneratedPreview'
import InsightPanel from '@/components/InsightPanel'
import MetricCard from '@/components/MetricCard'
import PasswordGate from '@/components/PasswordGate'
import SourceIntake from '@/components/SourceIntake'
import { useStudioStore } from '@/hooks/useStudioStore'

const promisePoints = [
  'Analyse d un site public existant',
  'Reformulation marketing plus differentiée',
  'Reglages visuels instantanes',
  'Preview d une nouvelle home vendeuse',
]

const transformationSteps = [
  {
    icon: Layers3,
    title: 'Lire le site source',
    body: 'Extraction des promesses, CTA, pages detectees et signaux de preuve sociale.',
  },
  {
    icon: Wand2,
    title: 'Recomposer le message',
    body: 'Creation d un nouveau positionnement plus net, plus memorisable et plus rentable.',
  },
  {
    icon: Palette,
    title: 'Personnaliser le branding',
    body: 'Couleurs, logo, fond d ecran, ton et niveau d intensite virale modifiables en direct.',
  },
]

export default function Home() {
  const {
    sourceUrl,
    analysis,
    generatedSite,
    loading,
    error,
    authToken,
    authLoading,
    authError,
    brand,
    setSourceUrl,
    updateBrand,
    analyzeSource,
    login,
    logout,
  } = useStudioStore()

  const metricValues = [
    {
      label: 'Signal source',
      value: analysis ? `${analysis.offers.length} offres` : '0 analyse',
      detail: analysis
        ? 'Le moteur detecte les offres et zones de valeur exploitables.'
        : 'Ajoute une URL pour commencer l extraction marketing.',
    },
    {
      label: 'Viralite',
      value: `${brand.viralityLevel}/5`,
      detail: 'Plus le niveau est haut, plus les accroches et CTA sont affirmes.',
    },
    {
      label: 'Preview',
      value: generatedSite ? `${generatedSite.pages.length} pages` : '0 page',
      detail: 'La structure generee sert de base a une refonte plus claire et partageable.',
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
                  <p className="text-xs uppercase tracking-[0.28em] text-white/45">Marketing Site Studio</p>
                  <p className="font-serif text-2xl text-white">Reboot ton site a partir d un site existant</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.2em] text-white/60">
                  <BadgeCheck className="h-4 w-4 text-[#67e8f9]" />
                  desktop-first
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
                <p className="text-xs uppercase tracking-[0.34em] text-[#f6c7b8]">Audit, redesign, viralite</p>
                <h1 className="mt-4 max-w-4xl font-serif text-5xl leading-[1.02] text-white md:text-6xl">
                  Transforme les informations d un site public en un nouveau site qui se remarque et
                  convertit plus vite.
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-8 text-white/70">
                  Cette application lit les pages publiques d un site source, recupere les messages
                  utiles, puis construit une nouvelle vitrine plus claire, plus desirables et plus
                  facile a personnaliser.
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

          <div className="mt-12 grid gap-6">
            <SourceIntake
              sourceUrl={sourceUrl}
              loading={loading}
              error={error}
              onChange={setSourceUrl}
              onSubmit={analyzeSource}
            />

            <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
              <div className="space-y-6">
                <InsightPanel analysis={analysis} />
                <BrandStudio brand={brand} onChange={updateBrand} />
              </div>

              <GeneratedPreview brand={brand} generatedSite={generatedSite} />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
