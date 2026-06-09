import type { NextFunction, Request, Response } from 'express'
import { verifyAuthToken } from '../services/authToken.js'

type ErrorResponse = {
  error: string
}

export const requireAuth = (
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction,
) => {
  const raw = req.headers.authorization ?? ''
  const token = raw.startsWith('Bearer ') ? raw.slice('Bearer '.length).trim() : ''

  if (!token) {
    return res.status(401).json({ error: 'Acces protege. Mot de passe requis.' })
  }

  const payload = verifyAuthToken(token)
  if (!payload) {
    return res.status(401).json({ error: 'Session invalide ou expiree. Reconnecte-toi.' })
  }

  return next()
}

