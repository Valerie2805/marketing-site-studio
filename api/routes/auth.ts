/**
 * This is a user authentication API route demo.
 * Handle user registration, login, token management, etc.
 */
import { Router, type Request, type Response } from 'express'
import crypto from 'crypto'
import type { AuthLoginRequest, AuthLoginResponse } from '../../shared/types.ts'
import { signAuthToken } from '../services/authToken.js'

const router = Router()

type ErrorResponse = {
  error: string
}

const getPassword = () => {
  const password = process.env.AUTH_PASSWORD
  if (password) {
    return password
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('AUTH_PASSWORD manquant')
  }

  return 'demo'
}

const safeEqual = (a: string, b: string) => {
  const left = Buffer.from(a, 'utf8')
  const right = Buffer.from(b, 'utf8')
  if (left.length !== right.length) {
    return false
  }
  return crypto.timingSafeEqual(left, right)
}

router.get('/status', (req: Request, res: Response) => {
  void req
  res.status(200).json({
    success: true,
    message: 'Auth demo route disponible.',
  })
})

router.post(
  '/login',
  async (
    req: Request<Record<string, never>, AuthLoginResponse | ErrorResponse, AuthLoginRequest>,
    res: Response<AuthLoginResponse | ErrorResponse>,
  ) => {
    const password = req.body?.password?.trim()
    if (!password) {
      return res.status(400).json({ error: 'Mot de passe requis.' })
    }

    let configured = ''
    try {
      configured = getPassword()
    } catch (error) {
      return res.status(500).json({
        error: error instanceof Error ? error.message : 'Configuration auth invalide.',
      })
    }

    if (!safeEqual(password, configured)) {
      return res.status(401).json({ error: 'Mot de passe incorrect.' })
    }

    const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 7
    const token = signAuthToken(expiresAt)
    return res.status(200).json({ token, expiresAt })
  },
)

export default router
