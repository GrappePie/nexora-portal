import type { Role } from './auth/roles'

export interface Invite {
  id: string
  email: string
  role: Role
}

let invites: Invite[] = []

export function listInvites() {
  return invites
}

export function addInvite(email: string, role: Role) {
  const invite: Invite = {
    id: Math.random().toString(36).slice(2),
    email,
    role,
  }
  invites.push(invite)
  return invite
}

export function removeInvite(id: string) {
  invites = invites.filter((i) => i.id !== id)
}
