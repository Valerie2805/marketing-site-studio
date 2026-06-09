import type { SiteAnalysis } from '../../shared/types.ts'

const CTA_PATTERNS = ['contact', 'devis', 'demo', 'essai', 'commencer', 'book', 'call', 'discover']

const decodeEntities = (value: string) =>
  value
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#0?39;?/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#x([0-9a-fA-F]+);?/g, (_match, hex) => {
      const code = Number.parseInt(String(hex), 16)
      if (!Number.isFinite(code)) {
        return ''
      }
      return String.fromCodePoint(code)
    })
    .replace(/&#([0-9]+);?/g, (_match, dec) => {
      const code = Number.parseInt(String(dec), 10)
      if (!Number.isFinite(code)) {
        return ''
      }
      return String.fromCodePoint(code)
    })

const sanitizeText = (value: string) =>
  decodeEntities(value)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const collectMatches = (html: string, regex: RegExp, limit = 8) => {
  const values = new Set<string>()

  for (const match of html.matchAll(regex)) {
    const value = sanitizeText(match[1] ?? '')
    if (value.length > 2) {
      values.add(value)
    }

    if (values.size >= limit) {
      break
    }
  }

  return Array.from(values)
}

const makeSentence = (parts: string[], fallback: string) => {
  const clean = parts.filter(Boolean)
  return clean.length ? clean.join(' ') : fallback
}

const guessTone = (content: string) => {
  const normalized = content.toLowerCase()

  if (/(premium|luxe|exclusif|haut de gamme)/.test(normalized)) {
    return 'Ton premium et aspirationnel, avec une recherche de desirabilite.'
  }

  if (/(expert|strategie|conseil|performance|methode)/.test(normalized)) {
    return 'Ton expert et rassurant, centre sur la credibilite et la clarte.'
  }

  if (/(rapide|simple|facile|gratuit|maintenant)/.test(normalized)) {
    return 'Ton direct et orienté action, efficace pour la conversion.'
  }

  return 'Ton commercial equilibré, avec un potentiel de différenciation plus marque.'
}

const pickCoreOffer = (headings: string[], paragraphs: string[]) => {
  return (
    headings.find((line) => line.length > 20 && line.length < 90) ??
    paragraphs.find((line) => line.length > 40 && line.length < 160) ??
    'Offre principale a reformuler pour mieux vendre la transformation promise.'
  )
}

const inferKeywords = (text: string) => {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9àâçéèêëîïôûùüÿñæœ\s-]/gi, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 4)

  const counts = new Map<string, number>()
  const stopWords = new Set([
    'votre',
    'vous',
    'avec',
    'pour',
    'dans',
    'notre',
    'votre',
    'cette',
    'entreprise',
    'service',
    'site',
    'nous',
  ])

  words.forEach((word) => {
    if (stopWords.has(word)) {
      return
    }

    counts.set(word, (counts.get(word) ?? 0) + 1)
  })

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word]) => word)
}

const buildDiagnostic = (
  metaDescription: string,
  ctas: string[],
  socialProof: string[],
  headings: string[],
) => {
  const output: string[] = []

  output.push(
    metaDescription
      ? 'Le site source formule deja une promesse exploitable, mais elle peut etre rendue plus differenciante.'
      : 'La promesse centrale manque de clarte immediate, ce qui laisse de la place pour une nouvelle proposition de valeur plus forte.',
  )

  output.push(
    ctas.length > 1
      ? 'Les appels a l’action existent deja : il faut les rendre plus desirables et plus repetes.'
      : 'Les appels a l’action semblent faibles ou peu visibles : opportunite directe de gain en conversion.',
  )

  output.push(
    socialProof.length
      ? 'Des preuves sociales sont detectees et peuvent etre reframes pour rassurer plus vite.'
      : 'La preuve sociale est peu visible : il faut ajouter temoignages, chiffres ou avant/apres.',
  )

  output.push(
    headings.length > 3
      ? 'La structure est suffisamment riche pour inspirer une arborescence cible plus nette.'
      : 'Le site semble peu structure : la refonte doit clarifier le parcours, l’offre et la capture de leads.',
  )

  return output
}

