import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'secret'

export interface JWTPayload {
  sub: number
  role: string
}

export function signToken(payload: JWTPayload) {
  return jwt.sign(payload, SECRET, { expiresIn: '1h' })
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, SECRET) as JWTPayload
}
