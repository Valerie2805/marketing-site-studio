import type { AnalyzeSiteResponse, AuthLoginResponse } from '../../shared/types'

export const analyzeSiteRequest = async (url: string, token: string) => {
  const response = await fetch('/api/projects/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ url }),
  })

  const payload = (await response.json()) as AnalyzeSiteResponse & { error?: string }

  if (!response.ok) {
    throw new Error(payload.error || 'Analyse impossible.')
  }

  return payload.analysis
}

export const loginRequest = async (password: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  })

  const payload = (await response.json()) as AuthLoginResponse & { error?: string }

  if (!response.ok) {
    throw new Error(payload.error || 'Connexion impossible.')
  }

  return payload
}
