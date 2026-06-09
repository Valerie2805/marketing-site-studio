import type { SiteAnalysis } from '../../shared/types'

type InsightPanelProps = {
  analysis: SiteAnalysis | null
}

const listClasses =
  'mt-3 space-y-2 text-sm text-slate-200/80 [&>li]:rounded-2xl [&>li]:border [&>li]:border-white/8 [&>li]:bg-white/5 [&>li]:px-4 [&>li]:py-3'

export default function InsightPanel({ analysis }: InsightPanelProps) {
  if (!analysis) {
    return (
      <section className="rounded-[28px] border border-dashed border-white/10 bg-white/5 p-6 text-sm text-white/55">
        Lance une premiere analyse pour afficher les offres detectees, le ton du site source et les
        opportunites de refonte virale.
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
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/60">
          {analysis.toneSummary}
        </span>
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
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">Pages reperees</p>
          <ul className="mt-3 space-y-2 text-sm text-white/75">
            {analysis.pages.slice(0, 3).map((page) => (
              <li key={page.url} className="truncate rounded-2xl bg-white/6 px-3 py-2">
                {page.title || page.url}
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  )
}
