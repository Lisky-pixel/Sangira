export type UserRole = 'donor' | 'ngo'

export type RegistrationRoleOption = {
  value: UserRole
  label: string
  description: string
}

export const REGISTRATION_ROLE_OPTIONS: RegistrationRoleOption[] = [
  {
    value: 'donor',
    label: 'Food donor',
    description: 'Hotels, caterers, supermarkets, event organisers',
  },
  {
    value: 'ngo',
    label: 'Humanitarian organisation',
    description: 'Registered NGOs, shelters, orphanages',
  },
]

export function isUserRole(value: string | null): value is UserRole {
  return value === 'donor' || value === 'ngo'
}