export const analyzePublicSite = async (rawUrl: string): Promise<SiteAnalysis> => {
  const sourceUrl = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`
  const url = new URL(sourceUrl)

  let html = ''

  try {
    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'MarketingSiteStudio/1.0',
        Accept: 'text/html,application/xhtml+xml',
      },
    })
    const buffer = await response.arrayBuffer()
    const utf8Text = new TextDecoder('utf-8', { fatal: false }).decode(buffer)
    const latinText = new TextDecoder('latin1', { fatal: false }).decode(buffer)
    const score = (value: string) => {
      const replacementCount = (value.match(/\uFFFD/g) ?? []).length
      const mojibakeCount = (value.match(/Ã./g) ?? []).length
      return replacementCount * 2 + mojibakeCount
    }

    html = score(latinText) < score(utf8Text) ? latinText : utf8Text
  } catch {
    html = `<html><head><title>${url.hostname}</title><meta name="description" content="Site de ${url.hostname}"></head><body><h1>${url.hostname}</h1><p>Le site public n'a pas pu etre charge, une analyse partielle est proposee a partir de l'URL.</p><a href="/contact">Contact</a></body></html>`
  }

  const pageTitle = collectMatches(html, /<title[^>]*>([\s\S]*?)<\/title>/gi, 1)[0] ?? url.hostname
  const metaDescription =
    collectMatches(html, /<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["'][^>]*>/gi, 1)[0] ?? ''
  const headings = collectMatches(html, /<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi, 10)
  const paragraphs = collectMatches(html, /<p[^>]*>([\s\S]*?)<\/p>/gi, 10)
  const links = Array.from(
    new Set(
      Array.from(html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi))
        .map((match) => ({
          href: match[1],
          label: sanitizeText(match[2] ?? ''),
        }))
        .filter((item) => item.label.length > 1),
    ),
  )

  const ctas = Array.from(
    new Set(
      links
        .filter((item) => CTA_PATTERNS.some((pattern) => item.label.toLowerCase().includes(pattern)))
        .map((item) => item.label),
    ),
  ).slice(0, 5)

  const offers = Array.from(new Set([...headings, ...paragraphs])).slice(0, 6)
  const socialProof = [...headings, ...paragraphs]
    .filter((line) => /(avis|temoignage|client|cas|resultat|note|expert|depuis|ans)/i.test(line))
    .slice(0, 4)
  const contactInfo = Array.from(
    new Set([
      ...(html.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) ?? []),
      ...(html.match(/(?:\+?\d[\d\s().-]{7,}\d)/g) ?? []),
    ]),
  ).slice(0, 4)

  const titleParts = sanitizeText(pageTitle)
    .split(' - ')
    .map((part) => part.trim())
    .filter(Boolean)
  const candidateBrand = titleParts[titleParts.length - 1] || ''
  const firstTitle = titleParts[0] || ''
  const hostnameBrand = url.hostname.replace('www.', '')
  const siteName =
    (candidateBrand.length > 1 && candidateBrand.length <= 32 ? candidateBrand : '') ||
    (firstTitle.length > 1 && firstTitle.length <= 32 ? firstTitle : '') ||
    hostnameBrand
  const fullText = makeSentence([pageTitle, metaDescription, ...headings, ...paragraphs], siteName)
  const keywords = inferKeywords(fullText)
  const coreOffer = pickCoreOffer(headings, paragraphs)
  const positioning = makeSentence(
    [
      metaDescription || headings[0],
      headings[1] ? `Positionnement secondaire : ${headings[1]}.` : '',
    ],
    `Positionnement a clarifier pour ${siteName}.`,
  )

  const heroLines = [pageTitle, headings[0], metaDescription].filter(Boolean).slice(0, 3)
  const notableFacts = [...paragraphs, ...headings].filter((line) => line.length > 25).slice(0, 4)
  const normalizedKeywords = keywords.join(' ').toLowerCase()
  const businessHooks =
    /(serrurier|serrure|porte|blind)/.test(normalizedKeywords)
      ? [
          'Proposer un diagnostic securite en 30 secondes a partager.',
          'Mettre en avant un devis express avec promesse de rappel rapide.',
          'Ajouter une checklist anti-effraction telechargeable (lead magnet).',
        ]
      : [
          `Transformer ${siteName} en marque memorable en 1 session de studio.`,
          'Faire ressortir une promesse plus nette que le site source.',
          'Ajouter des sections partageables et plus orientees preuve sociale.',
        ]
  const viralHooks = businessHooks.slice(0, 3)

  const pages = links
    .filter((item) => item.href.startsWith('/') || item.href.includes(url.hostname))
    .slice(0, 5)
    .map((item, index) => ({
      url: item.href.startsWith('http') ? item.href : `${url.origin}${item.href}`,
      title: item.label,
      headings: headings.slice(index, index + 2),
    }))

  return {
    sourceUrl: url.toString(),
    siteName,
    pageTitle,
    metaDescription,
    positioning,
    toneSummary: guessTone(fullText),
    coreOffer,
    seoKeywords: keywords,
    offers,
    callsToAction: ctas.length ? ctas : ['Demander une demonstration', 'Parler a un expert'],
    socialProof,
    contactInfo,
    heroLines,
    notableFacts,
    viralHooks,
    pages: pages.length ? pages : [{ url: url.toString(), title: pageTitle, headings: headings.slice(0, 3) }],
    diagnostic: buildDiagnostic(metaDescription, ctas, socialProof, headings),
  }
}
