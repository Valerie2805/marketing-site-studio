type SourceIntakeProps = {
  projectLabel: string
  sourceUrl: string
  authorizationConfirmed: boolean
  authorizationEvidence: string
  loading: boolean
  error: string | null
  onProjectLabelChange: (value: string) => void
  onChange: (value: string) => void
  onAuthorizationToggle: (value: boolean) => void
  onAuthorizationEvidenceChange: (value: string) => void
  onSubmit: () => void
}

export default function SourceIntake({
  projectLabel,
  sourceUrl,
  authorizationConfirmed,
  authorizationEvidence,
  loading,
  error,
  onProjectLabelChange,
  onChange,
  onAuthorizationToggle,
  onAuthorizationEvidenceChange,
  onSubmit,
}: SourceIntakeProps) {
  return (
    <section className="rounded-[32px] border border-white/10 bg-[#111827]/80 p-6 shadow-[0_24px_90px_rgba(5,10,25,0.45)] backdrop-blur-xl">
      <div className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-[0.32em] text-[#f6c7b8]">Source autorisee</p>
        <h2 className="max-w-2xl font-serif text-3xl text-white">
          Analyse un site que vous possedez ou que vous etes autorisee a refondre, puis
          reconstruisez une nouvelle version complete.
        </h2>
        <p className="max-w-2xl text-sm text-white/70">
          L application cartographie les pages publiques, extrait les messages utiles, puis genere
          un nouveau site structure page par page avec refonte design et marketing.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="rounded-[24px] border border-white/10 bg-white/5 px-5 py-4 text-sm text-white/80">
          <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-white/45">
            Nom du projet
          </span>
          <input
            className="w-full bg-transparent text-base text-white outline-none placeholder:text-white/30"
            value={projectLabel}
            onChange={(event) => onProjectLabelChange(event.target.value)}
            placeholder="Refonte site cabinet X"
          />
        </label>

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
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto]">
        <div className="rounded-[24px] border border-white/10 bg-white/5 px-5 py-4 text-sm text-white/80">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={authorizationConfirmed}
              onChange={(event) => onAuthorizationToggle(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent accent-[#67e8f9]"
            />
            <span>
              <span className="block text-xs uppercase tracking-[0.22em] text-white/45">
                Autorisation confirmee
              </span>
              <span className="mt-2 block text-sm text-white/72">
                Je confirme que je possede ce site ou que je dispose d une autorisation ecrite pour
                le reconstruire.
              </span>
            </span>
          </label>

          <textarea
            value={authorizationEvidence}
            onChange={(event) => onAuthorizationEvidenceChange(event.target.value)}
            className="mt-4 min-h-24 w-full resize-none rounded-[20px] border border-white/10 bg-[#0b1120] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
            placeholder="Client Mirevona, refonte validee le 10 juin, ou note interne de propriete..."
          />
        </div>

        <button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          className="rounded-[24px] bg-[#ff6b57] px-8 py-4 text-sm font-semibold text-[#1b1020] transition hover:translate-y-[-1px] hover:bg-[#ff806f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Analyse en cours...' : 'Analyser et reconstruire'}
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
