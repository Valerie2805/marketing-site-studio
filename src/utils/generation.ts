import type { BrandSettings, GeneratedPage, GeneratedSite, SiteAnalysis } from '../../shared/types'

const toneMap = {
  premium: {
    prefix: 'Lancement signature',
    proofWord: 'desirable',
    cta: 'Recevoir une version premium',
  },
  direct: {
    prefix: 'Croissance claire',
    proofWord: 'rentable',
    cta: 'Activer une version qui convertit',
  },
  luxe: {
    prefix: 'Presence d exception',
    proofWord: 'haut de gamme',
    cta: 'Creer une vitrine de prestige',
  },
  viral: {
    prefix: 'Impact partageable',
    proofWord: 'memorabile',
    cta: 'Generer une version virale',
  },
  expert: {
    prefix: 'Autorite immediate',
    proofWord: 'credible',
    cta: 'Structurer une version experte',
  },
} satisfies Record<BrandSettings['tone'], { prefix: string; proofWord: string; cta: string }>

const take = (items: string[], count: number, fallback: string[]) => {
  const values = items.filter(Boolean).slice(0, count)
  return values.length ? values : fallback.slice(0, count)
}

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)

export const buildGeneratedSite = (
  analysis: SiteAnalysis | null,
  brand: BrandSettings,
): GeneratedSite | null => {
  if (!analysis) {
    return null
  }

  const tone = toneMap[brand.tone]
  const viralBoost = Math.max(1, Math.min(5, brand.viralityLevel))
  const mainOffer = brand.signatureOffer || analysis.coreOffer
  const audience = brand.audienceFocus || 'les prospects les plus chauds'
  const brandName = brand.brandName || `${analysis.siteName} Studio`
  const proofBanner = `${brandName} transforme le message source en experience ${tone.proofWord} pour ${audience}.`

  const pageSections = [
    {
      id: 'hero',
      eyebrow: `${tone.prefix} ${viralBoost}/5`,
      title: `${brandName} donne une nouvelle presence a ${analysis.siteName}`,
      body: `${mainOffer}. Cette version pousse une promesse plus nette, un design plus marquant et une conversion plus directe.`,
      highlight: analysis.positioning,
      bullets: take(analysis.heroLines, 3, [
        'Promesse plus claire',
        'Branding personnalisable',
        'Storytelling plus fort',
      ]),
    },
    {
      id: 'offer',
      eyebrow: 'Offre reformulee',
      title: 'Une structure pensee pour faire reagir plus vite',
      body: `Le site reprend les informations publiques utiles puis les reorganise pour mieux vendre, mieux rassurer et mieux faire cliquer.`,
      highlight: analysis.toneSummary,
      bullets: take(analysis.offers, 3, [
        'Clarifier l offre',
        'Faire ressortir la valeur',
        'Reduire les frictions',
      ]),
    },
    {
      id: 'proof',
      eyebrow: 'Preuves sociales',
      title: 'Des elements de confiance remis au centre',
      body: `La nouvelle version accentue la preuve sociale et cree des micro-moments de reassurance sur tout le parcours.`,
      highlight: analysis.socialProof[0] || 'Ajouter des preuves clients plus visibles.',
      bullets: take(analysis.socialProof, 3, [
        'Temoignages visibles',
        'Resultats concrets',
        'Avant / apres',
      ]),
    },
    {
      id: 'share',
      eyebrow: 'Angle viral',
      title: 'Des hooks concus pour etre memorises et partages',
      body: `Le niveau de viralite ${viralBoost}/5 renforce les accroches, les contrastes et les appels a l action sans tomber dans la copie du site source.`,
      highlight: analysis.viralHooks[0],
      bullets: take(analysis.viralHooks, 3, [
        'Accroche forte',
        'Storytelling partageable',
        'CTA qui attire',
      ]),
    },
  ]

  const pages: GeneratedPage[] = [
    {
      slug: '/',
      name: 'Accueil',
      sections: pageSections,
    },
    {
      slug: '/offre',
      name: 'Offre',
      sections: [
        {
          id: 'signature',
          eyebrow: 'Signature',
          title: mainOffer,
          body: `Une page courte, claire et emotionnelle, focalisee sur ${audience}.`,
          highlight: analysis.coreOffer,
          bullets: take(analysis.callsToAction, 3, ['Prendre rendez-vous', 'Demander un audit', 'Voir les resultats']),
        },
        {
          id: 'diagnostic',
          eyebrow: 'Diagnostic',
          title: 'Pourquoi cette refonte peut mieux convertir',
          body: `Les informations detectees sur ${analysis.siteName} servent de base pour construire une version plus impactante et plus differenciante.`,
          highlight: analysis.diagnostic[0],
          bullets: take(analysis.diagnostic, 3, [
            'Promesse plus visible',
            'Parcours simplifie',
            'Preuves mieux placees',
          ]),
        },
      ],
    },
  ]

  const shareHooks = [
    `${capitalize(brandName)} en une phrase : ${tone.prefix.toLowerCase()} qui rend ${analysis.siteName} plus net.`,
    `${brandName} concentre ce que le site source dit deja, mais le transforme en message memorisable.`,
    `Nouvelle version de ${analysis.siteName} : plus claire, plus desirable, plus facile a partager.`,
  ]

  return {
    brandName,
    headline: `${tone.prefix} pour ${analysis.siteName}`,
    subheadline: `${mainOffer}. Un nouveau site pilote par les contenus publics detectes, ensuite affine par tes couleurs, ton logo et ton ambiance.`,
    heroCta: tone.cta,
    supportCta: 'Voir les pages generees',
    proofBanner,
    shareHooks,
    pages,
    faq: [
      {
        question: 'Le site est-il une copie du site source ?',
        answer:
          'Non. La logique consiste a reutiliser les informations publiques detectees pour creer une version originale, plus differenciante et plus performante.',
      },
      {
        question: 'Puis-je changer le branding ?',
        answer:
          'Oui. Les couleurs, le logo, l ambiance de fond, le ton marketing et le niveau de viralite sont ajustables en direct.',
      },
      {
        question: 'Qu est-ce qui rend la version plus virale ?',
        answer:
          'Les accroches, la structure emotionnelle, les preuves sociales et les CTA sont renforces pour favoriser memorisation et partage.',
      },
    ],
  }
}
