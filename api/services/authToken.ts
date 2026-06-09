import crypto from 'crypto'

type AuthTokenPayload = {
  v: 1
  iat: number
  exp: number
}

const getSecret = () => {
  const secret = process.env.AUTH_SECRET
  if (secret) {
    return secret
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('AUTH_SECRET manquant')
  }

  return 'local-dev-secret'
}

const base64UrlEncode = (value: string) => Buffer.from(value, 'utf8').toString('base64url')
const base64UrlDecode = (value: string) => Buffer.from(value, 'base64url').toString('utf8')

export const signAuthToken = (expiresAt: number) => {
  const payload: AuthTokenPayload = {
    v: 1,
    iat: Date.now(),
    exp: expiresAt,
  }

  const body = base64UrlEncode(JSON.stringify(payload))
  const signature = crypto.createHmac('sha256', getSecret()).update(body).digest('base64url')
  return `${body}.${signature}`
}

export const verifyAuthToken = (token: string) => {
  const [body, signature] = token.split('.')
  if (!body || !signature) {
    return null
  }

  const expected = crypto.createHmac('sha256', getSecret()).update(body).digest('base64url')
  const expectedBuffer = Buffer.from(expected, 'utf8')
  const signatureBuffer = Buffer.from(signature, 'utf8')

  if (expectedBuffer.length !== signatureBuffer.length) {
    return null
  }

  if (!crypto.timingSafeEqual(expectedBuffer, signatureBuffer)) {
    return null
  }

  let payload: AuthTokenPayload
  try {
    payload = JSON.parse(base64UrlDecode(body)) as AuthTokenPayload
  } catch {
    return null
  }

  if (payload.v !== 1) {
    return null
  }

  if (typeof payload.exp !== 'number' || payload.exp <= Date.now()) {
    return null
  }

  return payload
}

