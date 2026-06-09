import { Lock } from 'lucide-react'
import { useMemo, useState } from 'react'

type PasswordGateProps = {
  open: boolean
  loading: boolean
  error: string | null
  onSubmit: (password: string) => void
}

export default function PasswordGate({ open, loading, error, onSubmit }: PasswordGateProps) {
  const [password, setPassword] = useState('')

  const disabled = useMemo(() => loading || password.trim().length < 2, [loading, password])

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050816]/90 px-6 py-10 backdrop-blur">
      <div className="w-full max-w-lg rounded-[36px] border border-white/10 bg-[#0b1120] p-7 shadow-[0_28px_90px_rgba(0,0,0,0.55)]">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/8">
            <Lock className="h-5 w-5 text-[#67e8f9]" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-white/45">Acces protege</p>
            <h2 className="mt-2 font-serif text-3xl text-white">Entre le mot de passe</h2>
            <p className="mt-3 text-sm leading-6 text-white/65">
              Cette application est reservee. Le mot de passe est le meme pour toi et ton amie.
            </p>
          </div>
        </div>

        <div className="mt-7 grid gap-4">
          <label className="rounded-[24px] border border-white/10 bg-white/5 px-5 py-4 text-sm text-white/80">
            <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-white/45">
              Mot de passe
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full bg-transparent text-base text-white outline-none placeholder:text-white/30"
              placeholder="••••••••"
            />
          </label>

          <button
            type="button"
            onClick={() => onSubmit(password)}
            disabled={disabled}
            className="rounded-[24px] bg-[#67e8f9] px-8 py-4 text-sm font-semibold text-[#0b1120] transition hover:translate-y-[-1px] hover:bg-[#8cf0fb] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Connexion...' : 'Deverrouiller'}
          </button>

          {error ? (
            <p className="rounded-2xl border border-[#ff6b57]/30 bg-[#ff6b57]/10 px-4 py-3 text-sm text-[#ffd7d1]">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}

