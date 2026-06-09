type SourceIntakeProps = {
  sourceUrl: string
  loading: boolean
  error: string | null
  onChange: (value: string) => void
  onSubmit: () => void
}

export default function SourceIntake({
  sourceUrl,
  loading,
  error,
  onChange,
  onSubmit,
}: SourceIntakeProps) {
  return (
    <section className="rounded-[32px] border border-white/10 bg-[#111827]/80 p-6 shadow-[0_24px_90px_rgba(5,10,25,0.45)] backdrop-blur-xl">
      <div className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-[0.32em] text-[#f6c7b8]">Source publique</p>
        <h2 className="max-w-2xl font-serif text-3xl text-white">
          Analyse un site existant puis transforme-le en nouvelle vitrine plus claire, plus forte et
          plus partageable.
        </h2>
        <p className="max-w-2xl text-sm text-white/70">
          L app recupere les informations visibles sur le site source, detecte l offre, les CTA et
          les opportunites marketing, puis te laisse piloter le branding.
        </p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto]">
        <label className="rounded-[24px] border border-white/10 bg-white/5 px-5 py-4 text-sm text-white/80">
          <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-white/45">
            URL du site source
          </span>
          <input
            className="w-full bg-transparent text-base text-white outline-none placeholder:text-white/30"
            value={sourceUrl}
            onChange={(event) => onChange(event.target.value)}
            placeholder="https://example.com"
          />
        </label>

        <button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          className="rounded-[24px] bg-[#ff6b57] px-8 py-4 text-sm font-semibold text-[#1b1020] transition hover:translate-y-[-1px] hover:bg-[#ff806f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Analyse en cours...' : 'Generer la base marketing'}
        </button>
      </div>

      {error ? (
        <p className="mt-4 rounded-2xl border border-[#ff6b57]/30 bg-[#ff6b57]/10 px-4 py-3 text-sm text-[#ffd7d1]">
          {error}
        </p>
      ) : null}
    </section>
  )
}
