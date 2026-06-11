import { CheckCircle2, FolderKanban, Globe2, Plus, ShieldAlert } from 'lucide-react'
import type { SiteProject } from '../../shared/types'

type ProjectRailProps = {
  projects: SiteProject[]
  activeProjectId: string
  onSelect: (id: string) => void
  onCreate: () => void
}

const formatHost = (value: string) => {
  if (!value) {
    return 'Aucune URL'
  }

  try {
    const url = value.startsWith('http') ? new URL(value) : new URL(`https://${value}`)
    return url.hostname.replace(/^www\./, '')
  } catch {
    return value
  }
}

export default function ProjectRail({
  projects,
  activeProjectId,
  onSelect,
  onCreate,
}: ProjectRailProps) {
  return (
    <aside className="rounded-[32px] border border-white/10 bg-[#0b1120] p-5 shadow-[0_24px_90px_rgba(5,10,25,0.32)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#67e8f9]">Portefeuille</p>
          <h2 className="mt-2 font-serif text-2xl text-white">Vos refontes autorisees</h2>
        </div>

        <button
          type="button"
          onClick={onCreate}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/75 transition hover:bg-white/10"
        >
          <Plus className="h-4 w-4" />
          Nouveau
        </button>
      </div>

      <div className="mt-5 space-y-3">
        {projects.map((project) => {
          const isActive = project.id === activeProjectId
          const pageCount = project.generatedSite?.pages.length ?? 0

          return (
            <button
              key={project.id}
              type="button"
              onClick={() => onSelect(project.id)}
              className={[
                'w-full rounded-[24px] border p-4 text-left transition',
                isActive
                  ? 'border-[#67e8f9]/50 bg-[#0f1a2f] shadow-[0_12px_40px_rgba(6,20,35,0.45)]'
                  : 'border-white/8 bg-white/5 hover:bg-white/8',
              ].join(' ')}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">{project.label}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-white/55">
                    <Globe2 className="h-3.5 w-3.5" />
                    <span>{formatHost(project.sourceUrl)}</span>
                  </div>
                </div>

                <div className="rounded-full border border-white/10 bg-white/6 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-white/60">
                  {pageCount ? `${pageCount} pages` : 'brouillon'}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em]">
                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/6 px-3 py-2 text-white/60">
                  <FolderKanban className="h-3.5 w-3.5" />
                  {project.analysis ? 'analyse prete' : 'a analyser'}
                </span>
                <span
                  className={[
                    'inline-flex items-center gap-1 rounded-full border px-3 py-2',
                    project.authorizationConfirmed
                      ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200'
                      : 'border-amber-400/30 bg-amber-400/10 text-amber-100',
                  ].join(' ')}
                >
                  {project.authorizationConfirmed ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <ShieldAlert className="h-3.5 w-3.5" />
                  )}
                  {project.authorizationConfirmed ? 'autorisation OK' : 'autorisation requise'}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </aside>
  )
}
