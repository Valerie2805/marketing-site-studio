import { Router, type Request, type Response } from 'express'
import { analyzePublicSite } from '../services/siteAnalyzer.js'
import type { AnalyzeSiteRequest, AnalyzeSiteResponse } from '../../shared/types.ts'

const router = Router()

type ErrorResponse = {
  error: string
}

router.post(
  '/analyze',
  async (
    req: Request<Record<string, never>, AnalyzeSiteResponse | ErrorResponse, AnalyzeSiteRequest>,
    res: Response<AnalyzeSiteResponse | ErrorResponse>,
  ) => {
    const url = req.body?.url?.trim()

    if (!url) {
      return res.status(400).json({
        error: 'Merci de fournir une URL valide.',
      })
    }

    try {
      const analysis = await analyzePublicSite(url)
      return res.status(200).json({ analysis })
    } catch (error) {
      return res.status(500).json({
        error: error instanceof Error ? error.message : 'Analyse impossible.',
      })
    }
  },
)

export default router
