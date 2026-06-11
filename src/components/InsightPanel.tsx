import type { SiteAnalysis } from '../../shared/types'

type InsightPanelProps = {
  projectLabel: string
  authorizationConfirmed: boolean
  authorizationEvidence: string
  analysis: SiteAnalysis | null
}

const listClasses =
  'mt-3 space-y-2 text-sm text-slate-200/80 [&>li]:rounded-2xl [&>li]:border [&>li]:border-white/8 [&>li]:bg-white/5 [&>li]:px-4 [&>li]:py-3'

export default function InsightPanel({
  projectLabel,
  authorizationConfirmed,
  authorizationEvidence,
  analysis,
}: InsightPanelProps) {
  if (!analysis) {
    return (
      <section className="rounded-[28px] border border-dashed border-white/10 bg-white/5 p-6 text-sm text-white/55">
        Lance une premiere analyse pour afficher l arborescence detectee, les offres sources et les
        opportunites de refonte de ce projet autorise.
      </section>
    )
  }

  return (
    <section className="rounded-[32px] border border-white/10 bg-[#0b1120] p-6 shadow-[0_24px_90px_rgba(5,10,25,0.28)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#a5b4fc]">Lecture source</p>
          <h3 className="mt-2 font-serif text-2xl text-white">{analysis.siteName}</h3>
          <p className="mt-2 max-w-2xl text-sm text-white/65">{analysis.positioning}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/35">
            Projet {projectLabel} - {analysis.pages.length} pages detectees
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/60">
            {analysis.toneSummary}
          </span>
          <span
            className={[
              'rounded-full border px-4 py-2 text-xs uppercase tracking-[0.18em]',
              authorizationConfirmed
                ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200'
                : 'border-amber-400/30 bg-amber-400/10 text-amber-100',
            ].join(' ')}
          >
            {authorizationConfirmed ? 'autorisation validee' : 'autorisation a confirmer'}
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-white/40">Offres detectees</p>
          <ul className={listClasses}>
            {analysis.offers.slice(0, 3).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-white/40">Actions a renforcer</p>
          <ul className={listClasses}>
            {analysis.diagnostic.slice(0, 3).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <article className="rounded-[24px] border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">CTA</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {analysis.callsToAction.map((item) => (
              <span key={item} className="rounded-full bg-white/8 px-3 py-2 text-xs text-white/75">
                {item}
              </span>
            ))}
          </div>
        </article>

        <article className="rounded-[24px] border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">Mots SEO</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {analysis.seoKeywords.map((item) => (
              <span key={item} className="rounded-full bg-white/8 px-3 py-2 text-xs text-white/75">
                {item}
              </span>
            ))}
          </div>
        </article>

        <article className="rounded-[24px] border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">Autorisation</p>
          <p className="mt-3 text-sm leading-6 text-white/75">
            {authorizationEvidence || 'Aucune note ajoutee pour l instant. Pensez a garder une trace du mandat.'}
          </p>
        </article>
      </div>

      <article className="mt-6 rounded-[24px] border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">Pages detectees</p>
          <span className="rounded-full border border-white/10 bg-white/6 px-3 py-2 text-xs text-white/60">
            {analysis.pages.length} pages
          </span>
        </div>
        <ul className="mt-3 grid gap-2 md:grid-cols-2">
          {analysis.pages.map((page) => (
            <li key={page.url} className="rounded-2xl bg-white/6 px-4 py-3 text-sm text-white/75">
              <p className="font-medium text-white">{page.title || page.url}</p>
              {page.headings.length ? (
                <p className="mt-2 text-xs leading-5 text-white/55">
                  {page.headings.slice(0, 3).join(' - ')}
                </p>
              ) : null}
            </li>
          ))}
          {!analysis.pages.length ? (
            <li className="rounded-2xl bg-white/6 px-4 py-3 text-sm text-white/55">
              Aucune page secondaire detectee sur le site source.
            </li>
          ) : null}
        </ul>
      </article>
    </section>
  )
}
