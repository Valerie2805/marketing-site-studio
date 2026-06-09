import type { BrandSettings, GeneratedSite } from '../../shared/types'

type GeneratedPreviewProps = {
  brand: BrandSettings
  generatedSite: GeneratedSite | null
  activePageSlug: string
  onSelectPage: (slug: string) => void
  onOpenPage: (slug: string) => void
}

export default function GeneratedPreview({
  brand,
  generatedSite,
  activePageSlug,
  onSelectPage,
  onOpenPage,
}: GeneratedPreviewProps) {
  const dim = Number.isFinite(brand.backgroundDim) ? brand.backgroundDim : 0.72
  const zoom = Number.isFinite(brand.backgroundZoom) ? brand.backgroundZoom : 1
  const motionRange = Number.isFinite(brand.backgroundMotionRange) ? brand.backgroundMotionRange : 26
  const motionDuration = Number.isFinite(brand.backgroundMotionDuration) ? brand.backgroundMotionDuration : 18
  const overlayTop = Math.min(0.96, Math.max(0.3, dim))
  const overlayBottom = Math.min(0.96, Math.max(0.3, dim - 0.18))

  const scale = Math.max(0.7, Math.min(1.35, zoom))
  const shift = `${Math.max(2, Math.min(22, motionRange / 2))}%`

  const gradientLayerStyle = {
    backgroundImage: brand.backgroundImage
      ? `linear-gradient(135deg, rgba(2, 6, 23, ${overlayTop}), rgba(2, 6, 23, ${overlayBottom}))`
      : `radial-gradient(circle at top left, ${brand.accentColor}44, transparent 34%), linear-gradient(135deg, ${brand.primaryColor}, #040816 75%)`,
  }

  if (!generatedSite) {
    return (
      <section className="rounded-[32px] border border-dashed border-white/10 bg-white/5 p-6 text-sm text-white/55">
        La preview du nouveau site apparait ici des qu une analyse est disponible.
      </section>
    )
  }

  const pages = generatedSite.pages
  const currentPage = pages.find((page) => page.slug === activePageSlug) ?? pages[0]

  return (
    <section className="rounded-[36px] border border-white/10 bg-[#050816] p-4 shadow-[0_30px_120px_rgba(2,6,23,0.5)]">
      <div className="rounded-[30px] border border-white/10 bg-[#0b1120] p-3">
        <div className="flex items-center gap-2 px-3 pb-3">
          <span className="h-3 w-3 rounded-full bg-[#ff6b57]" />
          <span className="h-3 w-3 rounded-full bg-[#f59e0b]" />
          <span className="h-3 w-3 rounded-full bg-[#34d399]" />
          <div className="ml-auto flex flex-wrap items-center gap-2">
            {pages.map((page) => (
              <button
                key={page.slug}
                type="button"
                onClick={() => onSelectPage(page.slug)}
                className={[
                  'rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition',
                  page.slug === currentPage.slug
                    ? 'border-white/25 bg-white/10 text-white'
                    : 'border-white/10 bg-white/5 text-white/65 hover:bg-white/10',
                ].join(' ')}
              >
                {page.name}
              </button>
            ))}
            <button
              type="button"
              onClick={() => onOpenPage(currentPage.slug)}
              className="rounded-full bg-[#67e8f9] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#0b1120] transition hover:bg-[#8cf0fb]"
            >
              Ouvrir le site
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[26px] border border-white/10">
          {brand.backgroundImage ? (
            <img
              src={brand.backgroundImage}
              alt=""
              className={[
                'absolute inset-0 h-full w-full select-none',
                brand.backgroundMotion ? 'bg-shift-x' : '',
              ].join(' ')}
              style={{
                objectFit: brand.backgroundMode === 'contain' ? 'contain' : 'cover',
                objectPosition: 'center',
                transform: brand.backgroundMotion ? undefined : `scale(${scale})`,
                ['--bg-scale' as never]: String(scale),
                ['--bg-shift' as never]: shift,
                ['--bg-duration' as never]: `${Math.max(6, motionDuration)}s`,
              } as never}
              draggable={false}
            />
          ) : null}
          <div className="absolute inset-0" style={gradientLayerStyle} />

          <div className="relative bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent)] p-8 md:p-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {brand.logoDataUrl ? (
                  <img src={brand.logoDataUrl} alt="Logo" className="h-11 w-11 rounded-2xl object-cover" />
                ) : (
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-semibold"
                    style={{ backgroundColor: brand.accentColor, color: brand.primaryColor }}
                  >
                    {generatedSite.brandName.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/50">Nouvelle marque</p>
                  <p className="font-serif text-2xl text-white">{generatedSite.brandName}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-white/12 bg-white/6 px-3 py-2 text-xs text-white/65">
                  {brand.tone}
                </span>
                <span className="rounded-full border border-white/12 bg-white/6 px-3 py-2 text-xs text-white/65">
                  viralite {brand.viralityLevel}/5
                </span>
              </div>
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <p className="text-xs uppercase tracking-[0.32em]" style={{ color: brand.accentColor }}>
                  refonte marketing
                </p>
                <h3 className="mt-4 max-w-2xl font-serif text-5xl leading-tight text-white">
                  {generatedSite.headline}
                </h3>
                <p className="mt-5 max-w-2xl text-base leading-7 text-white/72">
                  {generatedSite.subheadline}
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="rounded-full px-6 py-3 text-sm font-semibold"
                    style={{ backgroundColor: brand.accentColor, color: brand.primaryColor }}
                  >
                    {generatedSite.heroCta}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const next = pages.find((page) => page.slug !== currentPage.slug)
                      if (next) {
                        onSelectPage(next.slug)
                      }
                    }}
                    className="rounded-full border border-white/10 bg-white/6 px-6 py-3 text-sm font-semibold text-white"
                  >
                    {generatedSite.supportCta}
                  </button>
                </div>

                <div className="mt-10 grid gap-4 md:grid-cols-3">
                  {currentPage.sections.slice(0, 3).map((section) => (
                    <article key={section.id} className="rounded-[26px] border border-white/10 bg-white/5 p-5 backdrop-blur">
                      <p className="text-xs uppercase tracking-[0.22em] text-white/45">{section.eyebrow}</p>
                      <h4 className="mt-3 font-serif text-2xl text-white">{section.title}</h4>
                      <p className="mt-3 text-sm leading-6 text-white/70">{section.body}</p>
                    </article>
                  ))}
                </div>
              </div>

              <aside className="rounded-[30px] border border-white/10 bg-[#f8f5ef] p-6 text-[#1b2234] shadow-[0_20px_80px_rgba(9,15,35,0.22)]">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Share hooks</p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                  {generatedSite.shareHooks.map((hook) => (
                    <li key={hook} className="rounded-2xl bg-slate-900/5 px-4 py-3">
                      {hook}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 rounded-[24px] p-5" style={{ backgroundColor: brand.primaryColor, color: brand.secondaryColor }}>
                  <p className="text-xs uppercase tracking-[0.22em] opacity-60">Proof banner</p>
                  <p className="mt-3 font-serif text-2xl">{generatedSite.proofBanner}</p>
                </div>

                <div className="mt-6 space-y-4">
                  {generatedSite.faq.map((item) => (
                    <article key={item.question} className="rounded-2xl border border-slate-900/8 bg-white px-4 py-4 shadow-sm">
                      <p className="text-sm font-semibold">{item.question}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{item.answer}</p>
                    </article>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
