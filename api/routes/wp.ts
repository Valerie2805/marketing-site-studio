import { Router, type Request, type Response } from 'express'
import { analyzePublicSite } from '../services/siteAnalyzer.js'
import type { WpGenerateHomeRequest, WpGenerateHomeResponse } from '../../shared/types.ts'

const router = Router()

type ErrorResponse = {
  error: string
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'accueil'

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

const wpHeading = (level: 1 | 2 | 3 | 4, text: string) =>
  `<!-- wp:heading {"level":${level}} -->\n<h${level}>${escapeHtml(text)}</h${level}>\n<!-- /wp:heading -->`

const wpParagraph = (text: string) =>
  `<!-- wp:paragraph -->\n<p>${escapeHtml(text)}</p>\n<!-- /wp:paragraph -->`

const wpList = (items: string[]) => {
  const clean = items.map((item) => item.trim()).filter(Boolean).slice(0, 8)
  if (!clean.length) {
    return ''
  }

  const listItems = clean.map((item) => `<li>${escapeHtml(item)}</li>`).join('\n')
  return `<!-- wp:list -->\n<ul>\n${listItems}\n</ul>\n<!-- /wp:list -->`
}

const wpButtons = (primary: string, secondary?: string) => {
  const left = primary?.trim()
  const right = secondary?.trim()
  if (!left && !right) {
    return ''
  }

  const button = (label: string) =>
    `<!-- wp:button -->\n<div class="wp-block-button"><a class="wp-block-button__link wp-element-button">${escapeHtml(label)}</a></div>\n<!-- /wp:button -->`

  return `<!-- wp:buttons -->\n<div class="wp-block-buttons">\n${left ? button(left) : ''}\n${right ? button(right) : ''}\n</div>\n<!-- /wp:buttons -->`
}

const wpSeparator = () => `<!-- wp:separator -->\n<hr class="wp-block-separator has-alpha-channel-opacity"/>\n<!-- /wp:separator -->`

const buildHomeContent = (analysis: Awaited<ReturnType<typeof analyzePublicSite>>) => {
  const heroTitle = analysis.heroLines[0] || `${analysis.siteName} : nouvelle version marketing`
  const heroSubtitle =
    analysis.metaDescription ||
    analysis.positioning ||
    `Voici une page d’accueil optimisée pour transformer plus vite que ${analysis.siteName}.`
  const primaryCta = analysis.callsToAction[0] || 'Demander un devis'
  const secondaryCta = analysis.callsToAction[1] || 'Parler a un expert'

  const offers = analysis.offers.slice(0, 6)
  const proof = analysis.socialProof.slice(0, 4)
  const hooks = analysis.viralHooks.slice(0, 3)
  const contact = analysis.contactInfo.slice(0, 4)
  const keywords = analysis.seoKeywords.slice(0, 8)

  const blocks: string[] = []

  blocks.push(wpHeading(1, heroTitle))
  blocks.push(wpParagraph(heroSubtitle))
  blocks.push(wpButtons(primaryCta, secondaryCta))
  blocks.push(wpSeparator())

  blocks.push(wpHeading(2, 'Ce que tu obtiens'))
  blocks.push(
    wpList([
      analysis.coreOffer,
      ...analysis.notableFacts,
      ...analysis.diagnostic.slice(0, 2),
    ]),
  )
  blocks.push(wpSeparator())

  blocks.push(wpHeading(2, 'Services / Offres'))
  blocks.push(wpParagraph('Selection de services inspirés du site source, reformulés pour convertir.'))
  blocks.push(wpList(offers))
  blocks.push(wpSeparator())

  blocks.push(wpHeading(2, 'Preuves & re-assurance'))
  blocks.push(wpList(proof.length ? proof : ['Avis clients a mettre en avant', 'Garantie / engagement', 'Intervention rapide']))
  blocks.push(wpSeparator())

  blocks.push(wpHeading(2, 'Angles partageables'))
  blocks.push(wpParagraph('3 accroches de viralite a tester en posts, reels ou carrousels.'))
  blocks.push(wpList(hooks))
  blocks.push(wpSeparator())

  blocks.push(wpHeading(2, 'FAQ'))
  blocks.push(
    wpList([
      'Quels sont vos delais et votre zone d’intervention ?',
      'Comment obtenir un devis clair avant de se deplacer ?',
      'Qu’est-ce qui vous differencie des autres ?',
      'Comment me contacter rapidement ?',
    ]),
  )
  blocks.push(wpSeparator())

  blocks.push(wpHeading(2, 'Contact'))
  blocks.push(
    wpParagraph(
      contact.length
        ? `Coordonnees detectees : ${contact.join(' • ')}`
        : 'Ajoute ici ton telephone, email et un bouton de prise de contact.',
    ),
  )
  blocks.push(wpButtons('Etre rappele', 'Envoyer un message'))

  if (keywords.length) {
    blocks.push(wpSeparator())
    blocks.push(wpHeading(3, 'Mots-cles SEO'))
    blocks.push(wpList(keywords))
  }

  blocks.push(
    `<!-- wp:paragraph -->\n<p><strong>Source :</strong> ${escapeHtml(
      analysis.sourceUrl,
    )}</p>\n<!-- /wp:paragraph -->`,
  )

  return blocks.filter(Boolean).join('\n\n')
}

router.post(
  '/generate-home',
  async (
    req: Request<Record<string, never>, WpGenerateHomeResponse | ErrorResponse, WpGenerateHomeRequest>,
    res: Response<WpGenerateHomeResponse | ErrorResponse>,
  ) => {
    const url = req.body?.url?.trim()

    if (!url) {
      return res.status(400).json({ error: 'Merci de fournir une URL valide.' })
    }

    try {
      const analysis = await analyzePublicSite(url)
      const title = `Accueil – ${analysis.siteName}`
      const slug = slugify(`accueil-${analysis.siteName}`)
      const content = buildHomeContent(analysis)
      return res.status(200).json({ title, slug, content })
    } catch (error) {
      return res.status(500).json({
        error: error instanceof Error ? error.message : 'Generation impossible.',
      })
    }
  },
)

export default router
