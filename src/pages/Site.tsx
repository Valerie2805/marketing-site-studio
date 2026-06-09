import { Link, useParams } from 'react-router-dom'
import PasswordGate from '@/components/PasswordGate'
import { useStudioStore } from '@/hooks/useStudioStore'

const mapSlugToPath = (slug: string) => (slug === '/' ? '/site' : `/site${slug}`)

export default function Site() {
  const params = useParams<{ page?: string }>()
  const {
    authToken,
    authLoading,
    authError,
    login,
    brand,
    generatedSite,
  } = useStudioStore()

  const slug = params.page ? `/${params.page}` : '/'
  const page = generatedSite?.pages.find((item) => item.slug === slug) ?? generatedSite?.pages[0]

  const dim = Number.isFinite(brand.backgroundDim) ? brand.backgroundDim : 0.72
  const zoom = Number.isFinite(brand.backgroundZoom) ? brand.backgroundZoom : 1
  const motionRange = Number.isFinite(brand.backgroundMotionRange) ? brand.backgroundMotionRange : 26
  const motionDuration = Number.isFinite(brand.backgroundMotionDuration) ? brand.backgroundMotionDuration : 18
  const overlayTop = Math.min(0.96, Math.max(0.3, dim))
  const overlayBottom = Math.min(0.96, Math.max(0.3, dim - 0.18))
  const scale = Math.max(0.7, Math.min(1.35, zoom))
  const shift = `${Math.max(2, Math.min(22, motionRange / 2))}%`

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <PasswordGate open={!authToken} loading={authLoading} error={authError} onSubmit={login} />

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-white/45">Site genere</p>
            <h1 className="mt-2 font-serif text-4xl text-white">{generatedSite?.brandName ?? 'Nouvelle version'}</h1>
          </div>
          <Link
            to="/"
            className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/70 transition hover:bg-white/10"
          >
            Retour au studio
          </Link>
        </div>

        {!generatedSite || !page ? (
          <div className="mt-10 rounded-[32px] border border-white/10 bg-white/5 p-8 text-sm text-white/65">
            Genere une version dans le studio, puis reviens ici.
          </div>
        ) : (
          <div className="mt-8 overflow-hidden rounded-[36px] border border-white/10 bg-[#0b1120] shadow-[0_30px_120px_rgba(2,6,23,0.5)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-6 py-4">
              <nav className="flex flex-wrap items-center gap-2">
                {generatedSite.pages.map((item) => (
                  <Link
                    key={item.slug}
                    to={mapSlugToPath(item.slug)}
                    className={[
                      'rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition',
                      item.slug === page.slug
                        ? 'border-white/25 bg-white/10 text-white'
                        : 'border-white/10 bg-white/5 text-white/65 hover:bg-white/10',
                    ].join(' ')}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/55">
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">{brand.tone}</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  viralite {brand.viralityLevel}/5
                </span>
              </div>
            </div>

            <div className="relative">
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
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: brand.backgroundImage
                    ? `linear-gradient(135deg, rgba(2, 6, 23, ${overlayTop}), rgba(2, 6, 23, ${overlayBottom}))`
                    : `radial-gradient(circle at top left, ${brand.accentColor}44, transparent 34%), linear-gradient(135deg, ${brand.primaryColor}, #040816 75%)`,
                }}
              />

              <div className="relative px-6 py-10 md:px-10 md:py-14">
                <p className="text-xs uppercase tracking-[0.32em]" style={{ color: brand.accentColor }}>
                  {page.name}
                </p>
                <h2 className="mt-4 max-w-3xl font-serif text-5xl leading-tight text-white">
                  {page.slug === '/' ? generatedSite.headline : page.sections[0]?.title ?? generatedSite.headline}
                </h2>
                <p className="mt-5 max-w-3xl text-base leading-7 text-white/72">
                  {page.slug === '/' ? generatedSite.subheadline : page.sections[0]?.body ?? generatedSite.subheadline}
                </p>

                <div className="mt-10 grid gap-5 lg:grid-cols-2">
                  {page.sections.map((section) => (
                    <article key={section.id} className="rounded-[28px] border border-white/10 bg-white/6 p-6 backdrop-blur">
                      <p className="text-xs uppercase tracking-[0.22em] text-white/45">{section.eyebrow}</p>
                      <h3 className="mt-3 font-serif text-3xl text-white">{section.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-white/70">{section.body}</p>
                      {section.bullets.length ? (
                        <ul className="mt-4 space-y-2 text-sm text-white/70">
                          {section.bullets.map((item) => (
                            <li key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                              {item}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </article>
                  ))}
                </div>

                {page.slug === '/' ? (
                  <div className="mt-10 rounded-[30px] border border-white/10 bg-[#f8f5ef] p-7 text-[#0b1120] shadow-[0_20px_80px_rgba(9,15,35,0.22)]">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">FAQ</p>
                    <div className="mt-5 grid gap-4 lg:grid-cols-3">
                      {generatedSite.faq.map((item) => (
                        <article key={item.question} className="rounded-2xl border border-slate-900/10 bg-white px-4 py-4 shadow-sm">
                          <p className="text-sm font-semibold">{item.question}</p>
                          <p className="mt-2 text-sm leading-6 text-slate-600">{item.answer}</p>
                        </article>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
