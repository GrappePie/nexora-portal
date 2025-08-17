export async function login(email: string, password: string): Promise<string> {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    throw new Error('Invalid credentials')
  }
  const data = (await res.json()) as { token: string }
  return data.token
}
