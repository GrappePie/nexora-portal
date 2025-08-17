export type Role = 'admin' | 'user'

const permissions: Record<Role, string[]> = {
  admin: ['dashboard', 'host-info'],
  user: ['dashboard'],
}

export function hasPermission(role: Role, resource: string) {
  return permissions[role]?.includes(resource)
}
