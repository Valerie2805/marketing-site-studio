import type { ChangeEvent } from 'react'
import type { BrandSettings } from '../../shared/types'

type BrandStudioProps = {
  brand: BrandSettings
  onChange: (value: Partial<BrandSettings>) => void
}

const toneOptions: Array<{ value: BrandSettings['tone']; label: string }> = [
  { value: 'viral', label: 'Viral' },
  { value: 'premium', label: 'Premium' },
  { value: 'expert', label: 'Expert' },
  { value: 'direct', label: 'Direct' },
  { value: 'luxe', label: 'Luxe' },
]

const backgroundModeOptions: Array<{ value: BrandSettings['backgroundMode']; label: string }> = [
  { value: 'cover', label: 'Recadrer (cover)' },
  { value: 'contain', label: 'Afficher entier (contain)' },
]

const fileToDataUrl = (file: File, callback: (value: string) => void) => {
  const reader = new FileReader()
  reader.onload = () => callback(String(reader.result ?? ''))
  reader.readAsDataURL(file)
}

const ColorField = ({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) => (
  <label className="rounded-[22px] border border-white/10 bg-white/5 p-4 text-sm text-white/70">
    <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-white/40">{label}</span>
    <div className="flex items-center gap-3">
      <input type="color" value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-12 rounded-xl border-0 bg-transparent" />
      <span className="font-mono text-xs uppercase text-white/70">{value}</span>
    </div>
  </label>
)

export default function BrandStudio({ brand, onChange }: BrandStudioProps) {
  const handleFile = (key: 'logoDataUrl' | 'backgroundImage') => (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    fileToDataUrl(file, (result) => onChange({ [key]: result }))
  }

  return (
    <section className="rounded-[32px] border border-white/10 bg-[#111827] p-6 shadow-[0_24px_90px_rgba(5,10,25,0.32)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#67e8f9]">Studio de marque</p>
          <h3 className="mt-2 font-serif text-2xl text-white">Reglages qui changent la perception</h3>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.16em] text-white/55">
          live preview
        </span>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="rounded-[22px] border border-white/10 bg-white/5 p-4 text-sm text-white/70 md:col-span-2">
          <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-white/40">Nom de marque</span>
          <input
            value={brand.brandName}
            onChange={(event) => onChange({ brandName: event.target.value })}
            className="w-full bg-transparent text-white outline-none placeholder:text-white/30"
            placeholder="Nova Pulse"
          />
        </label>

        <ColorField label="Couleur primaire" value={brand.primaryColor} onChange={(value) => onChange({ primaryColor: value })} />
        <ColorField label="Couleur secondaire" value={brand.secondaryColor} onChange={(value) => onChange({ secondaryColor: value })} />
        <ColorField label="Couleur accent" value={brand.accentColor} onChange={(value) => onChange({ accentColor: value })} />

        <label className="rounded-[22px] border border-white/10 bg-white/5 p-4 text-sm text-white/70">
          <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-white/40">Ton marketing</span>
          <select
            value={brand.tone}
            onChange={(event) => onChange({ tone: event.target.value as BrandSettings['tone'] })}
            className="w-full rounded-2xl bg-[#0b1120] px-3 py-3 text-white outline-none"
          >
            {toneOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label className="rounded-[22px] border border-white/10 bg-white/5 p-4 text-sm text-white/70 md:col-span-2">
          <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-white/40">Audience prioritaire</span>
          <input
            value={brand.audienceFocus}
            onChange={(event) => onChange({ audienceFocus: event.target.value })}
            className="w-full bg-transparent text-white outline-none placeholder:text-white/30"
            placeholder="Dirigeants, prospects premium, visiteurs tiedes..."
          />
        </label>

        <label className="rounded-[22px] border border-white/10 bg-white/5 p-4 text-sm text-white/70 md:col-span-2">
          <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-white/40">Promesse signature</span>
          <textarea
            value={brand.signatureOffer}
            onChange={(event) => onChange({ signatureOffer: event.target.value })}
            className="min-h-24 w-full resize-none bg-transparent text-white outline-none placeholder:text-white/30"
            placeholder="Une promesse plus claire et plus vendeuse."
          />
        </label>

        <label className="rounded-[22px] border border-white/10 bg-white/5 p-4 text-sm text-white/70 md:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs uppercase tracking-[0.22em] text-white/40">Intensite virale</span>
            <span className="text-xs text-white/60">{brand.viralityLevel}/5</span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            value={brand.viralityLevel}
            onChange={(event) => onChange({ viralityLevel: Number(event.target.value) })}
            className="mt-4 w-full accent-[#ff6b57]"
          />
        </label>

        <label className="rounded-[22px] border border-white/10 bg-white/5 p-4 text-sm text-white/70">
          <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-white/40">Logo</span>
          <input type="file" accept="image/*" onChange={handleFile('logoDataUrl')} className="w-full text-xs text-white/60" />
        </label>

        <label className="rounded-[22px] border border-white/10 bg-white/5 p-4 text-sm text-white/70">
          <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-white/40">Fond d ecran</span>
          <input type="file" accept="image/*" onChange={handleFile('backgroundImage')} className="w-full text-xs text-white/60" />
        </label>

        <label className="rounded-[22px] border border-white/10 bg-white/5 p-4 text-sm text-white/70">
          <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-white/40">Mode du fond</span>
          <select
            value={brand.backgroundMode}
            onChange={(event) =>
              onChange({ backgroundMode: event.target.value as BrandSettings['backgroundMode'] })
            }
            className="w-full rounded-2xl bg-[#0b1120] px-3 py-3 text-white outline-none"
          >
            {backgroundModeOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label className="rounded-[22px] border border-white/10 bg-white/5 p-4 text-sm text-white/70 md:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs uppercase tracking-[0.22em] text-white/40">Lisibilite du fond</span>
            <span className="text-xs text-white/60">{Math.round(brand.backgroundDim * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.35"
            max="0.92"
            step="0.01"
            value={brand.backgroundDim}
            onChange={(event) => onChange({ backgroundDim: Number(event.target.value) })}
            className="mt-4 w-full accent-[#67e8f9]"
          />
        </label>

        <label className="rounded-[22px] border border-white/10 bg-white/5 p-4 text-sm text-white/70 md:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs uppercase tracking-[0.22em] text-white/40">Zoom du fond</span>
            <span className="text-xs text-white/60">{Math.round(brand.backgroundZoom * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.7"
            max="1.35"
            step="0.01"
            value={brand.backgroundZoom}
            onChange={(event) => onChange({ backgroundZoom: Number(event.target.value) })}
            className="mt-4 w-full accent-[#ff6b57]"
          />
        </label>

        <label className="rounded-[22px] border border-white/10 bg-white/5 p-4 text-sm text-white/70 md:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs uppercase tracking-[0.22em] text-white/40">Animation du fond</span>
            <button
              type="button"
              onClick={() => onChange({ backgroundMotion: !brand.backgroundMotion })}
              className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs font-semibold text-white/75 transition hover:bg-white/10"
            >
              {brand.backgroundMotion ? 'Activee' : 'Desactivee'}
            </button>
          </div>
          <p className="mt-2 text-xs text-white/55">
            Fait bouger l image de gauche a droite en boucle pour donner du mouvement.
          </p>
        </label>

        <label className="rounded-[22px] border border-white/10 bg-white/5 p-4 text-sm text-white/70 md:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs uppercase tracking-[0.22em] text-white/40">Amplitude</span>
            <span className="text-xs text-white/60">{Math.round(brand.backgroundMotionRange)}%</span>
          </div>
          <input
            type="range"
            min="8"
            max="44"
            step="1"
            value={brand.backgroundMotionRange}
            onChange={(event) => onChange({ backgroundMotionRange: Number(event.target.value) })}
            disabled={!brand.backgroundMotion}
            className="mt-4 w-full accent-[#a5b4fc] disabled:opacity-40"
          />
        </label>

        <label className="rounded-[22px] border border-white/10 bg-white/5 p-4 text-sm text-white/70 md:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs uppercase tracking-[0.22em] text-white/40">Vitesse</span>
            <span className="text-xs text-white/60">{Math.round(brand.backgroundMotionDuration)}s</span>
          </div>
          <input
            type="range"
            min="8"
            max="32"
            step="1"
            value={brand.backgroundMotionDuration}
            onChange={(event) => onChange({ backgroundMotionDuration: Number(event.target.value) })}
            disabled={!brand.backgroundMotion}
            className="mt-4 w-full accent-[#67e8f9] disabled:opacity-40"
          />
        </label>
      </div>
    </section>
  )
}
