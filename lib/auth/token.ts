import { SignJWT, jwtVerify } from 'jose'

const SECRET = process.env.JWT_SECRET || 'secret'
const key = new TextEncoder().encode(SECRET)

export interface JWTPayload {
  sub: number
  role: string
}

export async function signToken(payload: JWTPayload) {
  return await new SignJWT({ role: payload.role })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setSubject(String(payload.sub))
    .setExpirationTime('1h')
    .sign(key)
}

export async function verifyToken(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, key)
  return {
    sub: typeof payload.sub === 'string' ? Number(payload.sub) : (payload.sub as any),
    role: (payload as any).role as string,
  }
}
